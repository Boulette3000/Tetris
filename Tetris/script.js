//Théo Bouvier, Alexandre Lathoud


// ==================== CONFIGURATION DE BASE ====================
// Définit la taille de la grille de jeu : 20 lignes et 10 colonnes
const ROWS = 20;
const COLS = 10;
// Définit la taille de chaque petit carré (en pixels)
const BLOCK_SIZE = 30;
// Définit la vitesse initiale du jeu (1000 ms = 1 seconde entre chaque descente)
const BASE_SPEED = 1000;
// Définit de combien la vitesse augmente à chaque niveau (500 ms plus rapide)
const SPEED_INCREMENT = 500;

// ==================== CONFIGURATION DU SON ====================
// Récupère l'élément audio de la page HTML
const audio = document.getElementById('tetrisTheme');
// Récupère le bouton qui contrôle la musique
const musicToggle = document.getElementById('musicToggle');
// Variable qui garde en mémoire si la musique joue ou non
let isMusicPlaying = false;

// Fonction qui s'occupe d'allumer/éteindre la musique
function toggleMusic() {
    if (isMusicPlaying) {
        // Si la musique joue, on l'arrête
        audio.pause();
        // On change l'icône du bouton pour montrer que le son est coupé
        musicToggle.textContent = '🔈 Musique';
    } else {
        // Si la musique est arrêtée, on la démarre
        audio.play();
        // On change l'icône du bouton pour montrer que le son joue
        musicToggle.textContent = '🔊 Musique';
    }
    // On inverse l'état de la musique (si elle jouait, elle s'arrête et vice versa)
    isMusicPlaying = !isMusicPlaying;
}

// Quand on clique sur le bouton de musique, on appelle la fonction toggleMusic
musicToggle.addEventListener('click', toggleMusic);

// ==================== DÉFINITION DES PIÈCES DU JEU ====================
// Liste de toutes les formes possibles avec leurs couleurs
const tetrominos = [
    { shape: [[1, 1, 1], [0, 1, 0]], color: 'purple' }, // Forme en T
    { shape: [[1, 1], [1, 1]], color: 'yellow' },       // Carré
    { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' },    // Forme en S
    { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' },  // Forme en Z
    { shape: [[1, 0, 0], [1, 1, 1]], color: 'orange' }, // Forme en L
    { shape: [[0, 0, 1], [1, 1, 1]], color: 'pink' },   // Forme en J
    { shape: [[1, 1, 1, 1]], color: 'cyan' }            // Barre droite
];

// ==================== PRÉPARATION DU JEU ====================
// Récupère la zone de dessin (canvas) depuis la page HTML
const canvas = document.getElementById('tetris');
// Prépare le contexte de dessin en 2D
const ctx = canvas.getContext('2d');
// Récupère les éléments qui affichent le score et le niveau
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');

// ==================== CLASSE PRINCIPALE DU JEU ====================
class Tetris {
    // Initialisation d'une nouvelle partie
    constructor() {
        // Crée une grille vide (remplie de zéros)
        this.grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
        // Crée la première pièce
        this.currentPiece = this.createNewPiece();
        // Le jeu n'est pas terminé au début
        this.gameOver = false;
        // Score initial à 0
        this.score = 0;
        // Niveau initial à 1
        this.level = 1;
        // Vitesse initiale
        this.speed = BASE_SPEED;
        // Volume de la musique à 50%
        audio.volume = 0.5;
    }

    // Crée une nouvelle pièce aléatoire
    createNewPiece() {
        // Choisit une forme au hasard
        const randomTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
        // Retourne la nouvelle pièce positionnée en haut au milieu
        return {
            shape: randomTetromino.shape,
            color: randomTetromino.color,
            x: Math.floor((COLS - randomTetromino.shape[0].length) / 2),
            y: 0
        };
    }

    // Met à jour le niveau en fonction du score
    updateLevel() {
        // Calcule le nouveau niveau (1 niveau tous les 1000 points)
        const newLevel = Math.floor(this.score / 1000) + 1;
        if (newLevel !== this.level) {
            this.level = newLevel;
            // Augmente la vitesse avec le niveau
            this.speed = Math.max(BASE_SPEED - (this.level - 1) * SPEED_INCREMENT, 100);
            // Affiche le nouveau niveau
            levelElement.textContent = `Niveau: ${this.level}`;
        }
    }

    // Dessine tout le jeu
    draw() {
        // Efface tout l'écran
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Dessine la grille (pièces déjà posées)
        this.drawGrid();
        // Dessine la pièce qui tombe
        this.drawPiece();
        // Met à jour l'affichage du score
        scoreElement.textContent = `Score: ${this.score}`;
    }

    // Dessine la grille avec toutes les pièces posées
    drawGrid() {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (this.grid[row][col]) {
                    // Si une case contient une couleur, on la dessine
                    ctx.fillStyle = this.grid[row][col];
                    ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                }
            }
        }
    }

    // Dessine la pièce qui tombe actuellement
    drawPiece() {
        const piece = this.currentPiece;
        ctx.fillStyle = piece.color;
        
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    // Dessine chaque carré de la pièce
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

    // Fait descendre la pièce d'un cran
    moveDown() {
        this.currentPiece.y++;
        // Si collision, on annule et on fixe la pièce
        if (this.hasCollision()) {
            this.currentPiece.y--;
            this.lockPiece();
            this.currentPiece = this.createNewPiece();
            // Si la nouvelle pièce ne peut pas apparaître, game over
            if (this.hasCollision()) {
                this.gameOver = true;
            }
        }
    }

    // Déplace la pièce vers la gauche
    moveLeft() {
        this.currentPiece.x--;
        // Si collision, on annule
        if (this.hasCollision()) {
            this.currentPiece.x++;
        }
    }

    // Déplace la pièce vers la droite
    moveRight() {
        this.currentPiece.x++;
        // Si collision, on annule
        if (this.hasCollision()) {
            this.currentPiece.x--;
        }
    }

    // Vérifie s'il y a une collision
    hasCollision() {
        const piece = this.currentPiece;
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    const newX = piece.x + col;
                    const newY = piece.y + row;
                    
                    // Vérifie si on sort des limites ou si on touche une autre pièce
                    if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
                    if (newY >= 0 && this.grid[newY][newX]) return true;
                }
            }
        }
        return false;
    }

    // Fixe la pièce dans la grille
    lockPiece() {
        const piece = this.currentPiece;
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    const newY = piece.y + row;
                    const newX = piece.x + col;
                    if (newY >= 0) {
                        // Ajoute la couleur de la pièce dans la grille
                        this.grid[newY][newX] = piece.color;
                    }
                }
            }
        }
        // Vérifie si des lignes sont complètes
        this.clearLines();
    }

    // Supprime les lignes complètes et calcule le score
    clearLines() {
        let linesCleared = 0;
        let linesToClear = [];
    
        // Trouve toutes les lignes complètes
        for (let row = ROWS - 1; row >= 0; row--) {
            if (this.grid[row].every(cell => cell !== 0)) {
                linesToClear.push(row);
                linesCleared++;
            }
        }
    
        // Si des lignes sont complètes
        if (linesCleared > 0) {
            // Calcule les points selon le nombre de lignes
            const scoreMultiplier = {
                1: 100,    // 1 ligne = 100 points
                2: 300,    // 2 lignes = 300 points
                3: 500,    // 3 lignes = 500 points
                4: 800     // 4 lignes = 800 points
            };
            this.score += scoreMultiplier[linesCleared] || linesCleared * 100;
            scoreElement.textContent = `Score: ${this.score}`;
            
            // Met à jour le niveau
            this.updateLevel();
    
            // Trie les lignes à supprimer de bas en haut
            linesToClear.sort((a, b) => b - a);
    
            // Crée une nouvelle grille sans les lignes complètes
            const newGrid = [];
            
            // Ajoute des lignes vides en haut
            for (let i = 0; i < linesCleared; i++) {
                newGrid.push(Array(COLS).fill(0));
            }
            
            // Copie les lignes non complètes
            for (let row = 0; row < ROWS; row++) {
                if (!linesToClear.includes(row)) {
                    newGrid.push([...this.grid[row]]);
                }
            }
            
            // Remplace l'ancienne grille par la nouvelle
            this.grid = newGrid.slice(0, ROWS);
        }
    
        return linesCleared;
    }

    // Fait tourner la pièce
    rotate() {
        const rotated = [];
        // Création de la nouvelle forme tournée
        for(let i = 0; i < this.currentPiece.shape[0].length; i++) {
            const row = [];
            for(let j = this.currentPiece.shape.length - 1; j >= 0; j--) {
                row.push(this.currentPiece.shape[j][i]);
            }
            rotated.push(row);
        }
        
        // Sauvegarde de l'ancienne forme
        const originalShape = this.currentPiece.shape;
        // Essaie la rotation
        this.currentPiece.shape = rotated;
        
        // Si collision, annule la rotation
        if (this.hasCollision()) {
            this.currentPiece.shape = originalShape;
        }
    }

    // Gère la fin de partie
    handleGameOver() {
        this.gameOver = true;
        // Arrête la musique si elle joue
        if (isMusicPlaying) {
            audio.pause();
            isMusicPlaying = false;
            musicToggle.textContent = '🔈 Musique';
        }
    }
}

// ==================== CONTRÔLES DU JEU ====================
// Crée une nouvelle partie
const game = new Tetris();

// Gère les touches du clavier
document.addEventListener('keydown', (event) => {
    // Si game over, ignore les touches
    if (game.gameOver) return;

    // Réagit selon la touche pressée
    switch (event.key) {
        case 'ArrowLeft':  // Flèche gauche
            game.moveLeft();
            break;
        case 'ArrowRight': // Flèche droite
            game.moveRight();
            break;
        case 'ArrowDown':  // Flèche bas
            game.moveDown();
            break;
        case 'ArrowUp':    // Flèche haut
            game.rotate();
            break;
    }
    // Redessine le jeu après chaque action
    game.draw();
});
// Variable qui va stocker le moment de la dernière mise à jour du jeu
// On commence à 0 car aucune mise à jour n'a encore eu lieu
let lastTime = 0;

// Fonction principale qui fait tourner le jeu
// currentTime est fourni automatiquement par requestAnimationFrame
// et représente le temps actuel en millisecondes
function gameLoop(currentTime) {
    // Si c'est la première fois que la fonction est appelée (lastTime est 0)
    // on initialise lastTime avec le temps actuel
    // Cela évite une première descente trop rapide de la pièce
    if (!lastTime) {
        lastTime = currentTime;
    }

    // Calcule le temps écoulé depuis la dernière mise à jour
    // Par exemple, si currentTime = 1000 et lastTime = 800
    // deltaTime sera 200 (millisecondes)
    const deltaTime = currentTime - lastTime;

    // Si le jeu n'est pas terminé (pas de game over)
    if (!game.gameOver) {
        // Si le temps écoulé est plus grand que la vitesse du jeu
        // Par exemple, si speed = 1000, on attend 1 seconde avant de bouger
        if (deltaTime > game.speed) {
            // Fait descendre la pièce d'une case
            game.moveDown();
            // Redessine tout le jeu (la grille, la pièce, le score...)
            game.draw();
            // Met à jour le temps de la dernière action
            lastTime = currentTime;
        }
        // Demande au navigateur de rappeler cette fonction
        // pour la prochaine image (environ 60 fois par seconde)
        requestAnimationFrame(gameLoop);
    } else {
        // Si le jeu est terminé...
        
        // Crée un fond semi-transparent noir pour assombrir le jeu
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        // Dessine un rectangle qui couvre tout l'écran
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Configure le texte en blanc
        ctx.fillStyle = 'white';
        // Configure la police en gros (30 pixels) pour "Game Over!"
        ctx.font = '30px Arial';
        // Centre le texte horizontalement
        ctx.textAlign = 'center';
        // Écrit "Game Over!" au centre de l'écran
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        
        // Réduit la taille de la police pour le score et le niveau
        ctx.font = '20px Arial';
        // Écrit le score final juste en dessous
        ctx.fillText(`Score Final: ${game.score}`, canvas.width / 2, canvas.height / 2 + 40);
        // Écrit le niveau atteint encore plus bas
        ctx.fillText(`Niveau Atteint: ${game.level}`, canvas.width / 2, canvas.height / 2 + 70);
        
        // Appelle la fonction qui gère la fin du jeu
        // (par exemple pour arrêter la musique)
        game.handleGameOver();
    }
}

// Démarre le jeu en demandant au navigateur d'appeler gameLoop
// C'est comme appuyer sur le bouton "Start"
requestAnimationFrame(gameLoop);