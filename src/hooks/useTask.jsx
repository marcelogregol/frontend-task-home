import api from '../utils/api'
import { useNavigate } from 'react-router-dom'
import useFlashMessage from './useFlashMessage'

export default function useTask() {
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    async function createTask(task) {
        let msgText = 'Task created successfully!'
        let msgType = 'success'

        try {
            const token = localStorage.getItem('token')
            if (!token) {
                msgText = 'You must be logged in to create a team'
                msgType = 'error'
                setFlashMessage(msgText, msgType)
                throw new Error('User not authenticated')
            }

            const taskData = {
                name: task.taskName ?? task.name,
                description: task.taskDescription ?? task.description,
                teamId: task.teamId,
            }

            const response = await api.post('/task/create', taskData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setFlashMessage(msgText, msgType)
            navigate('/')
            return response.data
        } catch (error) {
            const backendMsg = error?.response?.data?.message
            msgText = backendMsg || 'Error creating task'
            msgType = 'error'
            setFlashMessage(msgText, msgType)

            throw error
        }
    }

    return { createTask }
}
