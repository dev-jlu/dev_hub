import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/MainLayout.module.css";
import { useMutation } from "@apollo/client/react";
import { LOGOUT } from "../graphql/mutations";
import { useDispatch } from "react-redux";
import { clearUser } from "../app/slices/userSlice";
import type { UserType } from "../graphql/types";

type Props = {
    children: ReactNode;
};

const MainLayout = ({ children }: Props) => {
    const [logout] = useMutation(LOGOUT);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let user: UserType | null = null;

    const handleLogout = async () => {
        try {
            await logout();
            dispatch(clearUser());
            localStorage.removeItem("user");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            user = JSON.parse(storedUser);
        } catch (error) {
                    console.error('Failed to parse stored user: ', error);
        }
    }

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
                    <div className={styles.headerInfo}>Hello, {user && user.name}!</div>
                    <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
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