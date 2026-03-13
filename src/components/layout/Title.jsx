import styles from './Title.module.css'

function Title({ title, subTitle,  }) {
    return (
        <div className={styles.title}>
            <h3>{title}</h3>
            <p>{subTitle}</p>
        </div>
    )
}
export default Title