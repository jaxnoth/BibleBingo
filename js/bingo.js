/**
 * Check for bingo patterns on the board
 * @returns {boolean} True if a new bingo was found
 */
function checkForBingo() {
    const cells = document.querySelectorAll('.bingo-cell');
    const size = 5;
    let newBingoFound = false;

    // Convert cells to 2D array for easier checking
    const grid = Array(size).fill().map(() => Array(size).fill(null));
    cells.forEach((cell, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
        grid[row][col] = cell.classList.contains('marked');
    });

    // Clear all bingo-line classes first
    cells.forEach(cell => cell.classList.remove('bingo-line'));

    // Check for full board first
    const isFullBoard = Array.from(cells).every(cell => cell.classList.contains('marked'));

    // Check rows
    for (let row = 0; row < size; row++) {
        const lineKey = `row-${row}`;
        const isRowComplete = grid[row].every(cell => cell);

        if (isRowComplete) {
            if (!celebratedLines.has(lineKey)) {
                newBingoFound = true;
                celebratedLines.add(lineKey);
                log(`New bingo found in row ${row}`);
            }
            // Highlight bingo row
            for (let col = 0; col < size; col++) {
                cells[row * size + col].classList.add('bingo-line');
            }
        }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
        const lineKey = `col-${col}`;
        const isColComplete = grid.every(row => row[col]);

        if (isColComplete) {
            if (!celebratedLines.has(lineKey)) {
                newBingoFound = true;
                celebratedLines.add(lineKey);
                log(`New bingo found in column ${col}`);
            }
            // Highlight bingo column
            for (let row = 0; row < size; row++) {
                cells[row * size + col].classList.add('bingo-line');
            }
        }
    }

    // Check diagonal (top-left to bottom-right)
    const diagKey1 = 'diag-1';
    const isDiag1Complete = grid.every((row, i) => row[i]);
    if (isDiag1Complete) {
        if (!celebratedLines.has(diagKey1)) {
            newBingoFound = true;
            celebratedLines.add(diagKey1);
            log('New bingo found in diagonal 1');
        }
        // Highlight diagonal
        for (let i = 0; i < size; i++) {
            cells[i * size + i].classList.add('bingo-line');
        }
    }

    // Check diagonal (top-right to bottom-left)
    const diagKey2 = 'diag-2';
    const isDiag2Complete = grid.every((row, i) => row[size - 1 - i]);
    if (isDiag2Complete) {
        if (!celebratedLines.has(diagKey2)) {
            newBingoFound = true;
            celebratedLines.add(diagKey2);
            log('New bingo found in diagonal 2');
        }
        // Highlight diagonal
        for (let i = 0; i < size; i++) {
            cells[i * size + (size - 1 - i)].classList.add('bingo-line');
        }
    }

    // Check for full board celebration last
    if (isFullBoard && !celebratedLines.has('fullBoard')) {
        celebratedLines.add('fullBoard');
        log('Full board achieved!');
        celebrateFullBoard();
    }

    return newBingoFound;
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
