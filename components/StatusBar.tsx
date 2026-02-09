
import React from 'react';
import { ModelTier } from '../types';

interface StatusBarProps {
  statusText: string;
  modelTier?: ModelTier;
}

const StatusBar: React.FC<StatusBarProps> = ({ statusText, modelTier = 'PRO' }) => {
  return (
    <div className="h-[22px] bg-cine-accent text-white flex items-center justify-between px-[10px] text-[10px] font-medium tracking-wide select-none">
      <span>{statusText}</span>
      <span className="opacity-90">
        AI: {modelTier === 'PRO' ? 'Gemini 3 Pro + G3 Image' : 'Gemini 3 Flash + Flash Image'}
      </span>
    </div>
  );
};

export default StatusBar;