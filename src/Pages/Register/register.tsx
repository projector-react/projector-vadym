import React, { FC, useContext, useEffect } from 'react'
import { AuthContext } from '../../Auth/auth-context'

type Props = {}
export const Register: FC<Props> = () => {
    const { actions, isAuthenticated } = useContext(AuthContext)

    return (
        <>
            <button
              onClick={() => {
                    actions.login({ username: 'test', password: 'test' })
                }}
            >
                Login
            </button>
            <button onClick={actions.logout}>Logout</button>
            <h1>{isAuthenticated ? 'Auth' : ' Not auth'}</h1>
        </>
    )
}
