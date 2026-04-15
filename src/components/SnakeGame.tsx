import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 100;

export const SnakeGame: React.FC<{ onScoreChange: (score: number) => void }> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { 
        x: (newSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE, 
        y: (newSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE 
      };

      // Check collision with self
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        return;
      }

      newSnake.unshift(head);

      // Check food
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          onScoreChange(newScore);
          return newScore;
        });
        generateFood();
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [snake, direction, food, isGameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : 'rgba(0, 255, 255, 0.6)';
      ctx.shadowBlur = index === 0 ? 15 : 5;
      ctx.shadowColor = '#00ffff';
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <div className="relative glitch-border p-2 bg-black/40 backdrop-blur-sm">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="max-w-full aspect-square"
        />
        
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            {isGameOver ? (
              <>
                <h2 className="text-4xl font-bold text-neon-magenta mb-4 glitch-shadow">GAME OVER</h2>
                <p className="text-neon-cyan mb-6">FINAL SCORE: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-2 bg-neon-cyan text-black font-bold hover:bg-white transition-colors glitch-border"
                >
                  REBOOT SYSTEM
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-neon-cyan mb-4 glitch-shadow">PAUSED</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-2 bg-neon-magenta text-white font-bold hover:bg-white hover:text-black transition-colors glitch-border-magenta"
                >
                  RESUME
                </button>
                <p className="mt-4 text-xs opacity-50">PRESS SPACE TO TOGGLE</p>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 flex gap-8 text-sm uppercase tracking-widest">
        <div className="flex flex-col items-center">
          <span className="opacity-50">Score</span>
          <span className="text-xl text-neon-cyan font-bold">{score}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="opacity-50">Status</span>
          <span className={`text-xl font-bold ${isPaused ? 'text-neon-magenta' : 'text-green-400'}`}>
            {isPaused ? 'IDLE' : 'ACTIVE'}
          </span>
        </div>
      </div>
    </div>
  );
};
