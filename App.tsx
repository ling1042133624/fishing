import React, { useState } from 'react';
import { Wheel } from './components/Wheel';
import { FishOption, GameState } from './types';
import confetti from 'canvas-confetti';

// Constants defined here for simplicity, or could be in constants.ts
const FISH_OPTIONS: FishOption[] = [
  { id: '1', name: '类高', color: '#ef4444', textColor: '#ffffff' }, // Red
  { id: '2', name: '白边', color: '#f8fafc', textColor: '#0f172a' }, // White/Slate
  { id: '3', name: '金边', color: '#eab308', textColor: '#ffffff' }, // Yellow/Gold
  { id: '4', name: '异鱲', color: '#8b5cf6', textColor: '#ffffff' }, // Violet
  { id: '5', name: '红斑', color: '#f97316', textColor: '#ffffff' }, // Orange
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [selectedFish, setSelectedFish] = useState<FishOption | null>(null);

  const triggerFireworks = (color: string) => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Use the fish color and some white/gold for sparkle
      const colors = [color, '#ffffff', '#FFD700'];

      // Two emitters on the sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: colors
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: colors
      });
    }, 250);
  };

  const handleSpinEnd = (result: FishOption) => {
    setSelectedFish(result);
    setGameState(GameState.RESULT);
    triggerFireworks(result.color);
  };

  const resetGame = () => {
    setGameState(GameState.IDLE);
    setSelectedFish(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-white selection:bg-cyan-500 selection:text-white">
      
      {/* Header */}
      <header className="py-8 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg">
          🎣 钓鱼大轮盘
        </h1>
        <p className="mt-2 text-slate-400 text-sm md:text-base">
          天意已定，这就是你的目标！
        </p>
      </header>

      <main className="container mx-auto px-4 pb-12 max-w-lg">
        
        {/* Wheel Section */}
        <div className={`${gameState === GameState.RESULT ? 'opacity-30 scale-90 blur-sm pointer-events-none' : 'opacity-100 scale-100'} transition-all duration-700 ease-in-out`}>
          <Wheel 
            options={FISH_OPTIONS} 
            onSpinEnd={handleSpinEnd}
            isSpinning={gameState === GameState.SPINNING}
            setIsSpinning={(spinning) => setGameState(spinning ? GameState.SPINNING : GameState.IDLE)}
          />
        </div>

        {/* Result Overlay / Modal */}
        {gameState === GameState.RESULT && selectedFish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="relative bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col animate-float">
              
              {/* Decorative background glow */}
              <div 
                className="absolute top-0 left-0 right-0 h-32 opacity-30 blur-3xl pointer-events-none"
                style={{ backgroundColor: selectedFish.color }}
              ></div>

              {/* Close Button */}
              <button 
                onClick={resetGame}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors z-20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="p-8 text-center relative z-10 flex flex-col items-center gap-4">
                <span className="text-slate-400 text-sm uppercase tracking-widest font-bold">
                  本周目标鱼种
                </span>
                
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl mb-2"
                  style={{ 
                    backgroundColor: selectedFish.color,
                    color: selectedFish.textColor,
                    boxShadow: `0 0 30px ${selectedFish.color}40`
                  }}
                >
                  🐟
                </div>

                <h2 
                  className="text-6xl font-black drop-shadow-lg tracking-tight"
                  style={{ 
                    color: selectedFish.color === '#f8fafc' ? '#ffffff' : selectedFish.color,
                    textShadow: '0 4px 8px rgba(0,0,0,0.5)'
                  }}
                >
                  {selectedFish.name}
                </h2>
                
                <p className="text-slate-300 mt-2">
                  祝你大鲫大鲤，爆护归来！
                </p>
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-slate-900/50 border-t border-slate-700/50 flex justify-center">
                <button 
                  onClick={resetGame}
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  再转一次
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer credits */}
      <footer className="fixed bottom-0 w-full p-4 text-center text-xs text-slate-600 pointer-events-none">
        祝您大吉大利，今晚吃鱼
      </footer>
    </div>
  );
}