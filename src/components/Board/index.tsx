import { useEffect, useState } from "react";
import styles from "./index.module.css"
import Message from "./message";

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
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [turnMessage, setTurnMessage] = useState<string>("");

    const clickField = (row: number, column: number, piece: string) => {
        if (checkPlayerTurn(piece)) return;

        if (selectedPiece && checkIfMovementIsValid(row, column, board[selectedPiece![0]][selectedPiece![1]])) {
            movePiece(row, column);
            unselectPiece()
        } else if (piece) {
            // Unselect piece if click on already selected one.
            if (selectedPiece && row === selectedPiece[0] && column === selectedPiece[1]) {
                return unselectPiece()
            }
            if (piece !== 'pm' && selectedPiece && piece.slice(0, -1) !== board[selectedPiece![0]][selectedPiece![1]].slice(0, -1)) {
                console.log("Here")
                setShowMessage(true);
                return setTurnMessage(isWhiteTurn ? "It's white turn." : "It's black turn.");
            }
            if (selectedPiece && piece.slice(0, -1) === board[selectedPiece![0]][selectedPiece![1]].slice(0, -1)) {
                const tempBoard = [...board];
                deletePossibleMovimentsMarks(tempBoard);
            }
            if (piece !== 'pm') {
                setPieceIsSelected(true);
                setSelectedPiece([row, column]);
            }
        } else {
            // Unselect piece if moviment is invalid.
            unselectPiece()
        }
    };

    const checkPlayerTurn = (piece: string) => {
        if (!selectedPiece) {
            if (piece.slice(0, -1) === "b" && isWhiteTurn) {
                setShowMessage(true);
                setTurnMessage("It's white turn!");
                return true;
            } else if (piece.slice(0, -1) === "w" && !isWhiteTurn) {
                setShowMessage(true);
                setTurnMessage("It's black turn!");
                return true;
            }
        }
        return false;
    }

    const unselectPiece = () => {
        const tempBoard = [...board];
        deletePossibleMovimentsMarks(tempBoard);
        setPieceIsSelected(false);
        return setSelectedPiece(null)
    };

    const checkIfMovementIsValid = (row: number, column: number, piece: string) => {
        let squarePosition = board[row][column];
        const rowDifference = Math.abs(row - selectedPiece![0]), columnDifference = Math.abs(column - selectedPiece![1]);
        switch (piece) {
            case 'wp':
                if (checkIfIsSameColumn(column)) {
                    if (selectedPiece![0] === 6) {
                        if (row === (selectedPiece![0] - 2) && (!board[row][column] || board[row][column] === 'pm')) {
                            return checkRow(row);
                        }
                    }
                    if (row === (selectedPiece![0] - 1)) {
                        return !board[row][column] || board[row][column] === 'pm';
                    }
                }
                if (checkIfMovimentIsDiagonal(row, column) && selectedPiece![0] - 1 === row && board[row][column]) {
                    return checkSquare(piece, squarePosition);
                }
                break;
            case 'bp':
                if (checkIfIsSameColumn(column)) {
                    if (selectedPiece![0] === 1) {
                        if (row === (selectedPiece![0] + 2) && (!board[row][column] || board[row][column] === 'pm')) {
                            return checkRow(row);
                        }
                    }
                    if (row === (selectedPiece![0] + 1)) {
                        return (!board[row][column] || board[row][column] === 'pm');
                    }
                }
                if (checkIfMovimentIsDiagonal(row, column) && selectedPiece![0] + 1 === row && board[row][column]) {
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
                if (board[i][selectedPiece![1]] && board[i][selectedPiece![1]] !== 'pm') {
                    console.log("Found: " + board[i][selectedPiece![1]] + " at " + i);
                    return false;
                }
            }
        } else {
            for (let i = selectedPiece![0] - 1; i >= row + 1; i--) {
                if (board[i][selectedPiece![1]] && board[i][selectedPiece![1]] !== 'pm') {
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
            boardRow.map((_, columnIndex) => {
                if (index === row && columnIndex === column) {
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

    // Show possible player's position.
    useEffect(() => {
        const tempBoard = [...board];
        deletePossibleMovimentsMarks(tempBoard);
        let x = -1, y = -1;
        if (selectedPiece) {
            const piece = board[selectedPiece[0]][selectedPiece[1]];
            switch (piece) {
                case 'wp':
                    console.log(`Piece ${tempBoard[selectedPiece[0]][selectedPiece[1] - 1]} at position: [${selectedPiece[0]}, ${selectedPiece[1]}]`);
                    for (let x = 1; x <= 2; x++) {
                        if (selectedPiece[1] < 7 && tempBoard[selectedPiece[0] - x][selectedPiece[1] + 1].slice(0, 1) === 'b') {
                            tempBoard[selectedPiece[0] - x][selectedPiece[1] + 1] = tempBoard[selectedPiece[0] - x][selectedPiece[1] + 1].slice(0, 2) + "et";
                            setBoard(tempBoard);
                        }
                        if (selectedPiece[1] > 0 && tempBoard[selectedPiece[0] - x][selectedPiece[1] - 1].slice(0, 1) === 'b') {
                            tempBoard[selectedPiece[0] - x][selectedPiece[1] - 1] = tempBoard[selectedPiece[0] - x][selectedPiece[1] - 1].slice(0, 2) + "et";
                            setBoard(tempBoard);
                        }

                        if (!board[selectedPiece[0] - x][selectedPiece[1]]) {
                            tempBoard[selectedPiece[0] - x][selectedPiece[1]] = "pm";
                            setBoard(tempBoard);
                        } else {
                            return console.log(`Pìece found at [${selectedPiece[0] - x}, ${selectedPiece[1]}]`);
                        }
                    }
                    break;
                case 'wr':
                    console.log(`Piece ${tempBoard[selectedPiece[0]][selectedPiece[1] - 1]} at position: [${selectedPiece[0]}, ${selectedPiece[1]}]`);
                    if (selectedPiece[0] > 0) {
                        let x = selectedPiece[0] - 1, y = selectedPiece[1];
                        while (!board[x][y] && x > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x--;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] < 7) {
                        let x = selectedPiece[0] + 1, y = selectedPiece[1];
                        while (!board[x][y] && x < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x++;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[1] < 7) {
                        let x = selectedPiece[0], y = selectedPiece[1] + 1;
                        while (!board[x][y] && y < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            y++;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }

                    if (selectedPiece[1] > 0) {
                        let x = selectedPiece[0], y = selectedPiece[1] - 1;
                        while (!board[x][y] && y > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            y--;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    break;
                case 'wb':
                    console.log(`Piece ${tempBoard[selectedPiece[0]][selectedPiece[1]]} at position: [${selectedPiece[0]}, ${selectedPiece[1]}]`);
                    if (selectedPiece[0] > 0 && selectedPiece[1] < 7) {
                        let x = selectedPiece[0] - 1, y = selectedPiece[1] + 1;
                        while (!board[x][y] && x > 0 && y < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x--;
                            y++;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] > 0 && selectedPiece[1] > 0) {
                        let x = selectedPiece[0] - 1, y = selectedPiece[1] - 1;
                        while (!board[x][y] && x > 0 && y > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x--;
                            y--;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] < 7 && selectedPiece[1] > 0) {
                        let x = selectedPiece[0] + 1, y = selectedPiece[1] - 1;
                        while (!board[x][y] && x < 7 && y > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x++;
                            y--;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] < 7 && selectedPiece[1] < 7) {
                        let x = selectedPiece[0] + 1, y = selectedPiece[1] + 1;
                        while (!board[x][y] && x < 7 && y < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x++;
                            y++;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    break;
                case 'wq':
                    console.log(`Piece ${tempBoard[selectedPiece[0]][selectedPiece[1] - 1]} at position: [${selectedPiece[0]}, ${selectedPiece[1]}]`);
                    if (selectedPiece[0] > 0) {
                        let x = selectedPiece[0] - 1, y = selectedPiece[1];
                        while (!board[x][y] && x > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x--;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] < 7) {
                        let x = selectedPiece[0] + 1, y = selectedPiece[1];
                        while (!board[x][y] && x < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x++;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[1] < 7) {
                        let x = selectedPiece[0], y = selectedPiece[1] + 1;
                        while (!board[x][y] && y < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            y++;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }

                    if (selectedPiece[1] > 0) {
                        let x = selectedPiece[0], y = selectedPiece[1] - 1;
                        while (!board[x][y] && y > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            y--;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] > 0 && selectedPiece[1] < 7) {
                        let x = selectedPiece[0] - 1, y = selectedPiece[1] + 1;
                        while (!board[x][y] && x > 0 && y < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x--;
                            y++;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] > 0 && selectedPiece[1] > 0) {
                        let x = selectedPiece[0] - 1, y = selectedPiece[1] - 1;
                        while (!board[x][y] && x > 0 && y > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x--;
                            y--;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] < 7 && selectedPiece[1] > 0) {
                        let x = selectedPiece[0] + 1, y = selectedPiece[1] - 1;
                        while (!board[x][y] && x < 7 && y > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x++;
                            y--;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] < 7 && selectedPiece[1] < 7) {
                        let x = selectedPiece[0] + 1, y = selectedPiece[1] + 1;
                        while (!board[x][y] && x < 7 && y < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x++;
                            y++;
                        }
                        if (board[x][y].slice(0, -1) == 'b') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    break;
                case 'wn':
                    console.log(`Piece ${tempBoard[selectedPiece[0]][selectedPiece[1] - 1]} at position: [${selectedPiece[0]}, ${selectedPiece[1]}]`);
                    x = selectedPiece[0], y = selectedPiece[1];
                    if (x > 0 && y < 7) {
                        if (x > 1) {
                            if (!board[x - 2][y + 1]) {
                                tempBoard[x - 2][y + 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x - 2][y + 1].slice(0, -1) === 'b') {
                                tempBoard[x - 2][y + 1] = tempBoard[x - 2][y + 1].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }

                        if (y < 6) {
                            if (!board[x - 1][y + 2]) {
                                tempBoard[x - 1][y + 2] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x - 1][y + 2].slice(0, -1) === 'b') {
                                tempBoard[x - 1][y + 2] = tempBoard[x - 1][y + 2].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }

                    if (x < 7 && y > 0) {
                        if (x < 6) {
                            if (!board[x + 2][y - 1]) {
                                tempBoard[x + 2][y - 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x + 2][y - 1].slice(0, -1) === 'b') {
                                tempBoard[x + 2][y - 1] = tempBoard[x + 2][y - 1].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }

                        if (y > 1) {
                            if (!board[x + 1][y - 2]) {
                                tempBoard[x + 1][y - 2] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x + 1][y - 2].slice(0, -1) === 'b') {
                                tempBoard[x + 1][y - 2] = tempBoard[x + 1][y - 2].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }

                    if (x < 7 && y < 7) {
                        if (x < 6) {
                            if (!board[x + 2][y + 1]) {
                                tempBoard[x + 2][y + 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x + 2][y + 1].slice(0, +1) === 'b') {
                                tempBoard[x + 2][y + 1] = tempBoard[x + 2][y + 1].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }

                        if (y < 6) {
                            if (!board[x + 1][y + 2]) {
                                tempBoard[x + 1][y + 2] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x + 1][y + 2].slice(0, +1) === 'b') {
                                tempBoard[x + 1][y + 2] = tempBoard[x + 1][y + 2].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }

                    if (x > 0 && y < 7) {
                        if (x > 1) {
                            if (!board[x - 2][y - 1]) {
                                tempBoard[x - 2][y - 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x - 2][y - 1].slice(0, -1) === 'b') {
                                tempBoard[x - 2][y - 1] = tempBoard[x - 2][y - 1].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }

                        if (y > 1) {
                            if (!board[x - 1][y - 2]) {
                                tempBoard[x - 1][y - 2] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x - 1][y - 2].slice(0, -1) === 'b') {
                                tempBoard[x - 1][y - 2] = tempBoard[x - 1][y - 2].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }
                    break;
                case 'wk':
                    console.log(`Piece ${tempBoard[selectedPiece[0]][selectedPiece[1]]} at position: [${selectedPiece[0]}, ${selectedPiece[1]}]`);
                    x = selectedPiece[0], y = selectedPiece[1];
                    if (x > 0) {
                        if (!board[x - 1][y]) {
                            tempBoard[x - 1][y] = 'pm';
                            setBoard(tempBoard);
                        } else if (board[x - 1][y].slice(0, 1) === 'b') {
                            tempBoard[x - 1][y] = tempBoard[x - 1][y].slice(0, 3) + 'et';
                            setBoard(tempBoard);
                        }

                        if (y < 7) {
                            if (!board[x - 1][y + 1]) {
                                tempBoard[x - 1][y + 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x - 1][y + 1].slice(0, 1) === 'b') {
                                tempBoard[x - 1][y + 1] = tempBoard[x - 1][y + 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }

                            if (!board[x][y + 1]) {
                                tempBoard[x][y + 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x][y + 1].slice(0, 1) === 'b') {
                                tempBoard[x][y + 1] = tempBoard[x][y + 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }

                        if (y > 0) {
                            if (!board[x - 1][y - 1]) {
                                tempBoard[x - 1][y - 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x - 1][y - 1].slice(0, 1) === 'b') {
                                tempBoard[x - 1][y - 1] = tempBoard[x - 1][y - 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                            if (!board[x][y - 1]) {
                                tempBoard[x][y - 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x][y - 1].slice(0, 1) === 'b') {
                                tempBoard[x][y - 1] = tempBoard[x][y - 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }
                    if (x < 7) {
                        if (!board[x + 1][y]) {
                            tempBoard[x + 1][y] = 'pm';
                            setBoard(tempBoard);
                        } else if (board[x + 1][y].slice(0, 1) === 'b') {
                            tempBoard[x + 1][y] = tempBoard[x + 1][y].slice(0, 3) + 'et';
                            setBoard(tempBoard);
                        }
                        if (y > 0) {
                            if (!board[x + 1][y - 1]) {
                                tempBoard[x + 1][y - 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x + 1][y - 1].slice(0, 1) === 'b') {
                                tempBoard[x + 1][y - 1] = tempBoard[x + 1][y - 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                        if (y < 7) {
                            if (!board[x + 1][y + 1]) {
                                tempBoard[x + 1][y + 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x + 1][y + 1].slice(0, 1) === 'b') {
                                tempBoard[x + 1][y + 1] = tempBoard[x + 1][y + 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }
                    break;
                case 'bp':
                    console.log(`Piece ${tempBoard[selectedPiece[0]][selectedPiece[1] - 1]} at position: [${selectedPiece[0]}, ${selectedPiece[1]}]`);
                    for (let x = 1; x <= 2; x++) {
                        // if (selectedPiece[1] < 7 && tempBoard[selectedPiece[0] + x][selectedPiece[1] + 1].slice(0, 1) === 'w') {
                        //     tempBoard[selectedPiece[0] + x][selectedPiece[1] + 1] = tempBoard[selectedPiece[0] + x][selectedPiece[1] + 1].slice(0, 2) + "et";
                        //     setBoard(tempBoard);
                        // }
                        if (selectedPiece[1] > 0 && tempBoard[selectedPiece[0] + x][selectedPiece[1] - 1].slice(0, 1) === 'w') {
                            tempBoard[selectedPiece[0] + x][selectedPiece[1] - 1] = tempBoard[selectedPiece[0] + x][selectedPiece[1] - 1].slice(0, 2) + "et";
                            setBoard(tempBoard);
                        }

                        if (!board[selectedPiece[0] + x][selectedPiece[1]]) {
                            tempBoard[selectedPiece[0] + x][selectedPiece[1]] = "pm";
                            setBoard(tempBoard);
                        } else {
                            return console.log(`Pìece found at[${selectedPiece[0] + x}, ${selectedPiece[1]}]`);
                        }
                    }
                    break;
                case 'br':
                    console.log(`Piece ${tempBoard[selectedPiece[0]][selectedPiece[1] - 1]} at position: [${selectedPiece[0]}, ${selectedPiece[1]}]`);
                    if (selectedPiece[0] > 0) {
                        let x = selectedPiece[0] - 1, y = selectedPiece[1];
                        while (!board[x][y] && x > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x--;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] < 7) {
                        let x = selectedPiece[0] + 1, y = selectedPiece[1];
                        while (!board[x][y] && x < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x++;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[1] < 7) {
                        let x = selectedPiece[0], y = selectedPiece[1] + 1;
                        while (!board[x][y] && y < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            y++;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }

                    if (selectedPiece[1] > 0) {
                        let x = selectedPiece[0], y = selectedPiece[1] - 1;
                        while (!board[x][y] && y > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            y--;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    break;
                case 'bq':
                    console.log(`Piece ${tempBoard[selectedPiece[0]][selectedPiece[1] - 1]} at position: [${selectedPiece[0]}, ${selectedPiece[1]}]`);
                    if (selectedPiece[0] > 0) {
                        let x = selectedPiece[0] - 1, y = selectedPiece[1];
                        while (!board[x][y] && x > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x--;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] < 7) {
                        let x = selectedPiece[0] + 1, y = selectedPiece[1];
                        while (!board[x][y] && x < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x++;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[1] < 7) {
                        let x = selectedPiece[0], y = selectedPiece[1] + 1;
                        while (!board[x][y] && y < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            y++;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }

                    if (selectedPiece[1] > 0) {
                        let x = selectedPiece[0], y = selectedPiece[1] - 1;
                        while (!board[x][y] && y > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            y--;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] > 0 && selectedPiece[1] < 7) {
                        let x = selectedPiece[0] - 1, y = selectedPiece[1] + 1;
                        while (!board[x][y] && x > 0 && y < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x--;
                            y++;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] > 0 && selectedPiece[1] > 0) {
                        let x = selectedPiece[0] - 1, y = selectedPiece[1] - 1;
                        while (!board[x][y] && x > 0 && y > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x--;
                            y--;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] < 7 && selectedPiece[1] > 0) {
                        let x = selectedPiece[0] + 1, y = selectedPiece[1] - 1;
                        while (!board[x][y] && x < 7 && y > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x++;
                            y--;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] < 7 && selectedPiece[1] < 7) {
                        let x = selectedPiece[0] + 1, y = selectedPiece[1] + 1;
                        while (!board[x][y] && x < 7 && y < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x++;
                            y++;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    break;
                case 'bb':
                    console.log(`Piece ${tempBoard[selectedPiece[0]][selectedPiece[1]]} at position: [${selectedPiece[0]}, ${selectedPiece[1]}]`);
                    if (selectedPiece[0] > 0 && selectedPiece[1] < 7) {
                        let x = selectedPiece[0] - 1, y = selectedPiece[1] + 1;
                        while (!board[x][y] && x > 0 && y < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x--;
                            y++;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] > 0 && selectedPiece[1] > 0) {
                        let x = selectedPiece[0] - 1, y = selectedPiece[1] - 1;
                        while (!board[x][y] && x > 0 && y > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x--;
                            y--;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] < 7 && selectedPiece[1] > 0) {
                        let x = selectedPiece[0] + 1, y = selectedPiece[1] - 1;
                        while (!board[x][y] && x < 7 && y > 0) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x++;
                            y--;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    if (selectedPiece[0] < 7 && selectedPiece[1] < 7) {
                        let x = selectedPiece[0] + 1, y = selectedPiece[1] + 1;
                        while (!board[x][y] && x < 7 && y < 7) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                            x++;
                            y++;
                        }
                        if (board[x][y].slice(0, -1) == 'w') {
                            tempBoard[x][y] = tempBoard[x][y].slice(0, 2) + 'et';
                            setBoard(tempBoard);
                        } else if (!board[x][y]) {
                            tempBoard[x][y] = 'pm';
                            setBoard(tempBoard);
                        }
                    }
                    break;
                case 'bn':
                    console.log(`Piece ${tempBoard[selectedPiece[0]][selectedPiece[1] - 1]} at position: [${selectedPiece[0]}, ${selectedPiece[1]}]`);
                    x = selectedPiece[0], y = selectedPiece[1];
                    if (x > 0 && y < 7) {
                        if (x > 1) {
                            if (!board[x - 2][y + 1]) {
                                tempBoard[x - 2][y + 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x - 2][y + 1].slice(0, -1) === 'w') {
                                tempBoard[x - 2][y + 1] = tempBoard[x - 2][y + 1].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }

                        if (y < 6) {
                            if (!board[x - 1][y + 2]) {
                                tempBoard[x - 1][y + 2] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x - 1][y + 2].slice(0, -1) === 'w') {
                                tempBoard[x - 1][y + 2] = tempBoard[x - 1][y + 2].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }

                    if (x < 7 && y > 0) {
                        if (x < 6) {
                            if (!board[x + 2][y - 1]) {
                                tempBoard[x + 2][y - 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x + 2][y - 1].slice(0, -1) === 'w') {
                                tempBoard[x + 2][y - 1] = tempBoard[x + 2][y - 1].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }

                        if (y > 1) {
                            if (!board[x + 1][y - 2]) {
                                tempBoard[x + 1][y - 2] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x + 1][y - 2].slice(0, -1) === 'w') {
                                tempBoard[x + 1][y - 2] = tempBoard[x + 1][y - 2].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }

                    if (x < 7 && y < 7) {
                        if (x < 6) {
                            if (!board[x + 2][y + 1]) {
                                tempBoard[x + 2][y + 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x + 2][y + 1].slice(0, +1) === 'w') {
                                tempBoard[x + 2][y + 1] = tempBoard[x + 2][y + 1].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }

                        if (y < 6) {
                            if (!board[x + 1][y + 2]) {
                                tempBoard[x + 1][y + 2] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x + 1][y + 2].slice(0, +1) === 'w') {
                                tempBoard[x + 1][y + 2] = tempBoard[x + 1][y + 2].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }

                    if (x > 0 && y < 7) {
                        if (x > 1) {
                            if (!board[x - 2][y - 1]) {
                                tempBoard[x - 2][y - 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x - 2][y - 1].slice(0, -1) === 'w') {
                                tempBoard[x - 2][y - 1] = tempBoard[x - 2][y - 1].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }

                        if (y > 1) {
                            if (!board[x - 1][y - 2]) {
                                tempBoard[x - 1][y - 2] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x - 1][y - 2].slice(0, -1) === 'w') {
                                tempBoard[x - 1][y - 2] = tempBoard[x - 1][y - 2].slice(0, 2) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }
                    break;
                case 'bk':
                    console.log(`Piece ${tempBoard[selectedPiece[0]][selectedPiece[1]]} at position: [${selectedPiece[0]}, ${selectedPiece[1]}]`);
                    x = selectedPiece[0], y = selectedPiece[1];
                    if (x > 0) {
                        if (!board[x - 1][y]) {
                            tempBoard[x - 1][y] = 'pm';
                            setBoard(tempBoard);
                        } else if (board[x - 1][y].slice(0, 1) === 'w') {
                            tempBoard[x - 1][y] = tempBoard[x - 1][y].slice(0, 3) + 'et';
                            setBoard(tempBoard);
                        }

                        if (y < 7) {
                            if (!board[x - 1][y + 1]) {
                                tempBoard[x - 1][y + 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x - 1][y + 1].slice(0, 1) === 'w') {
                                tempBoard[x - 1][y + 1] = tempBoard[x - 1][y + 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }

                            if (!board[x][y + 1]) {
                                tempBoard[x][y + 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x][y + 1].slice(0, 1) === 'w') {
                                tempBoard[x][y + 1] = tempBoard[x][y + 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }

                        if (y > 0) {
                            if (!board[x - 1][y - 1]) {
                                tempBoard[x - 1][y - 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x - 1][y - 1].slice(0, 1) === 'w') {
                                tempBoard[x - 1][y - 1] = tempBoard[x - 1][y - 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                            if (!board[x][y - 1]) {
                                tempBoard[x][y - 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x][y - 1].slice(0, 1) === 'w') {
                                tempBoard[x][y - 1] = tempBoard[x][y - 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }
                    if (x < 7) {
                        if (!board[x + 1][y]) {
                            tempBoard[x + 1][y] = 'pm';
                            setBoard(tempBoard);
                        } else if (board[x + 1][y].slice(0, 1) === 'w') {
                            tempBoard[x + 1][y] = tempBoard[x + 1][y].slice(0, 3) + 'et';
                            setBoard(tempBoard);
                        }
                        if (y > 0) {
                            if (!board[x + 1][y - 1]) {
                                tempBoard[x + 1][y - 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x + 1][y - 1].slice(0, 1) === 'w') {
                                tempBoard[x + 1][y - 1] = tempBoard[x + 1][y - 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                        if (y < 7) {
                            if (!board[x + 1][y + 1]) {
                                tempBoard[x + 1][y + 1] = 'pm';
                                setBoard(tempBoard);
                            } else if (board[x + 1][y + 1].slice(0, 1) === 'w') {
                                tempBoard[x + 1][y + 1] = tempBoard[x + 1][y + 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }
                    break;
            }
        }
    }, [selectedPiece])

    const deletePossibleMovimentsMarks = (tempBoard: string[][]) => {
        tempBoard.map((rowBoard, rowIndex) => {
            rowBoard.map((position, columnIndex) => {
                if (position === 'pm') {
                    tempBoard[rowIndex][columnIndex] = ""
                }
                if (position.includes('et')) {
                    tempBoard[rowIndex][columnIndex] = tempBoard[rowIndex][columnIndex].slice(0, 2);
                }
            })
        })
    }

    useEffect(() => {
        const tempBoard = board;
        deletePossibleMovimentsMarks(tempBoard);
        setBoard(tempBoard);
    }, [board]);

    return (
        <>
            <section className={styles.game}>
                <div className={styles.board}>
                    {board.map((row, rowIndex) => (
                        row.map((piece, columnIndex) => (
                            <div
                                className={`
                                ${rowIndex % 2 == 0 ? (columnIndex % 2 == 0 ? styles.green : styles.yellow) : (columnIndex % 2 == 0 ? styles.yellow : styles.green)}
                                ${(selectedPiece && rowIndex == selectedPiece[0] && columnIndex == selectedPiece[1]) && styles.active}
                                ${piece === 'pm' && styles.possibleMoviment}
            `}
                                key={rowIndex + columnIndex}
                                onClick={() => clickField(rowIndex, columnIndex, piece)}
                            >
                                {piece && piece !== "pm" && <img src={`${piece.slice(0, 2)}.svg`} alt="" draggable={false} className={`${piece.includes('et') && styles.eatable} `} />}
                            </div>
                        ))
                    ))}
                </div>
            </section>
            <Message message={turnMessage} showMessage={showMessage} setShowMessage={setShowMessage} />
        </>
    )
};

export default Board;