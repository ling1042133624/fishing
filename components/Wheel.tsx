import React, { useEffect, useRef, useState } from 'react';
import { FishOption } from '../types';

interface WheelProps {
  options: FishOption[];
  onSpinEnd: (selected: FishOption) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const WHEEL_SIZE = 300;
const RADIUS = WHEEL_SIZE / 2;
const CX = WHEEL_SIZE / 2;
const CY = WHEEL_SIZE / 2;

export const Wheel: React.FC<WheelProps> = ({ options, onSpinEnd, isSpinning, setIsSpinning }) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);

  const numSegments = options.length;
  const anglePerSegment = 360 / numSegments;

  // Helper to calculate SVG path for a slice
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", x, y,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", x, y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Pick a random winner index
    const winningIndex = Math.floor(Math.random() * numSegments);
    
    // Calculate rotation to land on the winner
    // The pointer is usually at the top (0deg visual, or -90deg math).
    // We want the center of the winning segment to align with the pointer.
    // Segment i covers [i*angle, (i+1)*angle]. Center is (i+0.5)*angle.
    // We need to rotate the wheel such that (i+0.5)*angle ends up at 0 (top).
    // Target Rotation = 360 - ((winningIndex + 0.5) * anglePerSegment)
    
    const segmentCenterAngle = (winningIndex * anglePerSegment) + (anglePerSegment / 2);
    const targetBaseRotation = 360 - segmentCenterAngle;
    
    // Add extra spins (5 to 10 full rotations)
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 5));
    const finalRotation = rotation + extraSpins + targetBaseRotation - (rotation % 360);

    setRotation(finalRotation);

    // Wait for animation to finish (CSS transition duration)
    setTimeout(() => {
      setIsSpinning(false);
      onSpinEnd(options[winningIndex]);
    }, 4000); // 4 seconds matches CSS duration
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Pointer */}
      <div className="absolute top-4 z-20">
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-lg"></div>
      </div>

      {/* Wheel SVG */}
      <div 
        className="relative rounded-full shadow-2xl border-4 border-slate-700 bg-slate-800"
        style={{ width: WHEEL_SIZE + 20, height: WHEEL_SIZE + 20 }}
      >
        <svg
          ref={wheelRef}
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
          }}
        >
          {options.map((opt, index) => {
            const startAngle = index * anglePerSegment;
            const endAngle = (index + 1) * anglePerSegment;
            const path = describeArc(CX, CY, RADIUS, startAngle, endAngle);
            
            // Text position: middle of the arc, somewhat inwards
            const midAngle = startAngle + (anglePerSegment / 2);
            const textPos = polarToCartesian(CX, CY, RADIUS * 0.65, midAngle);

            return (
              <g key={opt.id}>
                <path d={path} fill={opt.color} stroke="#1e293b" strokeWidth="2" />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  fill={opt.textColor}
                  fontSize="20"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${midAngle}, ${textPos.x}, ${textPos.y})`}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {opt.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Center Knob */}
        <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white rounded-full shadow-inner transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 border-4 border-slate-300">
           <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`mt-10 px-12 py-4 rounded-full text-2xl font-black uppercase tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all transform hover:scale-105 active:scale-95 ${
          isSpinning 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed shadow-none' 
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
        }`}
      >
        {isSpinning ? '抽签中...' : '开始转动'}
      </button>
    </div>
  );
};
