import { useEffect, useRef, useState } from 'react';

export default function CyberEye() {
  const eyeRef = useRef(null);
  const pupilRef = useRef(null);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!eyeRef.current || !pupilRef.current) return;

      const rect = eyeRef.current.getBoundingClientRect();
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height / 2;
      
      const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
      const dist = Math.min(30, Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 10);
      
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;

      pupilRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    // Random Blinking Logic
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(blinkInterval);
    };
  }, []);

  return (
    <div className="relative w-full flex justify-center py-8 z-10">
      <div 
        ref={eyeRef}
        className="relative w-48 h-48 rounded-full border-4 border-slate-900 shadow-[0_0_50px_rgba(0,255,234,0.3)] bg-black overflow-hidden"
      >
        {/* Eyelids */}
        <div className={`absolute top-0 w-full bg-slate-900 z-20 transition-all duration-100 ${isBlinking ? 'h-1/2' : 'h-0'}`}></div>
        <div className={`absolute bottom-0 w-full bg-slate-900 z-20 transition-all duration-100 ${isBlinking ? 'h-1/2' : 'h-0'}`}></div>

        {/* Iris (CSS Generated) */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 opacity-80 blur-sm animate-pulse"></div>
            <div className="absolute w-28 h-28 rounded-full border-2 border-cyan-300 opacity-50"></div>
        </div>

        {/* Pupil */}
        <div 
            ref={pupilRef}
            className="absolute top-1/2 left-1/2 w-12 h-12 bg-black rounded-full border border-cyan-500 shadow-[0_0_20px_#00ffea] z-10 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            style={{ marginTop: '-24px', marginLeft: '-24px' }} // Centering fix
        >
            <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
        </div>
        
        {/* Reflection */}
        <div className="absolute top-4 left-8 w-10 h-6 bg-white opacity-10 rounded-full rotate-45 z-20 pointer-events-none"></div>
      </div>
    </div>
  );
}