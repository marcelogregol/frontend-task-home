import styles from './Select.module.css'

function Select({ label, name, value, options, handleOnChange, textColor, fontWeight }) {
    return (
        <div className={styles.selectContainer}>
            <label className={styles.label} htmlFor={name}>{label}</label>
            <div className={styles.selectWrapper}>
                <select
                    className={styles.selectField}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleOnChange}
                    style={textColor || fontWeight ? {
                        color: textColor,
                        fontWeight: fontWeight,
                    } : {}}
                >
                    <option value="">Select...</option>
                    {options?.map((opt, index) => (
                        <option key={opt.value ?? index} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default Select
