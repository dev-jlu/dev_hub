import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/MainLayout.module.css";

type Props = {
    children: ReactNode;
};

const MainLayout = ({ children }: Props) => {
    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <h2 className={styles.logo}>DevHub</h2>
                <nav>
                    <ul className={styles.navList}>
                        <li className={styles.navItem}><Link className={styles.navLink} to="/dashboard">Dashboard</Link></li>
                        <li className={styles.navItem}><Link className={styles.navLink} to="/tasks">Tasks</Link></li>
                        <li className={styles.navItem}><Link className={styles.navLink} to="/projects">Projects</Link></li>
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <main className={styles.mainContent}>
                {/* Navbar */}
                <header className={styles.header}>
                    <div className={styles.headerInfo}>Hello, User!</div>
                    <button className={styles.logoutButton}>Logout</button>
                </header>

                {/* Page content */}
                <div className={styles.pageContent}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;