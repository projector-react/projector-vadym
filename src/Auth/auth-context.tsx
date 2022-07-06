import React, { createContext, FC, useEffect, useMemo } from 'react'
import { merge } from 'rxjs'
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
const {
    login,
    logout,
    refreshToken,
    register,
    logoutResult$,
    registerResult$,
    loginResult$,
    refreshResult$
} = new AuthState(authService)

export const AuthProvider: FC<Props> = ({ children }) => {
    const subscription$ = merge(
        logoutResult$(),
        registerResult$(),
        loginResult$(),
        refreshResult$()
    ).subscribe()
    useEffect(() => () => {
        subscription$.unsubscribe()
    })
    const authValue: AuthStateType = useMemo(
        () => ({
            isAuthenticated: false,
            actions: {
                register,
                login,
                refreshToken,
                logout
            }
        }),
        []
    )
    console.log(authValue)
    return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
}
