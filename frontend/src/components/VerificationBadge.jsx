import React from 'react';
import { ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export default function VerificationBadge({ status }) {
  if (status === 'verified_creator') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        Verified Creator
      </span>
    );
  }

  if (status === 'community_verified') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-950/80 border border-sky-500/40 text-sky-300">
        <UserCheck className="w-3.5 h-3.5 text-sky-400" />
        Community Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/60 border border-amber-500/30 text-amber-300" title="Workflow and prompts provided directly by creator">
      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
      Self-Reported Workflow
    </span>
  );
}
