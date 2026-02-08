import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, XCircle, Activity, DollarSign, ExternalLink, Box, Server } from 'lucide-react';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // --- EYE TRACKING STATE ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate mouse position as a percentage of the screen width/height
      // -1 to 1 range (0 is center)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate pupil movement (Limit movement to keeps pupils inside eye)
  const pupilStyle = {
    transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
  };
  // --------------------------

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {

      const response = await axios.post('http://localhost:8000/analyze', formData);

      // Force a 3-second delay so we can enjoy the cool animation
      await new Promise(r => setTimeout(r, 3000));
      
    } catch (error) {
      console.error(error);
      alert("Error connecting to VETROX Core");
    }
    setLoading(false);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-green-400 font-mono p-6 selection:bg-green-900 selection:text-white relative overflow-hidden">
      
      {/* --- BACKGROUND GRID EFFECT --- */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* --- THE WATCHER (EYES) --- */}
      <div className="flex justify-center gap-8 mb-8 mt-4 relative z-10">
        {/* Left Eye */}
        <div className={`relative w-24 h-24 bg-black rounded-full border-4 transition-colors duration-300 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden
          ${loading ? 'border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.6)]' : 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.6)]'}`}>
           
           {/* The Pupil */}
           <div 
             className={`w-8 h-8 rounded-full shadow-[0_0_15px] transition-transform duration-75
               ${loading ? 'bg-orange-400 shadow-orange-500 animate-pulse' : 'bg-cyan-400 shadow-cyan-500'}`}
             style={loading ? {} : pupilStyle} // Disable tracking when loading
           >
           </div>
           
           {/* Scanning Line (Only visible when loading) */}
           {loading && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/30 to-transparent w-full h-full animate-[scan_1s_ease-in-out_infinite] opacity-50"></div>}
        </div>

        {/* Right Eye */}
        <div className={`relative w-24 h-24 bg-black rounded-full border-4 transition-colors duration-300 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden
          ${loading ? 'border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.6)]' : 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.6)]'}`}>
           
           <div 
             className={`w-8 h-8 rounded-full shadow-[0_0_15px] transition-transform duration-75
               ${loading ? 'bg-orange-400 shadow-orange-500 animate-pulse' : 'bg-cyan-400 shadow-cyan-500'}`}
             style={loading ? {} : pupilStyle}
           ></div>

           {loading && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/30 to-transparent w-full h-full animate-[scan_1s_ease-in-out_infinite] opacity-50"></div>}
        </div>
      </div>
      {/* ----------------------------- */}

      {/* Header Stats Bar */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 relative z-10">
        <div className="bg-gray-900/80 border border-green-900/50 p-4 rounded flex items-center gap-4 shadow-lg backdrop-blur-sm">
          <div className="p-3 bg-black rounded border border-green-800"><DollarSign className="w-6 h-6" /></div>
          <div><p className="text-gray-500 text-xs uppercase tracking-widest">Wallet Balance</p><p className="text-xl font-bold text-white">450.00 ETH</p></div>
        </div>
        <div className="bg-gray-900/80 border border-green-900/50 p-4 rounded flex items-center gap-4 shadow-lg backdrop-blur-sm">
          <div className="p-3 bg-black rounded border border-green-800"><Server className="w-6 h-6" /></div>
          <div><p className="text-gray-500 text-xs uppercase tracking-widest">Network Status</p><p className="text-xl font-bold text-white flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> SEPOLIA</p></div>
        </div>
        <div className="bg-gray-900/80 border border-green-900/50 p-4 rounded flex items-center gap-4 md:col-span-2 shadow-lg backdrop-blur-sm">
          <div className="p-3 bg-black rounded border border-green-800"><Box className="w-6 h-6" /></div>
          <div><p className="text-gray-500 text-xs uppercase tracking-widest">Latest Block</p><p className="text-xl font-bold text-white">#5,492,104</p></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 relative z-10">
        {/* Left Column: AI Scanner */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-gray-900/50 border border-green-500/30 rounded p-8 relative overflow-hidden backdrop-blur-sm">
            
            {/* Visual Header */}
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              {loading ? <Activity className="text-orange-500 animate-spin" /> : <Activity className="text-green-500" />} 
              {loading ? "ANALYZING BIOMETRICS..." : "EVIDENCE UPLOAD TERMINAL"}
            </h2>
            
            {/* Upload Area */}
            <div 
              className={`border-2 border-dashed rounded p-12 text-center transition-all relative overflow-hidden ${
                dragActive ? 'border-green-400 bg-green-900/20' : 'border-gray-700 hover:border-gray-500'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { 
                e.preventDefault(); 
                setDragActive(false); 
                setFile(e.dataTransfer.files[0]); 
              }}
            >
              {/* ANALYZING OVERLAY ANIMATION */}
              {loading && (
                <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center">
                  <div className="w-full h-1 bg-orange-500 shadow-[0_0_15px_#f97316] animate-[scan_2s_ease-in-out_infinite]"></div>
                  <p className="text-orange-500 font-mono mt-4 animate-pulse">SCANNING PIXELS... 98%</p>
                </div>
              )}

              <input type="file" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="fileUpload" />
              <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center relative z-10">
                <Upload className={`w-12 h-12 mb-4 ${file ? 'text-green-400' : 'text-gray-600'}`} />
                <span className="text-lg font-bold text-gray-300">
                  {file ? `[FILE LOADED]: ${file.name}` : "DRAG EVIDENCE IMAGE HERE"}
                </span>
                <span className="text-xs text-gray-500 mt-2 font-mono">SECURE UPLOAD LINK :: ENCRYPTED</span>
              </label>
            </div>

            <button 
              onClick={handleUpload}
              disabled={!file || loading}
              className={`w-full mt-6 py-4 rounded font-bold text-lg tracking-widest transition-all uppercase ${
                loading ? 'bg-orange-900/50 text-orange-500 border border-orange-500/50 cursor-wait' 
                : 'bg-green-600 hover:bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.6)]'
              }`}
            >
              {loading ? "PROCESSING..." : "EXECUTE CLAIM PROTOCOL"}
            </button>
          </div>

          {/* BLOCKCHAIN RESULT SECTION */}
          {result && !loading && (
            <div className={`p-6 rounded border-l-4 animate-fade-in-up ${result.decision === "APPROVE" ? "bg-green-900/10 border-green-500" : "bg-red-900/10 border-red-500"}`}>
              <div className="flex items-center gap-4 mb-6">
                {result.decision === "APPROVE" ? <CheckCircle className="w-10 h-10 text-green-500" /> : <XCircle className="w-10 h-10 text-red-500" />}
                <div>
                  <h3 className="text-2xl font-bold text-white">{result.decision === "APPROVE" ? "PAYOUT CONFIRMED" : "CLAIM REJECTED"}</h3>
                  <p className="text-sm font-mono text-gray-400">
                    {result.decision === "APPROVE" ? "Funds transferred via Smart Contract" : "Sent to DAO Governance for voting"}
                  </p>
                </div>
              </div>

              {/* THE TRANSACTION RECEIPT */}
              {result.payout && (
                <div className="bg-black border border-gray-800 p-4 rounded font-mono text-sm space-y-3 shadow-inner">
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">TRANSACTION HASH</span>
                    <span className="text-green-400 font-bold truncate w-64 text-right">
                      {result.payout.tx_hash}
                    </span>
                  </div>
                  <div className="pt-2">
                    <a 
                      href={result.payout.explorer} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 py-2 rounded transition"
                    >
                      <ExternalLink className="w-4 h-4" /> VIEW ON SEPOLIA EXPLORER
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Ledger Sidebar */}
        <div className="bg-gray-900/50 border border-gray-800 rounded p-6 h-fit backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white border-b border-gray-800 pb-2">
            <Server className="w-4 h-4 text-green-500" /> RECENT TRANSACTIONS
          </h3>
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-black border border-gray-800 rounded opacity-60 hover:opacity-100 transition">
              <div className="flex justify-between text-gray-500 mb-1">TX: 0x3a...9f21</div>
              <div className="flex justify-between">
                <span className="text-white">iPhone 13 Screen</span>
                <span className="text-yellow-500">PENDING</span>
              </div>
            </div>
            <div className="p-3 bg-black border border-green-900/50 rounded hover:bg-green-900/10 transition">
              <div className="flex justify-between text-gray-500 mb-1">TX: 0x8b...1a04</div>
              <div className="flex justify-between">
                <span className="text-white">MacBook Water</span>
                <span className="text-green-500">CONFIRMED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS Keyframes for the scanner line */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;