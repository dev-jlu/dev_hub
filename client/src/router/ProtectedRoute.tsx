import type { JSX } from "react"
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../app/store";

type ProtectedRouteProps = {
    children: JSX.Element;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const user = useSelector((state: RootState) => state.user);
    if (!user?.id) {
        return <Navigate to="/login" replace/>;
    }
    return children;
};

export default ProtectedRoute;