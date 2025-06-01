const foodSound = new Audio('Images/food.mp3');
const gameOverSound = new Audio('Images/gameover.mp3');
const moveSound = new Audio('Images/move.mp3');
const backgroundMusic = new Audio('Images/music.mp3');
backgroundMusic.loop = true; 

foodSound.volume = 0.2;        
gameOverSound.volume = 0.2;     
moveSound.volume = 0.2;       
backgroundMusic.volume = 0.1;

const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highscoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const startMessage = document.querySelector(".start-message");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highscoreElement.innerText = `High Score: ${highScore}`;

let isGameStarted = false;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    gameOverSound.play();  
    backgroundMusic.pause(); 
    alert("Game Over! Press OK to replay...");
    location.reload();
}

const changeDirection = (e) => {
    let previousVelocityX = velocityX;
    let previousVelocityY = velocityY;

    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0; 
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0; 
    }

    if ((velocityX !== previousVelocityX) || (velocityY !== previousVelocityY)) {
        moveSound.currentTime = 0; 
        moveSound.play();
    }
}

controls.forEach(key => {
    key.addEventListener("click", () => {
        if (!isGameStarted) {
            startGame();
        }
        changeDirection({ key: key.dataset.key });
    });
});


const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if(snakeX === foodX && snakeY === foodY) {
        foodSound.play();  
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Current Score: ${score}`;
        highscoreElement.innerText = `High Score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    snakeX += velocityX;
    snakeY += velocityY;

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
}

const startGame = () => {
    if (!isGameStarted) {
        isGameStarted = true;
        startMessage.style.display = "none";
        backgroundMusic.play();  
        setIntervalId = setInterval(initGame, 150);
    }
}

document.addEventListener("keydown", (e) => {
    if (!isGameStarted) {
        startGame();
    }
    changeDirection(e);
});

changeFoodPosition();