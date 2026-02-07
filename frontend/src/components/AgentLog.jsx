import { Terminal, DollarSign, Cpu } from "lucide-react";

export default function AgentLog({ data, isLoading }) {
  if (isLoading) return (
    <div className="bg-black rounded-xl border border-slate-700 p-8 font-mono text-sm h-full flex flex-col justify-center gap-4 shadow-2xl">
      <div className="text-emerald-500 flex items-center gap-3">
          <Cpu className="w-4 h-4 animate-spin" /> 
           Initializing Vision Model...
      </div>
      <div className="text-blue-500 animate-pulse delay-75"> Detecting Objects...</div>
      <div className="text-yellow-500 animate-pulse delay-150"> Estimating Repair Costs...</div>
      <div className="text-purple-500 animate-pulse delay-300"> Checking Policy Limits...</div>
    </div>
  );
  
  if (!data) return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-8 h-full flex flex-col items-center justify-center text-slate-500 font-mono text-sm min-h-[320px]">
      <Terminal className="w-12 h-12 mb-4 opacity-20" />
      <p>[SYSTEM IDLE]</p>
      <p className="text-xs mt-2">Waiting for data stream...</p>
    </div>
  );

  return (
    <div className="bg-black rounded-xl border border-slate-700 p-8 font-mono text-sm shadow-2xl relative overflow-hidden h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <span className="text-slate-500 text-xs">LOG ID: {Math.floor(Math.random() * 999999)}</span>
        <span className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-400">LATENCY: 1.2s</span>
      </div>
      
      {/* Analysis Data */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-8">
            <div>
                <span className="text-blue-500 text-xs uppercase tracking-wider block mb-1">Identified Object</span>
                <span className="text-white text-lg font-bold">{data.item_name}</span>
            </div>
            <div>
                <span className="text-purple-500 text-xs uppercase tracking-wider block mb-1">Est. Cost</span>
                <span className="text-white text-lg font-bold">${data.estimated_cost}</span>
            </div>
        </div>
        
        <div>
          <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Damage Report</span>
          <p className="text-slate-300 leading-relaxed border-l-2 border-slate-800 pl-3">
            {data.damage_description}
          </p>
        </div>

        {/* --- THE PAYOUT SECTION --- */}
        {data.payout_details ? (
          <div className="mt-8 bg-emerald-900/10 border border-emerald-500/30 p-5 rounded-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
            <div className="flex items-center gap-4 mb-3">
                <div className="bg-emerald-500/20 p-2 rounded-full">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <h3 className="text-emerald-400 font-bold text-lg tracking-wide">PAYOUT INITIATED</h3>
                    <p className="text-emerald-500/60 text-xs">Funds released to wallet</p>
                </div>
            </div>
            <div className="mt-2 text-xs font-mono text-emerald-300/60 break-all bg-black/40 p-3 rounded border border-emerald-500/10">
                TX: {data.payout_details.transaction_id}
            </div>
          </div>
        ) : (
            <div className="mt-6 bg-red-900/10 border border-red-500/20 p-4 rounded text-red-400 text-xs">
                PAYOUT ABORTED: Claim rejected or requires manual review.
            </div>
        )}

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
           AI Reasoning: {data.reason}
        </div>
      </div>
    </div>
  );
}