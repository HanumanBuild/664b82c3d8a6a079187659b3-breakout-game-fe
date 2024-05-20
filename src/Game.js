import React, { useState, useEffect, useRef } from 'react';
import './Game.css';
import paddleImg from './assets/paddle.png';
import ballImg from './assets/ball.png';
import brickImg from './assets/brick.png';

const Game = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [paddleX, setPaddleX] = useState(350);
  const [ball, setBall] = useState({ x: 400, y: 300, dx: 2, dy: -2 });
  const [bricks, setBricks] = useState([]);
  const [isGameRunning, setIsGameRunning] = useState(true);

  const paddleWidth = 100;
  const paddleHeight = 20;
  const ballRadius = 10;
  const brickRowCount = 5;
  const brickColumnCount = 8;
  const brickWidth = 75;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderCtx = canvas.getContext('2d');
    setContext(renderCtx);

    const bricksArray = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricksArray[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricksArray[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    setBricks(bricksArray);

    const keyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        setPaddleX((prev) => Math.max(prev - 20, 0));
      } else if (e.key === 'ArrowRight') {
        setPaddleX((prev) => Math.min(prev + 20, canvas.width - paddleWidth));
      }
    };

    document.addEventListener('keydown', keyPress);
    return () => {
      document.removeEventListener('keydown', keyPress);
    };
  }, []);

  useEffect(() => {
    if (context && isGameRunning) {
      const interval = setInterval(() => {
        draw();
        moveBall();
      }, 10);
      return () => clearInterval(interval);
    }
  }, [context, ball, paddleX, bricks, isGameRunning]);

  const drawPaddle = () => {
    context.drawImage(paddleImg, paddleX, canvasRef.current.height - paddleHeight, paddleWidth, paddleHeight);
  };

  const drawBall = () => {
    context.drawImage(ballImg, ball.x - ballRadius, ball.y - ballRadius, ballRadius * 2, ballRadius * 2);
  };

  const drawBricks = () => {
    bricks.forEach((column, c) => {
      column.forEach((brick, r) => {
        if (brick.status === 1) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          brick.x = brickX;
          brick.y = brickY;
          context.drawImage(brickImg, brickX, brickY, brickWidth, brickHeight);
        }
      });
    });
  };

  const draw = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawPaddle();
    drawBall();
    drawBricks();
  };

  const moveBall = () => {
    let newBall = { ...ball };
    newBall.x += newBall.dx;
    newBall.y += newBall.dy;

    if (newBall.x + newBall.dx > canvasRef.current.width - ballRadius || newBall.x + newBall.dx < ballRadius) {
      newBall.dx = -newBall.dx;
    }
    if (newBall.y + newBall.dy < ballRadius) {
      newBall.dy = -newBall.dy;
    } else if (newBall.y + newBall.dy > canvasRef.current.height - ballRadius) {
      if (newBall.x > paddleX && newBall.x < paddleX + paddleWidth) {
        newBall.dy = -newBall.dy;
      } else {
        setIsGameRunning(false);
      }
    }

    bricks.forEach((column, c) => {
      column.forEach((brick, r) => {
        if (brick.status === 1) {
          if (
            newBall.x > brick.x &&
            newBall.x < brick.x + brickWidth &&
            newBall.y > brick.y &&
            newBall.y < brick.y + brickHeight
          ) {
            newBall.dy = -newBall.dy;
            brick.status = 0;
          }
        }
      });
    });

    setBall(newBall);
  };

  return (
    <div className="game-container">
      <canvas ref={canvasRef} width="800" height="600" className="game-canvas"></canvas>
      {!isGameRunning && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default Game;