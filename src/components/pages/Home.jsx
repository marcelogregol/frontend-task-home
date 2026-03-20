import api from '../../utils/api'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../layout/Container'
import TaskBox from '../layout/TaskBox'
import Title from '../layout/Title'
import styles from './Home.module.css'

function Home() {
    const [tasks, setTasks] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {
        if (!token) {
            setTasks([])
            return
        }

        api.get('/task/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setTasks(response.data.tasks || [])
            })
            .catch((error) => {
                console.error('Error fetching tasks:', error)
                setTasks([])
            })
    }, [token])

    return (
        <Container>
            <div className={styles.homeRoot}>
                <Title title="Tasks" />

                <div className={styles.gridtask}>
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <Link
                                key={task.id}
                                to={`/updatetask/${task.id}`}
                                className={styles.link}
                            >
                                <TaskBox
                                    name={task.team?.name}
                                    title={task.title}
                                    description={task.description}
                                    currentResponsible={task.team?.currentRotationMember}
                                />
                            </Link>
                        ))
                    ) : (
                        <p>No tasks available.</p>
                    )}
                </div>
            </div>
        </Container>
    )
}

export default Home
