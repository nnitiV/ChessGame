import { Link } from "react-router-dom";
import styles from "./index.module.css"
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { setLoggedUser } from "../../redux/userSlice";

const Header = () => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
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
                        <Link to="#" onClick={() => dispatch(setLoggedUser({ id: -1, name: "", email: "", age: -1 }))}>Logout</Link>
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
