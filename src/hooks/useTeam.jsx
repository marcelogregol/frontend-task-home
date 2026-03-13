import api from '../utils/api'
import useFlashMessage from './useFlashMessage'
import { useNavigate } from 'react-router-dom'

export default function useTeam() {
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    async function createTeam(team) {
        let msgText = 'Team created successfully!'
        let msgType = 'success'

        try {
            const token = localStorage.getItem('token')

            if (!token) {
                msgText = 'You must be logged in to create a team'
                msgType = 'error'
                setFlashMessage(msgText, msgType)
                throw new Error('User not authenticated')
            }

            const emailList =
                Array.isArray(team?.emailList) ? team.emailList :
                Array.isArray(team?.emails) ? team.emails :
                []

            const teamData = {
                name: team.name,
                emailList,
                rotationStartDate: team.rotationStartDate || null,
                rotationDays: team.rotationDays,
            }

            const response = await api.post('/team/create', teamData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setFlashMessage(msgText, msgType)
            navigate('/listteam')
            return response.data
        } catch (error) {
            if (error.response?.status === 422) {
                msgText = error.response?.data?.message || error.response?.data?.error
            } else if (error.response?.data?.message) {
                msgText = error.response.data.message
            } else {
                msgText = 'Error creating team. Please try again.'
            }
            msgType = 'error'
            setFlashMessage(msgText, msgType)
            throw error
        }
    }

    return { createTeam }
}
