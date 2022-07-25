import React, { FC, useState } from "react";
import { withDiInject } from '../../DI-Inject-HOC/withDiInject'
import { LoginCredentials } from '../../Auth/auth-state'

type Props = {}
type ViewProps = {
    login: (creds: LoginCredentials) => void
    logout: () => void
    isAuthenticated$: boolean
}



export const RegisterView: FC<ViewProps> = props => {
    const { login, logout, isAuthenticated$ } = props

    return (
        <>
            <button
              onClick={() => {
                    login({ username: 'test', password: 'test' })
                }}
            >
                Login
            </button>
            <button onClick={logout}>Logout</button>
            <h1>{isAuthenticated$ ? 'Auth' : ' Not auth'}</h1>
        </>
    )
}

export const Register: FC<Props> = () => {
    const Component = withDiInject<ViewProps>(RegisterView, 'authState', [
        'login',
        'logout',
        'isAuthenticated$'
    ])
    return <Component />
}
