'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

// Simplified D-15 set colors (approximate hex values for standard D-15)
// Starting cap (fixed)
const REFERENCE_COLOR = '#32667a'; 

// The correct order of the 15 caps
const CORRECT_ORDER = [
  '#347388', '#3b7d8f', '#4a8b8e', '#539381', '#5d9872', 
  '#6d9d61', '#849e55', '#9ea050', '#b89d52', '#cf9459', 
  '#de8a66', '#e37e78', '#e0718d', '#d56aa4', '#c169b6'
];

export default function ColorBlindnessTest() {
  const [caps, setCaps] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    startTest();
  }, []);

  const startTest = () => {
    // Shuffle
    const shuffled = [...CORRECT_ORDER].sort(() => Math.random() - 0.5);
    setCaps(shuffled);
    setCompleted(false);
    setShowResult(false);
    setSelectedIdx(null);
  };

  const handleCapClick = (index: number) => {
    if (completed) return;

    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else {
      // Swap
      const newCaps = [...caps];
      const temp = newCaps[selectedIdx];
      newCaps[selectedIdx] = newCaps[index];
      newCaps[index] = temp;
      setCaps(newCaps);
      setSelectedIdx(null);
    }
  };

  const calculateScore = () => {
    // Calculate Total Error Score (TES)
    // Simple version: just count how many are out of place relative to neighbors
    // But for D-15, we usually sum color difference between adjacent caps.
    // Here, we will just count absolute position matches for simplicity, 
    // or better: check if neighbors are correct neighbors.
    
    let errors = 0;
    for (let i = 0; i < caps.length; i++) {
       if (caps[i] !== CORRECT_ORDER[i]) errors++;
    }
    
    setScore(errors);
    setCompleted(true);
    setShowResult(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Color Arrangement Test</h1>
        <p className="text-gray-600">
          Arrange the colors in a smooth gradient starting from the fixed reference color on the left.
          Click a color to select it, then click another to swap positions.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg overflow-x-auto">
        <div className="flex flex-wrap gap-2 justify-center min-w-[600px]">
          {/* Reference Cap */}
          <div className="flex flex-col items-center gap-2">
            <div 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-inner border-4 border-gray-300 flex-shrink-0"
              style={{ backgroundColor: REFERENCE_COLOR }}
            />
            <span className="text-xs font-bold text-gray-400">REF</span>
          </div>
          
          {/* Separator */}
          <div className="w-1 bg-gray-200 mx-2 rounded"/>

          {/* Draggable Caps */}
          {caps.map((color, idx) => (
            <button
              key={idx}
              onClick={() => handleCapClick(idx)}
              className={clsx(
                "w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-inner transition-transform duration-200 flex-shrink-0",
                selectedIdx === idx ? "ring-4 ring-blue-500 scale-110 z-10" : "hover:scale-105",
                completed && color === CORRECT_ORDER[idx] ? "ring-2 ring-green-400" : ""
              )}
              style={{ backgroundColor: color }}
              disabled={completed}
            />
          ))}
        </div>
      </div>

      {!showResult ? (
        <div className="mt-8 text-center">
          <button 
            onClick={calculateScore}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <CheckCircle size={20}/> Submit Arrangement
          </button>
        </div>
      ) : (
        <div className="mt-8 bg-white p-6 rounded-xl shadow text-center animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-bold mb-2">Results</h2>
          <div className="text-5xl font-black text-blue-600 mb-2">
            {score === 0 ? 'Perfect!' : `${score} Errors`}
          </div>
          <p className="text-gray-600 mb-6">
            {score === 0 
              ? "You have excellent color discrimination." 
              : score < 4 
                ? "You have minor color confusion, which is common." 
                : "You may have some color vision deficiency. Consider a professional test."}
          </p>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Correct Order:</h3>
            <div className="flex justify-center gap-1">
               <div className="w-4 h-4 rounded-full" style={{backgroundColor: REFERENCE_COLOR}}/>
               {CORRECT_ORDER.map(c => (
                 <div key={c} className="w-4 h-4 rounded-full" style={{backgroundColor: c}}/>
               ))}
            </div>
          </div>

          <button 
            onClick={startTest}
            className="border border-gray-300 bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16}/> Try Again
          </button>
        </div>
      )}
    </div>
  );
}
