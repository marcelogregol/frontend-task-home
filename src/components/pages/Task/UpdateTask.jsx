import api from '../../../utils/api'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Container from '../../layout/Container'
import Input from '../../form/Input'
import styles from '../Team/Pages.module.css'
import TextArea from '../../form/TextArea'
import Select from '../../form/Select'
import Title from '../../layout/Title'
import useFlashMessage from '../../../hooks/useFlashMessage'

function UpdateTask() {
    const { id } = useParams()
    const [task, setTask] = useState({
        title: '',
        description: '',
        teamId: '',
    })

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()
    const [teams, setTeams] = useState([])

    async function handleDelete() {
        try {
            const response = await api.delete(`/task/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            setFlashMessage(response.data.message, 'success')
            navigate('/')
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error deleting task.'
            setFlashMessage(errorMsg, 'error')
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        let msgType = 'success'
        try {
            const payload = {
                title: task.title,
                description: task.description,
                teamId: task.teamId,
            }

            const response = await api.put(`/task/update/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })

            const { task: updatedTask } = response.data

            setFlashMessage(response.data.message, msgType)
            navigate('/')
            setTask({
                title: updatedTask?.title || '',
                description: updatedTask?.description || '',
                teamId: updatedTask?.teamId || updatedTask?.team?.id || '',
            })
        } catch (error) {
            msgType = 'error'
            const errorMsg = error.response?.data?.message || 'An unexpected error occurred.'
            setFlashMessage(errorMsg, msgType)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        api
            .get(`/task/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const dataTask = response.data.task

                setTask({
                    title: dataTask?.title || '',
                    description: dataTask?.description || '',
                    teamId: dataTask?.teamId || dataTask?.team?.id || '',
                })
            })
            .catch((err) => {
                console.error('Error fetching task:', err)
            })
    }, [token, id])

    useEffect(() => {
        api
            .get('/users/checkuser', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setTeams(response.data?.Teams || [])
            })
            .catch((err) => {
                console.error('Error fetching user teams:', err)
                setTeams([])
            })
    }, [token])

    const teamOptions = teams.map((team) => ({
        value: team.id,
        label: team.name,
    }))

    function handleChange(e) {
        const { name, value } = e.target
        setTask((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <Container>
            <div className={styles.content}>
                <Title title="Update task" />
                <form className={styles.control} onSubmit={handleSubmit}>
                    <Input text="Task name" type="text" name="title" placeholder="Enter your task name" handleOnChange={handleChange} value={task.title} />
                    <Select label="Select team" name="teamId" value={task.teamId} options={teamOptions} handleOnChange={handleChange} />
                    <TextArea text="Description" name="description" placeholder="Add task details..." handleOnChange={handleChange} value={task.description} />
                    <div className={styles.buttons}>
                        <input type="submit" value={loading ? 'Saving...' : 'Save'} disabled={loading} />
                        <button type="button" onClick={handleDelete}>Delete</button>
                    </div>
                </form>
            </div>
        </Container>
    )
}

export default UpdateTask
