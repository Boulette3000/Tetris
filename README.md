# Jeu Tetris en JavaScript

Ce projet est une implémentation classique du jeu Tetris réalisée en JavaScript vanilla. Le jeu comprend toutes les fonctionnalités classiques de Tetris, avec un système de score, de niveaux et une bande sonore.

## 📁 Structure du Projet

Le projet se compose de trois fichiers principaux :

- `index.html` : La page principale qui contient la structure du jeu
- `styles.css` : Les styles CSS pour l'interface du jeu
- `script.js` : La logique du jeu en JavaScript
- `Tetris.mp3` : La musique du jeu

### Détail des fichiers

#### index.html
Contient la structure de base du jeu, notamment :
- Le canvas pour le rendu du jeu
- Les affichages du score et du niveau
- Les boutons de contrôle (musique, rejouer)
- Les liens vers les fichiers CSS et JavaScript

#### styles.css
Gère l'apparence visuelle du jeu :
- Mise en page responsive
- Style des boutons et des éléments d'interface
- Positionnement des éléments

#### script.js
Contient toute la logique du jeu :
- Configuration et initialisation du jeu
- Gestion des pièces de Tetris
- Contrôles du joueur
- Système de score et de niveau
- Gestion de la musique
- Détection des collisions
- Boucle de jeu principale

### 🎮 Lancement du jeu

- Double-cliquez simplement sur le fichier `index.html`
- Votre navigateur par défaut ouvrira le jeu

### Contrôles du jeu

- **←** : Déplacer la pièce à gauche
- **→** : Déplacer la pièce à droite
- **↑** : Faire pivoter la pièce
- **↓** : Accélérer la descente de la pièce
- **Bouton Musique** : Activer/Désactiver la musique
- **Bouton Rejouer** : Recommencer une partie

## 🎯 Fonctionnalités

- Interface graphique complète
- Système de score progressif
- Augmentation de la difficulté avec les niveaux
- Musique de fond typique Tetris
- Affichage du score et du niveau en temps réel
- Écran de Game Over avec score final
- Design responsive
- Contrôles intuitifs

## 🔧 Personnalisation

Pour modifier les paramètres du jeu, vous pouvez ajuster les constantes dans `script.js` :
- `ROWS` : Nombre de lignes (20 par défaut)
- `COLS` : Nombre de colonnes (10 par défaut)
- `BLOCK_SIZE` : Taille des blocs (30 pixels par défaut)
- `BASE_SPEED` : Vitesse initiale du jeu
- `SPEED_INCREMENT` : Augmentation de la vitesse par niveau

## 📝 Notes

- La musique ne démarre qu'après la première interaction utilisateur
- Le jeu est entièrement responsive et s'adapte à la taille de l'écran

4. Push sur la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
