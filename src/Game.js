import React, { useState, useEffect, useRef } from 'react';
import './Game.css';

const Game = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderCtx = canvas.getContext('2d');
    setContext(renderCtx);
  }, []);

  return (
    <div className="game-container">
      <canvas ref={canvasRef} width="800" height="600" className="game-canvas"></canvas>
    </div>
  );
};

export default Game;
