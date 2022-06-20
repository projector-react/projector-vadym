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
}
