import { useState } from "react";
import axios from "axios";
import { Upload, FileText, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import AgentLog from "../components/AgentLog";
import CyberEye from "../components/CyberEye";       // <--- NEW
import CyberAnalysis from "../components/CyberAnalysis"; // <--- NEW

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null); // Clear previous results
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Force a 3-second delay so we can enjoy the cool animation
      await new Promise(r => setTimeout(r, 3000));
      
     const response = await axios.post("http://127.0.0.1:8000/analyze", formData);
      setResult(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to connect to Agent Brain.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050a] text-cyan-400 font-mono relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Background Matrix Effect */}
      <div className="matrix-bg"></div>

      {/* Header */}
      <header className="border-b border-cyan-900/50 bg-[#0a0a12]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-900/20 rounded border border-cyan-500/50">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-widest text-white cyber-text-glow">VETROX AGENT</h1>
              <p className="text-[10px] text-cyan-600 uppercase tracking-[0.2em]">Autonomous Claims Unit</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-500">SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      {/* THE EYE (Always watching) */}
      <CyberEye />

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* LEFT COLUMN: Upload */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-white font-bold border-l-4 border-cyan-500 pl-3">
              1. Evidence Submission
            </h2>
          </div>

          <div className={`cyber-border rounded-xl p-1 transition-all ${isLoading ? 'opacity-50 blur-sm pointer-events-none' : 'opacity-100'}`}>
            <div className="border border-dashed border-cyan-800 rounded-lg p-8 text-center hover:bg-cyan-900/10 transition-colors relative group">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                onChange={handleFileChange}
                accept="image/*"
              />
              
              {preview ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-cyan-700 shadow-lg">
                  <img src={preview} alt="Evidence" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-transparent transition-all"></div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-900/30 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white text-lg">Drop Evidence Here</p>
                    <p className="text-cyan-600 text-sm mt-1">or click to browse secure files</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {file && !isLoading && !result && (
            <button 
              onClick={handleUpload}
              className="w-full py-4 bg-cyan-900/20 border border-cyan-500 text-cyan-400 font-bold hover:bg-cyan-500 hover:text-black transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,234,0.2)] hover:shadow-[0_0_40px_rgba(0,255,234,0.6)]"
            >
              Initiate Analysis Protocol
            </button>
          )}
        </div>

        {/* RIGHT COLUMN: Results / Processing */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-white font-bold border-l-4 border-purple-500 pl-3">
              2. Agent Decision Engine
            </h2>
          </div>

          <div className="cyber-border rounded-xl min-h-[400px] h-full relative overflow-hidden bg-black/40">
            {isLoading ? (
                <CyberAnalysis />
            ) : result ? (
                <AgentLog data={result} />
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-cyan-800/50">
                    <Shield className="w-24 h-24 mb-4 opacity-20" />
                    <p className="text-sm tracking-widest">[ WAITING FOR INPUT STREAM ]</p>
                </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}