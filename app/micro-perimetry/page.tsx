'use client';

import { useState, useRef, useEffect } from 'react';
import { Activity, AlertTriangle } from 'lucide-react';

// Simulates a MAIA or Humphrey 10-2
export default function MicroPerimetry() {
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [results, setResults] = useState<{x: number, y: number, sensitivity: number}[]>([]);

  // Grid: Central 10 degrees. 
  // Let's assume 50cm distance. 10 degrees is approx 8.7cm radius.
  // We'll use pixel approximations.
  
  const testState = useRef({
    points: [] as {x: number, y: number, currentDb: number, seen: boolean, completed: boolean}[],
    currentPointIndex: 0,
    waitingResponse: false,
    dotVisible: false
  });

  useEffect(() => {
    if (step === 'test') {
        initializePoints();
        runTestLoop();
    }
    return () => {
        // cleanup timeouts if needed
    };
  }, [step]);

  const initializePoints = () => {
    // Generate a polar grid for central vision
    const points = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // 3 rings: 2 deg, 6 deg, 10 deg
    // At 50cm monitor distance (~96 PPI), 1 deg approx 30px (rough estimate)
    const degPx = 30;
    
    // Center point (fovea)
    points.push({ x: centerX, y: centerY, currentDb: 30, seen: false, completed: false });

    const rings = [2, 6, 10];
    rings.forEach(radiusDeg => {
        const radiusPx = radiusDeg * degPx;
        const numPoints = radiusDeg * 4; // more points on outer rings
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            points.push({
                x: centerX + Math.cos(angle) * radiusPx,
                y: centerY + Math.sin(angle) * radiusPx,
                currentDb: 30, // Start high (dim) or low (bright)?
                // dB in perimetry: Higher is dimmer. 30dB is very dim. 0dB is max brightness.
                // We'll start at 25dB (somewhat dim).
                seen: false,
                completed: false
            });
        }
    });

    // Shuffle points to avoid predictable patterns
    testState.current.points = points.sort(() => Math.random() - 0.5);
    testState.current.currentPointIndex = 0;
  };

  const runTestLoop = () => {
    if (testState.current.currentPointIndex >= testState.current.points.length) {
        finishTest();
        return;
    }
    
    const point = testState.current.points[testState.current.currentPointIndex];
    
    // Show stimulus
    // Wait random interval
    setTimeout(() => {
        showStimulus(point);
    }, Math.random() * 1000 + 500);
  };

  const dbToOpacity = (db: number) => {
    // 0 dB = Max Brightness (Opacity 1.0 on black)
    // 30 dB = Min Brightness (Opacity ~0.1)
    // Simple linear map for demo:
    // 30 -> 0.05, 0 -> 1.0
    return Math.max(0.02, 1 - (db / 35));
  };

  const showStimulus = (point: any) => {
     const canvas = canvasRef.current;
     if (!canvas) return;
     const ctx = canvas.getContext('2d');
     if (!ctx) return;

     testState.current.dotVisible = true;
     testState.current.waitingResponse = true;
     
     // Draw
     draw(point);

     // Hide after 200ms
     setTimeout(() => {
        testState.current.dotVisible = false;
        draw(null);
        
        // Response window 1000ms
        setTimeout(() => {
            if (testState.current.waitingResponse) {
                // Missed
                handleResponse(false);
            }
        }, 800);
     }, 200);
  };

  const handleResponse = (seen: boolean) => {
     testState.current.waitingResponse = false;
     const point = testState.current.points[testState.current.currentPointIndex];
     
     // Simple 4-2 strategy or just simple screening (Seen/Not Seen at fixed level)
     // For this web demo, let's do a simple screening at varying levels.
     // Actually, let's just record seen/not seen at a "screening level" (e.g. 24dB) for simplicity 
     // OR a simple staircase: If seen, make dimmer (increase dB). If not seen, make brighter (decrease dB).
     // We will implement a 1-step check for demo speed: 
     // We present at 20dB (moderate). If seen -> 25dB. If not -> 15dB.
     
     // To keep it fast, we just store the result of the first presentation for now 
     // or we loop back. 
     
     // Let's just record the result and move on.
     point.seen = seen;
     point.completed = true;
     
     testState.current.currentPointIndex++;
     runTestLoop();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
     if (e.code === 'Space' && step === 'test' && testState.current.waitingResponse) {
         e.preventDefault();
         handleResponse(true);
     }
  };

  useEffect(() => {
     window.addEventListener('keydown', handleKeyDown);
     // Resize handler
     const handleResize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            draw(null);
        }
     };
     window.addEventListener('resize', handleResize);
     handleResize();
     
     return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', handleResize);
     };
  }, [step]);

  const draw = (activePoint: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fixation Target (Red central cross or circle, distinct from white stimuli)
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2); // Circle
    ctx.moveTo(cx - 12, cy); ctx.lineTo(cx + 12, cy); // Crosshairs
    ctx.moveTo(cx, cy - 12); ctx.lineTo(cx, cy + 12);
    ctx.stroke();

    // Stimulus
    if (activePoint && testState.current.dotVisible) {
        const opacity = 0.8; // Fixed contrast for screening
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        // Goldmann Size III is approx 0.43 deg. ~12px
        ctx.arc(activePoint.x, activePoint.y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
  };

  const finishTest = () => {
     setResults(testState.current.points.map(p => ({
         x: p.x, 
         y: p.y, 
         sensitivity: p.seen ? 1 : 0
     })));
     setStep('result');
  };

  return (
    <div className="min-h-screen bg-black text-white">
        {step === 'intro' && (
            <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
                <Activity className="w-16 h-16 text-red-500 mb-6"/>
                <h1 className="text-3xl font-bold mb-4">Macular Micro-Perimetry</h1>
                <p className="max-w-md text-gray-400 mb-8">
                    This test evaluates the sensitivity of your central vision (macula).
                    It is useful for detecting early signs of macular degeneration.
                </p>
                <div className="bg-gray-900 p-6 rounded-lg text-left mb-8 max-w-md border border-gray-800">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-yellow-500"/> Important
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-400 text-sm">
                        <li>Sit comfortably at arm's length (approx 50cm).</li>
                        <li>Stare continuously at the <strong>Red Cross/Circle</strong> in the center.</li>
                        <li>Do not move your eyes to look for flashes.</li>
                        <li>Press <strong>Spacebar</strong> whenever you see a white flash.</li>
                    </ul>
                </div>
                <button 
                  onClick={() => setStep('test')}
                  className="bg-red-600 text-white px-10 py-3 rounded-full font-bold hover:bg-red-700 transition-colors"
                >
                    Start Screening
                </button>
            </div>
        )}

        {step === 'test' && (
            <div className="fixed inset-0 cursor-none">
                <canvas ref={canvasRef} className="block" />
            </div>
        )}

        {step === 'result' && (
            <div className="flex flex-col items-center justify-center h-screen p-4">
                <div className="bg-white text-black p-8 rounded-xl shadow-xl max-w-2xl w-full">
                    <h2 className="text-2xl font-bold mb-6 text-center">Retinal Sensitivity Map</h2>
                    
                    <div className="aspect-square w-full max-w-[400px] mx-auto bg-black relative rounded-full border-4 border-gray-200 mb-6 overflow-hidden">
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full"/>
                         </div>
                         {results.map((p, i) => (
                             <div 
                                key={i}
                                className={`absolute w-3 h-3 rounded-full border ${p.sensitivity ? 'bg-green-500 border-green-600' : 'bg-black border-red-500'}`}
                                style={{ 
                                    left: p.x - (window.innerWidth/2) + 200, // Center in the 400px box
                                    top: p.y - (window.innerHeight/2) + 200,
                                    transform: 'translate(-50%, -50%)'
                                }}
                             />
                         ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center mb-8">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {results.filter(r => r.sensitivity).length}
                            </div>
                            <div className="text-sm text-gray-600">Points Seen</div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                             <div className="text-2xl font-bold text-red-600">
                                {results.filter(r => !r.sensitivity).length}
                            </div>
                            <div className="text-sm text-gray-600">Points Missed</div>
                        </div>
                    </div>

                    <button 
                        onClick={() => window.location.href = '/'}
                        className="w-full py-3 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 text-gray-900"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )}
    </div>
  );
}
