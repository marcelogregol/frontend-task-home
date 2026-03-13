import { useEffect, useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { HiOutlineCalendarDays } from 'react-icons/hi2'
import api from '../../../utils/api'
import Container from '../../layout/Container'
import Input from '../../form/Input'
import MultiEmailInput from '../../form/MultiEmailInput'
import styles from './Pages.module.css'
import Title from '../../layout/Title'
import useTeam from '../../../hooks/useTeam'

function normalizeParticipantList(emailList) {
    if (!Array.isArray(emailList)) {
        return []
    }

    return [...new Set(emailList.map((email) => String(email).trim()).filter(Boolean))]
}

function formatDate(value) {
    if (!value) {
        return '-'
    }

    return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {
        timeZone: 'UTC',
    })
}

function buildRotationPreview(emailList, rotationDays) {
    if (!Array.isArray(emailList) || emailList.length === 0) {
        return []
    }

    const parsedDays = Number(rotationDays)
    if (!Number.isInteger(parsedDays) || parsedDays <= 0) {
        return []
    }

    const normalizedStart = new Date().toISOString().split('T')[0]
    const baseDate = new Date(`${normalizedStart}T00:00:00`)

    return emailList.map((email, index) => {
        const startDate = new Date(baseDate)
        startDate.setUTCDate(startDate.getUTCDate() + (index * parsedDays))

        const endDate = new Date(startDate)
        endDate.setUTCDate(endDate.getUTCDate() + parsedDays - 1)

        return {
            email,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        }
    })
}

function reorderParticipants(list, startIndex, endIndex) {
    const reordered = Array.from(list)
    const [removed] = reordered.splice(startIndex, 1)
    reordered.splice(endIndex, 0, removed)
    return reordered
}

function Team() {
    const [teamName, setTeamName] = useState('')
    const [emailList, setEmailList] = useState([])
    const [rotationDays, setRotationDays] = useState('1')
    const [userNames, setUserNames] = useState({})
    const { createTeam } = useTeam()

    const scheduleEmails = useMemo(() => normalizeParticipantList(emailList), [emailList])
    const rotationPreview = useMemo(() => buildRotationPreview(scheduleEmails, rotationDays), [scheduleEmails, rotationDays])

    useEffect(() => {
        const token = localStorage.getItem('token') || ''

        if (!scheduleEmails.length || !token) {
            setUserNames({})
            return
        }

        api.post('/users/by-emails', {
            emails: scheduleEmails,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            const mappedUsers = (response.data?.users || []).reduce((acc, user) => {
                acc[user.email] = user.name
                return acc
            }, {})
            setUserNames(mappedUsers)
        }).catch((error) => {
            console.error('Error fetching participant names:', error)
            setUserNames({})
        })
    }, [scheduleEmails])

    function handleTeamNameChange(e) {
        setTeamName(e.target.value)
    }

    function handleRotationDaysChange(e) {
        setRotationDays(e.target.value)
    }

    function handleEmailsChange(updateEmails) {
        setEmailList(normalizeParticipantList(updateEmails))
    }

    function handleDragEnd(result) {
        if (!result.destination) {
            return
        }

        setEmailList((currentEmails) => reorderParticipants(currentEmails, result.source.index, result.destination.index))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const payload = {
            name: teamName.trim(),
            emailList: scheduleEmails,
            rotationDays,
        }

        try {
            await createTeam(payload)
            setTeamName('')
            setEmailList([])
            setRotationDays('1')
        } catch (error) {
            console.error('Error creating team:', error)
        }
    }

    return (
        <Container>
            <div className={styles.content}>
                <Title title="Team settings" />
                <form onSubmit={handleSubmit}>
                    <Input text="Group name" type="text" name="team" placeholder="Enter the group name" handleOnChange={handleTeamNameChange} value={teamName} />
                    <MultiEmailInput label="Add participant" placeholder="Enter your teammates' emails here" value={emailList} onChange={handleEmailsChange} />
                    <div className={styles.scheduleSection}>
                        <h3>Automatic team rotation</h3>
                        <div className={styles.scheduleSingleField}>
                            <Input text="Days per cycle" type="number" name="rotationDays" min="1" handleOnChange={handleRotationDaysChange} value={rotationDays} />
                        </div>
                        <p className={styles.scheduleHint}>The cycle starts on the current date. Drag the cards to change the participant order.</p>
                        {rotationPreview.length > 0 ? (
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="team-rotation-create">
                                    {(provided) => (
                                        <div className={styles.scheduleGrid} ref={provided.innerRef} {...provided.droppableProps}>
                                            {rotationPreview.map((entry, index) => (
                                                <Draggable key={entry.email} draggableId={entry.email} index={index}>
                                                    {(providedDrag, snapshot) => (
                                                        <div ref={providedDrag.innerRef} {...providedDrag.draggableProps} {...providedDrag.dragHandleProps} className={`${styles.scheduleCard} ${snapshot.isDragging ? styles.scheduleCardDragging : ''}`}>
                                                            <div className={styles.scheduleCardHeader}>
                                                                <span className={styles.scheduleOrderBadge}>{index + 1}</span>
                                                                <h4>{userNames[entry.email] || entry.email}</h4>
                                                            </div>
                                                            <div className={styles.scheduleDateRow}>
                                                                <HiOutlineCalendarDays />
                                                                <span>{formatDate(entry.startDate)} to {formatDate(entry.endDate)}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        ) : (
                            <div className={styles.scheduleEmpty}>Add members and set the days per cycle to preview the calculated periods.</div>
                        )}
                    </div>

                    <input type="submit" value="Save" />
                </form>
            </div>
        </Container>
    )
}

export default Team
