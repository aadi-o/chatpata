import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Settings, Trash2 } from 'lucide-react';
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

  return (
    <div className="w-full h-screen bg-[#F7F7F5] flex flex-col overflow-hidden font-sans">
      
      {/* Universal Header */}
      <div className="flex items-center justify-between p-4 md:px-8 bg-white z-20 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
         <div className="flex items-center gap-4 cursor-pointer group" onClick={onBack}>
            <div className="p-2 border border-transparent rounded-full group-hover:bg-gray-100 transition-colors">
               <ArrowLeft size={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-2">
               <div className="w-7 h-7 md:w-8 md:h-8 bg-[#111111] rounded-full flex items-center justify-center shadow-sm">
                 <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#F7F7F5] rounded-full block"></div>
               </div>
               <span className="font-bold text-lg md:text-xl tracking-tighter">
                 ChatPata <span className="text-orange-500 italic">AI</span>
               </span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button 
                onClick={clearChat}
                className="opacity-50 hover:opacity-100 transition-opacity bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100"
                title="Reset Chat"
              >
                 <Trash2 size={16} />
              </button>
            )}
            <select
              value={personalityMode}
              onChange={(e) => setPersonalityMode(e.target.value)}
              className="text-[12px] font-bold bg-white px-3 py-1.5 rounded-full text-gray-700 border border-gray-200 outline-none cursor-pointer focus:ring-2 focus:ring-orange-500/20 shadow-sm appearance-none pr-8 relative"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '14px'
              }}
            >
              <option value="Auto">Auto Mode</option>
              <option value="Sarcastic">Sarcastic</option>
              <option value="Supportive">Supportive</option>
              <option value="Intellectual">Intellectual</option>
              <option value="Chaotic">Chaotic</option>
            </select>
            <button 
               onClick={() => setIsSettingsOpen(true)}
               className="opacity-50 hover:opacity-100 transition-opacity bg-gray-50 p-2 rounded-full border border-gray-100"
            >
               <Settings size={18} />
            </button>
         </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50 z-0"></div>
        {messages.length === 0 ? (
           <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl flex flex-col items-center justify-center -mt-8 md:-mt-16"
              >
                 <div className="mb-8 relative max-w-[200px] hover:scale-105 transition-transform duration-500 cursor-pointer">
                    <Creature className="scale-[1.1]" />
                 </div>
                 <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-[#111111] tracking-tight text-center">What's on your mind?</h1>
                 
                 <form onSubmit={handleSubmit} className="w-full relative group">
                     <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Message your companion..."
                        disabled={isTyping}
                        className="w-full bg-white border border-[#EFEFEA] shadow-xl rounded-full py-3.5 md:py-4 pl-5 md:pl-6 pr-14 md:pr-16 text-[#111111] font-medium outline-none focus:ring-4 focus:ring-orange-500/20 transition-all disabled:opacity-70 text-base md:text-lg hover:border-gray-300"
                     />
                     <button 
                        type="submit" 
                        disabled={!input.trim() || isTyping}
                        className="absolute right-1.5 md:right-2 top-1.5 md:top-2 bottom-1.5 md:bottom-2 aspect-square bg-[#111111] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                     >
                        <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
                     </button>
                  </form>
                  <div className="flex justify-center mt-4 mb-2">
                    <div className="text-[11px] font-bold tracking-widest uppercase bg-gradient-to-r from-orange-100 via-yellow-100 to-emerald-100 text-gray-700 px-3 py-1 rounded-full shadow-sm">
                       {personalityMode === 'Auto' ? 'Autopilot Active' : `${personalityMode} Mode`}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-4 max-w-lg">
                    {['Roast my outfit', 'Tell me a joke', 'I need life advice'].map((suggestion) => (
                       <button 
                         key={suggestion}
                         onClick={() => { setInput(suggestion); sendMessage(suggestion); setInput(''); }}
                         className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs md:text-sm font-semibold hover:scale-105 transition-transform shadow-sm text-gray-600 hover:border-gray-300"
                       >
                         {suggestion}
                       </button>
                    ))}
                  </div>
              </motion.div>
           </div>
        ) : (
           <div className="w-full h-full flex flex-col md:flex-row relative bg-white">
             
             {/* Creature Display Side Panel (Desktop) */}
             <div className="hidden md:flex flex-col items-center justify-center w-[35%] lg:w-[40%] bg-[#F7F7F5] border-r border-[#EFEFEA] p-8 z-20 shadow-[2px_0_15px_rgba(0,0,0,0.03)] relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                 <div className="animate-[bounce_4s_infinite] drop-shadow-xl hover:scale-105 transition-transform duration-500 cursor-pointer relative z-10">
                     <Creature className="scale-[1.2] lg:scale-[1.4]" />
                 </div>
                 <div className="mt-16 text-center max-w-sm relative z-10">
                     <h3 className="font-bold text-2xl mb-3 text-[#111111] tracking-tight">Your Companion</h3>
                     <p className="text-sm lg:text-base text-gray-500 font-medium leading-relaxed">
                       {personalityMode === 'Auto' ? 'Auto-pilot active. Warning: May switch personalities without notice.' : `${personalityMode} Mode active.`}
                     </p>
                 </div>
             </div>

             {/* Creature Header (Mobile) */}
             <div className="md:hidden flex flex-col items-center justify-center bg-[#F7F7F5] pt-4 pb-2 border-b border-[#EFEFEA] z-20 shadow-sm relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                 <div className="scale-[0.55] origin-center -my-10 hover:scale-[0.6] transition-transform duration-300 relative z-10">
                     <Creature />
                 </div>
                 <div className="text-[10px] uppercase font-bold tracking-widest text-orange-600 mt-2 bg-orange-100/80 px-3 py-1 rounded-full border border-orange-200 relative z-10">
                    {personalityMode === 'Auto' ? 'Autopilot Active' : `${personalityMode} Mode`}
                 </div>
             </div>

             {/* Chat Area */}
             <div className="flex-1 flex flex-col h-full relative z-10 w-full overflow-hidden bg-white">
               <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50"></div>
               {/* Messages List */}
               <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 flex flex-col gap-6 scroll-smooth relative z-10">
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
               </div>

               {/* Input Area */}
               <div className="w-full p-3 md:p-8 z-20 bg-white/95 backdrop-blur-xl pb-4 sm:pb-6 md:pb-8 border-t border-[#EFEFEA] shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                 <form onSubmit={handleSubmit} className="relative group max-w-3xl mx-auto w-full">
                    <input
                       type="text"
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       placeholder="Type your message..."
                       disabled={isTyping}
                       className="w-full bg-[#F7F7F5] border-2 border-transparent shadow-inner rounded-full py-3.5 md:py-4 pl-5 md:pl-6 pr-14 md:pr-16 text-[#111111] font-medium outline-none focus:bg-white focus:border-orange-500/20 focus:shadow-[0_8px_30px_rgba(249,115,22,0.1)] transition-all duration-300 disabled:opacity-60 text-base md:text-lg placeholder:text-gray-400 hover:bg-[#F2F2F0]"
                    />
                    <button 
                       type="submit" 
                       disabled={!input.trim() || isTyping}
                       className="absolute right-1.5 md:right-2 top-1.5 md:top-2 bottom-1.5 md:bottom-2 aspect-square bg-[#111111] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all duration-200 font-medium shadow-md group-focus-within:bg-orange-500 group-focus-within:shadow-orange-500/30"
                    >
                       <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
                    </button>
                 </form>
                 <div className="text-center mt-3 text-[11px] text-gray-400 font-medium tracking-wide">
                    Companion AI may generate unpredictable responses.
                 </div>
               </div>
             </div>
           </div>
        )}
      </div>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};



