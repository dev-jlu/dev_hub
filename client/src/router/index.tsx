import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";

const Router = () => {
    const isLoggedIn = false;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={ isLoggedIn ? <Navigate to="dashboard" /> : <LoginPage /> } />
                <Route path="/dashboard" element={ isLoggedIn ? <DashboardPage /> : <Navigate to="/login" /> } />
                <Route path="*" element={< Navigate to="/login" /> } />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;