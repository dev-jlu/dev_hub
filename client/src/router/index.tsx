import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import TasksPage from "../pages/TasksPage";
import ProjectsPage from "../pages/ProjectsPage";

const Router = () => {
    const isLoggedIn = true;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={ <LoginPage /> } />
                <Route path="/dashboard" element={ <DashboardPage /> } />
                <Route path="/tasks" element={ <TasksPage /> } />
                <Route path="/projects" element={ <ProjectsPage /> } />

                <Route path="*" element={<DashboardPage /> } />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;