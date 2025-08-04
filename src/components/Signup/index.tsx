import { Link } from "react-router-dom";
import styles from "./index.module.css"

const Signup = () => {
    return (
        <div className={styles.signup}>
            signup
            <hr />
            <div className={styles.form}>
                <label htmlFor="email">Email</label>
                <input type="text" id="email" name="email" />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" />
                <label htmlFor="confirm-password">Confirm password</label>
                <input type="password" id="confirm-password" name="confirm-password" />
            </div>
            <Link to="/"><button>signup</button></Link>
        </div>
    )
};

export default Signup;
