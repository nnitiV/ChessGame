import { Link } from "react-router-dom";
import styles from "./index.module.css"

const Header = () => {
    return (
        <header className={styles.header}>
            <Link to="/">
                <h1>Chess</h1>
            </Link>
            <nav>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
            </nav>
        </header>
    )
};

export default Header;
