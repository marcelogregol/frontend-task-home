import { useMemo, useState } from 'react'
import styles from './RoundedImage.module.css'

function RoundedImage({ src, alt, width }) {
    const [hasError, setHasError] = useState(false)

    const fallbackLabel = useMemo(() => {
        const safeAlt = String(alt || '').trim()
        return safeAlt ? safeAlt.charAt(0).toUpperCase() : ''
    }, [alt])

    if (!src || hasError) {
        return (
            <div
                className={`${styles.rounded_image} ${styles[width]} ${styles.placeholder}`}
                aria-label={alt || 'User avatar'}
                title={alt || 'User avatar'}
            >
                {fallbackLabel}
            </div>
        )
    }

    return (
        <img
            className={`${styles.rounded_image} ${styles[width]}`}
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
        />
    )
}

export default RoundedImage
