/**
 * Check for bingo patterns on the board
 * @returns {boolean} True if a new bingo was found
 */
function checkForBingo() {
    const cells = document.querySelectorAll('.bingo-cell');
    if (!cells || cells.length === 0) return;

    const cellArray = Array.from(cells);
    let newBingo = false;

    // Remove winner class from all cells that are no longer part of a bingo
    cellArray.forEach(cell => cell.classList.remove('winner'));

    // Check rows
    for (let i = 0; i < 5; i++) {
        const rowStart = i * 5;
        const row = cellArray.slice(rowStart, rowStart + 5);
        const isRowBingo = checkLine(row);

        if (isRowBingo && !bingoStates.rows[i]) {
            // New bingo found
            bingoStates.rows[i] = true;
            row.forEach(cell => cell.classList.add('winner'));
            newBingo = true;
        } else if (!isRowBingo && bingoStates.rows[i]) {
            // Bingo was broken
            bingoStates.rows[i] = false;
        }
    }

    // Check columns
    for (let i = 0; i < 5; i++) {
        const column = [0,1,2,3,4].map(j => cellArray[i + j * 5]);
        const isColumnBingo = checkLine(column);

        if (isColumnBingo && !bingoStates.columns[i]) {
            bingoStates.columns[i] = true;
            column.forEach(cell => cell.classList.add('winner'));
            newBingo = true;
        } else if (!isColumnBingo && bingoStates.columns[i]) {
            bingoStates.columns[i] = false;
        }
    }

    // Check diagonals
    const diagonal1 = [0,6,12,18,24].map(i => cellArray[i]);
    const diagonal2 = [4,8,12,16,20].map(i => cellArray[i]);

    const isDiagonal1Bingo = checkLine(diagonal1);
    if (isDiagonal1Bingo && !bingoStates.diagonals[0]) {
        bingoStates.diagonals[0] = true;
        diagonal1.forEach(cell => cell.classList.add('winner'));
        newBingo = true;
    } else if (!isDiagonal1Bingo && bingoStates.diagonals[0]) {
        bingoStates.diagonals[0] = false;
    }

    const isDiagonal2Bingo = checkLine(diagonal2);
    if (isDiagonal2Bingo && !bingoStates.diagonals[1]) {
        bingoStates.diagonals[1] = true;
        diagonal2.forEach(cell => cell.classList.add('winner'));
        newBingo = true;
    } else if (!isDiagonal2Bingo && bingoStates.diagonals[1]) {
        bingoStates.diagonals[1] = false;
    }

    // Check for super bingo (all cells marked)
    const isSuperBingo = cellArray.every(cell => cell.classList.contains('marked'));

    if (isSuperBingo) {
        cellArray.forEach(cell => cell.classList.add('winner'));
        window.celebrateSuperBingo();
    } else if (newBingo) {
        window.celebrateWin();
    }

    // Reapply winner class to all current bingos
    reapplyWinnerClasses(cellArray);
}

function reapplyWinnerClasses(cellArray) {
    // Rows
    bingoStates.rows.forEach((isBingo, i) => {
        if (isBingo) {
            const rowStart = i * 5;
            cellArray.slice(rowStart, rowStart + 5).forEach(cell => cell.classList.add('winner'));
        }
    });

    // Columns
    bingoStates.columns.forEach((isBingo, i) => {
        if (isBingo) {
            [0,1,2,3,4].forEach(j => cellArray[i + j * 5].classList.add('winner'));
        }
    });

    // Diagonals
    if (bingoStates.diagonals[0]) {
        [0,6,12,18,24].forEach(i => cellArray[i].classList.add('winner'));
    }
    if (bingoStates.diagonals[1]) {
        [4,8,12,16,20].forEach(i => cellArray[i].classList.add('winner'));
    }
}

function checkLine(cells) {
    const isWinner = cells.every(cell => cell && cell.classList.contains('marked'));
    console.log('Line check result:', isWinner); // Debug log
    return isWinner;
}

/**
 * Handle cell click event
 * @param {HTMLElement} cell - The clicked cell
 */
function handleCellClick(cell) {
    // Don't allow unmarking the FREE space
    if (cell.classList.contains('free-space')) {
        return;
    }

    // Toggle marked state
    cell.classList.toggle('marked');

    // Add or remove checkmark
    if (cell.classList.contains('marked')) {
        const checkMark = document.createElement('span');
        checkMark.className = 'check-mark';
        checkMark.innerHTML = '✔';
        cell.appendChild(checkMark);
    } else {
        const checkMark = cell.querySelector('.check-mark');
        if (checkMark) {
            checkMark.remove();
        }
    }

    // Check for bingo after each move
    const newBingoFound = checkForBingo();
    if (newBingoFound) {
        celebrateBingo();
    }
}

/**
 * Reset the bingo board state
 */
function resetBingoState() {
    celebratedLines.clear();
    const cells = document.querySelectorAll('.bingo-cell');
    cells.forEach(cell => {
        if (!cell.classList.contains('free-space')) {
            cell.classList.remove('marked', 'bingo-line');
            const checkMark = cell.querySelector('.check-mark');
            if (checkMark) {
                checkMark.remove();
            }
        }
    });
    log('Bingo board state reset');
}

function initializeBingoCard() {
    const cells = document.querySelectorAll('.bingo-cell');

    cells.forEach(cell => {
        // Add both click and touch events
        cell.addEventListener('click', toggleCell);
        cell.addEventListener('touchstart', handleTouch, { passive: true });
    });
}

function handleTouch(event) {
    event.preventDefault();
    const cell = event.currentTarget;
    toggleCell({ currentTarget: cell });
}

function toggleCell(cell) {
    if (!cell) {
        console.error('No cell provided to toggleCell');
        return;
    }

    console.log('Toggling cell:', cell); // Debug log

    // Toggle the marked class
    cell.classList.toggle('marked');

    // Check for bingo after toggling
    checkForBingo();
}

// Bingo state tracking
let bingoStates = {
    rows: new Array(5).fill(false),
    columns: new Array(5).fill(false),
    diagonals: new Array(2).fill(false)
};

function resetBingoStates() {
    bingoStates = {
        rows: new Array(5).fill(false),
        columns: new Array(5).fill(false),
        diagonals: new Array(2).fill(false)
    };
}
