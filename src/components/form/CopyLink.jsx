import { useState } from 'react'
import styles from './CopyEmail.module.css'
import { FaRegCopy } from 'react-icons/fa'
import { FaCopy } from 'react-icons/fa6'

export default function CopyEmail({ value }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.log('Copy error', err)
        }
    }

    return (
        <div className={styles.box}>
            <input
                type="text"
                readOnly
                value={value}
                onFocus={(e) => e.target.select()}
            />
            <button onClick={handleCopy} aria-label={copied ? 'Copied' : 'Copy'}>
                {copied ? <FaCopy /> : <FaRegCopy />}
            </button>
        </div>
    )
}
