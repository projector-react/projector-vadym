import React from 'react'
import { AuthProvider } from './Auth/auth-context'
import { Register } from './Pages/Register/register'

export const App: React.FC = () => (
    <AuthProvider>
        <Register />
    </AuthProvider>
)
