import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import TasksPage from "../pages/TasksPage";
import ProjectsPage from "../pages/ProjectsPage";
import ProtectedRoute from "./ProtectedRoute";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={ <LoginPage /> } />
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
            </Routes>
        </BrowserRouter>
    );
};

export default Router;