
// Initialize variables
let loadingProgress = 0;
const loadingBar = document.getElementById('loading-bar');
const loadingText = document.getElementById('loading-text');
const loadingMessage = document.getElementById('loading-message');
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const gameModal = document.getElementById('game-modal');
const gameContainer = document.getElementById('game-container');
const modalTitle = document.getElementById('modal-title');
const closeModal = document.getElementById('close-modal');

// Update loading messages
function updateLoadingMessage() {
    const messages = [
        "Loading game assets...",
        "Optimizing performance...",
        "Connecting to servers...",
        "Preparing arena...",
        "Almost ready..."
    ];
    
    const messageIndex = Math.floor(loadingProgress / 20);
    if (messageIndex < messages.length) {
        loadingMessage.textContent = messages[messageIndex];
    }
}

// Simulate loading process
function simulateLoading() {
    const interval = setInterval(() => {
        loadingProgress += 1;
        loadingBar.style.width = `${loadingProgress}%`;
        loadingText.textContent = `${loadingProgress}%`;
        
        updateLoadingMessage();
        
        if (loadingProgress >= 100) {
            clearInterval(interval);
            
            // Hide loading screen and show main content
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.8,
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                    mainContent.classList.remove('hidden');
                    
                    // Animate nav
                    gsap.from('nav', {
                        duration: 0.8,
                        y: -50,
                        opacity: 0,
                        ease: 'power3.out'
                    });

                    // Animate game cards
                    document.querySelectorAll('.game-card').forEach((card, index) => {
                        gsap.fromTo(card, 
                            { y: 30, opacity: 0 }, 
                            { y: 0, opacity: 1, delay: 0.6 + index * 0.1, duration: 0.8, ease: 'power2.out' }
                        );
                    });
                }
            });
        }
    }, 30);
}

// Open game modal
function openGameModal(gameType) {
    modalTitle.textContent = getGameTitle(gameType);
    gameContainer.innerHTML = getGameHTML(gameType);
    gameModal.classList.remove('hidden');
    
    // Initialize the game
    setTimeout(() => {
        initGame(gameType);
    }, 100);
}

// Close game modal
function closeGameModal() {
    gameModal.classList.add('hidden');
    gameContainer.innerHTML = '';
}

// Get game title based on type
function getGameTitle(gameType) {
    const titles = {
        'memory': 'Memory Match',
        'snake': 'Snake Classic',
        'tictactoe': 'Tic Tac Toe',
        'numberguess': 'Number Guesser',
        'reaction': 'Reaction Tester',
        'colormatch': 'Color Match',
        'wordscramble': 'Word Scramble',
        'mathchallenge': 'Math Challenge',
        'memorycards': 'Memory Cards',
        'rps': 'Rock Paper Scissors'
    };
    return titles[gameType] || 'Game Arena';
}

// Get game HTML based on type
function getGameHTML(gameType) {
    const games = {
        'memory': `
            <div class="text-center">
                <h4 class="text-lg mb-4">Find matching pairs of cards</h4>
                <div id="memory-board" class="grid grid-cols-4 gap-2 mb-4"></div>
                <div class="flex justify-between items-center mb-4">
                    <span id="memory-score">Moves: 0</span>
                    <button id="memory-restart" class="px-3 py-1 bg-green-600 rounded">Restart</button>
                </div>
            </div>
        `,
        'snake': `
            <div class="text-center">
                <h4 class="text-lg mb-4">Use arrow keys to control the snake</h4>
                <canvas id="snake-canvas" width="300" height="300" class="border border-gray-600 mx-auto mb-4"></canvas>
                <div class="flex justify-between items-center mb-4">
                    <span id="snake-score">Score: 0</span>
                    <button id="snake-restart" class="px-3 py-1 bg-green-600 rounded">Restart</button>
                </div>
            </div>
        `,
        'tictactoe': `
            <div class="text-center">
                <h4 class="text-lg mb-4">Play against the computer</h4>
                <div id="tictactoe-board" class="grid grid-cols-3 gap-2 w-64 mx-auto mb-4"></div>
                <div id="tictactoe-status" class="mb-4">Your turn (X)</div>
                <button id="tictactoe-restart" class="px-3 py-1 bg-green-600 rounded">Restart</button>
            </div>
        `,
        'numberguess': `
            <div class="text-center">
                <h4 class="text-lg mb-4">Guess the number between 1-100</h4>
                <input type="number" id="numberguess-input" min="1" max="100" class="bg-gray-700 text-white p-2 rounded mb-4 w-32 text-center">
                <button id="numberguess-submit" class="block mx-auto px-3 py-1 bg-green-600 rounded mb-4">Guess</button>
                <div id="numberguess-feedback" class="mb-4">Enter your guess above</div>
                <div id="numberguess-attempts">Attempts: 0</div>
            </div>
        `,
        'reaction': `
            <div class="text-center">
                <h4 class="text-lg mb-4">Click when the box turns green</h4>
                <div id="reaction-box" class="w-40 h-40 bg-red-600 mx-auto mb-4 cursor-pointer flex items-center justify-center">Wait...</div>
                <div id="reaction-time" class="mb-4">Your time: 0ms</div>
                <div id="reaction-best" class="mb-4">Best time: 0ms</div>
                <button id="reaction-start" class="px-3 py-1 bg-green-600 rounded">Start Test</button>
            </div>
        `,
        'colormatch': `
            <div class="text-center">
                <h4 class="text-lg mb-4">Match the color with the name</h4>
                <div id="colormatch-color" class="w-32 h-32 mx-auto mb-4 rounded-full"></div>
                <div id="colormatch-options" class="grid grid-cols-2 gap-2 mb-4 w-64 mx-auto"></div>
                <div id="colormatch-score" class="mb-4">Score: 0</div>
            </div>
        `,
        'wordscramble': `
            <div class="text-center">
                <h4 class="text-lg mb-4">Unscramble the word</h4>
                <div id="wordscramble-word" class="text-2xl font-bold mb-4">Loading...</div>
                <input type="text" id="wordscramble-input" class="bg-gray-700 text-white p-2 rounded mb-4 w-64 text-center">
                <button id="wordscramble-submit" class="block mx-auto px-3 py-1 bg-green-600 rounded mb-4">Submit</button>
                <div id="wordscramble-hint" class="mb-2 text-sm text-gray-400"></div>
                <div id="wordscramble-score" class="mb-4">Score: 0</div>
            </div>
        `,
        'mathchallenge': `
            <div class="text-center">
                <h4 class="text-lg mb-4">Solve the math problem</h4>
                <div id="mathchallenge-problem" class="text-2xl font-bold mb-4">5 + 3 = ?</div>
                <input type="number" id="mathchallenge-input" class="bg-gray-700 text-white p-2 rounded mb-4 w-32 text-center">
                <button id="mathchallenge-submit" class="block mx-auto px-3 py-1 bg-green-600 rounded mb-4">Submit</button>
                <div id="mathchallenge-timer" class="mb-2">Time: 30s</div>
                <div id="mathchallenge-score" class="mb-4">Score: 0</div>
            </div>
        `,
        'memorycards': `
            <div class="text-center">
                <h4 class="text-lg mb-4">Remember the sequence of cards</h4>
                <div id="memorycards-board" class="grid grid-cols-4 gap-2 w-64 mx-auto mb-4"></div>
                <div id="memorycards-level" class="mb-2">Level: 1</div>
                <div id="memorycards-status" class="mb-4">Watch carefully...</div>
                <button id="memorycards-start" class="px-3 py-1 bg-green-600 rounded">Start Game</button>
            </div>
        `,
        'rps': `
            <div class="text-center">
                <h4 class="text-lg mb-4">Choose your weapon</h4>
                <div class="flex justify-center space-x-4 mb-6">
                    <button class="rps-choice p-4 bg-gray-700 rounded-full" data-choice="rock">✊</button>
                    <button class="rps-choice p-4 bg-gray-700 rounded-full" data-choice="paper">✋</button>
                    <button class="rps-choice p-4 bg-gray-700 rounded-full" data-choice="scissors">✌️</button>
                </div>
                <div id="rps-result" class="text-xl font-bold mb-4">Make your choice!</div>
                <div class="flex justify-center space-x-8 mb-4">
                    <div>
                        <div>You</div>
                        <div id="rps-player-choice" class="text-4xl">-</div>
                    </div>
                    <div>
                        <div>Computer</div>
                        <div id="rps-computer-choice" class="text-4xl">-</div>
                    </div>
                </div>
                <div id="rps-score" class="mb-4">Wins: 0 | Losses: 0 | Ties: 0</div>
            </div>
        `
    };
    
    return games[gameType] || '<div class="text-center">Game not found</div>';
}

// Initialize game based on type
function initGame(gameType) {
    switch(gameType) {
        case 'memory':
            initMemoryGame();
            break;
        case 'snake':
            initSnakeGame();
            break;
        case 'tictactoe':
            initTicTacToeGame();
            break;
        case 'numberguess':
            initNumberGuessGame();
            break;
        case 'reaction':
            initReactionGame();
            break;
        case 'colormatch':
            initColorMatchGame();
            break;
        case 'wordscramble':
            initWordScrambleGame();
            break;
        case 'mathchallenge':
            initMathChallengeGame();
            break;
        case 'memorycards':
            initMemoryCardsGame();
            break;
        case 'rps':
            initRPSGame();
            break;
    }
}

// Memory Game
function initMemoryGame() {
    const board = document.getElementById('memory-board');
    const scoreElement = document.getElementById('memory-score');
    const restartButton = document.getElementById('memory-restart');
    
    let cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
    let flippedCards = [];
    let matchedCards = [];
    let moves = 0;
    
    // Shuffle cards
    cards.sort(() => Math.random() - 0.5);
    
    // Create board
    function createBoard() {
        board.innerHTML = '';
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'bg-blue-600 h-16 flex items-center justify-center cursor-pointer text-white font-bold text-xl';
            cardElement.textContent = '?';
            cardElement.dataset.index = index;
            cardElement.dataset.value = card;
            cardElement.addEventListener('click', flipCard);
            board.appendChild(cardElement);
        });
    }
    
    // Flip card
    function flipCard() {
        const index = parseInt(this.dataset.index);
        
        // Don't allow flipping matched or already flipped cards
        if (flippedCards.length === 2 || matchedCards.includes(index) || flippedCards.includes(index)) {
            return;
        }
        
        // Flip the card
        this.textContent = this.dataset.value;
        this.classList.remove('bg-blue-600');
        this.classList.add('bg-green-600');
        flippedCards.push(index);
        
        // Check for match if two cards are flipped
        if (flippedCards.length === 2) {
            moves++;
            scoreElement.textContent = `Moves: ${moves}`;
            
            const firstCard = board.children[flippedCards[0]];
            const secondCard = board.children[flippedCards[1]];
            
            if (firstCard.dataset.value === secondCard.dataset.value) {
                // Match found
                matchedCards.push(flippedCards[0], flippedCards[1]);
                flippedCards = [];
                
                // Check for win
                if (matchedCards.length === cards.length) {
                    setTimeout(() => {
                        alert(`You won in ${moves} moves!`);
                    }, 500);
                }
            } else {
                // No match, flip back
                setTimeout(() => {
                    firstCard.textContent = '?';
                    secondCard.textContent = '?';
                    firstCard.classList.remove('bg-green-600');
                    secondCard.classList.remove('bg-green-600');
                    firstCard.classList.add('bg-blue-600');
                    secondCard.classList.add('bg-blue-600');
                    flippedCards = [];
                }, 1000);
            }
        }
    }
    
    // Restart game
    function restartGame() {
        cards.sort(() => Math.random() - 0.5);
        flippedCards = [];
        matchedCards = [];
        moves = 0;
        scoreElement.textContent = 'Moves: 0';
        createBoard();
    }
    
    restartButton.addEventListener('click', restartGame);
    createBoard();
}

// Snake Game
function initSnakeGame() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('snake-score');
    const restartButton = document.getElementById('snake-restart');
    
    const gridSize = 15;
    const gridWidth = canvas.width / gridSize;
    const gridHeight = canvas.height / gridSize;
    
    let snake = [{x: 10, y: 10}];
    let food = {x: 5, y: 5};
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let gameInterval;
    
    // Draw game
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#1F2937';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        ctx.fillStyle = '#10B981';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
        
        // Draw food
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }
    
    // Update game state
    function update() {
        // Update direction
        direction = nextDirection;
        
        // Calculate new head position
        const head = {...snake[0]};
        switch(direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // Check for collision with walls
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
            gameOver();
            return;
        }
        
        // Check for collision with self
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }
        
        // Add new head
        snake.unshift(head);
        
        // Check for food collision
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score++;
            scoreElement.textContent = `Score: ${score}`;
            
            // Generate new food
            generateFood();
        } else {
            // Remove tail
            snake.pop();
        }
        
        // Draw updated game
        draw();
    }
    
    // Generate food at random position
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
        
        // Make sure food doesn't spawn on snake
        if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            generateFood();
        }
    }
    
    // Game over
    function gameOver() {
        clearInterval(gameInterval);
        alert(`Game over! Your score: ${score}`);
    }
    
    // Restart game
    function restartGame() {
        clearInterval(gameInterval);
        snake = [{x: 10, y: 10}];
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        scoreElement.textContent = 'Score: 0';
        generateFood();
        draw();
        gameInterval = setInterval(update, 150);
    }
    
    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    });
    
    restartButton.addEventListener('click', restartGame);
    restartGame();
}

// Tic Tac Toe Game
function initTicTacToeGame() {
    const board = document.getElementById('tictactoe-board');
    const statusElement = document.getElementById('tictactoe-status');
    const restartButton = document.getElementById('tictactoe-restart');
    
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    // Create board
    function createBoard() {
        board.innerHTML = '';
        gameBoard.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'bg-gray-700 h-16 flex items-center justify-center cursor-pointer text-white font-bold text-2xl';
            cellElement.dataset.index = index;
            cellElement.addEventListener('click', handleCellClick);
            board.appendChild(cellElement);
        });
    }
    
    // Handle cell click
    function handleCellClick() {
        const index = parseInt(this.dataset.index);
        
        if (gameBoard[index] !== '' || !gameActive || currentPlayer !== 'X') {
            return;
        }
        
        // Update board
        gameBoard[index] = currentPlayer;
        this.textContent = currentPlayer;
        
        // Check for win or draw
        if (checkWin()) {
            statusElement.textContent = 'You win!';
            gameActive = false;
            return;
        }
        
        if (checkDraw()) {
            statusElement.textContent = 'Draw!';
            gameActive = false;
            return;
        }
        
        // Switch to computer player
        currentPlayer = 'O';
        statusElement.textContent = "Computer's turn (O)";
        
        // Computer move (simple AI)
        setTimeout(makeComputerMove, 500);
    }
    
    // Computer move
    function makeComputerMove() {
        if (!gameActive) return;
        
        // Find available moves
        const availableMoves = gameBoard.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        
        if (availableMoves.length === 0) return;
        
        // Random move
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const move = availableMoves[randomIndex];
        
        // Update board
        gameBoard[move] = 'O';
        board.children[move].textContent = 'O';
        
        // Check for win or draw
        if (checkWin()) {
            statusElement.textContent = 'Computer wins!';
            gameActive = false;
            return;
        }
        
        if (checkDraw()) {
            statusElement.textContent = 'Draw!';
            gameActive = false;
            return;
        }
        
        // Switch back to player
        currentPlayer = 'X';
        statusElement.textContent = 'Your turn (X)';
    }
    
    // Check for win
    function checkWin() {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                return true;
            }
        }
        return false;
    }
    
    // Check for draw
    function checkDraw() {
        return !gameBoard.includes('');
    }
    
    // Restart game
    function restartGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        statusElement.textContent = 'Your turn (X)';
        createBoard();
    }
    
    restartButton.addEventListener('click', restartGame);
    createBoard();
}

// Number Guess Game
function initNumberGuessGame() {
    const input = document.getElementById('numberguess-input');
    const submitButton = document.getElementById('numberguess-submit');
    const feedbackElement = document.getElementById('numberguess-feedback');
    const attemptsElement = document.getElementById('numberguess-attempts');
    
    let targetNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    
    // Handle guess submission
    function handleGuess() {
        const guess = parseInt(input.value);
        
        if (isNaN(guess) || guess < 1 || guess > 100) {
            feedbackElement.textContent = 'Please enter a valid number between 1-100';
            return;
        }
        
        attempts++;
        attemptsElement.textContent = `Attempts: ${attempts}`;
        
        if (guess === targetNumber) {
            feedbackElement.textContent = `Congratulations! You guessed the number in ${attempts} attempts.`;
            submitButton.disabled = true;
        } else if (guess < targetNumber) {
            feedbackElement.textContent = 'Too low! Try again.';
        } else {
            feedbackElement.textContent = 'Too high! Try again.';
        }
        
        input.value = '';
        input.focus();
    }
    
    submitButton.addEventListener('click', handleGuess);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });
}

// Reaction Tester Game
function initReactionGame() {
    const box = document.getElementById('reaction-box');
    const timeElement = document.getElementById('reaction-time');
    const bestElement = document.getElementById('reaction-best');
    const startButton = document.getElementById('reaction-start');
    
    let startTime;
    let timeoutId;
    let bestTime = 0;
    
    // Start test
    function startTest() {
        box.textContent = 'Wait...';
        box.style.backgroundColor = '#DC2626'; // Red
        startButton.disabled = true;
        
        // Random delay between 1-5 seconds
        const delay = Math.random() * 4000 + 1000;
        
        timeoutId = setTimeout(() => {
            box.textContent = 'CLICK NOW!';
            box.style.backgroundColor = '#10B981'; // Green
            startTime = Date.now();
        }, delay);
    }
    
    // Handle box click
    function handleBoxClick() {
        if (box.style.backgroundColor !== 'rgb(16, 185, 129)') { // Not green
            // Clicked too early
            clearTimeout(timeoutId);
            box.textContent = 'Too early!';
            box.style.backgroundColor = '#F59E0B'; // Amber
            startButton.disabled = false;
            return;
        }
        
        const reactionTime = Date.now() - startTime;
        timeElement.textContent = `Your time: ${reactionTime}ms`;
        
        // Update best time
        if (bestTime === 0 || reactionTime < bestTime) {
            bestTime = reactionTime;
            bestElement.textContent = `Best time: ${bestTime}ms`;
        }
        
        box.textContent = 'Wait...';
        box.style.backgroundColor = '#DC2626'; // Red
        startButton.disabled = false;
    }
    
    startButton.addEventListener('click', startTest);
    box.addEventListener('click', handleBoxClick);
}

// Color Match Game
function initColorMatchGame() {
    const colorElement = document.getElementById('colormatch-color');
    const optionsElement = document.getElementById('colormatch-options');
    const scoreElement = document.getElementById('colormatch-score');
    
    const colors = [
        { name: 'Red', value: '#EF4444' },
        { name: 'Blue', value: '#3B82F6' },
        { name: 'Green', value: '#10B981' },
        { name: 'Yellow', value: '#F59E0B' },
        { name: 'Purple', value: '#8B5CF6' },
        { name: 'Pink', value: '#EC4899' },
        { name: 'Orange', value: '#F97316' },
        { name: 'Cyan', value: '#06B6D4' }
    ];
    
    let score = 0;
    let currentColor;
    
    // Start new round
    function newRound() {
        // Select a random color
        const randomIndex = Math.floor(Math.random() * colors.length);
        currentColor = colors[randomIndex];
        
        // Display the color
        colorElement.style.backgroundColor = currentColor.value;
        
        // Generate options (one correct, three random)
        const options = [currentColor.name];
        while (options.length < 4) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            if (!options.includes(randomColor.name)) {
                options.push(randomColor.name);
            }
        }
        
        // Shuffle options
        options.sort(() => Math.random() - 0.5);
        
        // Display options
        optionsElement.innerHTML = '';
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'p-2 bg-gray-700 rounded text-white';
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(option));
            optionsElement.appendChild(button);
        });
    }
    
    // Check answer
    function checkAnswer(selected) {
        if (selected === currentColor.name) {
            // Correct
            score++;
            scoreElement.textContent = `Score: ${score}`;
            newRound();
        } else {
            // Incorrect
            alert(`Wrong! The color was ${currentColor.name}. Your score: ${score}`);
            score = 0;
            scoreElement.textContent = `Score: 0`;
            newRound();
        }
    }
    
    newRound();
}

// Word Scramble Game
function initWordScrambleGame() {
    const wordElement = document.getElementById('wordscramble-word');
    const inputElement = document.getElementById('wordscramble-input');
    const submitButton = document.getElementById('wordscramble-submit');
    const hintElement = document.getElementById('wordscramble-hint');
    const scoreElement = document.getElementById('wordscramble-score');
    
    const words = [
        { word: 'javascript', hint: 'A programming language' },
        { word: 'computer', hint: 'An electronic device' },
        { word: 'keyboard', hint: 'Input device with keys' },
        { word: 'algorithm', hint: 'Step-by-step procedure' },
        { word: 'function', hint: 'Block of reusable code' },
        { word: 'variable', hint: 'Stores a value' },
        { word: 'database', hint: 'Organized collection of data' },
        { word: 'network', hint: 'Connected computers' },
        { word: 'security', hint: 'Protection against threats' },
        { word: 'developer', hint: 'Person who creates software' }
    ];
    
    let score = 0;
    let currentWord;
    let scrambledWord;
    
    // Start new round
    function newRound() {
        // Select a random word
        const randomIndex = Math.floor(Math.random() * words.length);
        currentWord = words[randomIndex];
        
        // Scramble the word
        scrambledWord = currentWord.word.split('').sort(() => Math.random() - 0.5).join('');
        
        // Display scrambled word
        wordElement.textContent = scrambledWord;
        
        // Display hint
        hintElement.textContent = `Hint: ${currentWord.hint}`;
        
        // Clear input
        inputElement.value = '';
        inputElement.focus();
    }
    
    // Check answer
    function checkAnswer() {
        const guess = inputElement.value.trim().toLowerCase();
        
        if (guess === currentWord.word) {
            // Correct
            score++;
            scoreElement.textContent = `Score: ${score}`;
            newRound();
        } else {
            // Incorrect
            alert(`Wrong! The word was "${currentWord.word}".`);
            inputElement.focus();
        }
    }
    
    submitButton.addEventListener('click', checkAnswer);
    inputElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    
    newRound();
}

// Math Challenge Game
function initMathChallengeGame() {
    const problemElement = document.getElementById('mathchallenge-problem');
    const inputElement = document.getElementById('mathchallenge-input');
    const submitButton = document.getElementById('mathchallenge-submit');
    const timerElement = document.getElementById('mathchallenge-timer');
    const scoreElement = document.getElementById('mathchallenge-score');
    
    let score = 0;
    let timeLeft = 30;
    let timerId;
    let correctAnswer;
    
    // Generate math problem
    function generateProblem() {
        const operations = ['+', '-', '*'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2;
        
        switch(operation) {
            case '+':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                correctAnswer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 100) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
                correctAnswer = num1 - num2;
                break;
            case '*':
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                correctAnswer = num1 * num2;
                break;
        }
        
        problemElement.textContent = `${num1} ${operation} ${num2} = ?`;
        inputElement.value = '';
        inputElement.focus();
    }
    
    // Check answer
    function checkAnswer() {
        const answer = parseInt(inputElement.value);
        
        if (answer === correctAnswer) {
            // Correct
            score++;
            scoreElement.textContent = `Score: ${score}`;
            generateProblem();
        } else {
            // Incorrect
            alert(`Wrong! The answer was ${correctAnswer}.`);
            inputElement.focus();
        }
    }
    
    // Start timer
    function startTimer() {
        timeLeft = 30;
        timerElement.textContent = `Time: ${timeLeft}s`;
        
        clearInterval(timerId);
        timerId = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Time: ${timeLeft}s`;
            
            if (timeLeft <= 0) {
                clearInterval(timerId);
                alert(`Time's up! Your score: ${score}`);
                score = 0;
                scoreElement.textContent = `Score: 0`;
                generateProblem();
                startTimer();
            }
        }, 1000);
    }
    
    submitButton.addEventListener('click', checkAnswer);
    inputElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    
    generateProblem();
    startTimer();
}

// Memory Cards Game
function initMemoryCardsGame() {
    const board = document.getElementById('memorycards-board');
    const levelElement = document.getElementById('memorycards-level');
    const statusElement = document.getElementById('memorycards-status');
    const startButton = document.getElementById('memorycards-start');
    
    let level = 1;
    let sequence = [];
    let playerSequence = [];
    let isShowingSequence = false;
    
    // Start game
    function startGame() {
        level = 1;
        sequence = [];
        startButton.disabled = true;
        nextLevel();
    }
    
    // Next level
    function nextLevel() {
        levelElement.textContent = `Level: ${level}`;
        statusElement.textContent = 'Watch carefully...';
        
        // Add one more to sequence
        sequence.push(Math.floor(Math.random() * 16));
        
        // Show sequence
        isShowingSequence = true;
        showSequence(0);
    }
    
    // Show sequence
    function showSequence(index) {
        if (index >= sequence.length) {
            isShowingSequence = false;
            statusElement.textContent = 'Your turn! Repeat the sequence.';
            playerSequence = [];
            return;
        }
        
        const cardIndex = sequence[index];
        const card = board.children[cardIndex];
        
        // Highlight card
        card.classList.add('bg-green-500');
        
        setTimeout(() => {
            card.classList.remove('bg-green-500');
            
            setTimeout(() => {
                showSequence(index + 1);
            }, 200);
        }, 500);
    }
    
    // Handle card click
    function handleCardClick() {
        if (isShowingSequence) return;
        
        const cardIndex = parseInt(this.dataset.index);
        playerSequence.push(cardIndex);
        
        // Highlight clicked card
        this.classList.add('bg-blue-500');
        setTimeout(() => {
            this.classList.remove('bg-blue-500');
        }, 300);
        
        // Check if sequence is correct
        for (let i = 0; i < playerSequence.length; i++) {
            if (playerSequence[i] !== sequence[i]) {
                // Wrong sequence
                gameOver();
                return;
            }
        }
        
        // If sequence complete, go to next level
        if (playerSequence.length === sequence.length) {
            level++;
            setTimeout(nextLevel, 1000);
        }
    }
    
    // Game over
    function gameOver() {
        alert(`Game over! You reached level ${level}.`);
        startButton.disabled = false;
        statusElement.textContent = 'Click Start to play again';
    }
    
    // Create board
    function createBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const card = document.createElement('div');
            card.className = 'bg-gray-700 h-12 flex items-center justify-center cursor-pointer';
            card.dataset.index = i;
            card.addEventListener('click', handleCardClick);
            board.appendChild(card);
        }
    }
    
    startButton.addEventListener('click', startGame);
    createBoard();
}

// Rock Paper Scissors Game
function initRPSGame() {
    const choices = document.querySelectorAll('.rps-choice');
    const resultElement = document.getElementById('rps-result');
    const playerChoiceElement = document.getElementById('rps-player-choice');
    const computerChoiceElement = document.getElementById('rps-computer-choice');
    const scoreElement = document.getElementById('rps-score');
    
    const choicesMap = {
        'rock': '✊',
        'paper': '✋',
        'scissors': '✌️'
    };
    
    let wins = 0;
    let losses = 0;
    let ties = 0;
    
    // Handle player choice
    function handleChoice() {
        const playerChoice = this.dataset.choice;
        const computerChoice = getComputerChoice();
        
        playerChoiceElement.textContent = choicesMap[playerChoice];
        computerChoiceElement.textContent = choicesMap[computerChoice];
        
        const result = getResult(playerChoice, computerChoice);
        
        if (result === 'win') {
            resultElement.textContent = 'You win!';
            wins++;
        } else if (result === 'lose') {
            resultElement.textContent = 'You lose!';
            losses++;
        } else {
            resultElement.textContent = 'It\'s a tie!';
            ties++;
        }
        
        scoreElement.textContent = `Wins: ${wins} | Losses: ${losses} | Ties: ${ties}`;
    }
    
    // Get computer choice
    function getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * choices.length);
        return choices[randomIndex];
    }
    
    // Get game result
    function getResult(player, computer) {
        if (player === computer) {
            return 'tie';
        }
        
        if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            return 'win';
        }
        
        return 'lose';
    }
    
    choices.forEach(choice => {
        choice.addEventListener('click', handleChoice);
    });
}

// Handle page animations
document.addEventListener('DOMContentLoaded', function() {
    simulateLoading();
    
    // Close modal when clicking close button
    closeModal.addEventListener('click', closeGameModal);
    
    // Close modal when clicking outside
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            closeGameModal();
        }
    });
    
    const nav = document.querySelector('nav');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (lastScrollY < window.scrollY && window.scrollY > 100) {
            nav.classList.add('nav-hidden');
        } else {
            nav.classList.remove('nav-hidden');
        }
        lastScrollY = window.scrollY;
    });
});

// Add CSS for nav hide animation
const style = document.createElement('style');
style.textContent = `
    nav {
        transition: transform 0.3s ease;
    }
    
    .nav-hidden {
        transform: translateY(-100%);
    }
`;
document.head.appendChild(style);
