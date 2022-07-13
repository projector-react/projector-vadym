import React, { createContext, FC, useEffect, useMemo, useState } from 'react'
import { LoginCredentials } from './auth-service'

import { container } from '../compostion-root/composition-root'

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

const { login, logout, refreshToken, register, isAuthenticated$ } = container.resolve('authState')

export const AuthProvider: FC<Props> = ({ children }) => {
    const [isAuthValue, setAuthValue] = useState(false)
    const isAuthenticatedSubscription$ = isAuthenticated$.subscribe((isAuth: boolean) => {
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
