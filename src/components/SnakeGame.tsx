import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, RotateCcw, Play } from "lucide-react";
import { Point, Direction, GameState } from "../types";
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from "../constants";

const CANVAS_SIZE = 400;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

const INITIAL_GAME_STATE: GameState = {
  snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
  food: { x: 5, y: 5 },
  direction: "UP",
  isGameOver: false,
  score: 0,
  highScore: 0,
  speed: INITIAL_SPEED,
};

export default function SnakeGame() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [isPaused, setIsPaused] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const spawnFood = useCallback((snake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood?.x && segment.y === newFood?.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState(prev => ({
      ...INITIAL_GAME_STATE,
      highScore: prev.highScore,
    }));
    setIsPaused(false);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const key = e.key;
    setGameState(prev => {
      if (key === "ArrowUp" && prev.direction !== "DOWN") return { ...prev, direction: "UP" };
      if (key === "ArrowDown" && prev.direction !== "UP") return { ...prev, direction: "DOWN" };
      if (key === "ArrowLeft" && prev.direction !== "RIGHT") return { ...prev, direction: "LEFT" };
      if (key === "ArrowRight" && prev.direction !== "LEFT") return { ...prev, direction: "RIGHT" };
      return prev;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const update = useCallback((time: number) => {
    if (isPaused || gameState.isGameOver) return;

    const deltaTime = time - lastUpdateTimeRef.current;
    if (deltaTime >= gameState.speed) {
      lastUpdateTimeRef.current = time;

      setGameState(prev => {
        const head = { ...prev.snake[0] };

        if (prev.direction === "UP") head.y -= 1;
        if (prev.direction === "DOWN") head.y += 1;
        if (prev.direction === "LEFT") head.x -= 1;
        if (prev.direction === "RIGHT") head.x += 1;

        // Collision Check
        if (
          head.x < 0 || head.x >= GRID_SIZE ||
          head.y < 0 || head.y >= GRID_SIZE ||
          prev.snake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
          return { ...prev, isGameOver: true, highScore: Math.max(prev.highScore, prev.score) };
        }

        const newSnake = [head, ...prev.snake];

        // Food Check
        if (head.x === prev.food.x && head.y === prev.food.y) {
          return {
            ...prev,
            snake: newSnake,
            food: spawnFood(newSnake),
            score: prev.score + 10,
            speed: Math.max(MIN_SPEED, prev.speed - SPEED_INCREMENT),
          };
        }

        newSnake.pop();
        return { ...prev, snake: newSnake };
      });
    }

    requestRef.current = requestAnimationFrame(update);
  }, [isPaused, gameState.isGameOver, gameState.speed, spawnFood]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Grid (Subtle)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = "#ff00ff";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff00ff";
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * CELL_SIZE + CELL_SIZE / 2,
      gameState.food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    gameState.snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? "#00ffff" : "rgba(0, 255, 255, 0.6)";
      ctx.shadowBlur = isHead ? 20 : 0;
      ctx.shadowColor = "#00ffff";
      
      const padding = 2;
      ctx.fillRect(
        segment.x * CELL_SIZE + padding,
        segment.y * CELL_SIZE + padding,
        CELL_SIZE - padding * 2,
        CELL_SIZE - padding * 2
      );
      ctx.shadowBlur = 0;
    });

  }, [gameState]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex justify-between w-full max-w-[400px]">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Current Score</span>
          <span className="text-3xl font-mono font-bold text-neon-cyan neon-glow-cyan">{gameState.score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-3xl font-mono font-bold text-white">{gameState.highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="rounded-xl border-2 border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-zinc-950 neon-border-cyan/20 transition-all duration-500"
        />
        
        <AnimatePresence>
          {isPaused && !gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl"
            >
              <button 
                onClick={() => setIsPaused(false)}
                className="group relative flex flex-col items-center gap-4 cursor-pointer"
              >
                <div className="w-20 h-20 flex items-center justify-center bg-neon-cyan rounded-full shadow-[0_0_30px_rgba(0,255,255,0.4)] group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-black fill-current" />
                </div>
                <span className="text-white font-display font-medium tracking-widest uppercase text-sm">Start Mission</span>
              </button>
            </motion.div>
          )}

          {gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-xl"
            >
              <h2 className="text-5xl font-display font-black text-rose-500 mb-2 uppercase italic tracking-tighter">System Failure</h2>
              <p className="text-zinc-400 mb-8 uppercase tracking-[0.3em] text-xs">Final Score: {gameState.score}</p>
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-neon-cyan transition-colors"
                id="reset-game-btn"
              >
                <RotateCcw className="w-5 h-5" />
                Reboot System
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="scanline" />
      </div>

      <div className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest space-y-1 text-center">
        <p>Use Arrow Keys to Navigate</p>
        <p>Collect digital isotopes to survive</p>
      </div>
    </div>
  );
}
