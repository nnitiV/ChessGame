import { useState } from "react";
import styles from "./index.module.css"

const Board = () => {
    const [board, setBoard] = useState<string[][]>([
        ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
        ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
        ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
    ]);
    const [selectedPiece, setSelectedPiece] = useState<number[] | null>(null);
    const [pieceIsSelected, setPieceIsSelected] = useState<boolean>(false);
    // const [isWhiteTurn, setIsWhiteTurn] = useState<boolean>(true);

    const clickField = (row: number, column: number, piece: string) => {
        if (selectedPiece && checkIfMovementIsValid(row, column, board[selectedPiece![0]][selectedPiece![1]])) {
            movePiece(row, column);
            return unselectPiece()
        } else if (piece) {
            if (selectedPiece && row === selectedPiece[0] && column === selectedPiece[1]) {
                return unselectPiece()
            }
            setPieceIsSelected(true);
            return setSelectedPiece([row, column]);
        } else {
            return unselectPiece()
        }
    }

    const unselectPiece = () => {
        setPieceIsSelected(false);
        return setSelectedPiece(null)
    }

    const checkIfMovementIsValid = (row: number, column: number, piece: string) => {
        switch (piece) {
            case 'wp':
                if (column == selectedPiece![1] && (row === (selectedPiece![0] - 1) || row === (selectedPiece![0] - 2))) {
                    if (board[row + 1][column].slice(0, -1) === 'b') {
                        return false;
                    }
                    return true
                }
                break;
            case 'bp':
                if (column == selectedPiece![1] && (row === (selectedPiece![0] + 1) || row === (selectedPiece![0] + 2))) {
                    if (board[row - 1][column].slice(0, -1) === 'w') {
                        return false;
                    }
                    return true
                }
                break;
            default:
                return false;
                break;
        }
    }

    const movePiece = (row: number, column: number) => {
        board.map((boardRow, index) => {
            boardRow.map((_, index2) => {
                if (index === row && index2 === column) {
                    // Move piece to 
                    setBoard(board =>
                        board.map((boardRow, rowIndex) =>
                            rowIndex === row
                                ? boardRow.map((boardColumn, columnIndex) => (columnIndex === column ? board[selectedPiece![0]][selectedPiece![1]] : boardColumn))
                                : boardRow
                        )
                    );
                    // Remove piece from
                    setBoard(board =>
                        board.map((boardRow, rowIndex) =>
                            rowIndex === selectedPiece![0]
                                ? boardRow.map((boardColumn, columnIndex) => (columnIndex === selectedPiece![1] ? "" : boardColumn))
                                : boardRow
                        )
                    );
                }
            })
        })
    }

    return (
        <section className={styles.game}>
            <div className={styles.board}>
                {board.map((row, index) => (
                    row.map((piece, index2) => (
                        <div
                            className={`
                                ${index % 2 == 0 ? (index2 % 2 == 0 ? styles.green : styles.yellow) : (index2 % 2 == 0 ? styles.yellow : styles.green)}
                                ${(selectedPiece && index == selectedPiece[0] && index2 == selectedPiece[1]) && styles.active}
                            `}
                            key={index + index2}
                            onClick={() => clickField(index, index2, piece)}
                        >
                            {piece && <img src={`${piece}.svg`} alt="" draggable={false} />}
                        </div>
                    ))
                ))}
            </div>
        </section>
    )
};

export default Board;
