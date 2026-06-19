import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Key, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [userName, setUserName] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app we'd save to localStorage or backend
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#EFEFEA] bg-[#F7F7F5]">
              <h2 className="font-bold text-lg">System Preferences</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* User Config */}
              <div className="space-y-3">
                 <label className="text-sm font-semibold text-gray-700 block">Your Name</label>
                 <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. NIG AI Enjoyer"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/50 outline-none transition-shadow"
                 />
                 <p className="text-xs text-gray-500">So the creature knows who to roast.</p>
              </div>

              {/* API Key (Mock) */}
              <div className="space-y-3">
                 <label className="text-sm font-semibold text-gray-700 block flex items-center gap-2">
                    <Key size={14} className="text-orange-500" />
                    Custom API Key (Optional)
                 </label>
                 <input 
                    type="password" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/50 outline-none transition-shadow"
                 />
                 <div className="flex gap-2 items-start text-xs text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-100">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <p>
                       By default, the deployed version uses the server's environment variable API key. Do not provide yours unless you are hosting this yourself.
                    </p>
                 </div>
              </div>

            </div>

            <div className="p-4 border-t border-[#EFEFEA] bg-[#F7F7F5] flex justify-end">
               <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-[#111111] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:scale-105 transition-transform"
               >
                 {saved ? (
                    <>Saved!</>
                 ) : (
                    <><Save size={16} /> Save Changes</>
                 )}
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
