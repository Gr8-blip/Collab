import axios from 'axios';
import { useParams } from 'react-router-dom';

const BASE_API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: BASE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 (Expired) and we haven't already tried to refresh this specific request
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark request so we don't loop infinitely if refresh fails

            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // Call the Django SimpleJWT refresh endpoint directly via a clean axios call
                    // (Avoid using the wrapped 'api' instance here to prevent interceptor loops)
                    const response = await axios.post(`${BASE_API_URL}users/api/token/refresh/`, {
                        refresh: refreshToken
                    });

                    const newAccessToken = response.data.access;

                    // Save the new token
                    localStorage.setItem('access_token', newAccessToken);

                    // Update the authorization header for the original failed request
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Retry the original request with the fresh token
                    return api(originalRequest);
                } catch (refreshError) {
                    // If the refresh token itself is expired or invalid, log the user out
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');

                    // Redirect to login or force page reload to reset state
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);



const request = async (path, method = "GET", data = null) => {
    try {
        const response = await api.request({
            url: path,
            method,
            data,
        })

        return response.data
    } catch (e) {
        const data = e.response?.data
        const error =
            data?.message ||
            data?.detail ||
            (data && typeof data === "object" && Object.values(data).flat().join(" ")) ||
            e.message ||
            "Request failed"

        throw new Error(error)
    }
}


const users = (path, method, data) => request(path, method, data)
const collab = (path, method, data) => request(path, method, data)


// User API
export const getTokens = (data) => users('users/api/token/', 'POST', data)
export const register = (data) => users('users/api/register/', 'POST', data)
export const getUserProfile = () => users('users/api/me/', 'GET')


// Collab API (core)
export const exploreRooms = () => collab('rooms/explore/', 'GET')
export const myRooms = () => collab('rooms/mine/', 'GET')
export const createRoom = (data) => collab('rooms/create/', 'POST', data)
export const joinRoom = (id) => collab(`rooms/${id}/join/`, 'POST')
export const roomDetail = (room_id) => collab(`rooms/${room_id}`, 'GET')
export const createSpot = (data) => collab(`rooms/spots/create/`, 'POST', data)
export const spot = (room_id, title) => collab(`rooms/${room_id}/${title}`, 'GET')
export const fetchMessageHistory = (spot_id) => collab(`spots/${spot_id}/messages/`, 'GET')