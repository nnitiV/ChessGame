import { useNavigate } from "react-router-dom";
import styles from "./index.module.css"
import { useState } from "react";
import axios from "axios";
import type { SignupUser } from "../../types/SignupUserType";

const Signup = () => {
    const [user, setUser] = useState<SignupUser>({
        name: "",
        email: "",
        password: "",
        age: 0
    });
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const signup = async () => {
        if (user?.password != confirmPassword) return setError("Passwords doesn't match.");
        try {
            await axios.post("http://localhost:8080/api/users", user);
            setError("");
            navigate("/login");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data);
            } else {
                setError("Unknown error occurred");
            }
        }
    }
    return (
        <div className={styles.signup}>
            signup
            <hr />
            <div className={styles.form}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={user?.name} onChange={e => setUser(prev => ({ ...prev, name: e.target.value }))} />
                <label htmlFor="email">Email</label>
                <input type="text" id="email" name="email" value={user?.email} onChange={e => setUser(prev => ({ ...prev, email: e.target.value }))} />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={user?.password} onChange={e => setUser(prev => ({ ...prev, password: e.target.value }))} />
                <label htmlFor="confirm-password">Confirm password</label>
                <input type="password" id="confirm-password" name="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <label htmlFor="age">Age</label>
                <input type="number" id="age" name="age" value={user?.age} onChange={e => setUser(prev => ({ ...prev, age: Number(e.target.value) }))} />
            </div>
            {/* <Link to="/"><button>signup</button></Link> */}
            <button onClick={signup}>Signup</button>
            <p>{error}</p>
        </div>
    )
};

export default Signup;
