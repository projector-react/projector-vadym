export type AuthState = {
    isLoggedIn: boolean
}

export type LoginCredentials = {
    login: string
    password: string
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
    login: (loginCredentials: LoginCredentials) => Promise<UserInfo>
    logout: () => void
}


