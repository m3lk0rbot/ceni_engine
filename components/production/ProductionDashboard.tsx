
import React from 'react';
import { RiskAnalysisResult } from '../../types';
import { ShieldAlert, DollarSign, Activity, CheckCircle, AlertTriangle, Siren, Users, Calendar, Video, ThumbsUp, ThumbsDown, History } from 'lucide-react';

interface DashboardProps {
  result: RiskAnalysisResult;
}

export const ProductionDashboard: React.FC<DashboardProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20';
      case 'Medium': return 'bg-blue-900/20 text-blue-400 border-blue-500/20';
      case 'High': return 'bg-amber-900/20 text-amber-400 border-amber-500/20';
      case 'Extreme': return 'bg-red-900/20 text-red-400 border-red-500/20';
      default: return 'bg-gray-800 text-gray-400';
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-black animate-in fade-in duration-500 w-full">
      
      {/* HUMAN READABLE LOGISTICS ROW (NEW) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
         {/* Indie Friendly Badge */}
         <div className={`rounded-sm p-4 border flex flex-col items-center justify-center text-center ${result.logistics.indie_friendly ? 'bg-emerald-950/10 border-emerald-900/30' : 'bg-red-950/10 border-red-900/30'}`}>
            {result.logistics.indie_friendly ? <ThumbsUp className="w-5 h-5 text-emerald-500 mb-2" /> : <ThumbsDown className="w-5 h-5 text-red-500 mb-2" />}
            <span className={`text-[10px] font-bold uppercase tracking-wider ${result.logistics.indie_friendly ? 'text-emerald-400' : 'text-red-400'}`}>
                {result.logistics.indie_friendly ? "Indie Friendly" : "Studio Only"}
            </span>
         </div>

         {/* Crew Size */}
         <div className="bg-[#1a1a1a] rounded-sm p-4 border border-[#333] flex flex-col items-center justify-center text-center">
            <Users className="w-5 h-5 text-cine-text-dim mb-2" />
            <div className="text-[10px] font-bold text-cine-text-dim uppercase tracking-wider mb-1">Crew Size</div>
            <div className="text-xs font-bold text-white">{result.logistics.crew_size}</div>
         </div>

         {/* Shoot Days */}
         <div className="bg-[#1a1a1a] rounded-sm p-4 border border-[#333] flex flex-col items-center justify-center text-center">
            <Calendar className="w-5 h-5 text-cine-text-dim mb-2" />
            <div className="text-[10px] font-bold text-cine-text-dim uppercase tracking-wider mb-1">Shoot Days</div>
            <div className="text-xs font-bold text-white">{result.logistics.est_shoot_days}</div>
         </div>

         {/* Insurance */}
         <div className="bg-[#1a1a1a] rounded-sm p-4 border border-[#333] flex flex-col items-center justify-center text-center">
            <ShieldAlert className="w-5 h-5 text-cine-text-dim mb-2" />
            <div className="text-[10px] font-bold text-cine-text-dim uppercase tracking-wider mb-1">Insurance</div>
            <div className="text-xs font-bold text-white">{result.logistics.insurance_requirement}</div>
         </div>
      </div>

      {/* Group A: CONTINUITY WARNINGS (If Any) */}
      {result.continuity && result.continuity.length > 0 && (
         <div className="mb-6 bg-orange-900/20 border border-orange-600/30 p-4 rounded-sm">
             <h3 className="text-xs font-bold text-orange-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                 <History className="w-4 h-4" /> Continuity Drift Detected
             </h3>
             <div className="space-y-2">
                 {result.continuity.map((c, idx) => (
                     <div key={idx} className="flex items-start text-xs text-orange-200">
                         <span className="bg-orange-600/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mr-2 mt-0.5">{c.type}</span>
                         <span>{c.message}</span>
                     </div>
                 ))}
             </div>
         </div>
      )}

      {/* SCORE BREAKDOWN & MAIN METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Main Score */}
        <div className="lg:col-span-1 bg-cine-panel rounded-sm p-6 border border-cine-border flex flex-col items-center justify-center relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Activity className="w-24 h-24 text-white" />
          </div>
          <h3 className="text-cine-text-dim font-bold text-[10px] uppercase tracking-wider mb-2">Feasibility Score</h3>
          <div className={`text-6xl font-bold ${getScoreColor(result.feasibilityScore)} mb-2`}>
             {result.feasibilityScore}
          </div>
          <div className={`px-3 py-1 rounded text-xs font-bold border ${getRiskBadgeColor(result.riskLevel)}`}>
             {result.riskLevel} RISK
          </div>
          <p className="text-[10px] text-cine-text-dim mt-4 text-center leading-tight">
             Heuristic estimate based on industry norms.<br/>Not a final budget.
          </p>
        </div>

        {/* Granular Breakdown (NEW) */}
        <div className="lg:col-span-2 bg-cine-panel rounded-sm p-6 border border-cine-border flex flex-col justify-center">
           <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">Feasibility Breakdown</h3>
           <div className="space-y-4">
              
              {/* Safety */}
              <div>
                 <div className="flex justify-between text-xs mb-1">
                    <span className="text-cine-text-dim">Physical Safety</span>
                    <span className="text-white font-mono">{result.breakdown.safety_score}/100</span>
                 </div>
                 <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${result.breakdown.safety_score > 80 ? 'bg-emerald-500' : result.breakdown.safety_score > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${result.breakdown.safety_score}%`}}></div>
                 </div>
              </div>

              {/* Legal */}
              <div>
                 <div className="flex justify-between text-xs mb-1">
                    <span className="text-cine-text-dim">Legal & Clearance</span>
                    <span className="text-white font-mono">{result.breakdown.legal_score}/100</span>
                 </div>
                 <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${result.breakdown.legal_score > 80 ? 'bg-emerald-500' : result.breakdown.legal_score > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${result.breakdown.legal_score}%`}}></div>
                 </div>
              </div>

              {/* Logistics */}
              <div>
                 <div className="flex justify-between text-xs mb-1">
                    <span className="text-cine-text-dim">Logistics & Access</span>
                    <span className="text-white font-mono">{result.breakdown.logistics_score}/100</span>
                 </div>
                 <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${result.breakdown.logistics_score > 80 ? 'bg-emerald-500' : result.breakdown.logistics_score > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${result.breakdown.logistics_score}%`}}></div>
                 </div>
              </div>

              {/* VFX */}
              <div>
                 <div className="flex justify-between text-xs mb-1">
                    <span className="text-cine-text-dim">Technical / VFX</span>
                    <span className="text-white font-mono">{result.breakdown.vfx_score}/100</span>
                 </div>
                 <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${result.breakdown.vfx_score > 80 ? 'bg-emerald-500' : result.breakdown.vfx_score > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${result.breakdown.vfx_score}%`}}></div>
                 </div>
              </div>

           </div>
        </div>
      </div>

      {/* Red Flags & Mitigations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Red Flags */}
        <div className="bg-red-950/5 rounded-sm border border-red-900/20 p-5">
          <h3 className="text-xs font-bold text-red-400 mb-4 flex items-center uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Red Flags & Warnings
          </h3>
          <ul className="space-y-2">
            {result.redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start text-xs text-cine-text">
                <span className="mr-2 mt-1 w-1 h-1 bg-red-500 rounded-full flex-shrink-0"></span>
                {flag}
              </li>
            ))}
          </ul>
        </div>

        {/* Mitigation Strategies */}
        <div className="bg-emerald-950/5 rounded-sm border border-emerald-900/20 p-5">
          <h3 className="text-xs font-bold text-emerald-400 mb-4 flex items-center uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mitigation Strategies
          </h3>
          <ul className="space-y-2">
            {result.mitigations.map((item, idx) => (
              <li key={idx} className="flex items-start text-xs text-cine-text">
                 <span className="mr-2 mt-1 w-1 h-1 bg-emerald-500 rounded-full flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Logistics Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
         <div className="bg-cine-panel rounded-sm border border-cine-border p-5">
            <h4 className="text-[10px] font-bold text-cine-accent mb-3 uppercase tracking-wider">Required Safety Protocols</h4>
            <div className="flex flex-wrap gap-2">
              {result.safetyProtocols.map((proto, idx) => (
                <span key={idx} className="px-2 py-1 bg-[#333] text-cine-text rounded-sm text-[10px] border border-[#444] flex items-center">
                  <Siren className="w-3 h-3 mr-1.5 text-cine-warning"/>
                  {proto}
                </span>
              ))}
            </div>
         </div>
         <div className="bg-cine-panel rounded-sm border border-cine-border p-5">
            <h4 className="text-[10px] font-bold text-cine-accent mb-3 uppercase tracking-wider">Anticipated VFX Requirements</h4>
             <div className="flex flex-wrap gap-2">
              {result.vfxBreakdown.map((vfx, idx) => (
                <span key={idx} className="px-2 py-1 bg-[#333] text-cine-text rounded-sm text-[10px] border border-[#444]">
                  {vfx}
                </span>
              ))}
            </div>
         </div>
      </div>

    </div>
  );
};