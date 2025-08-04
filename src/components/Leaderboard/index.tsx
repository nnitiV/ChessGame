import { useEffect, useState } from "react";
import styles from "./index.module.css"
import axios from "axios";
import type { User } from "../../types/UserType";

const Leaderboard = () => {
    const [users, setUsers] = useState<User[]>();
    useEffect(() => {
        const fetchUsers = async () => {
            const result = await axios.get("http://localhost:8080/api/users");
            setUsers(result.data);
        }
        fetchUsers();
    }, [])
    return (
        <div className={styles.leaderboard}>
            <table>
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Name</th>
                        <th>Games won</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.sort((a, b) => b.age - a.age).map((item, i) => (
                        <tr key={item.id}>
                            <td>{i + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.gamesWon}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default Leaderboard;
