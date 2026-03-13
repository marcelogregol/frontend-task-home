import styles from './SequenceBox.module.css'
import Title from './Title'

function SequenceBox({ items = [] }) {
    return (
        <div className={styles.grid_list}>
            <Title title="Task sequence" />
            <ul className={styles.viewlist}>
                {items.map((name, index) => (
                    <li key={index}>
                        <span className={styles.position}>{index + 1}</span>
                        <div className={styles.user_info}>
                            <p>{name}</p>
                            <p><span>26/10</span> <span>05/11</span></p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SequenceBox
