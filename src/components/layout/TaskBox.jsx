import { HiOutlineCalendarDays } from 'react-icons/hi2'
import { AiOutlineTeam } from 'react-icons/ai'
import RoundedImage from './RoundedImage'
import styles from './TaskBox.module.css'

function formatDate(value) {
    if (!value) {
        return '-'
    }

    return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {
        timeZone: 'UTC',
    })
}

function buildFallbackAvatar(name) {
    const label = encodeURIComponent((name || 'U').trim().charAt(0).toUpperCase())
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72"><rect width="100%" height="100%" rx="36" fill="%23d9deea"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="28" fill="%23363f5f">${label}</text></svg>`
}

function TaskBox({ name, title, description, currentResponsible }) {
    const responsibleName = currentResponsible?.name || 'No current owner'
    const responsibleImage = currentResponsible?.image
        ? `${import.meta.env.VITE_API}/images/users/${currentResponsible.image}`
        : buildFallbackAvatar(responsibleName)

    const deadlineRange = `${formatDate(currentResponsible?.startDate)} to ${formatDate(currentResponsible?.endDate)}`

    return (
        <div className={styles.taskbox}>
            <div className={styles.currentCycle}>
                <div className={styles.infoCard}>
                    <div className={styles.userRow}>
                        <RoundedImage src={responsibleImage} alt={responsibleName} width="px35" />
                        <span className={styles.userName}>{responsibleName}</span>
                    </div>
                    <div className={styles.teamRow}>
                        <AiOutlineTeam />
                        <span>{name}</span>
                    </div>
                    <div className={styles.deadlineRow}>
                        <HiOutlineCalendarDays />
                        <span>{deadlineRange}</span>
                    </div>
                </div>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    )
}

export default TaskBox
