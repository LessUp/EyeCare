'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RotateCcw, Info, Brain } from 'lucide-react';

export default function GaborGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [difficulty, setDifficulty] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game state
  const [targetOrientation, setTargetOrientation] = useState<'left' | 'right' | null>(null);
  const [showStimulus, setShowStimulus] = useState(false);
  const [isWaitingInput, setIsWaitingInput] = useState(false);

  // Constants
  const SIZE = 300;
  const BASE_Contrast = 100; // 0-255

  const drawGabor = useCallback((ctx: CanvasRenderingContext2D, angleDeg: number, contrast: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    const lambda = 40; // Wavelength
    const sigma = 40; // Gaussian spread
    const theta = (angleDeg * Math.PI) / 180;
    
    const cx = width / 2;
    const cy = height / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - cx;
        const dy = y - cy;
        
        // Rotate coordinates
        const x_theta = dx * Math.cos(theta) + dy * Math.sin(theta);
        const y_theta = -dx * Math.sin(theta) + dy * Math.cos(theta);
        
        // Gabor function
        const gaussian = Math.exp(-(x_theta * x_theta + y_theta * y_theta) / (2 * sigma * sigma));
        const sinusoid = Math.cos(2 * Math.PI * x_theta / lambda);
        
        // Value between -1 and 1
        const gaborValue = gaussian * sinusoid;
        
        // Map to grayscale with contrast
        // 128 is mid-gray.
        // contrast controls the deviation from 128.
        const intensity = 128 + (gaborValue * contrast);
        
        const idx = (y * width + x) * 4;
        data[idx] = intensity;     // R
        data[idx + 1] = intensity; // G
        data[idx + 2] = intensity; // B
        data[idx + 3] = 255;       // Alpha
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }, []);

  const startRound = useCallback(() => {
    setFeedback(null);
    setIsWaitingInput(false);
    setShowStimulus(false);
    
    // Delay before showing stimulus
    setTimeout(() => {
      const isRight = Math.random() > 0.5;
      setTargetOrientation(isRight ? 'right' : 'left');
      
      // Calculate parameters based on difficulty
      // Difficulty 1: +/- 20 degrees, High contrast
      // Difficulty 10: +/- 2 degrees, Lower contrast
      const angleBase = Math.max(2, 20 - (difficulty * 1.5));
      const angle = isRight ? angleBase : -angleBase;
      const currentContrast = Math.max(20, 100 - (difficulty * 5));
      
      setShowStimulus(true);
      
      // Draw
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          // Clear first
          ctx.fillStyle = '#808080'; // Mid-gray background
          ctx.fillRect(0, 0, SIZE, SIZE);
          drawGabor(ctx, angle, currentContrast);
        }
      }

      // Hide stimulus after duration
      // Difficulty increases -> duration decreases? Or keep constant for now.
      setTimeout(() => {
        setShowStimulus(false);
        setIsWaitingInput(true);
        // Clear canvas to gray
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#808080';
                ctx.fillRect(0, 0, SIZE, SIZE);
            }
        }
      }, 500); // 500ms presentation

    }, 1000); // 1s fixation time
  }, [difficulty, drawGabor]);

  const handleInput = (direction: 'left' | 'right') => {
    if (!isWaitingInput || !isPlaying) return;
    
    const correct = direction === targetOrientation;
    
    if (correct) {
      setFeedback('correct');
      setScore(s => s + 10 * difficulty);
      if (round % 3 === 0) setDifficulty(d => Math.min(d + 1, 20));
    } else {
      setFeedback('wrong');
      setDifficulty(d => Math.max(1, d - 1));
    }
    
    setRound(r => r + 1);
    setTimeout(startRound, 1000);
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setRound(0);
    setDifficulty(1);
    startRound();
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isWaitingInput) return;
      if (e.key === 'ArrowLeft') handleInput('left');
      if (e.key === 'ArrowRight') handleInput('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWaitingInput, targetOrientation]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <Link href="/games" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Games
                </Link>
                <div className="flex items-center space-x-4">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                        <span className="text-gray-500 text-sm">Score</span>
                        <div className="text-2xl font-bold text-indigo-600">{score}</div>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                        <span className="text-gray-500 text-sm">Difficulty</span>
                        <div className="text-2xl font-bold text-purple-600">{difficulty}</div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center min-h-[500px] justify-center relative overflow-hidden">
                        
                        {!isPlaying ? (
                            <div className="text-center max-w-md">
                                <Brain className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Gabor Patch Orientation</h2>
                                <p className="text-gray-600 mb-8">
                                    A Gabor patch will appear briefly. Identify whether the stripes are tilted to the <strong>Left</strong> or <strong>Right</strong>.
                                    <br/><br/>
                                    This exercise stimulates the visual cortex and improves contrast sensitivity.
                                </p>
                                <button 
                                    onClick={startGame}
                                    className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                                >
                                    <Play className="w-5 h-5 mr-2" />
                                    Start Training
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="relative">
                                    <canvas 
                                        ref={canvasRef} 
                                        width={SIZE} 
                                        height={SIZE}
                                        className={`rounded-full shadow-inner bg-gray-400 transition-opacity duration-200 ${showStimulus ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                    
                                    {/* Fixation Cross */}
                                    {!showStimulus && !feedback && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-8 h-1 bg-gray-800/50"></div>
                                            <div className="h-8 w-1 bg-gray-800/50 absolute"></div>
                                        </div>
                                    )}

                                    {/* Feedback Overlay */}
                                    {feedback && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full z-10">
                                            <span className={`text-4xl font-bold ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                                                {feedback === 'correct' ? '✓' : '✗'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-12 flex gap-4">
                                    <button
                                        onClick={() => handleInput('left')}
                                        disabled={!isWaitingInput}
                                        className={`px-8 py-3 rounded-xl border-2 font-bold transition-all ${
                                            isWaitingInput 
                                            ? 'border-gray-300 hover:border-indigo-500 hover:text-indigo-600 bg-white' 
                                            : 'border-gray-100 text-gray-300 bg-gray-50'
                                        }`}
                                    >
                                        ← Left
                                    </button>
                                    <button
                                        onClick={() => handleInput('right')}
                                        disabled={!isWaitingInput}
                                        className={`px-8 py-3 rounded-xl border-2 font-bold transition-all ${
                                            isWaitingInput 
                                            ? 'border-gray-300 hover:border-indigo-500 hover:text-indigo-600 bg-white' 
                                            : 'border-gray-100 text-gray-300 bg-gray-50'
                                        }`}
                                    >
                                        Right →
                                    </button>
                                </div>
                                <p className="mt-4 text-gray-400 text-sm">Use arrow keys or buttons</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Info className="w-5 h-5 mr-2 text-indigo-500" />
                        Scientific Context
                    </h3>
                    <div className="prose prose-sm text-gray-600">
                        <p>
                            <strong>Gabor Patches</strong> are sinusoidal gratings with a Gaussian envelope. They closely match the receptive field profiles of neurons in the primary visual cortex (V1).
                        </p>
                        <p>
                            Research has shown that training with Gabor patches can induce <strong>neuroplasticity</strong> in the adult brain, improving:
                        </p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Visual Acuity</li>
                            <li>Contrast Sensitivity</li>
                            <li>Processing Speed</li>
                        </ul>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-500 font-medium mb-2">Key Reference:</p>
                            <p className="text-xs text-gray-500 italic">
                                Polat, U., Ma-Naim, T., Belkin, M., & Sagi, D. (2004). Improving vision in adult amblyopia by perceptual learning. 
                                <span className="block mt-1">Proceedings of the National Academy of Sciences, 101(17), 6692-6697.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
