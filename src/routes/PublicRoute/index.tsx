import type { JSX } from "react"
import { useAppSelector } from "../../redux/hooks";
import { Navigate } from "react-router-dom";

type PublicRouteProps = {
    children: JSX.Element
};

const PublicRoute = ({ children }: PublicRouteProps) => {
    const user = useAppSelector(state => state.user);

    if (user.email) {
        return <Navigate to="/" replace />
    }

    return children;
}
export default PublicRoute;