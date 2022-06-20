import React from 'react'
import AuthService from './Auth/auth-service'
import { ApiService } from './apiService'

export const App: React.FC = () => {
    const apiService = new ApiService()
    const auth = new AuthService(apiService)
    auth.login({ login: 'projector_user', password: 'projector' }).then(res => {
        console.log(res)
    })
    return <h1>Projector Library</h1>
}
