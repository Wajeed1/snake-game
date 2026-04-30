import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Position, Direction } from "../types";
import { GAME_CONFIG } from "../constants";
import { Trophy, RefreshCw, Play } from "lucide-react";

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(GAME_CONFIG.INITIAL_SPEED);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastDirection = useRef<Direction>("RIGHT");

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE);
    const y = Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE);
    return { x, y };
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection("RIGHT");
    lastDirection.current = "RIGHT";
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    setSpeed(GAME_CONFIG.INITIAL_SPEED);
    onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case "UP": newHead.y -= 1; break;
        case "DOWN": newHead.y += 1; break;
        case "LEFT": newHead.x -= 1; break;
        case "RIGHT": newHead.x += 1; break;
      }

      // Wall collision
      if (
        newHead.x < 0 || 
        newHead.x >= GAME_CONFIG.GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GAME_CONFIG.GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood());
        setSpeed((prev) => Math.max(GAME_CONFIG.MIN_SPEED, prev - GAME_CONFIG.SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      lastDirection.current = direction;
      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp": if (lastDirection.current !== "DOWN") setDirection("UP"); break;
        case "ArrowDown": if (lastDirection.current !== "UP") setDirection("DOWN"); break;
        case "ArrowLeft": if (lastDirection.current !== "RIGHT") setDirection("LEFT"); break;
        case "ArrowRight": if (lastDirection.current !== "LEFT") setDirection("RIGHT"); break;
        case " ": setIsPaused(p => !p); break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isGameOver && !isPaused) {
      const interval = setInterval(moveSnake, speed);
      return () => clearInterval(interval);
    }
  }, [moveSnake, isGameOver, isPaused, speed]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Game Board */}
      <div 
        className="grid bg-black/40 backdrop-blur-md rounded-xl overflow-hidden neon-border-blue"
        style={{
          gridTemplateColumns: `repeat(${GAME_CONFIG.GRID_SIZE}, 1fr)`,
          width: "min(80vw, 500px)",
          aspectRatio: "1/1"
        }}
      >
        {Array.from({ length: GAME_CONFIG.GRID_SIZE * GAME_CONFIG.GRID_SIZE }).map((_, i) => {
          const x = i % GAME_CONFIG.GRID_SIZE;
          const y = Math.floor(i / GAME_CONFIG.GRID_SIZE);
          
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.slice(1).some(seg => seg.x === x && seg.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div 
              key={i} 
              className="relative border-[0.5px] border-white/5"
            >
              <AnimatePresence>
                {isSnakeHead && (
                  <motion.div
                    layoutId="snake-head"
                    className="absolute inset-1 bg-neon-blue rounded-sm shadow-[0_0_10px_#00f2ff]"
                  />
                )}
                {isSnakeBody && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-1.5 bg-neon-blue/60 rounded-full"
                  />
                )}
                {isFood && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute inset-1 bg-neon-pink rounded-full shadow-[0_0_15px_#ff00e5]"
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl"
          >
            <h2 className="text-4xl font-bold text-neon-pink mb-4 neon-glow-pink">SYSTEM FAILURE</h2>
            <div className="flex items-center gap-2 mb-6 text-xl">
              <Trophy className="text-neon-blue" />
              <span className="font-mono">FINAL SCORE: {score}</span>
            </div>
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-neon-blue/20 border border-neon-blue text-neon-blue rounded-full hover:bg-neon-blue hover:text-black transition-all cursor-pointer font-bold"
            >
              <RefreshCw className="w-5 h-5" /> REBOOT SYSTEM
            </button>
          </motion.div>
        )}

        {isPaused && !isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-xl"
          >
            <button 
              onClick={() => setIsPaused(false)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-20 h-20 flex items-center justify-center bg-neon-blue/20 border-2 border-neon-blue rounded-full text-neon-blue group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,242,255,0.3)]">
                <Play className="w-10 h-10 fill-current" />
              </div>
              <span className="mt-4 text-neon-blue font-mono tracking-widest animate-pulse">INITIATE SEQUENCE</span>
            </button>
            <span className="mt-8 text-white/40 text-xs font-mono uppercase">Use Arrows to Move | Space to Pause</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SnakeGame;
