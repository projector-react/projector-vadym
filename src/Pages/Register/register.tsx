import React, { FC, useContext, useEffect } from 'react'
import { AuthContext } from '../../Auth/auth-context'

type Props = {}
export const Register: FC<Props> = () => {
    const { actions } = useContext(AuthContext)
    useEffect(() => {
        actions.login({ username: 'test', password: 'test' })
    })
    return <h1>Register Component</h1>
}
