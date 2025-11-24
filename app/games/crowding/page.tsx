'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Info, Eye } from 'lucide-react';
import { saveTrainingSession } from '@/lib/progress-tracker';

const LETTERS = ['C', 'D', 'H', 'K', 'N', 'O', 'R', 'S', 'V', 'Z'];

export default function CrowdingGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [spacing, setSpacing] = useState(2.5); // spacing factor (×letter size)
  const [showStimulus, setShowStimulus] = useState(false);
  const [targetLetter, setTargetLetter] = useState<string>('');
  const [flankerLetters, setFlankerLetters] = useState<string[]>([]);
  const [isWaitingInput, setIsWaitingInput] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [eccentricity, setEccentricity] = useState(8); // degrees from center
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const SIZE = 600;
  const BASE_FONT_SIZE = 40;

  const drawCrowding = useCallback((ctx: CanvasRenderingContext2D, target: string, flankers: string[], spacingFactor: number, ecc: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#F9FAFB';
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Calculate position (on the right side for peripheral vision)
    const pixelsPerDegree = 30; // Approximate
    const targetX = centerX + (ecc * pixelsPerDegree);
    const targetY = centerY;
    
    // Font setup
    ctx.font = `bold ${BASE_FONT_SIZE}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#111827';
    
    const letterSpacing = BASE_FONT_SIZE * spacingFactor;
    
    // Draw flankers
    if (flankers[0]) {
      ctx.fillText(flankers[0], targetX - letterSpacing, targetY);
    }
    if (flankers[1]) {
      ctx.fillText(flankers[1], targetX + letterSpacing, targetY);
    }
    
    // Draw target (slightly emphasized)
    ctx.fillStyle = '#1F2937';
    ctx.fillText(target, targetX, targetY);
    
    // Draw fixation cross at center
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 3;
    const crossSize = 12;
    ctx.beginPath();
    ctx.moveTo(centerX - crossSize, centerY);
    ctx.lineTo(centerX + crossSize, centerY);
    ctx.moveTo(centerX, centerY - crossSize);
    ctx.lineTo(centerX, centerY + crossSize);
    ctx.stroke();
    
    // Draw instruction arrow
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX + 30, centerY);
    ctx.lineTo(targetX - letterSpacing - 30, centerY);
    ctx.stroke();
    ctx.setLineDash([]);
    
  }, []);

  const startRound = useCallback(() => {
    setFeedback(null);
    setIsWaitingInput(false);
    setShowStimulus(false);
    
    // Fixation period
    setTimeout(() => {
      const target = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      const flanker1 = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      const flanker2 = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      
      setTargetLetter(target);
      setFlankerLetters([flanker1, flanker2]);
      
      setShowStimulus(true);
      
      // Draw crowding stimulus
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          drawCrowding(ctx, target, [flanker1, flanker2], spacing, eccentricity);
        }
      }

      // Brief presentation
      setTimeout(() => {
        setShowStimulus(false);
        setIsWaitingInput(true);
        
        // Clear to fixation only
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            const width = ctx.canvas.width;
            const height = ctx.canvas.height;
            
            ctx.fillStyle = '#F9FAFB';
            ctx.fillRect(0, 0, width, height);
            
            const centerX = width / 2;
            const centerY = height / 2;
            
            ctx.strokeStyle = '#EF4444';
            ctx.lineWidth = 3;
            const crossSize = 12;
            ctx.beginPath();
            ctx.moveTo(centerX - crossSize, centerY);
            ctx.lineTo(centerX + crossSize, centerY);
            ctx.moveTo(centerX, centerY - crossSize);
            ctx.lineTo(centerX, centerY + crossSize);
            ctx.stroke();
          }
        }
      }, 200); // 200ms presentation (brief to ensure fixation)

    }, 800); // 800ms fixation
  }, [spacing, eccentricity, drawCrowding]);

  const handleInput = (letter: string) => {
    if (!isWaitingInput || !isPlaying) return;
    
    const correct = letter === targetLetter;
    
    if (correct) {
      setFeedback('correct');
      setCorrectCount(c => c + 1);
      setScore(s => s + Math.round(50 / spacing));
      
      // Adaptive difficulty: reduce spacing after consecutive correct
      if (correctCount > 0 && correctCount % 2 === 1) {
        setSpacing(s => Math.max(0.8, s - 0.2));
      }
    } else {
      setFeedback('wrong');
      // Increase spacing on error
      setSpacing(s => Math.min(4, s + 0.3));
    }
    
    const newRound = round + 1;
    setRound(newRound);
    
    // Save progress every 15 rounds
    if (newRound > 0 && newRound % 15 === 0) {
      saveProgress(newRound);
    }
    
    setTimeout(startRound, 1200);
  };

  const saveProgress = (currentRound: number) => {
    const duration = (Date.now() - startTime) / 1000;
    const accuracy = currentRound > 0 ? (correctCount / currentRound) * 100 : 0;
    
    saveTrainingSession({
      gameType: 'crowding',
      timestamp: Date.now(),
      duration,
      score,
      difficulty: Math.round((4 - spacing) * 5), // Convert spacing to difficulty 0-20
      accuracy,
      rounds: currentRound,
      metadata: {
        bestSpacing: spacing,
        eccentricity
      }
    });
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setRound(0);
    setCorrectCount(0);
    setSpacing(2.5);
    setStartTime(Date.now());
    startRound();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/games" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Link>
          <div className="flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-500 text-sm block">Score</span>
              <span className="text-xl font-bold text-emerald-600">{score}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-500 text-sm block">Spacing</span>
              <span className="text-xl font-bold text-purple-600">{spacing.toFixed(1)}×</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center min-h-[600px] justify-center relative">
              
              {!isPlaying ? (
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Eye className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Crowding Reduction Training</h2>
                  <p className="text-gray-600 mb-6">
                    <strong>Keep your eyes on the red fixation cross</strong> at all times!
                    <br/><br/>
                    Letters will appear to the <strong>right</strong>. Identify the <strong>middle letter</strong> using your peripheral vision.
                    <br/><br/>
                    This trains your ability to overcome visual crowding - critical for reading and object recognition.
                  </p>
                  <button 
                    onClick={startGame}
                    className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Training
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative w-full">
                    <canvas 
                      ref={canvasRef} 
                      width={SIZE} 
                      height={SIZE}
                      className={`rounded-xl shadow-inner bg-gray-50 transition-opacity duration-150 mx-auto ${showStimulus ? 'opacity-100' : 'opacity-70'}`}
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

                  <div className="mt-8 w-full max-w-2xl">
                    <p className="text-center text-gray-600 mb-4 font-semibold">Select the MIDDLE letter:</p>
                    <div className="grid grid-cols-5 gap-2">
                      {LETTERS.map(letter => (
                        <button
                          key={letter}
                          onClick={() => handleInput(letter)}
                          disabled={!isWaitingInput}
                          className={`px-4 py-3 rounded-lg border-2 font-bold text-lg transition-all ${
                            isWaitingInput 
                            ? 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 bg-white' 
                            : 'border-gray-100 text-gray-300 bg-gray-50'
                          }`}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-emerald-500" />
              Scientific Context
            </h3>
            <div className="prose prose-sm text-gray-600">
              <p>
                <strong>Visual Crowding</strong> is the inability to identify objects in clutter. It's the limiting factor for peripheral vision and reading speed.
              </p>
              <p className="mt-3 text-sm">
                <strong>Bouma's Law:</strong> Objects become crowded when flankers are within 0.5× the eccentricity.
              </p>
              
              <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                <p className="text-sm font-semibold text-emerald-900 mb-2">Clinical Importance:</p>
                <ul className="text-xs text-emerald-800 space-y-1 list-disc pl-4">
                  <li>Amblyopia diagnosis</li>
                  <li>Reading disabilities</li>
                  <li>Macular degeneration impact</li>
                  <li>Training reduces crowding zones</li>
                </ul>
              </div>

              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs font-bold text-amber-900 mb-1">⚠️ Important:</p>
                <p className="text-xs text-amber-800">
                  Keep fixating on the red cross! Moving your eyes defeats the purpose of peripheral training.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-2">Key References:</p>
                <p className="text-xs text-gray-500 italic">
                  Pelli, D. G., et al. (2004). Crowding is unlike ordinary masking.
                  <span className="block mt-1">Vision Research, 44(12), 1565-1575.</span>
                </p>
                <p className="text-xs text-gray-500 italic mt-2">
                  Chung, S. T. (2014). Cortical reorganization after long-term adaptation to retinal lesions.
                  <span className="block mt-1">Journal of Neuroscience, 34(31), 10299-10310.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
