const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let food = {};
let direction = 'right';
let score = 0;
let gameInterval;
let gameSpeed = 100;
let isGameRunning = false;

// 初始化遊戲
function initGame() {
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    score = 0;
    scoreElement.textContent = score;
    direction = 'right';
    generateFood();
}

// 生成食物
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // 確保食物不會生成在蛇身上
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            break;
        }
    }
}

// 繪製遊戲元素
function draw() {
    // 清空畫布
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 繪製蛇
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, index) => {
        if (index === 0) {
            // 蛇頭
            ctx.fillStyle = '#45a049';
        } else {
            ctx.fillStyle = '#4CAF50';
        }
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
    
    // 繪製食物
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// 移動蛇
function moveSnake() {
    const head = { ...snake[0] };
    
    switch(direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    
    // 檢查碰撞
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    
    // 檢查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        // 加快遊戲速度
        if (gameSpeed > 50) {
            gameSpeed -= 2;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    } else {
        snake.pop();
    }
}

// 檢查碰撞
function checkCollision(head) {
    // 檢查牆壁碰撞
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // 檢查自身碰撞
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            return true;
        }
    }
    
    return false;
}

// 遊戲結束
function gameOver() {
    clearInterval(gameInterval);
    isGameRunning = false;
    startBtn.textContent = '重新開始';
    alert(`遊戲結束！您的分數是：${score}`);
}

// 遊戲主循環
function gameLoop() {
    moveSnake();
    draw();
}

// 開始遊戲
function startGame() {
    if (isGameRunning) {
        clearInterval(gameInterval);
        isGameRunning = false;
        startBtn.textContent = '開始遊戲';
    } else {
        initGame();
        isGameRunning = true;
        startBtn.textContent = '暫停';
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
}

// 觸控按鈕支援
function setDirection(dir) {
    if (!isGameRunning) return;
    if (dir === 'up' && direction !== 'down') direction = 'up';
    if (dir === 'down' && direction !== 'up') direction = 'down';
    if (dir === 'left' && direction !== 'right') direction = 'left';
    if (dir === 'right' && direction !== 'left') direction = 'right';
}

document.getElementById('btn-up')?.addEventListener('touchstart', e => { e.preventDefault(); setDirection('up'); });
document.getElementById('btn-down')?.addEventListener('touchstart', e => { e.preventDefault(); setDirection('down'); });
document.getElementById('btn-left')?.addEventListener('touchstart', e => { e.preventDefault(); setDirection('left'); });
document.getElementById('btn-right')?.addEventListener('touchstart', e => { e.preventDefault(); setDirection('right'); });

// 讓觸控按鈕在手機上顯示
function showTouchControlsIfMobile() {
    if (window.innerWidth <= 600) {
        document.querySelector('.touch-controls').style.display = 'flex';
    }
}
window.addEventListener('load', showTouchControlsIfMobile);
window.addEventListener('resize', showTouchControlsIfMobile);

// 鍵盤控制
document.addEventListener('keydown', (event) => {
    if (!isGameRunning) return;
    
    switch(event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

startBtn.addEventListener('click', startGame); 
