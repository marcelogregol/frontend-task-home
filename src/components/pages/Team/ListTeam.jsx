import api from '../../../utils/api'
import { useState, useEffect } from 'react'
import Container from '../../layout/Container'
import styles from './Pages.module.css'
import { Link } from 'react-router-dom'
import { AiOutlineTeam } from 'react-icons/ai'

function normalizeEmailList(emailList) {
    if (!emailList) return []
    if (Array.isArray(emailList)) return emailList

    if (typeof emailList === 'string') {
        try {
            const parsed = JSON.parse(emailList)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return emailList
                .split(',')
                .map((email) => email.trim())
                .filter(Boolean)
        }
    }

    return []
}

function getCurrentUserRole(team) {
    return team?.UserTeams?.role || 'member'
}

function ListTeam() {
    const [teams, setTeams] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {
        api
            .get('/team/teams', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setTeams(response.data?.teams || [])
            })
            .catch((error) => {
                console.error('Error fetching teams:', error)
                setTeams([])
            })
    }, [token])

    return (
        <Container>
            <div className={styles.content}>
                <div className={styles.listHeader}>
                    <h3 className={styles.headerTitle}>All my teams</h3>
                    <Link className={styles.team_btn} to="/team">
                        Create team
                    </Link>
                </div>

                {teams.length > 0 ? (
                    <div className={styles.teamCards}>
                        {teams.map((team) => {
                            const emails = normalizeEmailList(team.emailList)
                            const role = getCurrentUserRole(team)

                            return (
                                <Link className={styles.teamCardLink} to={`/editteam/${team.id}`} key={team.id}>
                                    <div className={styles.teamListItem}>
                                        <div className={styles.column}>
                                            <div className={styles.teamTitleRow}>
                                                <AiOutlineTeam />
                                                <h4>{team.name}</h4>
                                            </div>
                                            <div className={styles.emailChips}>
                                                {emails.length > 0 ? emails.map((email) => (
                                                    <span key={email} className={styles.emailChip}>{email}</span>
                                                )) : (
                                                    <span className={styles.emailChip}>No emails</span>
                                                )}
                                            </div>
                                            <p className={styles.roleText}>Team role: {role === 'admin' ? 'Administrator' : 'Member'}</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <p>You are not a member of any team yet.</p>
                )}
            </div>
        </Container>
    )
}

export default ListTeam
