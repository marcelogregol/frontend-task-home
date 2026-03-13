import React, { useContext, useState } from 'react'
import styles from '../../form/Form.module.css'
import Input from '../../form/Input'
import { Link } from 'react-router-dom'
import { Context } from '../../../context/UserContext'

function Register() {
    const [user, setUser] = useState({})
    const { register } = useContext(Context)

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()
        register(user)
    }

    return (
        <section className={styles.container}>
            <div className={styles.image_container}></div>
            <div className={styles.form_container}>
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <Input text="Name" type="text" name="name" placeholder="Enter your name" handleOnChange={handleChange} value={user.name || ''} />
                    <Input text="Phone" type="tel" name="phone" placeholder="Enter your phone" handleOnChange={handleChange} value={user.phone || ''} />
                    <Input text="Email" type="text" name="email" placeholder="Enter your email" handleOnChange={handleChange} value={user.email || ''} />
                    <Input text="Password" type="password" name="password" placeholder="Enter your password" handleOnChange={handleChange} value={user.password || ''} />
                    <Input text="Confirm password" type="password" name="confirpassword" placeholder="Confirm your password" handleOnChange={handleChange} value={user.confirpassword || ''} />
                    <input type="submit" value="Create account" />
                </form>
                <p>Already have an account? <Link to="/login">Click here</Link></p>
            </div>
        </section>
    )
}

export default Register
