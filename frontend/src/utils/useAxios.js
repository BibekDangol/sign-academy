import axios from "axios";
import { useContext, useMemo } from "react";
import AuthContext from "../context/AuthContext";
import { API_BASE_URL } from './api';

const useAxios = () => {
    const { getAccessToken, getSessionId, clearSession } = useContext(AuthContext);
    return useMemo(() => {
        const client = axios.create({ baseURL: API_BASE_URL });
        client.interceptors.request.use(async req => {
            const sessionId = getSessionId();
            if (req._authSession !== undefined && req._authSession !== sessionId) {
                throw new Error('Session changed before request');
            }
            req._authSession = sessionId;
            const access = await getAccessToken();
            if (getSessionId() !== sessionId) throw new Error('Session changed before request');
            req._authAccess = access;
            req.headers.Authorization = `Bearer ${access}`;
            return req;
        });
        client.interceptors.response.use(response => response, async error => {
            const req = error.config;
            if (error.response?.status !== 401 || !req || req._authSession !== getSessionId()) throw error;
            if (req._authRetry) {
                clearSession();
                throw error;
            }
            req._authRetry = true;
            await getAccessToken({ rejectedAccess: req._authAccess });
            return client(req);
        });
        return client;
    }, [getAccessToken, getSessionId, clearSession]);
}

export default useAxios;
