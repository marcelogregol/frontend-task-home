import api from '../../../utils/api'
import { useEffect, useState } from 'react'
import Container from '../../layout/Container'
import Input from '../../form/Input'
import styles from '../Team/Pages.module.css'
import TextArea from '../../form/TextArea'
import Select from '../../form/Select'
import Title from '../../layout/Title'
import useTask from '../../../hooks/useTask'

function Task() {
    const [task, setTask] = useState({
        taskName: '',
        taskDescription: '',
        teamId: '',
    })

    const [teams, setTeams] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')
    const { createTask } = useTask()

    useEffect(() => {
        api
            .get('/users/checkuser', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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

    function handleSubmit(e) {
        e.preventDefault()
        createTask({
            name: task.taskName,
            description: task.taskDescription,
            teamId: task.teamId,
        })
            .then(() => {
                setTask({ taskName: '', taskDescription: '', teamId: '' })
            })
            .catch((err) => {
                console.error('Error creating task:', err)
            })
    }

    return (
        <Container>
            <div className={styles.content}>
                <Title title="Create tasks" />
                <form className={styles.control} onSubmit={handleSubmit}>
                    <Input text="Task name" type="text" name="taskName" placeholder="Enter your task name" handleOnChange={handleChange} value={task.taskName} />
                    <Select label="Select team" name="teamId" value={task.teamId} options={teamOptions} handleOnChange={handleChange} />
                    <TextArea text="Description" name="taskDescription" placeholder="Add task details..." handleOnChange={handleChange} value={task.taskDescription} />
                    <input type="submit" value="Save" />
                </form>
            </div>
        </Container>
    )
}

export default Task
