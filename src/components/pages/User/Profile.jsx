import api from '../../../utils/api'
import { useEffect, useState } from 'react'
import Container from '../../layout/Container'
import styles from '../Team/Pages.module.css'
import Input from '../../form/Input'
import useFlashMessage from '../../../hooks/useFlashMessage'
import Title from '../../layout/Title'
import UploadImage from '../../form/UploadImage'

function Profile() {
    const [user, setUser] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {
        if (!token) {
            setUser({})
            return
        }

        api.get('/users/checkuser', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            setUser(response.data || {})
        }).catch(() => {
            setUser({})
        })
    }, [token])

    const handleImageUpload = (file) => {
        setUser({ ...user, image: file })
    }

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        let msgType = 'success'

        const formData = new FormData()
        Object.keys(user).forEach((key) => {
            if (user[key] !== '') {
                if (key === 'confirmpassword' && !user.password) {
                    return
                }
                formData.append(key, user[key])
            }
        })

        try {
            const response = await api.patch(`/users/edit/${user.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            })

            setFlashMessage(response.data.message, msgType)
        } catch (err) {
            msgType = 'error'
            const errorMessage = err.response?.data?.message || 'Error updating profile'
            setFlashMessage(errorMessage, msgType)
        }
    }

    const userImage = user.image
        ? `${import.meta.env.VITE_API}/images/users/${user.image}`
        : '/placeholder-user.jpg'

    return (
        <Container>
            <div className={styles.content}>
                <form onSubmit={handleSubmit} className={styles.form_profile}>
                    <Title title="Edit profile" />
                    <UploadImage onUpload={handleImageUpload} defaultImage={userImage} alt={user.name} />
                    <Input text="Name" type="text" name="name" placeholder="Enter your name" handleOnChange={handleChange} value={user.name || ''} />
                    <Input text="Phone" type="text" name="phone" placeholder="Enter your phone" handleOnChange={handleChange} value={user.phone || ''} />
                    <Input text="Email" type="text" name="email" placeholder="Enter your email" handleOnChange={handleChange} value={user.email || ''} />
                    <Input text="Password" type="password" name="password" placeholder="Enter your password" handleOnChange={handleChange} value={user.password || ''} autoComplete="new-password" />
                    <Input text="Confirm password" type="password" name="confirmpassword" placeholder="Confirm your password" handleOnChange={handleChange} value={user.confirmpassword || ''} autoComplete="new-password" />
                    <input type="submit" value="Update" />
                </form>
            </div>
        </Container>
    )
}

export default Profile
