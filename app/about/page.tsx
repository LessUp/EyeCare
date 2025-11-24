import { CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">About EyeCare Pro</h1>
      <p className="text-lg text-gray-600 mb-8">
        EyeCare Pro uses modern web technologies to bring professional-grade vision screening to your browser. 
        Our tests are based on established ophthalmological standards adapted for digital displays.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Our Tests</h2>
      <ul className="space-y-4 mb-8">
        <li className="flex gap-3">
            <CheckCircle className="text-blue-600 flex-shrink-0" />
            <div>
                <strong>Visual Acuity:</strong> Based on the Snellen and LogMAR standards, calibrated to your specific screen size.
            </div>
        </li>
        <li className="flex gap-3">
            <CheckCircle className="text-blue-600 flex-shrink-0" />
            <div>
                <strong>Color Vision:</strong> Adaptation of the Farnsworth D-15 arrangement test to detect Protan, Deutan, and Tritan defects.
            </div>
        </li>
        <li className="flex gap-3">
            <CheckCircle className="text-blue-600 flex-shrink-0" />
            <div>
                <strong>Contrast Sensitivity:</strong> dynamic testing of color discrimination thresholds.
            </div>
        </li>
        <li className="flex gap-3">
            <CheckCircle className="text-blue-600 flex-shrink-0" />
            <div>
                <strong>Perimetry:</strong> Digital simulation of Humphrey Field Analyzer concepts for detecting scotomas (blind spots).
            </div>
        </li>
      </ul>

      <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
        <h3 className="font-bold text-yellow-900 mb-2">Important Disclaimer</h3>
        <p className="text-yellow-800 text-sm">
            This software is for informational and educational purposes only. It is not a medical device and does not provide a medical diagnosis. 
            Factors such as screen quality, lighting conditions, and calibration accuracy can affect results. 
            Always seek the advice of a physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
      </div>
    </div>
  );
}
