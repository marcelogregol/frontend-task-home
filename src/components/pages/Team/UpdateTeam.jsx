import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { HiOutlineCalendarDays } from 'react-icons/hi2'
import api from '../../../utils/api'
import Container from '../../layout/Container'
import Input from '../../form/Input'
import MultiEmailInput from '../../form/MultiEmailInput'
import styles from './Pages.module.css'
import Title from '../../layout/Title'
import useFlashMessage from '../../../hooks/useFlashMessage'

function normalizeEmailList(emailList) {
    if (!emailList) return []
    if (Array.isArray(emailList)) return emailList

    if (typeof emailList === 'string') {
        try {
            const parsed = JSON.parse(emailList)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return emailList.split(',').map((email) => email.trim()).filter(Boolean)
        }
    }

    return []
}

function normalizeParticipantList(emailList) {
    return [...new Set(normalizeEmailList(emailList).map((email) => String(email).trim()).filter(Boolean))]
}

function formatDate(value) {
    if (!value) return '-'
    return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', { timeZone: 'UTC' })
}

function buildRotationPreview(emailList, rotationDays) {
    if (!Array.isArray(emailList) || emailList.length === 0) return []

    const parsedDays = Number(rotationDays)
    if (!Number.isInteger(parsedDays) || parsedDays <= 0) return []

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

function UpdateTeam() {
    const { id } = useParams()
    const [teamName, setTeamName] = useState('')
    const [emails, setEmails] = useState([])
    const [rotationDays, setRotationDays] = useState('1')
    const [userNames, setUserNames] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const [currentUserEmail, setCurrentUserEmail] = useState('')
    const [currentUserRole, setCurrentUserRole] = useState('member')
    const [previousEmails, setPreviousEmails] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showSelfRemovalModal, setShowSelfRemovalModal] = useState(false)
    const [showMemberRemovalBlockedModal, setShowMemberRemovalBlockedModal] = useState(false)
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            setCurrentUserEmail('')
            return
        }

        api.get('/users/checkuser', {
            headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
            setCurrentUserEmail(response.data?.email || '')
        }).catch((error) => {
            console.error('Error fetching current user:', error)
        })
    }, [token])

    useEffect(() => {
        api.get(`/team/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
            const dataTeam = response.data.team
            const normalizedEmails = normalizeParticipantList(dataTeam?.emailList)
            setTeamName(dataTeam?.name || '')
            setEmails(normalizedEmails)
            setPreviousEmails(normalizedEmails)
            setRotationDays(String(dataTeam?.rotationDays || 1))
            setCurrentUserRole(response.data?.currentUserRole || 'member')
        }).catch((err) => {
            console.error('Error fetching team:', err)
        })
    }, [token, id])

    const scheduleEmails = useMemo(() => normalizeParticipantList(emails), [emails])
    const rotationPreview = useMemo(() => buildRotationPreview(scheduleEmails, rotationDays), [scheduleEmails, rotationDays])

    useEffect(() => {
        if (!scheduleEmails.length || !token) {
            setUserNames({})
            return
        }

        api.post('/users/by-emails', { emails: scheduleEmails }, {
            headers: { Authorization: `Bearer ${token}` },
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
    }, [scheduleEmails, token])

    function handleDragEnd(result) {
        if (!result.destination) return
        setEmails((currentEmails) => reorderParticipants(currentEmails, result.source.index, result.destination.index))
    }

    async function confirmDelete() {
        try {
            const response = await api.delete(`team/deleteteam/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setFlashMessage(response.data.message, 'success')
            navigate('/listteam')
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error deleting team'
            setFlashMessage(errorMessage, 'error')
        } finally {
            setShowDeleteModal(false)
        }
    }

    function handleTeamNameChange(e) { setTeamName(e.target.value) }
    function handleRotationDaysChange(e) { setRotationDays(e.target.value) }

    function handleEmailsChange(updateEmails) {
        const normalizedEmails = normalizeParticipantList(updateEmails)
        const removedEmails = emails.filter((email) => !normalizedEmails.includes(email))

        if (!removedEmails.length) {
            setEmails(normalizedEmails)
            return
        }

        setPreviousEmails(emails)

        if (currentUserRole !== 'admin') {
            setShowMemberRemovalBlockedModal(true)
            return
        }

        setEmails(normalizedEmails)

        if (currentUserEmail && emails.includes(currentUserEmail) && !normalizedEmails.includes(currentUserEmail)) {
            setShowSelfRemovalModal(true)
        }
    }

    function handleCancelSelfRemoval() {
        setEmails(previousEmails)
        setShowSelfRemovalModal(false)
    }

    function handleConfirmSelfRemoval() {
        setShowSelfRemovalModal(false)
    }

    function handleCloseMemberRemovalBlockedModal() {
        setEmails(previousEmails)
        setShowMemberRemovalBlockedModal(false)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const payload = { name: teamName, emailList: scheduleEmails, rotationDays }

        try {
            const response = await api.patch(`/team/editteam/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setFlashMessage(response.data.message, 'success')
            navigate('/listteam')
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error updating team'
            setFlashMessage(errorMessage, 'error')
        }
    }

    return (
        <Container>
            <div className={styles.content}>
                <Title title="Team settings" />
                <form onSubmit={handleSubmit}>
                    <Input text="Group name" type="text" name="team" placeholder="Enter the group name" handleOnChange={handleTeamNameChange} textColor="#000" fontWeight={600} value={teamName} />
                    <MultiEmailInput label="Add participant" placeholder="Enter your teammates' emails here" value={emails} onChange={handleEmailsChange} />
                    <div className={styles.scheduleSection}>
                        <h3>Automatic team rotation</h3>
                        <div className={styles.scheduleSingleField}>
                            <Input text="Days per cycle" type="number" name="rotationDays" min="1" handleOnChange={handleRotationDaysChange} value={rotationDays} />
                        </div>
                        <p className={styles.scheduleHint}>The cycle starts on the current date. Drag the cards to change the participant order.</p>
                        {rotationPreview.length > 0 ? (
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="team-rotation-update">
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
                    <div className={styles.buttons}>
                        <input type="submit" value="Save" />
                        <button type="button" onClick={() => setShowDeleteModal(true)}>Delete</button>
                    </div>
                </form>
            </div>
            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Delete team?</h3>
                        <p>Are you sure you want to delete this team?<br /><strong>All team tasks will also be deleted.</strong></p>
                        <div className={styles.modalActions}>
                            <button type="button" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button type="button" className={styles.delete} onClick={confirmDelete}>Yes, delete</button>
                        </div>
                    </div>
                </div>
            )}
            {showSelfRemovalModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Remove my email?</h3>
                        <p>If I remove my email, I will be removed from the team.</p>
                        <div className={styles.modalActions}>
                            <button type="button" onClick={handleCancelSelfRemoval}>Back</button>
                            <button type="button" className={styles.delete} onClick={handleConfirmSelfRemoval}>Continue</button>
                        </div>
                    </div>
                </div>
            )}
            {showMemberRemovalBlockedModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>No permission to remove</h3>
                        <p>You do not have permission to remove participants from this team.</p>
                        <div className={styles.modalActions}>
                            <button type="button" onClick={handleCloseMemberRemovalBlockedModal}>Back</button>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    )
}

export default UpdateTeam
