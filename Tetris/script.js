// Configuration du jeu
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

// Définition des tetrominos
const tetrominos = [
    { shape: [[1, 1, 1], [0, 1, 0]], color: 'purple' }, // Forme T
    { shape: [[1, 1], [1, 1]], color: 'yellow' }, // Forme O
    { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' }, // Forme S
    { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' }, // Forme Z
    { shape: [[1, 0, 0], [1, 1, 1]], color: 'orange' }, // Forme L
    { shape: [[0, 0, 1], [1, 1, 1]], color: 'pink' }, // Forme J
    { shape: [[1, 1, 1, 1]], color: 'cyan' } // Forme I
];

// Initialisation du canvas
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

class Tetris {
    constructor() {
        this.grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
        this.currentPiece = this.createNewPiece();
        this.gameOver = false;
    }

    createNewPiece() {
        const randomTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
        return {
            shape: randomTetromino.shape,
            color: randomTetromino.color,
            x: Math.floor((COLS - randomTetromino.shape[0].length) / 2),
            y: 0
        };
    }

    draw() {
        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner la grille
        this.drawGrid();

        // Dessiner la pièce courante
        this.drawPiece();
    }

    drawGrid() {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (this.grid[row][col]) {
                    ctx.fillStyle = this.grid[row][col];
                    ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                }
            }
        }
    }

    drawPiece() {
        const piece = this.currentPiece;
        ctx.fillStyle = piece.color;
        
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    ctx.fillRect(
                        (piece.x + col) * BLOCK_SIZE,
                        (piece.y + row) * BLOCK_SIZE,
                        BLOCK_SIZE - 1,
                        BLOCK_SIZE - 1
                    );
                }
            }
        }
    }

    moveDown() {
        this.currentPiece.y++;
        if (this.hasCollision()) {
            this.currentPiece.y--;
            this.currentPiece = this.createNewPiece();
            if (this.hasCollision()) {
                this.gameOver = true;
            }
        }
    }

    moveLeft() {
        this.currentPiece.x--;
        if (this.hasCollision()) {
            this.currentPiece.x++;
        }
    }

    moveRight() {
        this.currentPiece.x++;
        if (this.hasCollision()) {
            this.currentPiece.x--;
        }
    }

    hasCollision() {
        const piece = this.currentPiece;
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    const newX = piece.x + col;
                    const newY = piece.y + row;
                    
                    if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
                    if (newY >= 0 && this.grid[newY][newX]) return true;
                }
            }
        }
        return false;
    }


    clearLines() {
        let linesCleared = 0;
        let linesToClear = [];
  
        // Identifier toutes les lignes complètes
        for (let row = ROWS - 1; row >= 0; row--) {
            if (this.grid[row].every(cell => cell !== 0)) {
                linesToClear.push(row);
                linesCleared++;
            }
        }

        if (linesCleared > 0) {
            // Supprimer les lignes complètes
            linesToClear.forEach(row => {
                this.grid.splice(row, 1);
                this.grid.unshift(Array(COLS).fill(0));
            });
        }
  
        return linesCleared;
    }
  
    rotate() {
        const rotated = [];
        for(let i = 0; i < this.currentPiece.shape[0].length; i++) {
            const row = [];
            for(let j = this.currentPiece.shape.length - 1; j >= 0; j--) {
                row.push(this.currentPiece.shape[j][i]);
            }
            rotated.push(row);
        }
        
        const originalShape = this.currentPiece.shape;
        this.currentPiece.shape = rotated;
        
        if (this.hasCollision()) {
            this.currentPiece.shape = originalShape;
        }
    }


}


// Initialisation du jeu
const game = new Tetris();

// Contrôles clavier
document.addEventListener('keydown', (event) => {
    if (game.gameOver) return;

    switch (event.key) {
        case 'ArrowLeft':
            game.moveLeft();
            break;
        case 'ArrowRight':
            game.moveRight();
            break;
        case 'ArrowDown':
            game.moveDown();
            break;
        case 'ArrowUp':
            game.rotate();
            break;
    }
    game.draw();
});

// Boucle de jeu
function gameLoop() {
    if (!game.gameOver) {
        game.moveDown();
        game.draw();
    }
    setTimeout(gameLoop, 1000);
}

// Démarrer le jeu
gameLoop();
