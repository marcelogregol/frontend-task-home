import React, { useContext, useState } from 'react'
import styles from '../../form/Form.module.css'
import Input from '../../form/Input'
import { Link } from 'react-router-dom'
import { Context } from '../../../context/UserContext'

function Login() {
    const [user, setUser] = useState({})
    const { login } = useContext(Context)

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()
        login(user)
    }

    return (
        <section className={styles.container}>
            <div className={styles.image_container}></div>
            <div className={styles.form_container}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <Input
                        text="Email"
                        type="text"
                        name="email"
                        placeholder="Enter your email"
                        handleOnChange={handleChange}
                        value={user.email || ''}
                    />
                    <Input
                        text="Password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        handleOnChange={handleChange}
                        value={user.password || ''}
                    />
                    <input type="submit" value="Sign in" />
                </form>
                <p>Don't have an account? <Link to="/register">Click here</Link></p>
            </div>
        </section>
    )
}

export default Login
