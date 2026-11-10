import { createContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { decodeSession, restoreSession, removeStoredSession } from './session';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert2';
import { apiUrl } from '../utils/api';
import { safeReturnPath } from '../utils/authRedirect';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);
  const tokensRef = useRef(null);
  const sessionIdRef = useRef(0);
  const getSessionId = useCallback(() => sessionIdRef.current, []);
  const refreshJob = useRef(null);
  const user = useMemo(() => {
    try { return decodeSession(authTokens, { allowExpired: true }); } catch { return null; }
  }, [authTokens]);

  const clearSession = useCallback(() => {
    sessionIdRef.current += 1;
    tokensRef.current = null;
    removeStoredSession();
    setAuthTokens(null);
  }, []);

  const saveSession = useCallback((tokens, { preserveSession = false } = {}) => {
    decodeSession(tokens);
    localStorage.setItem('authTokens', JSON.stringify(tokens));
    if (!preserveSession) sessionIdRef.current += 1;
    tokensRef.current = tokens;
    setAuthTokens(tokens);
  }, []);

  const refreshAccessToken = useCallback(() => {
    const tokens = tokensRef.current;
    if (!tokens) return Promise.reject(new Error('No active session'));
    if (refreshJob.current?.tokens === tokens) return refreshJob.current.promise;
    const sessionId = sessionIdRef.current;
    const job = { tokens };
    job.promise = (async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(apiUrl('token/refresh/'), {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: tokens.refresh }), signal: controller.signal,
        });
        const data = await response.json();
        if (response.status !== 200) throw new Error('Refresh rejected');
        // The refresh endpoint normally returns only access; retain the original refresh token.
        const next = { access: data.access, refresh: data.refresh ?? tokens.refresh };
        decodeSession(next);
        if (tokensRef.current !== tokens) {
          if (sessionIdRef.current === sessionId && tokensRef.current) return tokensRef.current.access;
          throw new Error('Session changed during refresh');
        }
        saveSession(next, { preserveSession: true });
        return next.access;
      } catch (error) {
        if (tokensRef.current === tokens) {
          clearSession();
          navigateRef.current('/login', { replace: true });
        }
        throw error;
      } finally {
        clearTimeout(timeout);
        if (refreshJob.current === job) refreshJob.current = null;
      }
    })();
    refreshJob.current = job;
    return job.promise;
  }, [saveSession, clearSession]);

  const applyProfileAccess = useCallback((access, expectedSession) => {
    const tokens = tokensRef.current;
    if (!tokens || expectedSession !== sessionIdRef.current) throw new Error('Session changed');
    const previous = decodeSession(tokens, { allowExpired: true });
    const updated = decodeSession({ ...tokens, access });
    if (updated.user_id !== previous.user_id || updated.session_jti !== previous.session_jti) {
      throw new Error('Profile response belongs to another session');
    }
    saveSession({ ...tokens, access }, { preserveSession: true });
  }, [saveSession]);

  const getAccessToken = useCallback(async ({ rejectedAccess } = {}) => {
    const tokens = tokensRef.current;
    if (!tokens) throw new Error('No active session');
    const decoded = decodeSession(tokens, { allowExpired: true });
    if (rejectedAccess === tokens.access || decoded.exp * 1000 <= Date.now() + 5000) return refreshAccessToken();
    return tokens.access;
  }, [refreshAccessToken]);

  useEffect(() => {
    let active = true;
    const restore = async () => {
      let tokens = restoreSession({ allowExpired: true });
      const pendingTokens = refreshJob.current?.tokens;
      // Reuse the pending session during StrictMode's development remount.
      if (tokens && pendingTokens?.access === tokens.access && pendingTokens?.refresh === tokens.refresh) {
        tokens = pendingTokens;
      }
      sessionIdRef.current += 1;
      tokensRef.current = tokens;
      setAuthTokens(tokens);
      if (tokens) {
        const decoded = decodeSession(tokens, { allowExpired: true });
        if (decoded.exp * 1000 <= Date.now()) {
          try { await refreshAccessToken(); } catch { /* Refresh handles invalid sessions. */ }
        }
      }
      if (active) setLoading(false);
    };
    restore();
    const syncSession = (event) => {
      if (event.key === 'authTokens' || event.key === null) {
        setLoading(true);
        restore();
      }
    };
    window.addEventListener('storage', syncSession);
    return () => {
      active = false;
      tokensRef.current = null;
      window.removeEventListener('storage', syncSession);
    };
  }, [refreshAccessToken]);

  const loginUser = async (email, password, returnTo = '/') => {
    let response;
    try {
      response = await fetch(apiUrl('token/'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      return { ok: false, message: 'Unable to connect. Please check your connection and try again.' };
    }

    const data = await response.json().catch(() => null);
    if (response.status === 401 || response.status === 403) {
      return { ok: false, message: 'Invalid email or password.' };
    }
    if (response.status === 400 && data && typeof data === 'object') {
      return { ok: false, errors: data };
    }
    if (response.status === 429) {
      return { ok: false, message: 'Too many login attempts. Please wait and try again.' };
    }
    if (response.status !== 200) {
      return { ok: false, message: 'Login is unavailable right now. Please try again later.' };
    }

    try {
      decodeSession(data);
    } catch {
      return { ok: false, message: 'The server returned an invalid login response. Please try again.' };
    }
    try {
      saveSession(data);
    } catch {
      return { ok: false, message: 'Unable to save your login. Please allow browser storage and try again.' };
    }
    navigate(safeReturnPath(returnTo), { replace: true });
    swal.fire({
      title: "Login Success", icon: "success", toast: true, timer: 6000,
      position: 'bottom-right', timerProgressBar: true, showConfirmButton: false,
    });
    return { ok: true };
  };

  const registerUser = async (full_name, email, username, password, password2) => {
    try {
      const response = await fetch(apiUrl('register/'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, username, password, password2 }),
      });

      const data = await response.json().catch(() => null);

      if (response.status === 201) {
        navigate("/login");
        swal.fire({
          title: "Registration Success",
          icon: "success",
          toast: true,
          timer: 6000,
          position: 'bottom-right',
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return { ok: true };
      }
      if (response.status === 400 && data && typeof data === 'object') {
        return { ok: false, errors: data };
      }
      return { ok: false, message: 'Registration is unavailable right now. Please try again later.' };
    } catch {
      return { ok: false, message: 'Unable to connect. Please check your connection and try again.' };
    }
  };

  const logoutUser = async () => {
    const tokens = tokensRef.current;
    // Clear immediately so failed/offline requests cannot leave this browser signed in.
    clearSession();
    navigate('/login', { replace: true });
    const signedOutSession = sessionIdRef.current;
    swal.fire({
      title: 'Signed out on this device', icon: 'success', toast: true, timer: 4000,
      position: 'bottom-right', showConfirmButton: false,
    });
    if (!tokens?.refresh) return { ok: true };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(apiUrl('logout/'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: tokens.refresh }), signal: controller.signal,
      });
      if (response.status !== 204) throw new Error('Server logout failed');
      return { ok: true };
    } catch {
      if (sessionIdRef.current === signedOutSession && !tokensRef.current) {
        swal.fire({
          title: 'Server logout could not be confirmed',
          text: 'You are signed out on this device. The server session may remain active until it expires.',
          icon: 'warning',
        });
      }
      return { ok: false, localLogout: true };
    } finally {
      clearTimeout(timeout);
    }
  };

  useEffect(() => {
    if (!authTokens || loading) return undefined;
    const decoded = decodeSession(authTokens, { allowExpired: true });
    const remaining = decoded.exp * 1000 - Date.now();
    // Refresh ahead of expiry, with a smaller margin for short-lived tokens.
    const delay = Math.max(0, remaining - Math.min(30000, remaining / 2));
    const timer = setTimeout(() => {
      refreshAccessToken().catch(() => {});
    }, Math.min(delay, 2147483647));
    return () => clearTimeout(timer);
  }, [authTokens, loading, refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{ user, authTokens, loading, saveSession, clearSession, getAccessToken, getSessionId, applyProfileAccess, refreshAccessToken, registerUser, loginUser, logoutUser }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
