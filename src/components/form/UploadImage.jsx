import { useEffect, useState } from 'react'
import styles from './UploadImage.module.css'
import { CiCamera } from 'react-icons/ci'

function UploadImage({ onUpload, defaultImage, alt }) {
    const [preview, setPreview] = useState(defaultImage || null)

    useEffect(() => {
        if (defaultImage) setPreview(defaultImage)
    }, [defaultImage])

    function handleFileChange(e) {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result)
            if (onUpload) onUpload(file)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className={styles.imageContainer}>
            <img
                src={preview || '/placeholder-user.jpg'}
                alt={alt || 'preview'}
                className={styles.imagePreview}
            />
            <label className={styles.editOverlay}>
                <CiCamera />
                <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
            </label>
        </div>
    )
}

export default UploadImage
