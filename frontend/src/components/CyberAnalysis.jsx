import { useEffect, useState } from 'react';

export default function CyberAnalysis() {
  const [log, setLog] = useState([]);
  
  // Terminal text animation
  useEffect(() => {
    const messages = [
      "INITIALIZING NEURAL NET...",
      "SCANNING PIXELS...",
      "DETECTING DAMAGE PATTERNS...",
      "CALCULATING REPAIR COSTS...",
      "CHECKING FRAUD DATABASE...",
      "VERIFYING POLICY LIMITS...",
      "FINALIZING DECISION..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLog(prev => [...prev, messages[i]]);
        i++;
      }
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Hexagon Processor Animation */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-emerald-500/30 animate-spin-slow" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
        <div className="absolute inset-2 border border-emerald-400 animate-ping opacity-20 rounded-full"></div>
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_#10b981]">
            <span className="text-2xl animate-pulse">🧠</span>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="w-full max-w-md bg-black/80 border border-emerald-500/30 p-4 font-mono text-xs rounded-lg shadow-2xl backdrop-blur h-48 overflow-hidden flex flex-col-reverse">
        {log.map((line, idx) => (
          <div key={idx} className="text-emerald-400 mb-1">
            <span className="text-emerald-700 mr-2">{`>`}</span>
            <span className="animate-pulse">{line}</span>
          </div>
        ))}
        <div className="border-b border-emerald-900/50 mb-2 pb-1 text-emerald-600">
            // SYSTEM LOG // VETROX_CORE_v2.1
        </div>
      </div>
    </div>
  );
}