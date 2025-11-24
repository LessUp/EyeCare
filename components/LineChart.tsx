'use client';

import { useEffect, useRef } from 'react';

interface LineChartProps {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
  showGrid?: boolean;
  yAxisLabel?: string;
}

export default function LineChart({ 
  data, 
  labels, 
  color = '#3B82F6',
  height = 200,
  showGrid = true,
  yAxisLabel = ''
}: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const h = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, h);
    
    // Padding
    const padding = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = h - padding.top - padding.bottom;
    
    // Calculate min/max for scaling
    const maxValue = Math.max(...data, 100);
    const minValue = Math.min(...data, 0);
    const valueRange = maxValue - minValue || 1;
    
    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 1;
      
      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartWidth, y);
        ctx.stroke();
        
        // Y-axis labels
        const value = maxValue - (valueRange / 5) * i;
        ctx.fillStyle = '#6B7280';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(value.toFixed(0), padding.left - 10, y + 4);
      }
    }
    
    // Draw axes
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.stroke();
    
    // Plot data
    if (data.length > 0) {
      const xStep = chartWidth / Math.max(data.length - 1, 1);
      
      // Draw line
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      
      data.forEach((value, i) => {
        const x = padding.left + i * xStep;
        const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      
      // Draw points
      ctx.fillStyle = color;
      data.forEach((value, i) => {
        const x = padding.left + i * xStep;
        const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlight last point
        if (i === data.length - 1) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
      
      // X-axis labels (show every nth label to avoid crowding)
      const labelStep = Math.ceil(labels.length / 10);
      ctx.fillStyle = '#6B7280';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      
      labels.forEach((label, i) => {
        if (i % labelStep === 0 || i === labels.length - 1) {
          const x = padding.left + i * xStep;
          ctx.fillText(label, x, padding.top + chartHeight + 20);
        }
      });
    }
    
    // Y-axis label
    if (yAxisLabel) {
      ctx.save();
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.translate(15, padding.top + chartHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(yAxisLabel, 0, 0);
      ctx.restore();
    }
    
  }, [data, labels, color, height, showGrid, yAxisLabel]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={height}
      className="w-full h-auto"
    />
  );
}
