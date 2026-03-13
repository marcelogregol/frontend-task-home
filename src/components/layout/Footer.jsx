import { Link } from 'react-router-dom'
import styles from './Footer.module.css'
import { CiLinkedin } from 'react-icons/ci'
import { FiGithub } from 'react-icons/fi'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footer_container}>
                <div className={styles.footer_logo}>
                    <Link to="/"><h3>TaskHome</h3></Link>
                </div>
                <div>
                    <p>© 2025, Marcelo Gregol, Portfolio Project</p>
                </div>
                <div className={styles.social_icons}>
                    <Link target="_blank" to="https://www.linkedin.com/in/marcelogregol">
                        <CiLinkedin />
                    </Link>
                    <Link target="_blank" to="https://github.com/marcelogregol">
                        <FiGithub />
                    </Link>
                </div>
            </div>
        </footer>
    )
}
