import { useState } from "react";
import styles from "./index.module.css"

const Board = () => {
    const intialBoardState = [
        ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
        ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
        ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
    ];
    const [board, setBoard] = useState<string[][]>(intialBoardState);
    const [selectedPiece, setSelectedPiece] = useState<number[] | null>(null);
    const [pieceIsSelected, setPieceIsSelected] = useState<boolean>(false);
    const [isWhiteTurn, setIsWhiteTurn] = useState<boolean>(true);

    const clickField = (row: number, column: number, piece: string) => {
        if (!selectedPiece) {
            if (piece.slice(0, -1) === "b" && isWhiteTurn) {
                return alert("It's white turn!");
            } else if (piece.slice(0, -1) === "w" && !isWhiteTurn) {
                return alert("It's black turn!");
            }
        }
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
    };

    const unselectPiece = () => {
        setPieceIsSelected(false);
        return setSelectedPiece(null)
    };

    const checkIfMovementIsValid = (row: number, column: number, piece: string) => {
        let squarePosition = board[row][column];
        const rowDifference = Math.abs(row - selectedPiece![0]), columnDifference = Math.abs(column - selectedPiece![1]);
        switch (piece) {
            case 'wp':
                if (selectedPiece![0] === 6) {
                    if (row === (selectedPiece![0] - 2)) {
                        return checkRow(row);
                    }
                }
                if (checkIfIsSameColumn(column)) {
                    if (row === (selectedPiece![0] - 1)) {
                        return !board[row][column];
                    }
                }
                if (checkIfMovimentIsDiagonal(row, column)) {
                    return checkSquare(piece, squarePosition);
                }
                break;
            case 'bp':
                if (selectedPiece![0] === 1) {
                    if (row === (selectedPiece![0] + 2)) {
                        return checkRow(row);
                    }
                }
                if (checkIfIsSameColumn(column)) {
                    if (row === (selectedPiece![0] + 1)) {
                        return !board[row][column];
                    }
                }
                if (checkIfMovimentIsDiagonal(row, column)) {
                    return checkSquare(piece, squarePosition);
                }
                break;
            case 'wr':
                if (checkIfIsSameColumn(column) && checkRow(row)) {
                    return checkSquare(piece, squarePosition);
                }
                if (checkIfIsSameRow(row) && checkColumn(column)) {
                    return checkSquare(piece, squarePosition);
                }
                break;
            case 'br':
                if (checkIfIsSameColumn(column) && checkRow(row)) {
                    return checkSquare(piece, squarePosition);
                }
                if (checkIfIsSameRow(row) && checkColumn(column)) {
                    return checkSquare(piece, squarePosition);
                }
                break;
            case 'wq':
                if (checkIfMovimentIsDiagonal(row, column)) {
                    return checkSquare(piece, squarePosition);
                }
                if (checkIfIsSameColumn(column) && checkRow(row)) {
                    return checkSquare(piece, squarePosition);
                }
                if (checkIfIsSameRow(row) && checkColumn(column)) {
                    return checkSquare(piece, squarePosition);
                }
                break;
            case 'bq':
                if (checkIfMovimentIsDiagonal(row, column)) {
                    return checkSquare(piece, squarePosition);
                }
                if (checkIfIsSameColumn(column) && checkRow(row)) {
                    return checkSquare(piece, squarePosition);
                }
                if (checkIfIsSameRow(row) && checkColumn(column)) {
                    return checkSquare(piece, squarePosition);
                }
                break;
            case "wb":
                if (checkIfMovimentIsDiagonal(row, column)) {
                    return checkSquare(piece, squarePosition);
                }
                break;
            case "bb":
                if (checkIfMovimentIsDiagonal(row, column)) {
                    return checkSquare(piece, squarePosition);
                }
                break;
            case 'wn':
                return checkHorseMove(row, column, piece, squarePosition);
                break;
            case 'bn':
                return checkHorseMove(row, column, piece, squarePosition);
                break;
            case "wk":
                if (rowDifference === 1 || columnDifference === 1) {
                    if (checkIfMovimentIsDiagonal(row, column)) {
                        return checkSquare(piece, squarePosition);
                    }
                    if (checkIfIsSameColumn(column) && checkRow(row)) {
                        return checkSquare(piece, squarePosition);
                    }
                    if (checkIfIsSameRow(row) && checkColumn(column)) {
                        return checkSquare(piece, squarePosition);
                    }
                }
                break;
            case "bk":
                if (rowDifference === 1 || columnDifference === 1) {
                    if (checkIfMovimentIsDiagonal(row, column)) {
                        return checkSquare(piece, squarePosition);
                    }
                    if (checkIfIsSameColumn(column) && checkRow(row)) {
                        return checkSquare(piece, squarePosition);
                    }
                    if (checkIfIsSameRow(row) && checkColumn(column)) {
                        return checkSquare(piece, squarePosition);
                    }
                }
                break;
            default:
                return false;
        }
    };

    const checkSquare = (piece: string, squarePosition: string) => {
        return squarePosition.slice(0, -1) !== piece.slice(0, -1) || !squarePosition;
    };

    const checkRow = (row: number) => {
        if (row >= selectedPiece![0]) {
            for (let i = selectedPiece![0] + 1; i <= row - 1; i++) {
                if (board[i][selectedPiece![1]]) {
                    console.log("Found: " + board[i][selectedPiece![1]] + " at " + i);
                    return false;
                }
            }
        } else {
            for (let i = selectedPiece![0] - 1; i >= row + 1; i--) {
                if (board[i][selectedPiece![1]]) {
                    console.log("Found " + board[i][selectedPiece![1]] + " at " + i);
                    return false;
                }
            }
        }
        return true;
    };

    const checkColumn = (column: number) => {
        if (column >= selectedPiece![1]) {
            for (let i = selectedPiece![1] + 1; i <= column - 1; i++) {
                if (board[selectedPiece![0]][i]) {
                    console.log("Found: " + board[selectedPiece![0]][i] + " at " + i);
                    return false;
                }
            }
        } else {
            for (let i = selectedPiece![1] - 1; i >= column + 1; i--) {
                if (board[selectedPiece![0]][i]) {
                    console.log("Found " + board[selectedPiece![0]][i] + " at " + i);
                    return false;
                }
            }
        }
        return true;
    };

    const checkIfIsSameColumn = (column: number) => {
        return column === selectedPiece![1];
    };

    const checkIfIsSameRow = (row: number) => {
        return row === selectedPiece![0];
    };

    const checkIfMovimentIsDiagonal = (row: number, column: number) => {
        const rowDifference = row - selectedPiece![0], columnDifference = column - selectedPiece![1];
        if (rowDifference === columnDifference) {
            if (rowDifference > 0 && columnDifference > 0) {
                for (let x = selectedPiece![0] + 1, y = selectedPiece![1] + 1; (x < row && y < column); x++, y++) {
                    if (board[x][y]) {
                        return false;
                    }
                }
                return true;
            } else if (rowDifference < 0 && columnDifference < 0) {
                for (let x = selectedPiece![0] - 1, y = selectedPiece![1] - 1; (x > row && y > column); x--, y--) {
                    if (board[x][y]) {
                        return false;
                    }
                }
                return true;
            }
        } else if (Math.abs(rowDifference) === Math.abs(columnDifference)) {
            if (rowDifference > 0 && columnDifference < 0) {
                for (let x = selectedPiece![0] + 1, y = selectedPiece![1] - 1; (x < row && y > column); x++, y--) {
                    if (board[x][y]) {
                        return false;
                    }
                }
                return true;
            } else if (rowDifference < 0 && columnDifference > 0) {
                for (let x = selectedPiece![0] - 1, y = selectedPiece![1] + 1; (x > row && y < column); x--, y++) {
                    if (board[x][y]) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    };

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
        });
        setIsWhiteTurn(prev => !prev);
    };

    const checkHorseMove = (row: number, column: number, piece: string, squarePosition: string) => {
        if ((row === (selectedPiece![0] + 2)) && (column === (selectedPiece![1] + 1)) ||
            (row === (selectedPiece![0] + 1)) && (column === (selectedPiece![1] + 2)) ||
            (row === (selectedPiece![0] + 2)) && (column === (selectedPiece![1] - 1)) ||
            (row === (selectedPiece![0] + 1)) && (column === (selectedPiece![1] - 2)) ||
            (row === (selectedPiece![0] - 1)) && (column === (selectedPiece![1] - 2)) ||
            (row === (selectedPiece![0] - 2)) && (column === (selectedPiece![1] - 1)) ||
            (row === (selectedPiece![0] - 1)) && (column === (selectedPiece![1] + 2)) ||
            (row === (selectedPiece![0] - 2)) && (column === (selectedPiece![1] + 1))) {
            return checkSquare(piece, squarePosition);
        }
        return false;
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
