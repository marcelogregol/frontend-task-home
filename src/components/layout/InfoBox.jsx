import styles from "./InfoBox.module.css"

export default function InfoBox({ children, title, subtitle }) {

    return (
        <div className={styles.infobox}>
            <h3>{title}</h3>
            <p>{subtitle}</p>
                {children}
        </div>
    )
}
