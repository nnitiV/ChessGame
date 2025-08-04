import styles from "./index.module.css"
import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import type { User } from "../../types/UserType";
import type { LoginUser } from "../../types/LoginUserType";
import { useAppDispatch } from "../../redux/hooks";
import { setLoggedUser } from "../../redux/userSlice";

const EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

const Login = () => {
    const [user, setUser] = useState<LoginUser>({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string>("");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const login = async () => {
        if (!user.email?.trim()) return setError("Email can't be empty!");
        if (!user.email?.match(EMAIL_REGEX)) return setError("Invalid email!");
        if (!user.password?.trim()) return setError("Password can't be empty!");
        try {
            let result = await axios.post("http://localhost:8080/api/users/login", {
                email: user.email,
                password: user.password,
            }, { withCredentials: true });
            setError("");
            const loggedUser: User = result.data;
            console.log(result.headers);
            dispatch(setLoggedUser(loggedUser));
            navigate("/");
        } catch (ex) {
            if (axios.isAxiosError(ex) && ex.response) {
                setError(ex.response.data);
            } else {
                setError("Unknown error occurred");
            }
        }
    }
    return (
        <>
            <div className={styles.login}>
                Login
                <hr />
                <div className={styles.form}>
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" name="email" value={user.email} onChange={e => setUser(prev => ({ ...prev, email: e.target.value }))} />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={user.password} onChange={e => setUser(prev => ({ ...prev, password: e.target.value }))} />
                </div>
                <button onClick={login}>Login</button>
            </div>
            {error.length > 0 && <p>{error}</p >}
        </>
    )
};

export default Login;
