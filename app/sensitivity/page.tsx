'use client';

import { useState, useEffect } from 'react';
import { Play, Timer, AlertCircle } from 'lucide-react';

export default function SensitivityTest() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gridSize, setGridSize] = useState(2);
  const [colors, setColors] = useState<{base: string, odd: string, oddIndex: number}>({ base: '', odd: '', oddIndex: 0 });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (playing && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && playing) {
      setPlaying(false);
      setGameOver(true);
    }
    return () => clearInterval(timer);
  }, [playing, timeLeft]);

  const generateLevel = (currentScore: number) => {
    // Logic to determine grid size and color difficulty
    const newGridSize = currentScore < 5 ? 2 : currentScore < 10 ? 3 : currentScore < 20 ? 4 : currentScore < 30 ? 5 : 6;
    setGridSize(newGridSize);

    // HSL color generation
    const hue = Math.floor(Math.random() * 360);
    const sat = Math.floor(Math.random() * 40) + 60; // 60-100%
    const light = Math.floor(Math.random() * 40) + 40; // 40-80%

    // Difficulty curve: Lightness difference decreases as score increases
    // Start with 20% diff, decrease to 2%
    const diff = Math.max(2, 20 - Math.floor(currentScore / 2));
    
    // Decide if odd one is lighter or darker
    const isLighter = Math.random() > 0.5;
    const oddLight = isLighter 
       ? Math.min(100, light + diff) 
       : Math.max(0, light - diff);

    setColors({
      base: `hsl(${hue}, ${sat}%, ${light}%)`,
      odd: `hsl(${hue}, ${sat}%, ${oddLight}%)`,
      oddIndex: Math.floor(Math.random() * (newGridSize * newGridSize))
    });
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setPlaying(true);
    generateLevel(0);
  };

  const handleClick = (index: number) => {
    if (!playing) return;
    
    if (index === colors.oddIndex) {
      const newScore = score + 1;
      setScore(newScore);
      generateLevel(newScore);
    } else {
      // Penalty for wrong click? Subtract time?
      setTimeLeft(prev => Math.max(0, prev - 3));
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Color Sensitivity Test</h1>
      
      {!playing && !gameOver && (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
          <p className="text-gray-600 mb-6">
            Find the square that is a different shade of color from the rest.
            The difference will get smaller as you progress.
            You have 60 seconds.
          </p>
          <button 
            onClick={startGame}
            className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 flex items-center gap-2 mx-auto text-lg transition-transform hover:scale-105"
          >
            <Play fill="currentColor" /> Start Game
          </button>
        </div>
      )}

      {playing && (
        <div>
          <div className="flex justify-between items-center max-w-md mx-auto mb-8 font-mono text-xl bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-600">Score:</span> {score}
            </div>
            <div className={`flex items-center gap-2 ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
              <Timer size={24} /> {timeLeft}s
            </div>
          </div>

          <div 
            className="grid gap-2 mx-auto bg-white p-4 rounded-xl shadow-inner border"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              width: 'min(90vw, 500px)',
              height: 'min(90vw, 500px)'
            }}
          >
            {Array.from({ length: gridSize * gridSize }).map((_, i) => (
              <button
                key={i}
                onClick={() => handleClick(i)}
                className="rounded-lg transition-transform active:scale-95 duration-75"
                style={{ 
                  backgroundColor: i === colors.oddIndex ? colors.odd : colors.base 
                }}
              />
            ))}
          </div>
        </div>
      )}

      {gameOver && (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto animate-in zoom-in">
          <h2 className="text-2xl font-bold mb-4">Time's Up!</h2>
          <div className="text-6xl font-black text-blue-600 mb-4">{score}</div>
          <p className="text-gray-600 mb-8">
            {score < 15 ? "Good start! Keep practicing." : 
             score < 25 ? "Great eye! You have strong color sensitivity." : 
             "Eagle eye! Outstanding performance."}
          </p>
          <button 
            onClick={startGame}
            className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
