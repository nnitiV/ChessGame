import styles from "./index.module.css"

interface Arguments {
    openPromotionSelection: boolean,
    setOpenPromotionSelection: (val: boolean) => void
    setPieceToSubstituteWith: (piece: string) => void
}

const Promote = ({ openPromotionSelection, setOpenPromotionSelection, setPieceToSubstituteWith }: Arguments) => {
    const selectAndClose = (piece: string) => {
        setOpenPromotionSelection(false);
        setPieceToSubstituteWith(piece);
        new Audio("./promote.mp3").play();
    }
    return (
        <div className={`${styles.wrapper} ${openPromotionSelection && styles.active}`}>
            <div className={styles.promote}>
                <p onClick={() => selectAndClose("r")}>Rook</p>
                <p onClick={() => selectAndClose("n")}>Horse</p>
                <p onClick={() => selectAndClose("b")}>Bishop</p>
                <p onClick={() => selectAndClose("q")}>Queen</p>
            </div>
        </div>
    )
};

export default Promote;
