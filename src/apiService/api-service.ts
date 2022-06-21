import axios, { AxiosInstance } from 'axios'

export type ApiGet = <T, C = void>(path: string, config?: C) => Promise<T>
export type ApiPost = <T, R = void, D = void>(path: string, data?: D, config?: R) => Promise<T>

export interface IApi {
    get: ApiGet
    post: ApiPost
}

const API_URL = 'http://localhost:8000/api/'

export class AxiosApiService implements IApi {
    $api: AxiosInstance

    constructor() {
        this.$api = axios.create({ baseURL: API_URL, withCredentials: true })

        this.$api.interceptors.response.use(
            res => res,
            async error => {
                const originalReq = error.config
                if (error.response.status === 401 && error.config && !originalReq.isRetry) {
                    originalReq.isRetry = true
                    try {
                        await axios.post(`${API_URL}auth/refresh`, {})
                        return this.$api.request(originalReq.isRetry)
                    } catch {
                        throw Error('Unauthorized')
                    }
                }
                throw Error('Network error')
            }
        )
    }

    async get<T, C>(path: string, config?: C) {
        return this.$api.get<T>(API_URL + path, config).then(res => res.data)
    }

    async post<T, R, D>(path: string, data?: D, config?: R) {
        return this.$api.post<T>(API_URL + path, data, config).then(res => res.data)
    }
}