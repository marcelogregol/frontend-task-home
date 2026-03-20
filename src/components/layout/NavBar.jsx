import api from '../../utils/api'
import { useContext } from 'react'
import { useState, useEffect } from 'react'
import styles from './NavBar.module.css'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineTeam, AiOutlineSetting } from 'react-icons/ai'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { LuLogOut } from 'react-icons/lu'
import RoundedImage from './RoundedImage'

import { Context } from '../../context/UserContext'

function Navbar() {
    const [user, setUser] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const { logout } = useContext(Context)
    const [teamId, setTeamId] = useState(null)
    const location = useLocation()

    useEffect(() => {
        async function loadUser() {
            try {
                const response = await api.get('/users/checkuser', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const userData = response.data
                if (!userData) {
                    setUser({})
                    setTeamId(null)
                    return
                }

                setUser(userData)
                if (userData.teamId) {
                    setTeamId(userData.teamId)
                }
            } catch {
                setUser({})
                setTeamId(null)
            }
        }

        if (!token) {
            setUser({})
            setTeamId(null)
            return
        }

        loadUser()

        window.addEventListener('user-updated', loadUser)
        return () => window.removeEventListener('user-updated', loadUser)
    }, [token, location.pathname])

    const profileImage = user.image
        ? `${import.meta.env.VITE_API}/images/users/${user.image}`
        : ''

    return (
        <nav className={styles.navbar}>
            <div className={styles.nav_container}>
                <div className={styles.nav_logo}>
                    <Link to="/"><h1>Tasks</h1></Link>
                </div>

                <ul className={styles.link_menu}>
                    <Link to="/task">
                        <li>
                            <IoIosAddCircleOutline />
                            Add task
                        </li>
                    </Link>

                    {teamId ? (
                        <Link to={`/editteam/${teamId}`}>
                            <li>
                                <AiOutlineSetting />
                                My team settings
                            </li>
                        </Link>
                    ) : (
                        <Link to="/listteam">
                            <li>
                                <AiOutlineTeam />
                                Teams
                            </li>
                        </Link>
                    )}
                </ul>

                <ul className={styles.box_profile}>
                    <li>
                        <Link to="/profile">
                            <RoundedImage
                                src={profileImage}
                                alt={user.name}
                                width="px35"
                            />
                            <p>{user.name}</p>
                        </Link>
                    </li>
                    <li onClick={logout}>
                        <LuLogOut />
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar

