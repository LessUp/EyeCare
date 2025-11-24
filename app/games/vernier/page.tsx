'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Info, Crosshair } from 'lucide-react';
import { saveTrainingSession } from '@/lib/progress-tracker';

type Position = 'left' | 'right' | 'center';

export default function VernierGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [offset, setOffset] = useState(5); // pixels
  const [showStimulus, setShowStimulus] = useState(false);
  const [targetPosition, setTargetPosition] = useState<Position | null>(null);
  const [isWaitingInput, setIsWaitingInput] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const SIZE = 400;
  const LINE_LENGTH = 150;
  const LINE_WIDTH = 3;
  const GAP = 20; // Gap between upper and lower lines

  const drawVernier = useCallback((ctx: CanvasRenderingContext2D, position: Position, offsetPx: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Calculate offset for lower line
    let lowerOffset = 0;
    if (position === 'left') lowerOffset = -offsetPx;
    if (position === 'right') lowerOffset = offsetPx;
    
    // Draw upper line (reference)
    ctx.strokeStyle = '#1F2937';
    ctx.lineWidth = LINE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(centerX - LINE_LENGTH / 2, centerY - GAP / 2);
    ctx.lineTo(centerX + LINE_LENGTH / 2, centerY - GAP / 2);
    ctx.stroke();
    
    // Draw lower line (test)
    ctx.beginPath();
    ctx.moveTo(centerX - LINE_LENGTH / 2 + lowerOffset, centerY + GAP / 2);
    ctx.lineTo(centerX + LINE_LENGTH / 2 + lowerOffset, centerY + GAP / 2);
    ctx.stroke();
    
    // Draw fixation cross
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2;
    const crossSize = 8;
    ctx.beginPath();
    ctx.moveTo(centerX - crossSize, centerY);
    ctx.lineTo(centerX + crossSize, centerY);
    ctx.moveTo(centerX, centerY - crossSize);
    ctx.lineTo(centerX, centerY + crossSize);
    ctx.stroke();
    
  }, []);

  const startRound = useCallback(() => {
    setFeedback(null);
    setIsWaitingInput(false);
    setShowStimulus(false);
    
    // Fixation period
    setTimeout(() => {
      const positions: Position[] = ['left', 'right', 'center'];
      const randomPos = positions[Math.floor(Math.random() * positions.length)];
      setTargetPosition(randomPos);
      
      setShowStimulus(true);
      
      // Draw Vernier stimulus
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          drawVernier(ctx, randomPos, offset);
        }
      }

      // Brief presentation
      setTimeout(() => {
        setShowStimulus(false);
        setIsWaitingInput(true);
        
        // Clear to gray with fixation
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#F3F4F6';
            ctx.fillRect(0, 0, SIZE, SIZE);
            
            // Keep fixation cross
            const centerX = SIZE / 2;
            const centerY = SIZE / 2;
            ctx.strokeStyle = '#EF4444';
            ctx.lineWidth = 2;
            const crossSize = 8;
            ctx.beginPath();
            ctx.moveTo(centerX - crossSize, centerY);
            ctx.lineTo(centerX + crossSize, centerY);
            ctx.moveTo(centerX, centerY - crossSize);
            ctx.lineTo(centerX, centerY + crossSize);
            ctx.stroke();
          }
        }
      }, 300); // 300ms presentation

    }, 500); // 500ms fixation
  }, [offset, drawVernier]);

  const handleInput = (position: Position) => {
    if (!isWaitingInput || !isPlaying) return;
    
    const correct = position === targetPosition;
    
    if (correct) {
      setFeedback('correct');
      setCorrectCount(c => c + 1);
      setScore(s => s + Math.round(100 / offset));
      
      // Adaptive difficulty: reduce offset after consecutive correct
      if (correctCount > 0 && correctCount % 2 === 1) {
        setOffset(o => Math.max(0.5, o - 0.5));
      }
    } else {
      setFeedback('wrong');
      // Increase offset on error
      setOffset(o => Math.min(10, o + 0.8));
    }
    
    const newRound = round + 1;
    setRound(newRound);
    
    // Save progress every 15 rounds
    if (newRound > 0 && newRound % 15 === 0) {
      saveProgress(newRound);
    }
    
    setTimeout(startRound, 1000);
  };

  const saveProgress = (currentRound: number) => {
    const duration = (Date.now() - startTime) / 1000;
    const accuracy = currentRound > 0 ? (correctCount / currentRound) * 100 : 0;
    
    saveTrainingSession({
      gameType: 'vernier',
      timestamp: Date.now(),
      duration,
      score,
      difficulty: Math.round((10 - offset) * 2), // Convert offset to difficulty 0-20
      accuracy,
      rounds: currentRound,
      metadata: {
        bestOffset: offset
      }
    });
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setRound(0);
    setCorrectCount(0);
    setOffset(5);
    setStartTime(Date.now());
    startRound();
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isWaitingInput) return;
      if (e.key === 'ArrowLeft') handleInput('left');
      if (e.key === 'ArrowRight') handleInput('right');
      if (e.key === 'ArrowDown' || e.key === ' ') handleInput('center');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWaitingInput, targetPosition]);

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
              <span className="text-gray-500 text-sm block">Offset</span>
              <span className="text-xl font-bold text-purple-600">{offset.toFixed(1)}px</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center min-h-[600px] justify-center relative">
              
              {!isPlaying ? (
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Crosshair className="w-10 h-10 text-cyan-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Vernier Acuity Training</h2>
                  <p className="text-gray-600 mb-8">
                    Two horizontal lines will flash. Determine if the <strong>lower line</strong> is shifted to the <strong>Left</strong>, <strong>Right</strong>, or <strong>Aligned (Center)</strong>.
                    <br/><br/>
                    This tests your hyperacuity - the ability to detect position differences smaller than a photoreceptor.
                  </p>
                  <button 
                    onClick={startGame}
                    className="inline-flex items-center px-8 py-4 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-colors"
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
                      className={`rounded-xl shadow-inner bg-gray-100 transition-opacity duration-150 ${showStimulus ? 'opacity-100' : 'opacity-60'}`}
                    />

                    {/* Feedback Overlay */}
                    {feedback && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-xl z-10">
                        <span className={`text-5xl font-bold ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
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
                        ? 'border-gray-300 hover:border-cyan-500 hover:text-cyan-600 bg-white' 
                        : 'border-gray-100 text-gray-300 bg-gray-50'
                      }`}
                    >
                      ← Left Shift
                    </button>
                    <button
                      onClick={() => handleInput('center')}
                      disabled={!isWaitingInput}
                      className={`px-8 py-3 rounded-xl border-2 font-bold transition-all ${
                        isWaitingInput 
                        ? 'border-gray-300 hover:border-cyan-500 hover:text-cyan-600 bg-white' 
                        : 'border-gray-100 text-gray-300 bg-gray-50'
                      }`}
                    >
                      Aligned
                    </button>
                    <button
                      onClick={() => handleInput('right')}
                      disabled={!isWaitingInput}
                      className={`px-8 py-3 rounded-xl border-2 font-bold transition-all ${
                        isWaitingInput 
                        ? 'border-gray-300 hover:border-cyan-500 hover:text-cyan-600 bg-white' 
                        : 'border-gray-100 text-gray-300 bg-gray-50'
                      }`}
                    >
                      Right Shift →
                    </button>
                  </div>
                  <p className="mt-4 text-gray-400 text-sm">Use ← → Space/↓ keys</p>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-cyan-500" />
              Scientific Context
            </h3>
            <div className="prose prose-sm text-gray-600">
              <p>
                <strong>Vernier Acuity</strong> (also called hyperacuity) is the ability to detect misalignment between two line segments.
              </p>
              <p className="mt-3">
                Remarkably, humans can detect offsets as small as <strong>5-10 arcseconds</strong> - much smaller than the spacing between photoreceptors!
              </p>
              
              <div className="mt-4 p-3 bg-cyan-50 rounded-lg">
                <p className="text-sm font-semibold text-cyan-900 mb-2">Why It Matters:</p>
                <ul className="text-xs text-cyan-800 space-y-1 list-disc pl-4">
                  <li>Tests fine spatial discrimination</li>
                  <li>Sensitive to early vision problems</li>
                  <li>Important for reading & precision tasks</li>
                  <li>Training improves spatial precision</li>
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-2">Key Reference:</p>
                <p className="text-xs text-gray-500 italic">
                  Westheimer, G. (1979). The spatial sense of the eye. 
                  <span className="block mt-1">Investigative Ophthalmology & Visual Science, 18(9), 893-912.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
