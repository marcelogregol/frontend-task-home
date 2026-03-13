import styles from './Container.module.css'
import Footer from './Footer'
import Navbar from './NavBar'

function Container({ children }) {
    return (
        <div className={styles.pageShell}>
            <Navbar />
            <main className={styles.container}>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Container
