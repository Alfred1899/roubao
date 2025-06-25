// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏配置
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let speed = 7;

// 加载猫咪头部图片
const catHead = new Image();
catHead.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjZmY2OWI0IiBkPSJNMjU2IDI0YzExOS4zIDAgMjE2IDk2LjcgMjE2IDIxNiAwIDExOS4zLTk2LjcgMjE2LTIxNiAyMTZTNDAgMzU5LjMgNDAgMjQwQzQwIDEyMC43IDEzNi43IDI0IDI1NiAyNHptMCA0OGMtOTMuOSAwLTE3MCA3Ni4xLTE3MCAxNzAgMCA5My45IDc2LjEgMTcwIDE3MCAxNzBzMTcwLTc2LjEgMTcwLTE3MGMwLTkzLjktNzYuMS0xNzAtMTcwLTE3MHptLTQyLjUgODhjMTYuNiAwIDMwIDE0LjQgMzAgMzJzLTEzLjQgMzItMzAgMzItMzAtMTQuNC0zMC0zMiAxMy40LTMyIDMwLTMyek0yOTguNSAxNjBjMTYuNiAwIDMwIDE0LjQgMzAgMzJzLTEzLjQgMzItMzAgMzItMzAtMTQuNC0zMC0zMiAxMy40LTMyIDMwLTMyem0tODQgMTEyaDEyNXYyNUgyMTQuNXYtMjV6Ii8+PC9zdmc+';

// 游戏状态
let snake = [];
let food = {};
let direction = 'right';
let newDirection = 'right';
let gameStarted = false;
let gameOver = false;
let score = 0;

// 初始化游戏
function initGame() {
    // 初始化蛇的位置
    snake = [
        { x: 3, y: 10 },
        { x: 2, y: 10 },
        { x: 1, y: 10 }
    ];
    
    // 初始化食物位置
    placeFood();
    
    // 重置分数
    score = 0;
    document.getElementById('score').textContent = score;
    
    // 重置状态
    direction = 'right';
    newDirection = 'right';
    gameOver = false;
}

// 放置食物
function placeFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // 确保食物不会出现在蛇身上
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            placeFood();
            break;
        }
    }
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.fillStyle = '#fff5f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制食物
    ctx.fillStyle = '#ff4da6';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize/2,
        food.y * gridSize + gridSize/2,
        gridSize/2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // 绘制小爱心在食物上
    ctx.fillStyle = '#ffffff';
    const heartSize = gridSize/4;
    drawHeart(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, heartSize);
    
    // 绘制蛇
    snake.forEach((segment, index) => {
        if (index === 0) {
            // 绘制猫咪头部
            ctx.drawImage(
                catHead,
                segment.x * gridSize,
                segment.y * gridSize,
                gridSize,
                gridSize
            );
        } else {
            // 绘制蛇身
            ctx.fillStyle = '#ff69b4';
            ctx.fillRect(
                segment.x * gridSize + 2,
                segment.y * gridSize + 2,
                gridSize - 4,
                gridSize - 4
            );
        }
    });
    
    // 游戏结束显示
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '40px Arial Rounded MT Bold';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束!', canvas.width/2, canvas.height/2);
        ctx.font = '20px Arial Rounded MT Bold';
        ctx.fillText('按空格键重新开始', canvas.width/2, canvas.height/2 + 40);
    }
}

// 绘制爱心函数
function drawHeart(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y - size/2);
    ctx.bezierCurveTo(
        x - size/2, y - size,
        x - size, y - size/4,
        x, y + size/2
    );
    ctx.bezierCurveTo(
        x + size, y - size/4,
        x + size/2, y - size,
        x, y - size/2
    );
    ctx.fill();
}

// 更新游戏状态
function update() {
    if (!gameStarted || gameOver) return;
    
    direction = newDirection;
    
    // 获取蛇头位置
    const head = { x: snake[0].x, y: snake[0].y };
    
    // 根据方向移动蛇头
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // 检查是否撞墙
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
        return;
    }
    
    // 检查是否撞到自己
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver = true;
            return;
        }
    }
    
    // 在蛇数组开头添加新头部
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        placeFood();
        // 每得100分增加速度
        if (score % 100 === 0) {
            speed = Math.min(speed + 1, 15);
        }
    } else {
        // 如果没有吃到食物，删除尾部
        snake.pop();
    }
}

// 游戏循环
function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 1000/speed);
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction !== 'down') newDirection = 'up';
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction !== 'up') newDirection = 'down';
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction !== 'right') newDirection = 'left';
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction !== 'left') newDirection = 'right';
            break;
        case ' ':
            if (gameOver) {
                initGame();
                gameStarted = true;
            }
            break;
    }
});

// 开始按钮点击事件
document.getElementById('startBtn').addEventListener('click', () => {
    if (!gameStarted || gameOver) {
        initGame();
        gameStarted = true;
    }
});

// 初始化游戏
initGame();
gameLoop(); 