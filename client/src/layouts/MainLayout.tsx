import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
    children: ReactNode;
};

const MainLayout = ({ children }: Props) => {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <aside style={{
                width: "200px",
                background: "#2c3e50",
                color: "#ecf0f1",
                padding: "20px",
            }}>
                <h2>DevHub</h2>
                <nav>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li><Link style={{ color: "ecf0f1" }} to="/dashboard">Dashboard</Link></li>
                        <li><Link style={{ color: "ecf0f1" }} to="/tasks">Tasks</Link></li>
                        <li><Link style={{ color: "ecf0f1" }} to="/projects">Projects</Link></li>
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <main style={{ flexGrow: 1, padding: 2 }}>
                {/* Navbar */}
                <header style={{
                    height: "60px",
                    borderBottom: "1px solid #bdc3c7",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 20px",
                }}>
                    <h3>Welcome, User</h3>
                    <button>Logout</button>
                </header>

                {/* Page content */}
                <div>{children}</div>
            </main>
        </div>
    );
};

export default MainLayout;