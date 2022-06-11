export type AuthState = {
    readonly isLoggedIn: boolean
}

export type LoginCredentials = {
    readonly login: string
    readonly password: string
}

export type UserInfo = {
    readonly id: number
    readonly email: string
    readonly isSubscribed: boolean
    readonly firstName?: string
    readonly lastName?: string
    readonly tel?: string
}

export interface AuthService {
    readonly login: (loginCredentials: LoginCredentials) => Promise<UserInfo>
    readonly logout: () => void
}
