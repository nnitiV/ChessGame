import { type JSX } from "react"
import { useAppSelector } from "../../redux/hooks";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
    children: JSX.Element
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const user = useAppSelector(state => state.user);

    if (!user.email) {
        return <Navigate to={"/login"} replace />
    }

    return children;
};
export default PrivateRoute;