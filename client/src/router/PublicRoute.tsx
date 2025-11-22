import type { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../app/store";

type PublicRouteProps = {
    children: JSX.Element;
};

const PublicRoute = ({ children }: PublicRouteProps) => {
    const user = useSelector((state: RootState) => state.user);
    if (user?.id) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

export default PublicRoute;