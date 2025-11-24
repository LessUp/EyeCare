'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Info, Award } from 'lucide-react';

type Direction = 'up' | 'down' | 'left' | 'right';

export default function ContrastSensitivityGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [currentContrast, setCurrentContrast] = useState(80);
  const [showStimulus, setShowStimulus] = useState(false);
  const [targetDirection, setTargetDirection] = useState<Direction | null>(null);
  const [isWaitingInput, setIsWaitingInput] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [bestContrast, setBestContrast] = useState(100);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const SIZE = 400;
  const GRATING_FREQ = 4; // cycles per image width (spatial frequency)

  const drawGrating = useCallback((ctx: CanvasRenderingContext2D, direction: Direction, contrast: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Background luminance (mid-gray)
    const bgLuminance = 128;
    
    // Contrast: 0-100 (percentage)
    const amplitude = (contrast / 100) * 127; // max deviation from bg
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let position = 0;
        
        // Determine grating direction
        switch (direction) {
          case 'up':
          case 'down':
            // Vertical stripes (horizontal orientation)
            position = x;
            break;
          case 'left':
          case 'right':
            // Horizontal stripes (vertical orientation)
            position = y;
            break;
        }
        
        // Sinusoidal grating
        const phase = (2 * Math.PI * GRATING_FREQ * position) / width;
        const intensity = bgLuminance + amplitude * Math.sin(phase);
        
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
    
    // Fixation period
    setTimeout(() => {
      const directions: Direction[] = ['up', 'down', 'left', 'right'];
      const randomDir = directions[Math.floor(Math.random() * directions.length)];
      setTargetDirection(randomDir);
      
      setShowStimulus(true);
      
      // Draw grating
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#808080';
          ctx.fillRect(0, 0, SIZE, SIZE);
          drawGrating(ctx, randomDir, currentContrast);
        }
      }

      // Brief presentation
      setTimeout(() => {
        setShowStimulus(false);
        setIsWaitingInput(true);
        
        // Clear to gray
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#808080';
            ctx.fillRect(0, 0, SIZE, SIZE);
          }
        }
      }, 400); // 400ms presentation

    }, 800); // 800ms fixation
  }, [currentContrast, drawGrating]);

  const handleInput = (direction: Direction) => {
    if (!isWaitingInput || !isPlaying) return;
    
    const correct = direction === targetDirection;
    
    if (correct) {
      setFeedback('correct');
      const newConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutive);
      setScore(s => s + Math.round(100 / currentContrast * 10));
      
      // Adaptive difficulty: reduce contrast after 2 consecutive correct
      if (newConsecutive >= 2) {
        const newContrast = Math.max(2, currentContrast - 5);
        setCurrentContrast(newContrast);
        if (newContrast < bestContrast) {
          setBestContrast(newContrast);
        }
        setConsecutiveCorrect(0);
        if (newContrast <= 10) {
          setLevel(l => l + 1);
        }
      }
    } else {
      setFeedback('wrong');
      setConsecutiveCorrect(0);
      // Increase contrast on error
      const newContrast = Math.min(100, currentContrast + 8);
      setCurrentContrast(newContrast);
    }
    
    setTimeout(startRound, 1000);
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setLevel(1);
    setCurrentContrast(80);
    setConsecutiveCorrect(0);
    setBestContrast(100);
    startRound();
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isWaitingInput) return;
      if (e.key === 'ArrowUp') handleInput('up');
      if (e.key === 'ArrowDown') handleInput('down');
      if (e.key === 'ArrowLeft') handleInput('left');
      if (e.key === 'ArrowRight') handleInput('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWaitingInput, targetDirection]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/games" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Link>
          <div className="flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-500 text-sm block">Score</span>
              <span className="text-xl font-bold text-blue-600">{score}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-500 text-sm block">Contrast</span>
              <span className="text-xl font-bold text-purple-600">{currentContrast}%</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-500 text-sm block">Best</span>
              <span className="text-xl font-bold text-green-600">{bestContrast}%</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center min-h-[600px] justify-center relative">
              
              {!isPlaying ? (
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-10 h-10 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contrast Sensitivity Training</h2>
                  <p className="text-gray-600 mb-8">
                    A grating pattern will flash briefly. Identify whether the stripes are oriented <strong>Horizontally</strong> or <strong>Vertically</strong>.
                    <br/><br/>
                    The contrast will decrease as you improve, challenging your visual system to detect fainter patterns.
                  </p>
                  <button 
                    onClick={startGame}
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
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
                      className={`rounded-xl shadow-inner bg-gray-400 transition-opacity duration-150 ${showStimulus ? 'opacity-100' : 'opacity-30'}`}
                    />
                    
                    {/* Fixation Cross */}
                    {!showStimulus && !feedback && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-1.5 bg-red-500"></div>
                        <div className="h-10 w-1.5 bg-red-500 absolute"></div>
                      </div>
                    )}

                    {/* Feedback Overlay */}
                    {feedback && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-xl z-10">
                        <span className={`text-5xl font-bold ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                          {feedback === 'correct' ? '✓' : '✗'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-12 grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleInput('left')}
                      disabled={!isWaitingInput}
                      className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${
                        isWaitingInput 
                        ? 'border-gray-300 hover:border-blue-500 hover:text-blue-600 bg-white' 
                        : 'border-gray-100 text-gray-300 bg-gray-50'
                      }`}
                    >
                      ←
                    </button>
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleInput('up')}
                        disabled={!isWaitingInput}
                        className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${
                          isWaitingInput 
                          ? 'border-gray-300 hover:border-blue-500 hover:text-blue-600 bg-white' 
                          : 'border-gray-100 text-gray-300 bg-gray-50'
                        }`}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleInput('down')}
                        disabled={!isWaitingInput}
                        className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${
                          isWaitingInput 
                          ? 'border-gray-300 hover:border-blue-500 hover:text-blue-600 bg-white' 
                          : 'border-gray-100 text-gray-300 bg-gray-50'
                        }`}
                      >
                        ↓
                      </button>
                    </div>
                    <button
                      onClick={() => handleInput('right')}
                      disabled={!isWaitingInput}
                      className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${
                        isWaitingInput 
                        ? 'border-gray-300 hover:border-blue-500 hover:text-blue-600 bg-white' 
                        : 'border-gray-100 text-gray-300 bg-gray-50'
                      }`}
                    >
                      →
                    </button>
                  </div>
                  <p className="mt-4 text-gray-400 text-sm">Use arrow keys or buttons</p>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              Scientific Context
            </h3>
            <div className="prose prose-sm text-gray-600">
              <p>
                <strong>Contrast Sensitivity</strong> measures your ability to detect subtle differences in luminance. It's often more predictive of functional vision than standard acuity tests.
              </p>
              <p className="mt-3">
                <strong>Clinical Importance:</strong>
              </p>
              <ul className="list-disc pl-4 space-y-1 mt-2">
                <li>Early detection of cataracts</li>
                <li>Glaucoma screening</li>
                <li>Diabetic retinopathy</li>
                <li>Multiple sclerosis (optic neuritis)</li>
              </ul>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">Performance Guide</p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li><strong>&gt;50%</strong>: Below average</li>
                  <li><strong>20-50%</strong>: Average</li>
                  <li><strong>10-20%</strong>: Good</li>
                  <li><strong>&lt;10%</strong>: Excellent</li>
                  <li><strong>&lt;5%</strong>: Superior</li>
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-2">Key Reference:</p>
                <p className="text-xs text-gray-500 italic">
                  Pelli, D. G., & Bex, P. (2013). Measuring contrast sensitivity. 
                  <span className="block mt-1">Vision Research, 90, 10-14.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
