'use client';

import { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';

interface CalibrationProps {
  onComplete: (pixelsPerMm: number) => void;
}

export default function Calibration({ onComplete }: CalibrationProps) {
  // Standard credit card width is 85.60mm
  const [sliderValue, setSliderValue] = useState(300); // Arbitrary start pixels

  const handleComplete = () => {
    const pixelsPerMm = sliderValue / 85.60;
    onComplete(pixelsPerMm);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border text-center">
      <div className="mb-6">
        <CreditCard className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Screen Calibration</h2>
        <p className="text-gray-600 mb-6">
          To ensure accuracy, we need to calibrate your screen size.
          Place a standard credit card (or ID card) against the screen.
          Adjust the slider until the blue box below is exactly the same width as your card.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div 
          className="h-48 bg-blue-500 rounded-lg shadow-inner transition-all duration-75 relative"
          style={{ width: `${sliderValue}px` }}
        >
             <div className="absolute inset-0 flex items-center justify-center text-white/50 font-mono text-sm">
                Physical Card Width
             </div>
        </div>
      </div>

      <input
        type="range"
        min="150"
        max="600"
        value={sliderValue}
        onChange={(e) => setSliderValue(Number(e.target.value))}
        className="w-full mb-8 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />

      <button
        onClick={handleComplete}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Confirm Calibration
      </button>
    </div>
  );
}
