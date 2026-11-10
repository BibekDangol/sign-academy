import axios from 'axios';

// Set REACT_APP_API_URL before starting/building the frontend to use another server.
export const API_BASE_URL = `${(process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api').replace(/\/+$/, '')}/`;
export const apiUrl = path => `${API_BASE_URL}${path.replace(/^\/+/, '')}`;

// Public requests deliberately carry no authentication credentials.
export const publicApi = axios.create({ baseURL: API_BASE_URL });
