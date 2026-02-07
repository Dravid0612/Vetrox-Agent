import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login delay for effect
    setTimeout(() => {
        navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800/50 border border-slate-700 mb-6 shadow-2xl">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">VETROX AGENT</h1>
          <p className="text-slate-400 text-lg">Secure Claims Processing Gateway</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl">
          <div>
            <label className="block text-xs font-mono text-slate-500 uppercase mb-2">Agent ID</label>
            <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-600" />
                <input 
                  type="text" 
                  defaultValue="AGENT-007" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
                />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            INITIALIZE SYSTEM <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center mt-8 text-slate-600 text-xs font-mono">
          UNAUTHORIZED ACCESS IS PROHIBITED. <br/> SYSTEM LOGS ALL ACTIVITY.
        </p>
      </div>
    </div>
  );
}