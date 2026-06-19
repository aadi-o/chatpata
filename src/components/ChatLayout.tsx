import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Settings, Trash2, Mic, MicOff } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';
import { useChat } from '../lib/hooks/useChat';
import { Creature } from '../components/Creature';
import { MessageBubble } from '../components/MessageBubble';
import { SettingsModal } from '../components/SettingsModal';
import { motion, AnimatePresence } from 'motion/react';

export const ChatLayout: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { messages, isTyping, personalityMode, setPersonalityMode, clearChat } = useChatStore();
  const { sendMessage, error } = useChat();
  const [input, setInput] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser.");
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      // You can set the language here if needed, e.g., recognition.lang = 'en-US';
      
      let currentFinal = input;
      
      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        currentFinal += final;
        setInput(currentFinal + interim);
      };
      
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="w-full h-screen bg-[#F7F7F5] flex flex-col overflow-hidden font-sans relative">
      {/* Aurora Glass Blurs */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-orange-300/15 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-amber-200/15 blur-[120px] pointer-events-none z-0"></div>
      
      {/* Universal Header */}
      <div className="flex items-center justify-between p-4 md:px-8 bg-white/40 backdrop-blur-xl z-20 border-b border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.02)]">
         <div className="flex items-center gap-4 cursor-pointer group" onClick={onBack}>
            <div className="p-2 border border-transparent rounded-full group-hover:bg-gray-100/50 transition-colors">
               <ArrowLeft size={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-2">
               <div className="w-7 h-7 md:w-8 md:h-8 bg-[#111111] rounded-full flex items-center justify-center shadow-sm">
                 <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#F7F7F5] rounded-full block"></div>
               </div>
               <span className="font-bold text-lg md:text-xl tracking-tighter">
                 NIG <span className="text-orange-500 italic">AI</span>
               </span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button 
                onClick={clearChat}
                className="opacity-50 hover:opacity-100 transition-opacity bg-red-50/50 text-red-500 p-2 rounded-full hover:bg-red-100/80 border border-red-200/35"
                title="Reset Chat"
              >
                 <Trash2 size={16} />
              </button>
            )}
            <select
              value={personalityMode}
              onChange={(e) => setPersonalityMode(e.target.value)}
              className="text-[12px] font-bold bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full text-gray-700 border border-white/80 outline-none cursor-pointer focus:ring-2 focus:ring-orange-500/20 shadow-sm appearance-none pr-8 relative"
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
               className="opacity-50 hover:opacity-100 transition-opacity bg-white/60 backdrop-blur-md p-2 rounded-full border border-white/80"
            >
               <Settings size={18} />
            </button>
         </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full relative bg-transparent overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40 z-0"></div>
        {messages.length === 0 ? (
           <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full mx-auto max-w-4xl xl:max-w-6xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl lg:max-w-3xl flex flex-col items-center justify-center -mt-8 md:-mt-16 xl:-mt-24 mx-auto"
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
                        className="w-full bg-white/60 border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl rounded-full py-3.5 md:py-4 pl-5 md:pl-6 pr-24 md:pr-28 text-[#111111] font-semibold outline-none focus:bg-white/95 focus:border-orange-500/30 focus:shadow-[0_20px_50px_rgba(249,115,22,0.12)] transition-all duration-300 disabled:opacity-70 text-base md:text-lg"
                     />
                     <div className="absolute right-1.5 md:right-2 top-1.5 md:top-2 bottom-1.5 md:bottom-2 flex gap-1">
                       <button
                          type="button"
                          onClick={toggleListening}
                          className={`aspect-square rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-md' : 'bg-white/80 text-gray-500 hover:bg-gray-100/90'}`}
                          title="Transcribe with Voice"
                       >
                          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                       </button>
                       <button 
                          type="submit" 
                          disabled={!input.trim() || isTyping}
                          className="aspect-square bg-[#111111] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                       >
                          <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
                       </button>
                     </div>
                  </form>
                  <div className="flex justify-center mt-4 mb-2">
                    <div className="text-[11px] font-bold tracking-widest uppercase bg-gradient-to-r from-orange-100/60 via-yellow-100/60 to-emerald-100/60 text-gray-700 px-3 py-1 rounded-full shadow-sm backdrop-blur-md border border-white/40">
                       {personalityMode === 'Auto' ? 'Autopilot Active' : `${personalityMode} Mode`}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-4 max-w-lg">
                    {['Roast my outfit', 'Tell me a joke', 'I need life advice'].map((suggestion) => (
                       <button 
                         key={suggestion}
                         onClick={() => { setInput(suggestion); sendMessage(suggestion); setInput(''); }}
                         className="px-4 py-2 bg-white/60 hover:bg-white/95 border border-white/80 rounded-full text-xs md:text-sm font-bold hover:scale-105 transition-transform backdrop-blur-md shadow-sm text-gray-700 cursor-pointer"
                       >
                         {suggestion}
                       </button>
                    ))}
                  </div>
              </motion.div>
           </div>
        ) : (
           <div className="w-full h-full flex flex-col md:flex-row relative bg-transparent">
             
             {/* Creature Display Side Panel (Desktop) */}
             <div className="hidden md:flex flex-col items-center justify-center w-[35%] lg:w-[40%] xl:w-[35%] 2xl:w-[30%] bg-white/35 backdrop-blur-xl border-r border-white/40 p-8 lg:p-12 z-20 shadow-[4px_0_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                 <div className="animate-[bounce_4s_infinite] drop-shadow-xl hover:scale-105 transition-transform duration-500 cursor-pointer relative z-10">
                     <Creature className="scale-[1.2] lg:scale-[1.4] xl:scale-[1.6]" />
                 </div>
                 <div className="mt-16 xl:mt-24 text-center max-w-sm relative z-10">
                     <h3 className="font-bold text-2xl xl:text-3xl mb-3 text-[#111111] tracking-tight">Your Companion</h3>
                     <p className="text-sm lg:text-base xl:text-lg text-gray-500 font-medium leading-relaxed">
                       {personalityMode === 'Auto' ? 'Auto-pilot active. Warning: May switch personalities without notice.' : `${personalityMode} Mode active.`}
                     </p>
                 </div>
             </div>

             {/* Creature Header (Mobile) */}
             <div className="md:hidden flex flex-col items-center justify-center bg-white/25 backdrop-blur-xl pt-5 pb-3 border-b border-white/30 z-20 shadow-sm relative overflow-visible">
                 <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden" style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                 <div className="scale-[0.65] origin-center -my-9 hover:scale-[0.7] transition-transform duration-300 relative z-10 overflow-visible">
                     <Creature />
                 </div>
                 <div className="text-[10px] uppercase font-bold tracking-widest text-orange-600 mt-2 bg-orange-100/90 px-3 py-1 rounded-full border border-orange-200 relative z-10 shadow-sm">
                    {personalityMode === 'Auto' ? 'Autopilot Active' : `${personalityMode} Mode`}
                 </div>
             </div>

             {/* Chat Area */}
             <div className="flex-1 flex flex-col h-full relative z-10 w-full overflow-hidden bg-white/15 backdrop-blur-xl">
               <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50"></div>
               {/* Messages List */}
               <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 scroll-smooth relative z-10">
                 <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl w-full mx-auto flex flex-col gap-6">
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
                         <div className="bg-white/60 border border-white/80 py-5 px-6 rounded-3xl rounded-bl-sm shadow-sm flex gap-1.5 items-center max-w-[100px] backdrop-blur-md">
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
               </div>

               {/* Input Area */}
               <div className="w-full p-3 md:p-8 z-20 bg-white/30 backdrop-blur-2xl pb-4 sm:pb-6 md:pb-8 border-t border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                  {/* Realistic Typing Indicator directly above the chat input */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full mb-3 flex items-center justify-start px-2"
                      >
                        <div className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/15 rounded-2xl shadow-sm backdrop-blur-md">
                          <div className="flex gap-1 items-center shrink-0">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                          </div>
                          <span className="text-xs font-bold text-orange-700 tracking-wide animate-pulse">
                            {personalityMode === 'Sarcastic' && "NIG AI is drafting some toxic sarcasm... 😏💅"}
                            {personalityMode === 'Chaotic' && "NIG AI is cooking crazy unhinged logic... 💀💥"}
                            {personalityMode === 'Supportive' && "NIG AI is crafting some abusive brotherly advice... 🤝😭"}
                            {personalityMode === 'Intellectual' && "NIG AI is compiling high-brain tech-slams... 🤡🧠"}
                            {personalityMode === 'Auto' && "NIG AI is preparing a brutal response... 💀🤫"}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                 <form onSubmit={handleSubmit} className="relative group max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full">
                    <input
                       type="text"
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       placeholder="Type your message..."
                       disabled={isTyping}
                       className="w-full bg-white/70 border border-white/80 shadow-[0_4px_30px_rgba(0,0,0,0.02)] backdrop-blur-md rounded-full py-3.5 md:py-4 pl-5 md:pl-6 pr-24 md:pr-28 text-[#111111] font-semibold outline-none focus:bg-white focus:border-orange-500/25 focus:shadow-[0_8px_30px_rgba(249,115,22,0.12)] transition-all duration-300 disabled:opacity-60 text-base md:text-lg placeholder:text-gray-400"
                    />
                    <div className="absolute right-1.5 md:right-2 top-1.5 md:top-2 bottom-1.5 md:bottom-2 flex gap-1">
                      <button
                         type="button"
                         onClick={toggleListening}
                         className={`aspect-square rounded-full flex items-center justify-center transition-all duration-200 ${isListening ? 'bg-red-500 text-white animate-pulse shadow-md' : 'bg-white/80 border border-white/60 text-gray-500'}`}
                         title="Transcribe with Voice"
                      >
                         {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                      </button>
                      <button 
                         type="submit" 
                         disabled={!input.trim() || isTyping}
                         className="aspect-square bg-[#111111] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all duration-200 font-medium shadow-md group-focus-within:bg-orange-500 group-focus-within:shadow-orange-500/30"
                      >
                         <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
                      </button>
                    </div>
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



