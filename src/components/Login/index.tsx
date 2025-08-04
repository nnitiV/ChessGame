import { Link } from "react-router-dom";
import styles from "./index.module.css"

const Login = () => {
    return (
        <div className={styles.login}>
            Login
            <hr />
            <div className={styles.form}>
                <label htmlFor="">Email</label>
                <input type="text" />
                <label htmlFor="">Password</label>
                <input type="password" />
            </div>
            <Link to="/"><button>Login</button></Link>
        </div>
    )
};

export default Login;
