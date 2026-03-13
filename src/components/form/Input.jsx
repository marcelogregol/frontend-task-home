import styles from './Input.module.css'

function Input({ type, text, name, placeholder, handleOnChange, value, multiple, textColor, fontWeight, ...rest }) {
    const inputClassName = `${styles.field} ${type === 'number' ? styles.numberField : ''}`.trim()

    return (
        <div className={styles.control}>
            <label className={styles.label} htmlFor={name}>{text}</label>
            <input
                className={inputClassName}
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                onChange={handleOnChange}
                value={value || ''}
                {...(multiple ? { multiple: true } : {})}
                {...rest}
            />
        </div>
    )
}

export default Input
