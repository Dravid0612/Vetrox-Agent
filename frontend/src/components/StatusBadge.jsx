import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function StatusBadge({ decision }) {
  if (decision === "APPROVE") {
    return (
      <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-5 py-2 rounded-full border border-emerald-500/30 font-bold tracking-widest text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
        <CheckCircle className="w-5 h-5" /> APPROVED
      </div>
    );
  }
  if (decision === "REJECT") {
    return (
      <div className="flex items-center gap-2 bg-red-500/10 text-red-400 px-5 py-2 rounded-full border border-red-500/30 font-bold tracking-widest text-sm shadow-[0_0_15px_rgba(239,68,68,0.2)]">
        <XCircle className="w-5 h-5" /> REJECTED
      </div>
    );
  }
  return (
    <div className="bg-yellow-500/10 text-yellow-500 flex items-center gap-2 px-5 py-2 rounded-full border border-yellow-500/20 text-sm font-bold">
      <AlertTriangle className="w-4 h-4" /> MANUAL REVIEW
    </div>
  );
}