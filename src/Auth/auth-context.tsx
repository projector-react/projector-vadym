import React, { createContext, FC, useEffect, useMemo, useState } from 'react'
import { AuthService, LoginCredentials } from './auth-service'
import { AxiosApiService } from '../apiService/api-service'
import { createAxiosInstance } from '../apiService/create-axios-instance'
import { AuthState } from './auth-state'

type AuthActions = {
    login: (creds: LoginCredentials) => void
    register: (creds: LoginCredentials) => void
    logout: () => void
    refreshToken: () => void
}

type AuthStateType = {
    isAuthenticated: boolean
    actions: AuthActions
}

const authInitialState: AuthStateType = {
    isAuthenticated: false,
    actions: {} as AuthActions
}

type Props = {
    children: React.ReactNode
}

export const AuthContext = createContext<AuthStateType>(authInitialState)

const apiService = new AxiosApiService(createAxiosInstance())
const authService = new AuthService(apiService)
const { login, logout, refreshToken, register, isAuthenticated$ } = new AuthState(authService)

export const AuthProvider: FC<Props> = ({ children }) => {
    const [isAuthValue, setAuthValue] = useState(false)
    const isAuthenticatedSubscription$ = isAuthenticated$().subscribe(isAuth => {
        setAuthValue(isAuth)
    })


    useEffect(() => {
        return () => {
            isAuthenticatedSubscription$.unsubscribe()
        }
    })

    const authValue: AuthStateType = useMemo(
        () => ({
            isAuthenticated: isAuthValue,
            actions: {
                register,
                login,
                refreshToken,
                logout
            }
        }),
        [isAuthValue]
    )
    return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
}
