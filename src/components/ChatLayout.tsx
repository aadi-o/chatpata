import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, MessageSquareWarning, Flame, Sparkles, BrainCircuit, Settings } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';
import { useChat } from '../hooks/useChat';
import { Creature } from '../components/Creature';
import { MessageBubble } from '../components/MessageBubble';
import { SettingsModal } from '../components/SettingsModal';
import { motion, AnimatePresence } from 'motion/react';

export const ChatLayout: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { messages, isTyping, personalityMode, setPersonalityMode, clearChat } = useChatStore();
  const { sendMessage, error } = useChat();
  const [input, setInput] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      sendMessage(input);
      setInput('');
    }
  };

  const personalityOptions = [
    { id: 'Best Friend', icon: <Sparkles size={16} />, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { id: 'Roast Mode', icon: <Flame size={16} />, color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'Chaos Mode', icon: <MessageSquareWarning size={16} />, color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200' },
    { id: 'Therapist Lite', icon: <BrainCircuit size={16} />, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  ];

  return (
    <div className="w-full h-screen bg-[#F7F7F5] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Sidebar / Left Column (Hidden on mobile) */}
      <div className="hidden md:flex w-80 border-r border-[#EFEFEA] bg-white flex-col h-full z-10 shadow-sm relative">
        <div className="p-6 border-b border-[#EFEFEA] flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={onBack}>
             <ArrowLeft size={20} className="opacity-50 group-hover:opacity-100 transition-opacity" />
             <span className="font-bold text-lg tracking-tight">ChatPata</span>
          </div>
          <button 
             onClick={() => setIsSettingsOpen(true)}
             className="opacity-50 hover:opacity-100 transition-opacity bg-gray-50 p-2 rounded-full border border-gray-100"
          >
             <Settings size={16} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
           <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">Personality Engine</div>
           <div className="flex flex-col gap-2">
             {personalityOptions.map((mode) => (
                <button 
                  key={mode.id}
                  onClick={() => setPersonalityMode(mode.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    personalityMode === mode.id 
                      ? `${mode.color} shadow-sm` 
                      : 'border-transparent hover:bg-[#F7F7F5] text-gray-600'
                  }`}
                >
                  <div className="bg-white p-1.5 rounded-lg shadow-sm">
                     {mode.icon}
                  </div>
                  <span className="font-semibold">{mode.id}</span>
                </button>
             ))}
           </div>

           <div className="mt-8">
              <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">Memory Sync</div>
              <div className="p-4 bg-[#F7F7F5] rounded-xl border border-[#EFEFEA] text-sm relative overflow-hidden group">
                 <p className="opacity-70 mb-2 relative z-10">Creature is learning your habits...</p>
                 <div className="h-1.5 w-full bg-[#EFEFEA] rounded-full overflow-hidden relative z-10">
                    <motion.div 
                       className="h-full bg-blue-500"
                       initial={{ width: '0%' }}
                       animate={{ width: messages.length > 5 ? '100%' : `${messages.length * 20}%` }}
                    />
                 </div>
                 {/* Decorative background grid */}
                 <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>
              </div>
           </div>
        </div>

        <div className="p-6 border-t border-[#EFEFEA] flex justify-between items-center bg-gray-50/50">
           <button onClick={clearChat} className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors">
              Reset Memory
           </button>
           <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse"></div>
           </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-[#EFEFEA] bg-white flex items-center justify-between z-20 shadow-sm relative">
           <div className="flex items-center gap-2" onClick={onBack}>
              <ArrowLeft size={18} />
              <span className="font-bold">ChatPata AI</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="text-[10px] font-bold bg-gray-100 px-2.5 py-1 rounded-full text-gray-600 border border-gray-200 shadow-inner">
                {personalityMode}
              </div>
              <button onClick={() => setIsSettingsOpen(true)}>
                 <Settings size={18} className="opacity-50" />
              </button>
           </div>
        </div>

        {/* Creature Display (Floating in background on Desktop, Top on Mobile) */}
        <div className="md:absolute top-8 right-8 z-0 pointer-events-none hidden md:block opacity-80 scale-75 xl:scale-100 xl:opacity-100 transition-all">
           <Creature />
        </div>
        
        {/* Mobile Creature Display */}
        <div className="md:hidden flex justify-center py-4 bg-[#F7F7F5] border-b border-[#EFEFEA] pt-6 relative overflow-hidden">
           <div className="scale-[0.8] origin-top relative z-10 pb-4">
              <Creature />
           </div>
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F7F7F5] z-20 pointer-events-none"></div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-6 z-10 scroll-smooth">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 mt-8 md:mt-0">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-6 max-w-md"
               >
                 <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Start the Chaos.</h2>
                 <p className="text-lg opacity-60">
                   You are in <span className="font-bold text-[#111111] italic">{personalityMode}</span> mode. 
                   Say something to wake up your creature.
                 </p>
                 <div className="flex flex-wrap gap-2 justify-center mt-8">
                   {['Roast my outfit', 'Tell me a joke', 'I need life advice'].map((suggestion) => (
                      <button 
                        key={suggestion}
                        onClick={() => { setInput(suggestion); sendMessage(suggestion); setInput(''); }}
                        className="px-4 py-2 bg-white border border-[#EFEFEA] rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-sm hover:border-gray-300"
                      >
                        {suggestion}
                      </button>
                   ))}
                 </div>
               </motion.div>
            </div>
          ) : (
             <AnimatePresence initial={false}>
               {messages.map((message) => (
                 <MessageBubble key={message.id} message={message} />
               ))}
               {isTyping && (
                 <motion.div
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex w-full justify-start"
                 >
                   <div className="bg-white border border-[#EFEFEA] py-5 px-6 rounded-3xl rounded-bl-sm shadow-sm flex gap-1.5 items-center max-w-[100px]">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                 </motion.div>
               )}
               {error && (
                 <div className="flex w-full justify-center my-4">
                    <span className="text-red-500 text-sm bg-red-50 px-5 py-2.5 rounded-full border border-red-200 shadow-sm font-medium">
                      {error}
                    </span>
                 </div>
               )}
               <div ref={messagesEndRef} className="h-4" />
             </AnimatePresence>
          )}
        </div>

        {/* Input Area */}
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8 z-10 bg-gradient-to-t from-[#F7F7F5] via-[#F7F7F5] pb-6 md:pb-8">
          <form onSubmit={handleSubmit} className="relative group">
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message your companion..."
                disabled={isTyping}
                className="w-full bg-white border border-[#EFEFEA] shadow-xl rounded-full py-4 pl-6 pr-16 text-[#111111] font-medium outline-none focus:ring-2 focus:ring-orange-500/50 transition-all disabled:opacity-70 text-lg hover:border-gray-300"
             />
             <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-[#111111] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all font-medium"
             >
                <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
             </button>
          </form>
          <div className="text-center mt-4 text-xs text-gray-400 font-medium">
             ChatPata AI makes mistakes. Always double check it.
          </div>
        </div>

      </div>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};


