import { Link, useNavigate } from "react-router-dom";
import styles from "./index.module.css"
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { setLoggedUser } from "../../redux/userSlice";
import { useAppDispatch } from "../../redux/hooks";
import axios from "axios";
import { useEffect } from "react";

const Header = () => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const fetchLoggedUser = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/users/me", { withCredentials: true });
            const user = response.data;  // your UserResponseDTO
            dispatch(setLoggedUser(user));
        } catch (error) {
            // handle unauthorized or other errors here
            console.log("Not logged in or error fetching user");
        }
    };
    const logout = async () => {
        try {
            await axios.post("http://localhost:8080/api/users/logout", {}, { withCredentials: true });
            dispatch(setLoggedUser({ id: -1, name: "", email: "", age: -1, gamesWon: -1 }));  // Clear user in Redux
            navigate("/login"); // Redirect to login page or wherever you want
        } catch (error) {
            console.error("Logout failed", error);
        }
    };
    useEffect(() => { fetchLoggedUser(); }, [])
    return (
        <header className={styles.header}>
            <Link to="/">
                <h1>Chess</h1>
            </Link>
            <nav>
                <Link to="/">Game</Link>
                <Link to="/leaderboard">Leaderboard</Link>
                {user.email ? (
                    <>
                        <p>{user.name}</p>
                        <Link to="#" onClick={logout}>Logout</Link>
                    </>
                ) : (
                    <>
                        <Link to="/signup">Signup</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}
            </nav>
        </header>
    )
};

export default Header;
