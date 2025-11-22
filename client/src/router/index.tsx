import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import TasksPage from "../pages/TasksPage";
import ProjectsPage from "../pages/ProjectsPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import SignupPage from "../pages/SignUpPage";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/login" 
                    element={ 
                        <PublicRoute>
                            <LoginPage /> 
                        </PublicRoute>
                    } 
                />
                <Route 
                    path="/dashboard" 
                    element={ 
                        <ProtectedRoute>
                            <DashboardPage/>
                        </ProtectedRoute> 
                    } 
                />
                
                <Route 
                    path="/tasks" 
                    element={ 
                        <ProtectedRoute>
                            <TasksPage/>
                        </ProtectedRoute> 
                    } 
                />

                <Route 
                    path="/projects" 
                    element={ 
                        <ProtectedRoute>
                            <ProjectsPage/>
                        </ProtectedRoute> 
                    } 
                />

                <Route 
                    path="*" 
                    element={ 
                        <ProtectedRoute>
                            <DashboardPage/>
                        </ProtectedRoute> 
                    } 
                />
                
                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <SignupPage /> 
                        </PublicRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;