'use client';

import { useState, useCallback, useEffect } from 'react';
import Calibration from '@/components/Calibration';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

// LogMAR values: 1.0 (20/200) down to -0.3 (20/10)
// Each step usually 0.1 LogMAR
const LEVELS = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3];

export default function AcuityTest() {
  const [pixelsPerMm, setPixelsPerMm] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [orientation, setOrientation] = useState<'up'|'down'|'left'|'right'>('up');
  const [score, setScore] = useState<{correct: number, total: number}>({ correct: 0, total: 0 });
  const [result, setResult] = useState<number | null>(null);
  const [distance, setDistance] = useState(50); // Default 50cm viewing distance for monitor

  const generateOrientation = useCallback(() => {
    const dirs: ('up'|'down'|'left'|'right')[] = ['up', 'down', 'left', 'right'];
    return dirs[Math.floor(Math.random() * dirs.length)];
  }, []);

  const startTest = () => {
    setStarted(true);
    setCurrentLevelIndex(0);
    setScore({ correct: 0, total: 0 });
    setResult(null);
    setOrientation(generateOrientation());
  };

  const calculateSizePx = (logMar: number) => {
    if (!pixelsPerMm) return 0;
    // Formula: Gap size in mm = 2 * distance * tan( (1/60 deg) * 10^logMar / 2 )
    // Snellen E height is 5x gap size.
    // Simplified: Gap (mm) approx = distance (mm) * tan(radians)
    // 1 min arc = 0.000290888 radians
    // For LogMAR L, visual angle = 10^L minutes
    
    const mar = Math.pow(10, logMar); // Minimum Angle of Resolution in minutes
    const angleRad = (mar / 60) * (Math.PI / 180);
    const gapMm = distance * 10 * Math.tan(angleRad); // distance in cm * 10 = mm
    const heightMm = 5 * gapMm;
    return heightMm * pixelsPerMm;
  };

  const handleInput = (dir: 'up'|'down'|'left'|'right') => {
    const isCorrect = dir === orientation;
    const newScore = { 
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1 
    };
    setScore(newScore);

    // Protocol: 5 attempts per level. Pass if >= 3 correct? 
    // Or simple staircase: 1 mistake allowed? 
    // Let's do: 3 presentations per level. Need 2/3 to pass to next.
    
    if (newScore.total >= 3) {
       if (newScore.correct >= 2) {
         // Pass
         if (currentLevelIndex < LEVELS.length - 1) {
           setCurrentLevelIndex(prev => prev + 1);
           setScore({ correct: 0, total: 0 });
           setOrientation(generateOrientation());
         } else {
           // Finished all levels
           setResult(LEVELS[LEVELS.length - 1]);
         }
       } else {
         // Fail, result is previous level (or this level if it was the first, then 20/200+)
         const level = currentLevelIndex > 0 ? LEVELS[currentLevelIndex - 1] : LEVELS[0];
         setResult(level);
       }
    } else {
       setOrientation(generateOrientation());
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!started || result !== null) return;
      switch(e.key) {
        case 'ArrowUp': handleInput('up'); break;
        case 'ArrowDown': handleInput('down'); break;
        case 'ArrowLeft': handleInput('left'); break;
        case 'ArrowRight': handleInput('right'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [started, result, orientation]);

  if (!pixelsPerMm) {
    return <Calibration onComplete={setPixelsPerMm} />;
  }

  const logMar = LEVELS[currentLevelIndex];
  const eSizePx = calculateSizePx(logMar);
  
  // Convert LogMAR to Snellen (approximation)
  // LogMAR 0 = 20/20. LogMAR 1 = 20/200. 
  // Snellen Denominator = 20 * 10^LogMAR
  const snellenDenominator = Math.round(20 * Math.pow(10, logMar));

  return (
    <div className="max-w-2xl mx-auto text-center py-8">
      {!started ? (
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4">Visual Acuity Test</h1>
          <div className="mb-6 space-y-2 text-left">
            <p><strong>Instructions:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Position yourself exactly <strong>{distance} cm</strong> from the screen.</li>
              <li>Cover one eye with your hand.</li>
              <li>Indicate the direction the "E" is facing using arrow keys or on-screen buttons.</li>
              <li>Repeat for the other eye.</li>
            </ul>
            <div className="mt-4">
               <label className="block text-sm font-medium mb-1">Viewing Distance (cm)</label>
               <select 
                 value={distance} 
                 onChange={(e) => setDistance(Number(e.target.value))}
                 className="w-full p-2 border rounded"
               >
                 <option value={40}>40 cm (Phone/Tablet)</option>
                 <option value={50}>50 cm (Laptop)</option>
                 <option value={70}>70 cm (Desktop Monitor)</option>
                 <option value={100}>100 cm (TV/Far)</option>
                 <option value={300}>3 meters (Standard Clinical)</option>
               </select>
            </div>
          </div>
          <button onClick={startTest} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700">
            Start Test
          </button>
        </div>
      ) : result !== null ? (
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Test Complete</h2>
          <p className="text-xl mb-6">
            Your estimated visual acuity is: <br/>
            <span className="text-4xl font-bold text-blue-600">20/{Math.round(20 * Math.pow(10, result))}</span>
            <br/>
            <span className="text-gray-500 text-sm">(LogMAR {result})</span>
          </p>
          <p className="text-gray-600 mb-8">
            Remember to test your other eye!
          </p>
          <button onClick={() => {setStarted(false); setResult(null)}} className="flex items-center justify-center w-full gap-2 border p-3 rounded-lg hover:bg-gray-50">
            <RotateCcw size={20}/> Restart
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-500 mb-8">
            Level {currentLevelIndex + 1}/{LEVELS.length} (20/{snellenDenominator})
          </div>
          
          <div 
            className="flex items-center justify-center font-black leading-none select-none mb-12 transition-all"
            style={{ 
              width: eSizePx, 
              height: eSizePx,
              fontSize: eSizePx, 
              transform: `rotate(${
                orientation === 'up' ? -90 : 
                orientation === 'down' ? 90 : 
                orientation === 'left' ? 180 : 0
              }deg)` 
            }}
          >
            E
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-[200px]">
            <div/>
            <button onClick={() => handleInput('up')} className="p-4 bg-gray-100 rounded-lg hover:bg-blue-100 active:bg-blue-200">
              <ArrowUp size={24}/>
            </button>
            <div/>
            <button onClick={() => handleInput('left')} className="p-4 bg-gray-100 rounded-lg hover:bg-blue-100 active:bg-blue-200">
              <ArrowLeft size={24}/>
            </button>
            <button onClick={() => handleInput('down')} className="p-4 bg-gray-100 rounded-lg hover:bg-blue-100 active:bg-blue-200">
              <ArrowDown size={24}/>
            </button>
            <button onClick={() => handleInput('right')} className="p-4 bg-gray-100 rounded-lg hover:bg-blue-100 active:bg-blue-200">
              <ArrowRight size={24}/>
            </button>
          </div>
          <p className="mt-8 text-gray-400 text-sm">Use keyboard arrows or buttons</p>
        </div>
      )}
    </div>
  );
}
