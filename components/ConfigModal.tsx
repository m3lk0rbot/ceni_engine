
import React, { useState, useEffect } from 'react';
import { Settings, Terminal, X, PlayCircle } from 'lucide-react';
import { ModelTier } from '../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (key: string, tier: ModelTier) => void;
  currentKey?: string | null;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, onConfirm, currentKey }) => {
  const [inputKey, setInputKey] = useState('');

  useEffect(() => {
    if (isOpen && currentKey) {
      setInputKey(currentKey);
    }
  }, [isOpen, currentKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    const tier: ModelTier = inputKey.trim().length > 0 ? 'PRO' : 'LITE';
    onConfirm(inputKey, tier);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cine-panel border border-cine-border shadow-2xl rounded-sm w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-[#333] bg-cine-header">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4" /> Engine Configuration
          </h2>
          <button onClick={onClose} className="text-cine-text-dim hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <label className="text-[10px] font-bold text-cine-text-dim uppercase tracking-wider mb-2 block flex items-center gap-2">
              <Terminal className="w-3 h-3" /> API Credentials (Gemini 3 Pro)
            </label>
            <div className="relative group">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Paste Google Cloud API Key..."
                className="w-full bg-[#151515] border border-cine-border p-3 pl-4 text-sm text-white rounded-sm focus:border-cine-accent outline-none placeholder:text-cine-text-dim/30 font-mono transition-all group-hover:border-[#555]"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {inputKey ? (
                  <span className="text-[9px] text-green-500 font-bold bg-green-900/20 px-1.5 py-0.5 rounded">PRO READY</span>
                ) : (
                  <span className="text-[9px] text-cine-text-dim bg-[#222] px-1.5 py-0.5 rounded border border-[#333]">STANDARD</span>
                )}
              </div>
            </div>
            <p className="text-[10px] text-cine-text-dim mt-2 leading-relaxed">
              Leave blank to use <strong>Standard Mode (Gemini 3 Flash)</strong>. <br />
              Gemini 3 Pro requires a billing-enabled project key for advanced reasoning.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-transparent border border-[#333] hover:bg-[#333] text-cine-text text-xs font-bold uppercase rounded-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-[2] py-3 bg-cine-accent hover:bg-cine-accent-hover text-white font-bold uppercase tracking-widest text-xs rounded-sm transition-all shadow-lg hover:shadow-cine-accent/20 flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-4 h-4" />
              {inputKey.trim().length > 0 ? 'Initialize Pro Engine' : 'Initialize Standard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;