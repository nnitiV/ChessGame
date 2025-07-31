import { useEffect, useState } from "react";
import styles from "./index.module.css"
import Message from "./message";
import Promote from "./Promote";

const Board = () => {
    // const intialBoardState = [
    //     ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    //     ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    //     ["", "", "", "", "", "", "", ""],
    //     ["", "", "", "", "", "", "", ""],
    //     ["", "", "", "", "", "", "", ""],
    //     ["", "", "", "", "", "", "", ""],
    //     ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    //     ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
    // ];
    const intialBoardState = [
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "wq", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "bk", "", "", ""],
        ["", "", "", "", "", "", "", ""]
    ];
    const [board, setBoard] = useState<string[][]>(intialBoardState);
    const [totalMoves, setTotalMoves] = useState<number>(0);
    const [selectedPiece, setSelectedPiece] = useState<number[] | null>(null);
    const [gameIsFinished, setGameIsFinished] = useState<boolean>(false);
    const [_, setPieceIsSelected] = useState<boolean>(false);
    const [isWhiteTurn, setIsWhiteTurn] = useState<boolean>(false);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [openPromotionSelection, setOpenPromotionSelection] = useState<boolean>(false);
    const [pieceToSubstituteWith, setPieceToSubstituteWith] = useState<string>("");
    const [lastMove, setLastMove] = useState<number[]>([]);
    const [renderScreen, setRenderScreen] = useState<string>("");
    const [checkCastleWhite, setCheckCastleWhite] = useState<boolean[]>([false, false, false]);
    const [checkCastleBlack, setCheckCastleBlack] = useState<boolean[]>([false, false, false]);
    const [checked, setChecked] = useState<[string, number]>(["", 0]);

    const clickField = (row: number, column: number, piece: string) => {
        if (checkPlayerTurn(piece)) return;

        // Unselect piece if click on already selected one.
        if (selectedPiece && row === selectedPiece[0] && column === selectedPiece[1]) {
            return unselectPiece()
        }

        if (selectedPiece && checkIfMovementIsValid(row, column, board[selectedPiece![0]][selectedPiece![1]])) {
            movePiece(row, column);
            unselectPiece();
        } else if (piece) {
            // Don't do anything in case the player select a piece of a different color
            if (piece !== 'pm' && selectedPiece && piece.slice(0, 1) !== board[selectedPiece![0]][selectedPiece![1]].slice(0, 1)) {
                return;
            }
            if (selectedPiece && piece.slice(0, 1) === board[selectedPiece![0]][selectedPiece![1]].slice(0, 1)) {
                const tempBoard = [...board];
                deleteAnyMovimentMark(tempBoard);
            }
            // Select the piece 
            if (piece !== 'pm') {
                setPieceIsSelected(true);
                setSelectedPiece([row, column]);
            }
        }
    };

    const checkPlayerTurn = (piece: string) => {
        if (!selectedPiece) {
            if (piece.slice(0, -1) === "b" && isWhiteTurn) {
                setShowMessage(true);
                setMessage("It's white turn!");
                return true;
            } else if (piece.slice(0, -1) === "w" && !isWhiteTurn) {
                setShowMessage(true);
                setMessage("It's black turn!");
                return true;
            }
        }
        return false;
    }

    const unselectPiece = () => {
        const tempBoard = board;
        deleteAnyMovimentMark(tempBoard);
        setPieceIsSelected(false);
        return setSelectedPiece(null)
    };

    const checkIfMovementIsValid = (row: number, column: number, piece: string) => {
        let squarePosition = board[row][column];
        const rowDifference = Math.abs(row - selectedPiece![0]), columnDifference = Math.abs(column - selectedPiece![1]);
        const tempBoard = board;
        switch (piece.slice(0, 2)) {
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
                // Castle checking
                if (checkCastleWhite[0] === false && !board[selectedPiece![0]][selectedPiece![1] + 1] && !board[selectedPiece![0]][selectedPiece![1] + 2]) {
                    if (row === 7 && column === 6 && checkCastleWhite[2] === false) {
                        tempBoard[row][column - 1] = 'wr';
                        tempBoard[row][column + 1] = '';
                        new Audio("./castle.mp3").play();
                        const castleWhite = checkCastleWhite;
                        castleWhite[0] = true;
                        castleWhite[2] = true;
                        console.log("It was a white castle!")
                        setCheckCastleWhite(castleWhite);
                        return true;
                    }
                }

                if (checkCastleWhite[0] === false && !board[selectedPiece![0]][selectedPiece![1] - 1] && !board[selectedPiece![0]][selectedPiece![1] - 2] && !board[selectedPiece![0]][selectedPiece![1] - 3]) {
                    if (row === 7 && column === 2 && checkCastleWhite[1] === false) {
                        tempBoard[row][column + 1] = 'wr';
                        tempBoard[row][column - 2] = '';
                        new Audio("./castle.mp3").play();
                        const castleWhite = checkCastleWhite;
                        console.log("It was a white castle!")
                        castleWhite[0] = true;
                        castleWhite[1] = true;
                        setCheckCastleWhite(castleWhite);
                        return true;
                    }
                }

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
                if (checkCastleBlack[0] === false && !board[selectedPiece![0]][selectedPiece![1] + 1] && !board[selectedPiece![0]][selectedPiece![1] + 2]) {
                    if (row === 0 && column === 6 && checkCastleBlack[2] === false) {
                        tempBoard[row][column - 1] = 'br';
                        tempBoard[row][column + 1] = '';
                        new Audio("./castle.mp3").play();
                        const castleBlack = checkCastleBlack;
                        castleBlack[0] = true;
                        castleBlack[2] = true;
                        console.log("It was a black castle!")
                        setCheckCastleBlack(castleBlack);
                        return true;
                    }
                }
                if (checkCastleBlack[0] === false && !board[selectedPiece![0]][selectedPiece![1] - 1] && !board[selectedPiece![0]][selectedPiece![1] - 2] && !board[selectedPiece![0]][selectedPiece![1] - 2]) {
                    if (row === 0 && column === 2 && checkCastleBlack[1] === false) {
                        tempBoard[row][column + 1] = 'br';
                        tempBoard[row][column - 2] = '';
                        new Audio("./castle.mp3").play();
                        const castleBlack = checkCastleBlack;
                        castleBlack[0] = true;
                        castleBlack[1] = true;
                        console.log("It was a black castle!")
                        setCheckCastleBlack(castleBlack);
                        return true;
                    }
                }
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
        const didItCapturePiece = squarePosition && squarePosition.slice(0, -1) !== piece.slice(0, -1);
        if (didItCapturePiece) {
            new Audio('./capture.mp3').play();
        }
        return didItCapturePiece || !squarePosition;
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
        const pieceMoving = board[selectedPiece![0]][selectedPiece![1]];
        if (selectedPiece![0] === 7 && selectedPiece![1] === 4 && pieceMoving === 'wk') {
            let whiteCastleCheck = checkCastleWhite;
            whiteCastleCheck[0] = true;
            setCheckCastleWhite(whiteCastleCheck);
        }
        if (selectedPiece![0] === 0 && selectedPiece![1] === 4 && pieceMoving === 'bk') {
            let blackCastleCheck = checkCastleBlack;
            blackCastleCheck[0] = true;
            setCheckCastleBlack(blackCastleCheck);
        }
        const tempBoard = board;
        tempBoard[row][column] = pieceMoving;
        tempBoard[selectedPiece![0]][selectedPiece![1]] = '';
        if ((row === 0 || row === 7) && pieceMoving.slice(1, 2) === 'p') {
            setOpenPromotionSelection(true);
        }
        let hasCheck: boolean = false;
        tempBoard.map((row, rIdx) => row.map((position, cIdx) => {
            if (checkCheck(position.slice(0, 2), rIdx, cIdx)) {
                hasCheck = true;
                return;
            }
        }));
        if (!hasCheck && pieceMoving.slice(1, 2) === 'k') {
            tempBoard[row][column] = pieceMoving.slice(0, 2);
        }
        setBoard(tempBoard)
        setRenderScreen(prev => prev.slice(0, 1) + 'a');
        setTotalMoves(totalMove => totalMove + 1);
        new Audio('./move-self.mp3').play();
        setLastMove([row, column]);
        checkCheck(pieceMoving, row, column);
        setIsWhiteTurn(prev => !prev);
        if (checked) {
            if (checked[0] === 'bk' && checked[1] + 1 === 2) {
                alert("You lost!");
                setBoard(intialBoardState);
            }
        }
    };

    const checkCheck = (pieceMoving: string, row: number, column: number) => {
        let tempBoard = board;
        switch (pieceMoving) {
            case 'wp':
                if (board[row - 1][column + 1] === 'bk') {
                    tempBoard[row - 1][column + 1] = tempBoard[row - 1][column + 1] + 'dg';
                    setBoard(tempBoard);
                    return new Audio("move-check.mp3").play();
                }
                if (board[row - 1][column - 1] === 'bk') {
                    tempBoard[row - 1][column - 1] = tempBoard[row - 1][column - 1] + 'dg';
                    setBoard(tempBoard);
                    return new Audio("move-check.mp3").play();
                }
                break;
            case 'bp':
                if (board[row + 1][column + 1] === 'wk') {
                    tempBoard[row + 1][column + 1] = tempBoard[row + 1][column + 1] + 'dg';
                    setBoard(tempBoard);
                    return new Audio("move-check.mp3").play();
                }
                if (board[row + 1][column - 1] === 'wk') {
                    tempBoard[row + 1][column - 1] = tempBoard[row + 1][column - 1] + 'dg';
                    setBoard(tempBoard);
                    return new Audio("move-check.mp3").play();
                }
                break;
            case 'wr':
                if (row < 7) {
                    for (let x = row + 1; x <= 7; x++) {
                        const field = board[x][column];
                        if (field) {
                            if (field === 'bk') {
                                tempBoard[x][column] = tempBoard[x][column] + 'dg';
                                setBoard(tempBoard);
                                return new Audio("move-check.mp3").play();
                            } else {
                                return;
                            }
                        }
                    }
                }
                if (row > 0) {
                    for (let x = row - 1; x >= 0; x--) {
                        const field = board[x][column];
                        if (field) {
                            if (field === 'bk') {
                                tempBoard[x][column] = tempBoard[x][column] + 'dg';
                                setBoard(tempBoard);
                                return new Audio("move-check.mp3").play();
                            } else {
                                return;
                            }
                        }
                    }
                }
                if (column > 0) {
                    for (let y = column - 1; y >= 0; y--) {
                        const field = board[row][y];
                        if (field) {
                            if (field === 'bk') {
                                tempBoard[row][y] = tempBoard[row][y] + 'dg';
                                setBoard(tempBoard);
                                return new Audio("move-check.mp3").play();
                            } else {
                                return;
                            }
                        }
                    }
                }
                if (column < 7) {
                    for (let y = column + 1; y <= 7; y++) {
                        const field = board[row][y];
                        if (field) {
                            if (field === 'bk') {
                                tempBoard[row][y] = tempBoard[row][y] + 'dg';
                                setBoard(tempBoard);
                                return new Audio("move-check.mp3").play();
                            } else {
                                return;
                            }
                        }
                    }
                }
                break;
            case 'br':
                if (row < 7) {
                    for (let x = row + 1; x <= 7; x++) {
                        const field = board[x][column];
                        if (field) {
                            if (field === 'wk') {
                                tempBoard[x][column] = tempBoard[x][column] + 'dg';
                                setBoard(tempBoard);
                                return new Audio("move-check.mp3").play();
                            } else {
                                return;
                            }
                        }
                    }
                }
                if (row > 0) {
                    for (let x = row - 1; x >= 0; x--) {
                        const field = board[x][column];
                        if (field) {
                            if (field === 'wk') {
                                tempBoard[x][column] = tempBoard[x][column] + 'dg';
                                setBoard(tempBoard);
                                return new Audio("move-check.mp3").play();
                            } else {
                                return;
                            }
                        }
                    }
                }
                if (column > 0) {
                    for (let y = column - 1; y >= 0; y--) {
                        const field = board[row][y];
                        if (field) {
                            if (field === 'wk') {

                                tempBoard[row][y] = tempBoard[row][y] + 'dg';
                                setBoard(tempBoard);
                                return new Audio("move-check.mp3").play();
                            } else {
                                return;
                            }
                        }
                    }
                }
                if (column < 7) {
                    for (let y = column + 1; y <= 7; y++) {
                        const field = board[row][y];
                        if (field) {
                            if (field === 'wk') {

                                tempBoard[row][y] = tempBoard[row][y] + 'dg';
                                setBoard(tempBoard);
                                return new Audio("move-check.mp3").play();
                            } else {
                                return;
                            }
                        }
                    }
                }
                break;
            case 'wb':
                if (row < 7) {
                    if (column < 7) {
                        for (let x = row + 1, y = column + 1; x <= 7 && y <= 7; x++, y++) {
                            const field = board[x][y];
                            if (field) {
                                if (field === 'bk') {
                                    tempBoard[x][y] = tempBoard[x][y] + 'dg';
                                    setBoard(tempBoard);
                                    return new Audio("move-check.mp3").play();
                                } else {
                                    return;
                                }
                            }
                        }
                    }
                    if (column > 0) {
                        for (let x = row + 1, y = column - 1; x <= 7 && y >= 0; x++, y--) {
                            const field = board[x][y];
                            if (field) {
                                if (field === 'bk') {
                                    tempBoard[x][y] = tempBoard[x][y] + 'dg';
                                    setBoard(tempBoard);
                                    return new Audio("move-check.mp3").play();
                                } else {
                                    return;
                                }
                            }
                        }
                    }
                }
                if (row > 0) {
                    if (column < 7) {
                        for (let x = row - 1, y = column + 1; x >= 0 && y <= 7; x--, y++) {
                            const field = board[x][y];
                            if (field) {
                                if (field === 'bk') {
                                    tempBoard[x][y] = tempBoard[x][y] + 'dg';
                                    setBoard(tempBoard);
                                    return new Audio("move-check.mp3").play();
                                } else {
                                    return;
                                }
                            }
                        }
                    }
                    if (column > 0) {
                        for (let x = row - 1, y = column - 1; x >= 0 && y >= 0; x--, y--) {
                            const field = board[x][y];
                            if (field) {
                                if (field === 'bk') {
                                    tempBoard[x][y] = tempBoard[x][y] + 'dg';
                                    setBoard(tempBoard);
                                    return new Audio("move-check.mp3").play();
                                } else {
                                    return;
                                }
                            }
                        }
                    }
                }
                break;
            case 'bb':
                if (row < 7) {
                    if (column < 7) {
                        for (let x = row + 1, y = column + 1; x <= 7 && y <= 7; x++, y++) {
                            const field = board[x][y];
                            if (field) {
                                if (field === 'wk') {
                                    tempBoard[x][y] = tempBoard[x][y] + 'dg';
                                    setBoard(tempBoard);
                                    return new Audio("move-check.mp3").play();
                                } else {
                                    return;
                                }
                            }
                        }
                    }
                    if (column > 0) {
                        for (let x = row + 1, y = column - 1; x <= 7 && y >= 0; x++, y--) {
                            const field = board[x][y];
                            if (field) {
                                if (field === 'wk') {
                                    tempBoard[x][y] = tempBoard[x][y] + 'dg';
                                    setBoard(tempBoard);
                                    return new Audio("move-check.mp3").play();
                                } else {
                                    return;
                                }
                            }
                        }
                    }
                }
                if (row > 0) {
                    if (column < 7) {
                        for (let x = row - 1, y = column + 1; x >= 0 && y <= 7; x--, y++) {
                            const field = board[x][y];
                            if (field) {
                                if (field === 'wk') {
                                    tempBoard[x][y] = tempBoard[x][y] + 'dg';
                                    setBoard(tempBoard);
                                    return new Audio("move-check.mp3").play();
                                } else {
                                    return;
                                }
                            }
                        }
                    }
                    if (column > 0) {
                        for (let x = row - 1, y = column - 1; x >= 0 && y >= 0; x--, y--) {
                            const field = board[x][y];
                            if (field) {
                                if (field === 'wk') {
                                    tempBoard[x][y] = tempBoard[x][y] + 'dg';
                                    setBoard(tempBoard);
                                    return new Audio("move-check.mp3").play();
                                } else {
                                    return;
                                }
                            }
                        }
                    }
                }
                break;
            case 'wn':
                if (row > 0 && column < 7) {
                    if (row > 1) {
                        if (board[row - 2][column + 1] === 'bk') {
                            tempBoard[row - 2][column + 1] = tempBoard[row - 2][column + 1] + 'dg';
                            setBoard(tempBoard);
                            return new Audio("move-check.mp3").play();
                        }
                    }

                    if (column < 6) {
                        console.log(board[row - 1][column + 2]);
                        if (board[row - 1][column + 2] === 'bk') {
                            tempBoard[row - 1][column + 2] = tempBoard[row - 1][column + 2] + 'dg';
                            setBoard(tempBoard);
                            return new Audio("move-check.mp3").play();
                        }
                    }
                }

                if (row < 7 && column > 0) {
                    if (row < 6) {
                        if (board[row + 2][column - 1] === 'bk') {
                            tempBoard[row + 2][column - 1] = tempBoard[row + 2][column - 1] + 'dg';
                            setBoard(tempBoard);
                            return new Audio("move-check.mp3").play();
                        }
                    }

                    if (column > 1) {
                        if (board[row + 1][column - 2] === 'bk') {
                            tempBoard[row + 1][column - 2] = tempBoard[row + 1][column - 2] + 'dg';
                            setBoard(tempBoard);
                            return new Audio("move-check.mp3").play();
                        }
                    }
                }

                if (row < 7 && column < 7) {
                    if (row < 6) {
                        if (board[row + 2][column + 1] === 'bk') {
                            tempBoard[row + 2][column + 1] = tempBoard[row + 2][column + 1] + 'dg';
                            setBoard(tempBoard);
                            return new Audio("move-check.mp3").play();
                        }
                    }

                    if (column < 6) {
                        if (board[row + 1][column + 2] === 'bk') {
                            tempBoard[row + 1][column + 2] = tempBoard[row + 1][column + 2] + 'dg';
                            setBoard(tempBoard);
                            return new Audio("move-check.mp3").play();
                        }
                    }
                }

                if (row > 0 && column < 7) {
                    if (row > 1) {
                        if (board[row - 2][column - 1] === 'bk') {
                            tempBoard[row - 2][column - 1] = tempBoard[row - 2][column - 1] + 'dg';
                            setBoard(tempBoard);
                            return new Audio("move-check.mp3").play();
                        }
                    }

                    if (column > 1) {
                        if (board[row - 1][column - 2] === 'bk') {
                            tempBoard[row - 1][column - 2] = tempBoard[row - 1][column - 2] + 'dg';
                            setBoard(tempBoard);
                            return new Audio("move-check.mp3").play();
                        }
                    }
                }
                break;
            case 'bn':
                if (row > 0 && column < 7) {
                    if (row > 1) {
                        if (board[row - 2][column + 1] === 'wk') {
                            return new Audio("move-check.mp3").play();
                        }
                    }

                    if (column < 6) {
                        console.log(board[row - 1][column + 2]);
                        if (board[row - 1][column + 2] === 'wk') {
                            return new Audio("move-check.mp3").play();
                        }
                    }
                }

                if (row < 7 && column > 0) {
                    if (row < 6) {
                        if (board[row + 2][column - 1] === 'wk') {
                            return new Audio("move-check.mp3").play();
                        }
                    }

                    if (column > 1) {
                        if (board[row + 1][column - 2] === 'wk') {
                            return new Audio("move-check.mp3").play();
                        }
                    }
                }

                if (row < 7 && column < 7) {
                    if (row < 6) {
                        if (board[row + 2][column + 1] === 'wk') {
                            return new Audio("move-check.mp3").play();
                        }
                    }

                    if (column < 6) {
                        if (board[row + 1][column + 2] === 'wk') {
                            return new Audio("move-check.mp3").play();
                        }
                    }
                }

                if (row > 0 && column < 7) {
                    if (row > 1) {
                        if (board[row - 2][column - 1] === 'wk') {
                            return new Audio("move-check.mp3").play();
                        }
                    }

                    if (column > 1) {
                        if (board[row - 1][column - 2] === 'wk') {
                            return new Audio("move-check.mp3").play();
                        }
                    }
                }
                break;
            case 'wq':
                if (row < 7) {
                    for (let x = row + 1; x <= 7; x++) {
                        const field = board[x][column].slice(0, 2);
                        if (field) {
                            if (field === 'bk') {
                                tempBoard[x][column] = field + 'dg';
                                setBoard(tempBoard);
                                new Audio("move-check.mp3").play();
                                return true;
                            }
                        }
                    }
                    if (column < 7) {
                        for (let x = row + 1, y = column + 1; x <= 7 && y <= 7; x++, y++) {
                            const field = board[x][y].slice(0, 2);
                            if (field) {
                                if (field === 'bk') {
                                    tempBoard[x][y] = field + 'dg';
                                    setBoard(tempBoard);
                                    new Audio("move-check.mp3").play();
                                    return true;
                                }
                            }
                        }
                    }
                    if (column > 0) {
                        for (let x = row + 1, y = column - 1; x <= 7 && y >= 0; x++, y--) {
                            const field = board[x][y].slice(0, 2);
                            if (field) {
                                if (field === 'bk') {
                                    tempBoard[x][y] = field + 'dg';
                                    setBoard(tempBoard);
                                    new Audio("move-check.mp3").play();
                                    return true;
                                }
                            }
                        }
                    }
                }
                if (row > 0) {
                    for (let x = row - 1; x >= 0; x--) {
                        const field = board[x][column].slice(0, 2);
                        if (field) {
                            if (field === 'bk') {
                                tempBoard[x][column] = field + 'dg';
                                setBoard(tempBoard);
                                new Audio("move-check.mp3").play();
                                return true;
                            }
                        }
                    }
                    if (column < 7) {
                        for (let x = row - 1, y = column + 1; x >= 0 && y <= 7; x--, y++) {
                            const field = board[x][y].slice(0, 2);
                            if (field) {
                                if (field === 'bk') {
                                    tempBoard[x][y] = field + 'dg';
                                    setBoard(tempBoard);
                                    new Audio("move-check.mp3").play();
                                    return true;
                                }
                            }
                        }
                    }
                    if (column > 0) {
                        for (let x = row - 1, y = column - 1; x >= 0 && y >= 0; x--, y--) {
                            const field = board[x][y].slice(0, 2);
                            if (field) {
                                if (field === 'bk') {
                                    tempBoard[x][y] = field + 'dg';
                                    setBoard(tempBoard);
                                    new Audio("move-check.mp3").play();
                                    return true;
                                }
                            }
                        }
                    }
                }
                if (column > 0) {
                    for (let y = column - 1; y >= 0; y--) {
                        const field = board[row][y].slice(0, 2);
                        if (field) {
                            if (field === 'bk') {
                                tempBoard[row][y] = field + 'dg';
                                setBoard(tempBoard);
                                new Audio("move-check.mp3").play();
                                return true;
                            }
                        }
                    }
                }
                if (column < 7) {
                    for (let y = column + 1; y <= 7; y++) {
                        const field = board[row][y].slice(0, 2);
                        if (field) {
                            if (field === 'bk') {
                                tempBoard[row][y] = field + 'dg';
                                setBoard(tempBoard);
                                new Audio("move-check.mp3").play();
                                return true;
                            }
                        }
                    }
                }
                break;
            case 'bq':
                if (row < 7) {
                    for (let x = row + 1; x <= 7; x++) {
                        const field = tempBoard[x][column].slice(0, 2);
                        if (field) {
                            if (field === 'wk') {
                                tempBoard[x][column] = tempBoard[x][column] + 'dg';
                                setBoard(tempBoard);
                                return new Audio("move-check.mp3").play();
                            }
                        }
                    }
                    if (column < 7) {
                        for (let x = row + 1, y = column + 1; x <= 7 && y <= 7; x++, y++) {
                            const field = board[x][y].slice(0, 2);
                            if (field) {
                                if (field === 'wk') {
                                    tempBoard[x][y] = tempBoard[x][y] + 'dg';
                                    setBoard(tempBoard);
                                    return new Audio("move-check.mp3").play();
                                }
                            }
                        }
                    }
                    if (column > 0) {
                        for (let x = row + 1, y = column - 1; x <= 7 && y >= 0; x++, y--) {
                            const field = board[x][y].slice(0, 2);
                            if (field) {
                                if (field === 'wk') {
                                    tempBoard[x][y] = tempBoard[x][y] + 'dg';
                                    setBoard(tempBoard);
                                    return new Audio("move-check.mp3").play();
                                }
                            }
                        }
                    }
                }
                if (row > 0) {
                    for (let x = row - 1; x >= 0; x--) {
                        const field = board[x][column].slice(0, 2);
                        if (field) {
                            if (field === 'wk') {
                                tempBoard[x][column] = tempBoard[x][column] + 'dg';
                                setBoard(tempBoard);
                                return new Audio("move-check.mp3").play();
                            }
                        }
                    }
                    if (column < 7) {
                        for (let x = row - 1, y = column + 1; x >= 0 && y <= 7; x--, y++) {
                            const field = board[x][y].slice(0, 2);
                            if (field) {
                                if (field === 'wk') {
                                    tempBoard[x][y] = tempBoard[x][y] + 'dg';
                                    setBoard(tempBoard);
                                    return new Audio("move-check.mp3").play();
                                }
                            }
                        }
                    }
                    if (column > 0) {
                        for (let x = row - 1, y = column - 1; x >= 0 && y >= 0; x--, y--) {
                            const field = board[x][y].slice(0, 2);
                            if (field) {
                                if (field === 'wk') {
                                    tempBoard[x][y] = tempBoard[x][y] + 'dg';
                                    setBoard(tempBoard);
                                    return new Audio("move-check.mp3").play();
                                }
                            }
                        }
                    }
                }
                if (column > 0) {
                    for (let y = column - 1; y >= 0; y--) {
                        const field = board[row][y].slice(0, 2);
                        if (field) {
                            if (field === 'wk') {
                                tempBoard[row][y] = tempBoard[row][y] + 'dg';
                                setBoard(tempBoard);
                                return new Audio("move-check.mp3").play();
                            }
                        }
                    }
                }
                if (column < 7) {
                    for (let y = column + 1; y <= 7; y++) {
                        const field = board[row][y].slice(0, 2);
                        if (field) {
                            if (field === 'wk') {
                                tempBoard[row][y] = tempBoard[row][y] + 'dg';
                                setBoard(tempBoard);
                                return new Audio("move-check.mp3").play();
                            }
                        }
                    }
                }
                break;
        }
    }

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

    // Show possible moviments.
    useEffect(() => {
        const tempBoard = [...board];
        deleteAnyMovimentMark(tempBoard);
        let x = -1, y = -1;
        if (selectedPiece) {
            const piece = board[selectedPiece[0]][selectedPiece[1]];
            switch (piece.slice(0, 2)) {
                case 'wp':
                    console.log(`Piece ${tempBoard[selectedPiece[0]][selectedPiece[1] - 1]} at position: [${selectedPiece[0]}, ${selectedPiece[1]}]`);
                    for (let x = 1; x <= 2; x++) {
                        if (selectedPiece[0] !== 6 && x == 2) break;
                        if (x == 1) {
                            if (selectedPiece[1] < 7 && tempBoard[selectedPiece[0] - x][selectedPiece[1] + 1].slice(0, 1) === 'b') {
                                tempBoard[selectedPiece[0] - x][selectedPiece[1] + 1] = tempBoard[selectedPiece[0] - x][selectedPiece[1] + 1].slice(0, 2) + "et";
                                setBoard(tempBoard);
                            }
                            if (selectedPiece[1] > 0 && tempBoard[selectedPiece[0] - x][selectedPiece[1] - 1].slice(0, 1) === 'b') {
                                tempBoard[selectedPiece[0] - x][selectedPiece[1] - 1] = tempBoard[selectedPiece[0] - x][selectedPiece[1] - 1].slice(0, 2) + "et";
                                setBoard(tempBoard);
                            }
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
                    x = selectedPiece[0], y = selectedPiece[1];
                    // Castle checks
                    if (tempBoard[x][y].slice(0, 2) === 'wk' && tempBoard[x][0].slice(0, 2) === 'wr' && checkCastleWhite[0] === false && checkCastleWhite[2] === false &&
                        !tempBoard[selectedPiece![0]][selectedPiece![1] + 1] && !tempBoard[selectedPiece![0]][selectedPiece![1] + 2]) {
                        tempBoard[x][y + 2] = 'pm';
                        setBoard(tempBoard);
                    }
                    if (tempBoard[x][y].slice(0, 2) === 'wk' && tempBoard[x][7].slice(0, 2) === 'wr' && checkCastleWhite[0] === false && checkCastleWhite[1] === false &&
                        !tempBoard[selectedPiece![0]][selectedPiece![1] - 1] && !tempBoard[selectedPiece![0]][selectedPiece![1] - 2] && !tempBoard[selectedPiece![0]][selectedPiece![1] - 3]) {
                        tempBoard[x][y - 2] = 'pm';
                        setBoard(tempBoard);
                    }
                    // Normal checks
                    if (x > 0) {
                        if (!board[x - 1][y]) {
                            let hasPieceToCheckIt: boolean = false;
                            for (let xPos = x - 1; xPos > 0; xPos--) {
                                if (board[xPos][y].slice(0, 2) === 'bq' || board[xPos][y].slice(0, 2) === 'bb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x - 1; xPos < 7; xPos++) {
                                if (board[xPos][y].slice(0, 2) === 'bq' || board[xPos][y].slice(0, 2) === 'bb') {
                                    console.log(board[xPos][y])
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let yPos = y; yPos > 0; yPos--) {
                                if (board[x - 1][yPos].slice(0, 2) === 'bq' || board[x][yPos].slice(0, 2) === 'bb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let yPos = y; yPos < 7; yPos++) {
                                if (board[x - 1][yPos].slice(0, 2) === 'bq' || board[x - 1][yPos].slice(0, 2) === 'bb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }

                            for (let xPos = x - 1, yPos = y; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x - 1, yPos = y; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }

                            for (let xPos = x - 1, yPos = y; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x - 1, yPos = y; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            if (!hasPieceToCheckIt) {
                                tempBoard[x - 1][y] = 'pm';
                                setBoard(tempBoard);
                            }
                        } else if (board[x - 1][y].slice(0, 1) === 'b') {
                            tempBoard[x - 1][y] = tempBoard[x - 1][y].slice(0, 3) + 'et';
                            setBoard(tempBoard);
                        }

                        if (y < 7) {
                            if (!board[x - 1][y + 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let xPos = x - 1, yPos = y + 1; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y + 1; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y + 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y + 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y + 1; yPos > 0; yPos--) {
                                    if (board[x - 1][yPos].slice(0, 2) === 'bq' || board[x][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y + 1; yPos < 7; yPos++) {
                                    if (board[x - 1][yPos].slice(0, 2) === 'bq' || board[x - 1][yPos].slice(0, 2) === 'bb') {
                                        console.log(board[x][yPos])
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'bq' || board[xPos][y + 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'bq' || board[xPos][y + 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                if (!hasPieceToCheckIt) {
                                    tempBoard[x - 1][y + 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x - 1][y + 1].slice(0, 1) === 'b') {
                                tempBoard[x - 1][y + 1] = tempBoard[x - 1][y + 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }

                            if (!board[x][y + 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let yPos = y + 1; yPos < 7; yPos++) {
                                    if (board[x][yPos].slice(0, 2) === 'bq' || board[x][yPos].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y - 1; yPos > 0; yPos--) {
                                    if (board[x][yPos].slice(0, 2) === 'bq' || board[x][yPos].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'bq' || board[xPos][y + 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'bq' || board[xPos][y + 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                for (let xPos = x, yPos = y + 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                for (let xPos = x, yPos = y + 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y + 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                if (!hasPieceToCheckIt) {
                                    tempBoard[x][y + 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x][y + 1].slice(0, 1) === 'b') {
                                tempBoard[x][y + 1] = tempBoard[x][y + 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }

                        if (y > 0) {
                            if (!board[x - 1][y - 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let xPos = x - 1, yPos = y - 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y - 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y - 1; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y - 1; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y + 1; yPos > 0; yPos--) {
                                    if (board[x - 1][yPos].slice(0, 2) === 'bq' || board[x][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y + 1; yPos < 7; yPos++) {
                                    if (board[x - 1][yPos].slice(0, 2) === 'bq' || board[x - 1][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'bq' || board[xPos][y - 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'bq' || board[xPos][y - 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                if (!hasPieceToCheckIt) {
                                    tempBoard[x - 1][y - 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x - 1][y - 1].slice(0, 1) === 'b') {
                                tempBoard[x - 1][y - 1] = tempBoard[x - 1][y - 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }

                            if (!board[x][y - 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let yPos = y + 1; yPos < 7; yPos++) {
                                    if (board[x][yPos].slice(0, 2) === 'bq' || board[x][yPos].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y - 1; yPos > 0; yPos--) {
                                    if (board[x][yPos].slice(0, 2) === 'bq' || board[x][yPos].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y - 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y - 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'bq' || board[xPos][y - 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'bq' || board[xPos][y - 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }


                                for (let xPos = x, yPos = y - 1; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y - 1; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                if (!hasPieceToCheckIt) {
                                    tempBoard[x][y - 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x][y - 1].slice(0, 1) === 'b') {
                                tempBoard[x][y - 1] = tempBoard[x][y - 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }
                    if (x < 7) {
                        if (!board[x + 1][y]) {
                            let hasPieceToCheckIt: boolean = false;
                            for (let xPos = x + 1; xPos < 7; xPos++) {
                                if (board[xPos][y].slice(0, 2) === 'bq' || board[xPos][y].slice(0, 2) === 'bb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x + 1; xPos > 0; xPos--) {
                                if (board[xPos][y].slice(0, 2) === 'bq' || board[xPos][y].slice(0, 2) === 'bb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }

                            for (let yPos = y; yPos > 0; yPos--) {
                                if (board[x + 1][yPos].slice(0, 2) === 'bq' || board[x + 1][yPos].slice(0, 2) === 'br') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let yPos = y; yPos < 7; yPos++) {
                                if (board[x + 1][yPos].slice(0, 2) === 'bq' || board[x + 1][yPos].slice(0, 2) === 'br') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x, yPos = y + 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }

                            for (let xPos = x + 1, yPos = y; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x + 1, yPos = y; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x + 1, yPos = y; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x + 1, yPos = y; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            if (!hasPieceToCheckIt) {
                                tempBoard[x + 1][y] = 'pm';
                                setBoard(tempBoard);
                            }
                        } else if (board[x + 1][y].slice(0, 1) === 'b') {
                            tempBoard[x + 1][y] = tempBoard[x + 1][y].slice(0, 3) + 'et';
                            setBoard(tempBoard);
                        }
                        if (y > 0) {
                            if (!board[x + 1][y - 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let xPos = x + 1, yPos = y - 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x + 1, yPos = y - 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x + 1, yPos = y - 1; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x + 1, yPos = y - 1; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'bq' || board[xPos][y - 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'bq' || board[xPos][y - 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y - 1; yPos > 0; yPos--) {
                                    if (board[x + 1][yPos].slice(0, 2) === 'bq' || board[x + 1][yPos].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y - 1; yPos < 7; yPos++) {
                                    if (board[x + 1][yPos].slice(0, 2) === 'bq' || board[x + 1][yPos].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                if (!hasPieceToCheckIt) {
                                    tempBoard[x + 1][y - 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x + 1][y - 1].slice(0, 1) === 'b') {
                                tempBoard[x + 1][y - 1] = tempBoard[x + 1][y - 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                            if (!board[x][y - 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let yPos = y + 1; yPos < 7; yPos++) {
                                    if (board[x][yPos].slice(0, 2) === 'bq' || board[x][yPos].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y - 1; yPos > 0; yPos--) {
                                    if (board[x][yPos].slice(0, 2) === 'bq' || board[x][yPos].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y - 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y - 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'bq' || board[xPos][y - 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'bq' || board[xPos][y - 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y - 1; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y - 1; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                if (!hasPieceToCheckIt) {
                                    tempBoard[x][y - 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x][y - 1].slice(0, 1) === 'b') {
                                tempBoard[x][y - 1] = tempBoard[x][y - 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                        if (y < 7) {
                            if (!board[x + 1][y + 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let xPos = x - 1, yPos = y - 1; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y - 1; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x + 1, yPos = y + 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x + 1, yPos = y + 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'bq' || board[xPos][y + 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'bq' || board[xPos][y + 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y + 1; yPos > 0; yPos--) {
                                    if (board[x + 1][yPos].slice(0, 2) === 'bq' || board[x + 1][yPos].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y + 1; yPos < 7; yPos++) {
                                    if (board[x + 1][yPos].slice(0, 2) === 'bq' || board[x + 1][yPos].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                if (!hasPieceToCheckIt) {
                                    tempBoard[x + 1][y + 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x + 1][y + 1].slice(0, 1) === 'b') {
                                tempBoard[x + 1][y + 1] = tempBoard[x + 1][y + 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                            if (!board[x][y + 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let yPos = y + 1; yPos < 7; yPos++) {
                                    if (board[x][yPos].slice(0, 2) === 'bq' || board[x][yPos].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y - 1; yPos > 0; yPos--) {
                                    if (board[x][yPos].slice(0, 2) === 'bq' || board[x][yPos].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'bq' || board[xPos][y + 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'bq' || board[xPos][y + 1].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                for (let yPos = y - 1; yPos > 0; yPos--) {
                                    if (board[x][yPos].slice(0, 2) === 'bq' || board[x][yPos].slice(0, 2) === 'br') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y + 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                for (let xPos = x - 1, yPos = y; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y + 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y + 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'bq' || tempBoard[xPos][yPos].slice(0, 2) === 'bb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                if (!hasPieceToCheckIt) {
                                    tempBoard[x][y + 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x][y + 1].slice(0, 1) === 'b') {
                                tempBoard[x][y + 1] = tempBoard[x][y + 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }
                    break;
                case 'bp':
                    for (let x = 1; x <= 2; x++) {
                        if (selectedPiece[0] !== 1 && x == 2) break;
                        if (x == 1) {
                            if (selectedPiece[1] < 7 && tempBoard[selectedPiece[0] + x][selectedPiece[1] + 1].slice(0, 1) === 'w') {
                                tempBoard[selectedPiece[0] + x][selectedPiece[1] + 1] = tempBoard[selectedPiece[0] + x][selectedPiece[1] + 1].slice(0, 2) + "et";
                                setBoard(tempBoard);
                            }
                            if (selectedPiece[1] > 0 && tempBoard[selectedPiece[0] + x][selectedPiece[1] - 1].slice(0, 1) === 'w') {
                                tempBoard[selectedPiece[0] + x][selectedPiece[1] - 1] = tempBoard[selectedPiece[0] + x][selectedPiece[1] - 1].slice(0, 2) + "et";
                                setBoard(tempBoard);
                            }
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
                    x = selectedPiece[0], y = selectedPiece[1];
                    // Rook checks
                    if (checkCastleBlack[0] === false && tempBoard[x][7].slice(0, 2) === 'wr' && checkCastleBlack[2] === false &&
                        !tempBoard[selectedPiece![0]][selectedPiece![1] + 1] && !tempBoard[selectedPiece![0]][selectedPiece![1] + 2]) {
                        tempBoard[x][y + 2] = 'pm';
                        setBoard(tempBoard);
                    }
                    if (checkCastleBlack[0] === false && tempBoard[x][7].slice(0, 2) === 'wr' && checkCastleBlack[1] === false &&
                        !tempBoard[selectedPiece![0]][selectedPiece![1] - 1] && !tempBoard[selectedPiece![0]][selectedPiece![1] - 2] && !tempBoard[selectedPiece![0]][selectedPiece![1] - 3]) {
                        tempBoard[x][y - 2] = 'pm';
                        setBoard(tempBoard);
                    }

                    // Possible move checks
                    if (x > 0) {
                        if (!board[x - 1][y]) {
                            let hasPieceToCheckIt: boolean = false;
                            for (let xPos = x - 1; xPos > 0; xPos--) {
                                if (board[xPos][y].slice(0, 2) === 'wq' || board[xPos][y].slice(0, 2) === 'wb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x - 1; xPos < 7; xPos++) {
                                if (board[xPos][y].slice(0, 2) === 'wq' || board[xPos][y].slice(0, 2) === 'wb') {
                                    console.log(board[xPos][y])
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let yPos = y; yPos > 0; yPos--) {
                                if (board[x - 1][yPos].slice(0, 2) === 'wq' || board[x][yPos].slice(0, 2) === 'wb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let yPos = y; yPos < 7; yPos++) {
                                if (board[x - 1][yPos].slice(0, 2) === 'wq' || board[x - 1][yPos].slice(0, 2) === 'wb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }

                            for (let xPos = x - 1, yPos = y; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x - 1, yPos = y; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }

                            for (let xPos = x - 1, yPos = y; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x - 1, yPos = y; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            if (!hasPieceToCheckIt) {
                                tempBoard[x - 1][y] = 'pm';
                                setBoard(tempBoard);
                            }
                        } else if (board[x - 1][y].slice(0, 1) === 'w') {
                            tempBoard[x - 1][y] = tempBoard[x - 1][y].slice(0, 3) + 'et';
                            setBoard(tempBoard);
                        }

                        if (y < 7) {
                            if (!board[x - 1][y + 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let xPos = x - 1, yPos = y + 1; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y + 1; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y + 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y + 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y + 1; yPos > 0; yPos--) {
                                    if (board[x - 1][yPos].slice(0, 2) === 'wq' || board[x][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y + 1; yPos < 7; yPos++) {
                                    if (board[x - 1][yPos].slice(0, 2) === 'wq' || board[x - 1][yPos].slice(0, 2) === 'wb') {
                                        console.log(board[x][yPos])
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'wq' || board[xPos][y + 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'wq' || board[xPos][y + 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                if (!hasPieceToCheckIt) {
                                    tempBoard[x - 1][y + 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x - 1][y + 1].slice(0, 1) === 'w') {
                                tempBoard[x - 1][y + 1] = tempBoard[x - 1][y + 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }

                            if (!board[x][y + 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let yPos = y + 1; yPos < 7; yPos++) {
                                    if (board[x][yPos].slice(0, 2) === 'wq' || board[x][yPos].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y - 1; yPos > 0; yPos--) {
                                    if (board[x][yPos].slice(0, 2) === 'wq' || board[x][yPos].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'wq' || board[xPos][y + 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'wq' || board[xPos][y + 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                for (let xPos = x, yPos = y + 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                for (let xPos = x, yPos = y + 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y + 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                if (!hasPieceToCheckIt) {
                                    tempBoard[x][y + 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x][y + 1].slice(0, 1) === 'w') {
                                tempBoard[x][y + 1] = tempBoard[x][y + 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }

                        if (y > 0) {
                            if (!board[x - 1][y - 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let xPos = x - 1, yPos = y - 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y - 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y - 1; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y - 1; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y + 1; yPos > 0; yPos--) {
                                    if (board[x - 1][yPos].slice(0, 2) === 'wq' || board[x][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y + 1; yPos < 7; yPos++) {
                                    if (board[x - 1][yPos].slice(0, 2) === 'wq' || board[x - 1][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'wq' || board[xPos][y - 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'wq' || board[xPos][y - 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                if (!hasPieceToCheckIt) {
                                    tempBoard[x - 1][y - 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x - 1][y - 1].slice(0, 1) === 'w') {
                                tempBoard[x - 1][y - 1] = tempBoard[x - 1][y - 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }

                            if (!board[x][y - 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let yPos = y + 1; yPos < 7; yPos++) {
                                    if (board[x][yPos].slice(0, 2) === 'wq' || board[x][yPos].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y - 1; yPos > 0; yPos--) {
                                    if (board[x][yPos].slice(0, 2) === 'wq' || board[x][yPos].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y - 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y - 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'wq' || board[xPos][y - 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'wq' || board[xPos][y - 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }


                                for (let xPos = x, yPos = y - 1; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y - 1; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                if (!hasPieceToCheckIt) {
                                    tempBoard[x][y - 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x][y - 1].slice(0, 1) === 'w') {
                                tempBoard[x][y - 1] = tempBoard[x][y - 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }
                    if (x < 7) {
                        if (!board[x + 1][y]) {
                            let hasPieceToCheckIt: boolean = false;
                            for (let xPos = x + 1; xPos < 7; xPos++) {
                                if (board[xPos][y].slice(0, 2) === 'wq' || board[xPos][y].slice(0, 2) === 'wb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x + 1; xPos > 0; xPos--) {
                                if (board[xPos][y].slice(0, 2) === 'wq' || board[xPos][y].slice(0, 2) === 'wb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }

                            for (let yPos = y; yPos > 0; yPos--) {
                                if (board[x + 1][yPos].slice(0, 2) === 'wq' || board[x + 1][yPos].slice(0, 2) === 'wr') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let yPos = y; yPos < 7; yPos++) {
                                if (board[x + 1][yPos].slice(0, 2) === 'wq' || board[x + 1][yPos].slice(0, 2) === 'wr') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x, yPos = y + 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }

                            for (let xPos = x + 1, yPos = y; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x + 1, yPos = y; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x + 1, yPos = y; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            for (let xPos = x + 1, yPos = y; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                    hasPieceToCheckIt = true;
                                    break;
                                }
                            }
                            if (!hasPieceToCheckIt) {
                                tempBoard[x + 1][y] = 'pm';
                                setBoard(tempBoard);
                            }
                        } else if (board[x + 1][y].slice(0, 1) === 'w') {
                            tempBoard[x + 1][y] = tempBoard[x + 1][y].slice(0, 3) + 'et';
                            setBoard(tempBoard);
                        }
                        if (y > 0) {
                            if (!board[x + 1][y - 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let xPos = x + 1, yPos = y - 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x + 1, yPos = y - 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x + 1, yPos = y - 1; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x + 1, yPos = y - 1; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'wq' || board[xPos][y - 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'wq' || board[xPos][y - 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y - 1; yPos > 0; yPos--) {
                                    if (board[x + 1][yPos].slice(0, 2) === 'wq' || board[x + 1][yPos].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y - 1; yPos < 7; yPos++) {
                                    if (board[x + 1][yPos].slice(0, 2) === 'wq' || board[x + 1][yPos].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                if (!hasPieceToCheckIt) {
                                    tempBoard[x + 1][y - 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x + 1][y - 1].slice(0, 1) === 'w') {
                                tempBoard[x + 1][y - 1] = tempBoard[x + 1][y - 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                            if (!board[x][y - 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let yPos = y + 1; yPos < 7; yPos++) {
                                    if (board[x][yPos].slice(0, 2) === 'wq' || board[x][yPos].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y - 1; yPos > 0; yPos--) {
                                    if (board[x][yPos].slice(0, 2) === 'wq' || board[x][yPos].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y - 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y - 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'wq' || board[xPos][y - 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y - 1].slice(0, 2) === 'wq' || board[xPos][y - 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y - 1; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y - 1; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                if (!hasPieceToCheckIt) {
                                    tempBoard[x][y - 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x][y - 1].slice(0, 1) === 'w') {
                                tempBoard[x][y - 1] = tempBoard[x][y - 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                        if (y < 7) {
                            if (!board[x + 1][y + 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let xPos = x - 1, yPos = y - 1; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y - 1; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x + 1, yPos = y + 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x + 1, yPos = y + 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'wq' || board[xPos][y + 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'wq' || board[xPos][y + 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y + 1; yPos > 0; yPos--) {
                                    if (board[x + 1][yPos].slice(0, 2) === 'wq' || board[x + 1][yPos].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y + 1; yPos < 7; yPos++) {
                                    if (board[x + 1][yPos].slice(0, 2) === 'wq' || board[x + 1][yPos].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                if (!hasPieceToCheckIt) {
                                    tempBoard[x + 1][y + 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x + 1][y + 1].slice(0, 1) === 'w') {
                                tempBoard[x + 1][y + 1] = tempBoard[x + 1][y + 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                            if (!board[x][y + 1]) {
                                let hasPieceToCheckIt: boolean = false;
                                for (let yPos = y + 1; yPos < 7; yPos++) {
                                    if (board[x][yPos].slice(0, 2) === 'wq' || board[x][yPos].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let yPos = y - 1; yPos > 0; yPos--) {
                                    if (board[x][yPos].slice(0, 2) === 'wq' || board[x][yPos].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                for (let xPos = x; xPos > 0; xPos--) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'wq' || board[xPos][y + 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x; xPos < 7; xPos++) {
                                    if (board[xPos][y + 1].slice(0, 2) === 'wq' || board[xPos][y + 1].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                for (let yPos = y - 1; yPos > 0; yPos--) {
                                    if (board[x][yPos].slice(0, 2) === 'wq' || board[x][yPos].slice(0, 2) === 'wr') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y + 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }

                                for (let xPos = x - 1, yPos = y; xPos > 0 && yPos > 0; xPos--, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x - 1, yPos = y; xPos < 7 && yPos < 7; xPos++, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y + 1; xPos > 0 && yPos < 7; xPos--, yPos++) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                for (let xPos = x, yPos = y + 1; xPos < 7 && yPos > 0; xPos++, yPos--) {
                                    if (tempBoard[xPos][yPos].slice(0, 2) === 'wq' || tempBoard[xPos][yPos].slice(0, 2) === 'wb') {
                                        hasPieceToCheckIt = true;
                                        break;
                                    }
                                }
                                if (!hasPieceToCheckIt) {
                                    tempBoard[x][y + 1] = 'pm';
                                    setBoard(tempBoard);
                                }
                            } else if (board[x][y + 1].slice(0, 1) === 'w') {
                                tempBoard[x][y + 1] = tempBoard[x][y + 1].slice(0, 3) + 'et';
                                setBoard(tempBoard);
                            }
                        }
                    }
                    break;
            }
        }
    }, [selectedPiece])

    const deleteAnyMovimentMark = (tempBoard: string[][]) => {
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

    // Update and remove any move marks after each move
    useEffect(() => {
        const tempBoard = board;
        deleteAnyMovimentMark(tempBoard);
        setBoard(tempBoard);

    }, [board]);

    // Reset game after 50 moves.
    // useEffect(() => {
    //     if (totalMoves == 50) {
    //         setTimeout(() => {
    //             setShowMessage(true);
    //             setGameIsFinished(true);
    //             setMessage("Total moves amount reached. Resetting the game...")
    //         }, 15);
    //         setTimeout(() => {
    //             setBoard(intialBoardState);
    //             setTotalMoves(0);
    //             setGameIsFinished(false);
    //             setIsWhiteTurn(true);
    //         }, 3000)
    //     }
    // }, [totalMoves])

    // Updates the board when you choose a piece to promote
    const udpateBord = () => {
        const tempBoard = board;
        if (lastMove.length > 0) {
            const lastPieceMoved = board[lastMove[0]][lastMove[1]];
            tempBoard[lastMove[0]][lastMove[1]] = lastPieceMoved.slice(0, 1) + pieceToSubstituteWith;
        }
        setBoard(tempBoard);
        setLastMove([]);
        setRenderScreen(prev => prev);
    }
    useEffect(() => {
        udpateBord();
    }, [pieceToSubstituteWith]);

    useEffect(() => {
        console.log(checked)
        let itHasCheck: boolean = false;
        let fieldPosition: number[] = [];
        board.map((row, rowIndex) => {
            row.map((position, columIndex) => {
                if (checkCheck(position, rowIndex, columIndex)) {
                    itHasCheck = true;
                    fieldPosition = [rowIndex, columIndex];
                }
            })
        });
        // if (itHasCheck) {
        //     if (board[fieldPosition[0]][fieldPosition[1]].slice(0, 1) === 'w') {
        //         setChecked(prev => ['bk', 1]);
        //     } else if (board[fieldPosition[0]][fieldPosition[1]].slice(0, 1) === 'b') {
        //         setChecked(prev => ['wk', 1]);
        //     }
        // }
    }, []);

    return (
        <>
            {renderScreen && ""}
            <section className={`${styles.game} ${gameIsFinished && styles.gameFinished}`}>
                <div className={styles.board}>
                    {board.map((row, rowIndex) => (
                        row.map((piece, columnIndex) => (
                            <div
                                className={`
                                ${piece.slice(2, 4) && piece.slice(2, 4) === 'dg' ? styles.danger : rowIndex % 2 == 0 ? (columnIndex % 2 == 0 ? styles.yellow : styles.green) : (columnIndex % 2 == 0 ? styles.green : styles.yellow)}
                                ${(selectedPiece && rowIndex == selectedPiece[0] && columnIndex == selectedPiece[1]) && styles.active}
                                ${piece === 'pm' && styles.possibleMoviment}
            `}
                                key={rowIndex + columnIndex}
                                onClick={() => clickField(rowIndex, columnIndex, piece)}
                            >
                                {piece && piece !== "pm" && <img src={`${piece.slice(0, 2)}.svg`} alt="" draggable={false} className={`${piece.includes('et') ? styles.eatable : ""} `} />}
                            </div>
                        ))
                    ))}
                </div>
            </section>
            <Message message={message} showMessage={showMessage} setShowMessage={setShowMessage} />
            <Promote openPromotionSelection={openPromotionSelection} setOpenPromotionSelection={setOpenPromotionSelection} setPieceToSubstituteWith={setPieceToSubstituteWith} />
        </>
    )
};

export default Board;