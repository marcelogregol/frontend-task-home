import api from '../utils/api'
import { useState } from 'react'
import useFlashMessage from './useFlashMessage'
import { useNavigate } from 'react-router-dom'

export default function useAuth() {
    const [authenticated, setAuthenticated] = useState(false)
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    async function register(user) {
        let msgText = 'Registration completed successfully!'
        let msgType = 'success'

        try {
            const response = await api.post('/users/register', user)
            const data = response.data
            await authUser(data)
        } catch (error) {
            console.error('Request error:', error)

            if (error.response && error.response.data) {
                msgText = error.response.data.message
            } else {
                msgText = 'Server connection error'
            }

            msgType = 'error'
        }
        setFlashMessage(msgText, msgType)
    }

    async function authUser(data) {
        setAuthenticated(true)
        localStorage.setItem('token', data.token)
        navigate('/')
    }

    function logout() {
        const msgText = 'Logout completed successfully'
        const msgType = 'success'

        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined
        navigate('/login')
        setFlashMessage(msgText, msgType)
    }

    async function login(user) {
        let msgText = 'Login completed successfully'
        let msgType = 'success'

        try {
            const response = await api.post('/users/login', user)
            const data = response.data
            await authUser(data)
        } catch (error) {
            msgText = error.response.data.message
            msgType = 'error'
        }
        setFlashMessage(msgText, msgType)
    }

    return { register, login, logout, authenticated }
}
