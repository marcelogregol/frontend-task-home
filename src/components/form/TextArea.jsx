import styles from './Input.module.css'

function TextArea({ text, name, placeholder, handleOnChange, value }) {
    return (
        <div className={styles.control}>
            <label className={styles.label} htmlFor={name}>{text}</label>
            <textarea
                className={styles.textareaField}
                name={name}
                id={name}
                placeholder={placeholder}
                onChange={handleOnChange}
                value={value || ''}
            />
        </div>
    )
}

export default TextArea
