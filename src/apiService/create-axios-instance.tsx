import axios, { AxiosInstance } from 'axios'

export function createAxiosInstance(): AxiosInstance {
    const API_URL = 'http://localhost:8000/api/'
    const $api = axios.create({ baseURL: API_URL, withCredentials: true })


    $api.interceptors.response.use(
        res => res,
        async error => {
            const originalReq = error.config
            if (error.response.status === 401 && error.config && !originalReq.isRetry) {
                originalReq.isRetry = true
                try {
                    await axios.post(`${API_URL}auth/refresh`, {})
                    return $api.request(originalReq.isRetry)
                } catch {
                    throw Error('Unauthorized')
                }
            }
            throw Error('Network error')
        }
    )
    return $api
}
