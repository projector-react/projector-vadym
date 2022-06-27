import { ApiPost, IApi } from '../apiService/api-service'

export type AuthState = {
    readonly isLoggedIn: boolean
}

export type LoginCredentials = {
    readonly username: string
    readonly password: string
}

export type UserInfo = {
    readonly id: number
    readonly email: string
    readonly isSubscribed: boolean
    readonly firstName?: string
    readonly lastName?: string
    readonly phone?: string
}

export interface IAuthService {
    readonly login: (loginCredentials: LoginCredentials) => Promise<string>
    readonly logout: () => void
    readonly getUser: () => Promise<UserInfo>
    readonly register: (loginCredentials: LoginCredentials) => Promise<string>
    readonly refreshToken: () => Promise<string>
}

export class AuthService implements IAuthService {
    post: ApiPost

    constructor(apiService: IApi) {
        this.post = apiService.post.bind(apiService)
    }

    login({ username, password }: LoginCredentials) {
        return this.post<string, void, LoginCredentials>('auth/login', {
            username,
            password
        }).then(res => res)
    }

    logout() {
        return this.post('auth/logout', {}).then(res => res)
    }

    register({ username, password }: LoginCredentials) {
        return this.post<string, void, LoginCredentials>('auth/register', {
            username,
            password
        }).then(res => res)
    }

    refreshToken() {
        return this.post<string, void, undefined>('auth/refresh', undefined).then(res => res)
    }

    getUser() {
        return this.post<UserInfo, void, Record<string, never>>('me', {}).then(res => res)
    }
}

