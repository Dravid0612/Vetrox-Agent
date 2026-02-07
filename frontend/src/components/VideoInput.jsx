import { UploadCloud, Loader2, FileImage } from "lucide-react";

export default function VideoInput({ onFileSelect, isLoading }) {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-800/30 hover:bg-slate-800/80 hover:border-emerald-500/50 transition-all cursor-pointer relative h-80 group">
      
      {isLoading ? (
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-6" />
          <p className="text-emerald-400 font-mono text-lg animate-pulse">ANALYZING PIXELS...</p>
          <p className="text-slate-500 text-sm mt-2">Connecting to Neural Engine</p>
        </div>
      ) : (
        <>
          <div className="bg-slate-900 p-6 rounded-full mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
            <UploadCloud className="w-12 h-12 text-emerald-400" />
          </div>
          <p className="text-slate-200 font-medium text-xl">Drop Evidence Here</p>
          <p className="text-slate-500 mt-2">or click to browse files</p>
          
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept="image/*"
          />
        </>
      )}
    </div>
  );
}