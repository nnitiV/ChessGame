import { memo } from "react";
import styles from "./index.module.css"

interface Arguments {
    message: string,
    showMessage: boolean,
    setShowMessage: (val: boolean) => void
}

const Message = ({ message, showMessage, setShowMessage }: Arguments) => {
    let myTimeout = setTimeout(() => setShowMessage(false), 3500);
    setInterval(() => clearTimeout(myTimeout), 3501);
    return (
        <div className={`${styles.messageDiv} ${showMessage && styles.active}`}>
            {message}
        </div>
    )
};

export default memo(Message);
