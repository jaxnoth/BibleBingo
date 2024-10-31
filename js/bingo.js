/**
 * Check for bingo patterns on the board
 * @returns {boolean} True if a new bingo was found
 */
function checkForBingo() {
    const cells = document.querySelectorAll('.bingo-cell');
    const size = 5;
    const selected = Array.from(cells).map(cell => cell.classList.contains('selected'));
    let newBingo = false;

    // Clear existing bingo line classes
    cells.forEach(cell => {
        cell.classList.remove('bingo-row', 'bingo-column', 'bingo-diagonal', 'bingo-multiple', 'super-bingo');
    });

    // Check for super bingo (all cells selected)
    if (selected.every(Boolean)) {
        cells.forEach(cell => cell.classList.add('super-bingo'));
        if (!bingoStates.superBingo) {
            bingoStates.superBingo = true;
            startSuperCelebration();
            return true;
        }
    } else {
        bingoStates.superBingo = false;
    }

    // Track cells that are part of bingo lines
    const bingoCells = new Map(); // cell index -> set of bingo types

    // Check rows
    for (let i = 0; i < size; i++) {
        const rowComplete = selected.slice(i * size, (i + 1) * size).every(Boolean);
        if (rowComplete && !bingoStates.rows.has(i)) {
            bingoStates.rows.add(i);
            newBingo = true;
        } else if (!rowComplete && bingoStates.rows.has(i)) {
            bingoStates.rows.delete(i);
        }

        if (rowComplete) {
            for (let j = 0; j < size; j++) {
                const cellIndex = i * size + j;
                if (!bingoCells.has(cellIndex)) bingoCells.set(cellIndex, new Set());
                bingoCells.get(cellIndex).add('row');
            }
        }
    }

    // Check columns
    for (let i = 0; i < size; i++) {
        const columnComplete = Array.from({length: size}, (_, j) => selected[i + j * size]).every(Boolean);
        if (columnComplete && !bingoStates.columns.has(i)) {
            bingoStates.columns.add(i);
            newBingo = true;
        } else if (!columnComplete && bingoStates.columns.has(i)) {
            bingoStates.columns.delete(i);
        }

        if (columnComplete) {
            for (let j = 0; j < size; j++) {
                const cellIndex = i + j * size;
                if (!bingoCells.has(cellIndex)) bingoCells.set(cellIndex, new Set());
                bingoCells.get(cellIndex).add('column');
            }
        }
    }

    // Check diagonals
    const diagonal1Complete = Array.from({length: size}, (_, i) => selected[i * size + i]).every(Boolean);
    if (diagonal1Complete && !bingoStates.diagonals.has(0)) {
        bingoStates.diagonals.add(0);
        newBingo = true;
    } else if (!diagonal1Complete && bingoStates.diagonals.has(0)) {
        bingoStates.diagonals.delete(0);
    }

    if (diagonal1Complete) {
        for (let i = 0; i < size; i++) {
            const cellIndex = i * size + i;
            if (!bingoCells.has(cellIndex)) bingoCells.set(cellIndex, new Set());
            bingoCells.get(cellIndex).add('diagonal');
        }
    }

    const diagonal2Complete = Array.from({length: size}, (_, i) => selected[i * size + (size - 1 - i)]).every(Boolean);
    if (diagonal2Complete && !bingoStates.diagonals.has(1)) {
        bingoStates.diagonals.add(1);
        newBingo = true;
    } else if (!diagonal2Complete && bingoStates.diagonals.has(1)) {
        bingoStates.diagonals.delete(1);
    }

    if (diagonal2Complete) {
        for (let i = 0; i < size; i++) {
            const cellIndex = i * size + (size - 1 - i);
            if (!bingoCells.has(cellIndex)) bingoCells.set(cellIndex, new Set());
            bingoCells.get(cellIndex).add('diagonal');
        }
    }

    // Apply visual classes based on bingo lines
    bingoCells.forEach((types, index) => {
        const cell = cells[index];
        if (types.size > 1) {
            cell.classList.add('bingo-multiple');
        } else {
            if (types.has('row')) cell.classList.add('bingo-row');
            if (types.has('column')) cell.classList.add('bingo-column');
            if (types.has('diagonal')) cell.classList.add('bingo-diagonal');
        }
    });

    if (newBingo) {
        startCelebration();
    }

    return newBingo;
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

function toggleCell(event) {
    const cell = event.currentTarget;
    cell.classList.toggle('selected');
    checkForBingo();
}

// Track bingo states
const bingoStates = {
    rows: new Set(),      // Store completed row indices
    columns: new Set(),   // Store completed column indices
    diagonals: new Set(),  // Store completed diagonal indices (0 = main, 1 = counter)
    superBingo: false
};

// Add function to reset bingo states (call this when generating a new board)
function resetBingoStates() {
    bingoStates.rows.clear();
    bingoStates.columns.clear();
    bingoStates.diagonals.clear();
    bingoStates.superBingo = false;
}
