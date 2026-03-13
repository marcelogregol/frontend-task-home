import React, { useState, useRef, useEffect } from 'react'
import styles from '../form/MultiEmail.module.css'

function MultiEmailInput({ value = [], onChange = () => {}, placeholder, label }) {
    const [emails, setEmails] = useState(Array.isArray(value) ? value : [])
    const [input, setInput] = useState('')
    const inputRef = useRef(null)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    useEffect(() => {
        if (Array.isArray(value)) {
            setEmails(value)
        }
    }, [value])

    const handleAddEmail = (text) => {
        const parts = text.split(/[;,\n\s]+/).map((part) => part.trim()).filter(Boolean)

        if (!parts.length) return

        const valid = []

        parts.forEach((part) => {
            if (emailRegex.test(part) && !emails.includes(part)) {
                valid.push(part)
            }
        })

        if (valid.length) {
            const updated = [...emails, ...valid]
            setEmails(updated)
            onChange(updated)
        }
    }

    const handleKeyDown = (e) => {
        if (['Enter', ',', ';', ' ', 'Tab'].includes(e.key)) {
            e.preventDefault()
            if (input.trim()) {
                handleAddEmail(input)
                setInput('')
            }
        }

        if (e.key === 'Backspace' && !input && emails.length) {
            const updated = emails.slice(0, -1)
            setEmails(updated)
            onChange(updated)
        }
    }

    const handleRemove = (index) => {
        const updated = emails.filter((_, i) => i !== index)
        setEmails(updated)
        onChange(updated)
    }

    return (
        <div className={styles.container}>
            <label className={styles.label}>{label}</label>
            <div className={styles.inputbox}>
                {emails.map((email, i) => (
                    <div key={email} className={styles.tag}>
                        <span>{email}</span>
                        <button type="button" onClick={() => handleRemove(i)} className={styles.remove}>×</button>
                    </div>
                ))}
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={styles.input}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                        if (input.trim()) {
                            handleAddEmail(input)
                            setInput('')
                        }
                    }}
                    placeholder={emails.length ? '' : placeholder}
                />
            </div>
            <p className={styles.hint}>Separate with comma, space, or press Enter.</p>
        </div>
    )
}

export default MultiEmailInput
