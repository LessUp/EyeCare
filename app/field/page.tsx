'use client';

import { useState, useEffect, useRef } from 'react';
import { ScanLine, EyeOff } from 'lucide-react';

export default function FieldTest() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<{x: number, y: number, seen: boolean}[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [message, setMessage] = useState("Press Spacebar when you see a dot");

  // Test parameters
  const DOT_DURATION = 200; // ms
  const RESPONSE_WINDOW = 1000; // ms
  const TOTAL_DOTS = 30;
  
  const stateRef = useRef({
    dotVisible: false,
    dotLocation: { x: 0, y: 0 },
    waitingForResponse: false,
    dotsShown: 0,
    results: [] as {x: number, y: number, seen: boolean}[],
    timeoutId: null as NodeJS.Timeout | null
  });

  const startTest = () => {
    setStarted(true);
    setFinished(false);
    stateRef.current = {
        dotVisible: false,
        dotLocation: { x: 0, y: 0 },
        waitingForResponse: false,
        dotsShown: 0,
        results: [],
        timeoutId: null
    };
    scheduleNextDot();
  };

  const scheduleNextDot = () => {
    if (stateRef.current.dotsShown >= TOTAL_DOTS) {
      finishTest();
      return;
    }

    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    stateRef.current.timeoutId = setTimeout(showDot, delay);
  };

  const showDot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Random position, but avoid center (fixation)
    let x, y, dist;
    do {
       x = Math.random() * width;
       y = Math.random() * height;
       const dx = x - width/2;
       const dy = y - height/2;
       dist = Math.sqrt(dx*dx + dy*dy);
    } while (dist < 50); // Avoid central 50px radius

    stateRef.current.dotLocation = { x, y };
    stateRef.current.dotVisible = true;
    stateRef.current.waitingForResponse = true;
    stateRef.current.dotsShown++;
    
    draw();

    // Hide dot after duration
    setTimeout(() => {
      stateRef.current.dotVisible = false;
      draw();
      // Wait for response window to close before recording miss
      setTimeout(() => {
        if (stateRef.current.waitingForResponse) {
            // Missed
            recordResult(false);
        }
      }, RESPONSE_WINDOW - DOT_DURATION);
    }, DOT_DURATION);
  };

  const recordResult = (seen: boolean) => {
    if (!stateRef.current.waitingForResponse) return;
    
    stateRef.current.waitingForResponse = false;
    stateRef.current.results.push({
        x: stateRef.current.dotLocation.x,
        y: stateRef.current.dotLocation.y,
        seen
    });
    
    // Flash feedback (optional, maybe distracting)
    // schedule next
    scheduleNextDot();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && started && !finished) {
      e.preventDefault();
      if (stateRef.current.waitingForResponse) {
          recordResult(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        if (stateRef.current.timeoutId) clearTimeout(stateRef.current.timeoutId);
    };
  }, [started, finished]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Fixation Cross
    ctx.strokeStyle = '#ffffff'; // White cross
    ctx.lineWidth = 2;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy);
    ctx.lineTo(cx + 10, cy);
    ctx.moveTo(cx, cy - 10);
    ctx.lineTo(cx, cy + 10);
    ctx.stroke();

    // Draw Dot if visible
    if (stateRef.current.dotVisible) {
        ctx.fillStyle = '#ffffff'; // White dot
        ctx.beginPath();
        ctx.arc(stateRef.current.dotLocation.x, stateRef.current.dotLocation.y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
  };

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            draw();
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const finishTest = () => {
    setStarted(false);
    setFinished(true);
    setResults(stateRef.current.results);
  };

  if (!started && !finished) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <ScanLine className="w-16 h-16 text-blue-600 mb-6" />
            <h1 className="text-4xl font-bold mb-4">Visual Field Screening</h1>
            <p className="max-w-lg text-gray-600 mb-8">
                This test checks your peripheral vision. 
                <br/><br/>
                <strong>Instructions:</strong><br/>
                1. Make the browser fullscreen (F11).<br/>
                2. Fix your eyes on the <strong>central cross</strong> at all times.<br/>
                3. Press <strong>SPACEBAR</strong> whenever you see a white dot flash anywhere on the screen.<br/>
                4. Do not move your eyes to look for the dots.
            </p>
            <button onClick={startTest} className="bg-blue-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 shadow-lg">
                Start Test
            </button>
        </div>
    );
  }

  if (finished) {
    const hits = results.filter(r => r.seen).length;
    const score = Math.round((hits / results.length) * 100);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
                <h2 className="text-3xl font-bold mb-6 text-center">Results</h2>
                <div className="flex justify-between items-center mb-8 px-8">
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Stimuli Shown</div>
                        <div className="text-2xl font-bold">{results.length}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Detected</div>
                        <div className="text-2xl font-bold text-green-600">{hits}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Missed</div>
                        <div className="text-2xl font-bold text-red-500">{results.length - hits}</div>
                    </div>
                </div>

                <div className="aspect-video w-full bg-black relative rounded-lg overflow-hidden mb-6 border-4 border-gray-200">
                    {/* Replay visualization */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="w-4 h-4 text-white">+</div>
                    </div>
                    {results.map((r, i) => (
                        <div 
                            key={i}
                            className={`absolute w-2 h-2 rounded-full ${r.seen ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ left: r.x, top: r.y, transform: 'translate(-50%, -50%)' }}
                            title={r.seen ? "Seen" : "Missed"}
                        />
                    ))}
                </div>
                
                <p className="text-gray-600 text-center mb-6">
                   Green dots were seen. Red dots were missed. 
                   <br/>If you have many red dots in a specific area, it may indicate a blind spot.
                </p>

                <button onClick={() => setFinished(false)} className="w-full border py-3 rounded-lg hover:bg-gray-50 font-semibold">
                    Back to Menu
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black cursor-none">
        <canvas ref={canvasRef} className="block" />
        <div className="absolute bottom-8 left-0 right-0 text-center text-gray-500 pointer-events-none select-none">
            Press SPACE when you see a dot. Keep eyes on center cross.
        </div>
    </div>
  );
}
