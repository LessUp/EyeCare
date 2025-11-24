'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Target, RefreshCcw, Info, CheckCircle, XCircle } from 'lucide-react';

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isTarget: boolean;
  isSelected: boolean;
}

export default function MOTGame() {
  const [gameState, setGameState] = useState<'idle' | 'cue' | 'track' | 'answer' | 'feedback'>('idle');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const requestRef = useRef<number>(0);
  
  // Configuration
  const BALL_RADIUS = 12; // Slightly smaller for higher density
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 500;
  
  // Physics Constants
  const BASE_SPEED = 2;

  // Initialize Level
  const initLevel = useCallback(() => {
    const totalBalls = Math.min(8 + level, 20);
    const targetCount = Math.min(2 + Math.floor(level / 2), 6);
    const speed = BASE_SPEED + (level * 0.2);

    const newBalls: Ball[] = [];
    for (let i = 0; i < totalBalls; i++) {
      // Ensure balls don't overlap initially
      let x: number = 0;
      let y: number = 0;
      let overlap = false;
      let attempts = 0;
      do {
        x = Math.random() * (CANVAS_WIDTH - 2 * BALL_RADIUS) + BALL_RADIUS;
        y = Math.random() * (CANVAS_HEIGHT - 2 * BALL_RADIUS) + BALL_RADIUS;
        overlap = newBalls.some(b => {
          const dx = b.x - x;
          const dy = b.y - y;
          return Math.sqrt(dx*dx + dy*dy) < 2.5 * BALL_RADIUS;
        });
        attempts++;
      } while (overlap && attempts < 100);

      const angle = Math.random() * 2 * Math.PI;
      newBalls.push({
        id: i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        isTarget: i < targetCount,
        isSelected: false
      });
    }
    ballsRef.current = newBalls;
  }, [level]);

  // Game Loop
  const animate = useCallback(() => {
    if (gameState !== 'track') return;

    const balls = ballsRef.current;
    
    balls.forEach(ball => {
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Bounce off walls
      if (ball.x - BALL_RADIUS < 0) { ball.x = BALL_RADIUS; ball.vx *= -1; }
      if (ball.x + BALL_RADIUS > CANVAS_WIDTH) { ball.x = CANVAS_WIDTH - BALL_RADIUS; ball.vx *= -1; }
      if (ball.y - BALL_RADIUS < 0) { ball.y = BALL_RADIUS; ball.vy *= -1; }
      if (ball.y + BALL_RADIUS > CANVAS_HEIGHT) { ball.y = CANVAS_HEIGHT - BALL_RADIUS; ball.vy *= -1; }
      
      // Simple collision between balls (optional, keeps them apart)
       // For MOT, strictly physical collisions can be distracting or helpful. 
       // Usually, in scientific MOT, they pass through or bounce. Let's bounce to be realistic.
       for (let other of balls) {
         if (ball.id !== other.id) {
           const dx = other.x - ball.x;
           const dy = other.y - ball.y;
           const dist = Math.sqrt(dx*dx + dy*dy);
           if (dist < 2 * BALL_RADIUS) {
             // Simple elastic collision resolution (swap velocities approx)
             // To avoid sticking, move them apart slightly
             const angle = Math.atan2(dy, dx);
             const move = (2 * BALL_RADIUS - dist) / 2;
             ball.x -= Math.cos(angle) * move;
             ball.y -= Math.sin(angle) * move;
             other.x += Math.cos(angle) * move;
             other.y += Math.sin(angle) * move;

             const tempVx = ball.vx;
             const tempVy = ball.vy;
             ball.vx = other.vx;
             ball.vy = other.vy;
             other.vx = tempVx;
             other.vy = tempVy;
           }
         }
       }
    });

    draw();
    requestRef.current = requestAnimationFrame(animate);
  }, [gameState]);

  // Draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Background Grid (subtle)
    ctx.strokeStyle = '#f0f0f0';
    ctx.beginPath();
    for(let i=0; i<CANVAS_WIDTH; i+=40) { ctx.moveTo(i,0); ctx.lineTo(i, CANVAS_HEIGHT); }
    for(let i=0; i<CANVAS_HEIGHT; i+=40) { ctx.moveTo(0,i); ctx.lineTo(CANVAS_WIDTH, i); }
    ctx.stroke();

    // Draw Balls
    ballsRef.current.forEach(ball => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, 2 * Math.PI);
      
      // Color Logic
      if (gameState === 'cue') {
        ctx.fillStyle = ball.isTarget ? '#FCD34D' : '#3B82F6'; // Yellow for targets, Blue for distractors
      } else if (gameState === 'feedback') {
        if (ball.isTarget) {
          ctx.fillStyle = ball.isSelected ? '#10B981' : '#FCD34D'; // Green if found, Yellow if missed
        } else {
          ctx.fillStyle = ball.isSelected ? '#EF4444' : '#3B82F6'; // Red if wrongly selected, Blue otherwise
        }
      } else if (gameState === 'answer') {
         ctx.fillStyle = ball.isSelected ? '#10B981' : '#3B82F6'; // User selection turns green
      } else {
        ctx.fillStyle = '#3B82F6'; // All blue during tracking
      }
      
      // Selection Ring
      if (ball.isSelected && gameState === 'answer') {
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#059669';
          ctx.stroke();
      }

      ctx.fill();
      
      // Highlight targets during feedback if missed
      if (gameState === 'feedback' && ball.isTarget && !ball.isSelected) {
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 2;
          ctx.stroke();
      }
    });
  }, [gameState]);

  // Handle Click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (gameState !== 'answer') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickedBall = ballsRef.current.find(b => {
      const dx = b.x - x;
      const dy = b.y - y;
      return Math.sqrt(dx*dx + dy*dy) < BALL_RADIUS * 2; // Generous click area
    });

    if (clickedBall) {
      clickedBall.isSelected = !clickedBall.isSelected;
      draw(); // Re-draw immediately
      
      // Check if all targets selected?
      // No, let user submit manually or auto-submit when K are selected.
      // Let's limit selection count to target count.
      const selectedCount = ballsRef.current.filter(b => b.isSelected).length;
      const targetCount = ballsRef.current.filter(b => b.isTarget).length;
      
      if (selectedCount === targetCount) {
          submitAnswer();
      }
    }
  };

  const submitAnswer = () => {
      setGameState('feedback');
      draw();
      
      // Calculate Score
      const targets = ballsRef.current.filter(b => b.isTarget);
      const selected = ballsRef.current.filter(b => b.isSelected);
      
      const correct = selected.filter(s => s.isTarget).length;
      const wrong = selected.filter(s => !s.isTarget).length;
      
      if (correct === targets.length && wrong === 0) {
          // Perfect
          setScore(s => s + (100 * level));
          setTimeout(() => {
              setLevel(l => l + 1);
              startNextRound();
          }, 2000);
      } else {
          // Failed
          setLives(l => l - 1);
          if (lives > 1) {
             setTimeout(() => {
                 // Retry same level or downgrade?
                 // Let's retry same level
                 startNextRound();
             }, 2000);
          } else {
              // Game Over logic handled in render
          }
      }
  };

  const startNextRound = () => {
      if (lives <= 0) {
          setLives(3);
          setScore(0);
          setLevel(1);
      }
      setGameState('cue');
      initLevel();
      draw(); // Draw initial state
      
      setTimeout(() => {
          setGameState('track');
      }, 2000); // 2s cue time
  };

  // Trigger animation when state changes to track
  useEffect(() => {
      if (gameState === 'track') {
          requestRef.current = requestAnimationFrame(animate);
          
          // Track for 5 seconds then stop
          const timer = setTimeout(() => {
              cancelAnimationFrame(requestRef.current);
              setGameState('answer');
              draw();
          }, 5000 + (level * 500)); // Duration increases slightly with level
          
          return () => clearTimeout(timer);
      }
      return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, animate, level, draw]);


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <Link href="/games" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Games
                </Link>
                <div className="flex items-center space-x-6">
                     <div className="flex items-center space-x-2">
                        <span className="text-gray-500">Lives</span>
                        <div className="flex">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className={`w-3 h-3 rounded-full mx-0.5 ${i < lives ? 'bg-red-500' : 'bg-gray-200'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                        <span className="text-gray-500 text-sm block">Level</span>
                        <span className="text-xl font-bold text-purple-600">{level}</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                        <span className="text-gray-500 text-sm block">Score</span>
                        <span className="text-xl font-bold text-indigo-600">{score}</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col items-center min-h-[600px] relative">
                        
                        {lives <= 0 ? (
                            <div className="absolute inset-0 z-10 bg-white/90 flex flex-col items-center justify-center text-center p-8 rounded-2xl">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                    <XCircle className="w-10 h-10 text-red-500" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Over</h2>
                                <p className="text-gray-600 mb-8">Final Score: {score}</p>
                                <button 
                                    onClick={startNextRound}
                                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center"
                                >
                                    <RefreshCcw className="w-5 h-5 mr-2" />
                                    Try Again
                                </button>
                            </div>
                        ) : gameState === 'idle' ? (
                            <div className="absolute inset-0 z-10 bg-white/90 flex flex-col items-center justify-center text-center p-8 rounded-2xl">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                    <Target className="w-10 h-10 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Multiple Object Tracking</h2>
                                <p className="text-gray-600 max-w-md mb-8">
                                    1. Watch the <strong>yellow balls</strong> (Targets).<br/>
                                    2. Track them as they turn blue and move.<br/>
                                    3. Click all the original targets when they stop.
                                </p>
                                <button 
                                    onClick={startNextRound}
                                    className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center text-lg"
                                >
                                    <Play className="w-6 h-6 mr-2" />
                                    Start Game
                                </button>
                            </div>
                        ) : null}

                        <canvas 
                            ref={canvasRef}
                            width={CANVAS_WIDTH}
                            height={CANVAS_HEIGHT}
                            onClick={handleCanvasClick}
                            className="bg-gray-50 rounded-xl border border-gray-100 cursor-pointer w-full h-full object-contain"
                        />
                        
                        <div className="mt-4 text-center h-8">
                            {gameState === 'cue' && <span className="text-yellow-600 font-bold animate-pulse">Memorize Targets!</span>}
                            {gameState === 'track' && <span className="text-blue-600 font-bold">Tracking...</span>}
                            {gameState === 'answer' && <span className="text-green-600 font-bold">Select Targets</span>}
                            {gameState === 'feedback' && <span className="text-gray-500">Checking...</span>}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Info className="w-5 h-5 mr-2 text-rose-500" />
                        Scientific Context
                    </h3>
                    <div className="prose prose-sm text-gray-600">
                        <p>
                            <strong>Multiple Object Tracking (MOT)</strong> assesses the brain's ability to sustain attention on multiple distinct items simultaneously.
                        </p>
                        <p>
                            Research indicates that this training enhances:
                        </p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Dynamic Visual Acuity</li>
                            <li>Selective Attention</li>
                            <li>Situational Awareness</li>
                            <li>Peripheral Awareness</li>
                        </ul>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-500 font-medium mb-2">Key Reference:</p>
                            <p className="text-xs text-gray-500 italic">
                                Green, C. S., & Bavelier, D. (2003). Action video game modifies visual selective attention.
                                <span className="block mt-1">Nature, 423(6939), 534-537.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
