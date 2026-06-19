import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'USER';
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.content);
      // Try to find a nice Indian Hinglish Male voice
      if (window.speechSynthesis.getVoices) {
        const voices = window.speechSynthesis.getVoices();
        
        // Let's filter first for Indian accents (en-IN or hi-IN)
        const indianVoices = voices.filter(v => v.lang.includes('en-IN') || v.lang.includes('en_IN') || v.lang.includes('hi') || v.lang.includes('HI'));
        
        // Find a male Indian voice if possible
        let selectedVoice = indianVoices.find(v => {
          const name = v.name.toLowerCase();
          return name.includes('male') || name.includes('rishi') || name.includes('ravi') || name.includes('heera') || name.includes('prabhat');
        });

        // Fallback to any Indian voice
        if (!selectedVoice && indianVoices.length > 0) {
          selectedVoice = indianVoices[0];
        }

        // Fallback to any English male voice
        if (!selectedVoice) {
          selectedVoice = voices.find(v => {
            const name = v.name.toLowerCase();
            const lang = v.lang.toLowerCase();
            return (lang.includes('en') && (name.includes('male') || name.includes('david') || name.includes('george') || name.includes('mark') || name.includes('guy') || name.includes('microsoft')));
          });
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        // Set pitch lower (0.85 - 0.9) to simulate a deep, cool, and highly realistic masculine voice
        const isSelectedMale = selectedVoice && (selectedVoice.name.toLowerCase().includes('male') || selectedVoice.name.toLowerCase().includes('rishi') || selectedVoice.name.toLowerCase().includes('ravi') || selectedVoice.name.toLowerCase().includes('david') || selectedVoice.name.toLowerCase().includes('george'));
        utterance.pitch = isSelectedMale ? 0.95 : 0.82; // Force masculine profile on general voices
        utterance.rate = 1.02; // Prompt and natural tempo
      }
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-300 flex-shrink-0 flex items-center justify-center mt-auto mb-1 shadow-sm relative overflow-visible">
          <span className="relative w-full h-full flex items-center justify-center">
            {/* Animated Cat ears */}
            <motion.div 
              className="absolute -top-1 left-1.5 w-2.5 h-2.5 bg-orange-400 rounded-tr-[50%] rounded-tl-[80%] rounded-br-[20%] rotate-[-20deg]"
              animate={{ rotate: [-20, -35, -5, -20] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -top-1 right-1.5 w-2.5 h-2.5 bg-orange-400 rounded-tl-[50%] rounded-tr-[80%] rounded-bl-[20%] rotate-[20deg]"
              animate={{ rotate: [20, 5, 35, 20] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.2 }}
            />
            {/* Inner pink ears */}
            <div className="absolute -top-0.5 left-2 w-1.5 h-1.5 bg-pink-300 rounded-tr-[40%] rounded-tl-[70%] rotate-[-20deg]" />
            <div className="absolute -top-0.5 right-2 w-1.5 h-1.5 bg-pink-300 rounded-tl-[40%] rounded-tr-[70%] rotate-[20deg]" />

            {/* Cat Face SVG */}
            <svg viewBox="0 0 100 100" className="w-6 h-6 text-orange-700 select-none fill-current mt-0.5 z-10">
              {/* Cat Eyes */}
              <motion.ellipse 
                cx="30" cy="45" rx="6" ry="6" 
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ repeat: Infinity, duration: 3, times: [0, 0.45, 0.5, 0.55, 1] }}
              />
              <motion.ellipse 
                cx="70" cy="45" rx="6" ry="6" 
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ repeat: Infinity, duration: 3, times: [0, 0.45, 0.5, 0.55, 1] }}
              />
              {/* Nose & Mouth */}
              <polygon points="50,55 45,50 55,50" className="fill-orange-800" />
              <path d="M 45 57 Q 50 63 50 57 Q 50 63 55 57" fill="none" strokeWidth="4" strokeLinecap="round" className="stroke-current" />
              {/* Blushing cheeks */}
              <motion.ellipse 
                cx="20" cy="53" rx="6" ry="4" 
                className="fill-red-400/70"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              />
              <motion.ellipse 
                cx="80" cy="53" rx="6" ry="4" 
                className="fill-red-400/70"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              />
            </svg>
            
            {/* Tiny moving tail */}
            <motion.div 
              className="absolute -right-1 bottom-1 w-2 h-3.5 bg-orange-400 rounded-full origin-bottom"
              animate={{ rotate: [-20, 25, -20] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            />
          </span>
        </div>
      )}
      <div 
        className={cn(
          "max-w-[85%] md:max-w-[75%] p-4 shadow-sm relative overflow-hidden backdrop-blur-md transition-all duration-300",
          isUser 
            ? "bg-gradient-to-br from-zinc-900/90 via-zinc-900/80 to-[#111]/70 text-white border border-white/10 rounded-3xl rounded-br-sm shadow-[0_8px_32px_rgba(0,0,0,0.15)]" 
            : "bg-gradient-to-br from-white/75 via-white/50 to-white/30 border border-white/60 text-[#111111] rounded-3xl rounded-bl-sm shadow-[0_8px_32px_rgba(31,38,135,0.04)]"
        )}
      >
        <div className={cn("markdown-body leading-relaxed text-[15px]", isUser && "text-white prose-invert")}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
              a: ({href, children}) => <a href={href} className="underline underline-offset-2 hover:text-orange-400 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
              code: ({inline, className, children, ...props}: any) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="bg-[#1a1a1a] rounded-lg my-3 overflow-hidden text-[13px] border border-gray-800">
                    <div className="flex items-center px-4 py-2 bg-[#222] text-gray-400 text-xs font-mono border-b border-gray-800">
                      {match[1]}
                    </div>
                    <pre className="p-4 overflow-x-auto text-gray-300">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                ) : (
                  <code className={cn("bg-black/10 rounded px-1.5 py-0.5 text-[0.9em] font-mono", isUser ? "bg-white/20 text-orange-200" : "text-orange-600")} {...props}>
                    {children}
                  </code>
                )
              },
              ul: ({children}) => <ul className="list-disc pl-5 mb-2 space-y-1 marker:text-orange-400">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal pl-5 mb-2 space-y-1 marker:text-orange-400">{children}</ol>,
              li: ({children}) => <li>{children}</li>,
              strong: ({children}) => <strong className="font-bold">{children}</strong>,
              blockquote: ({children}) => <blockquote className="border-l-4 border-orange-500 pl-4 py-1 my-3 bg-orange-50/50 rounded-r-lg italic text-gray-700">{children}</blockquote>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        {/* Timestamp & Speak Tool */}
        <div className={cn(
          "text-[10px] mt-2 font-medium opacity-50 flex items-center justify-between gap-4",
          isUser ? "text-right justify-end" : "text-left justify-between"
        )}>
          {!isUser && (
            <button 
              onClick={toggleSpeech} 
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full hover:opacity-100 transition-all border border-black/10 text-[10px] font-bold cursor-pointer relative z-20",
                isSpeaking 
                  ? "bg-orange-500/20 text-orange-700 hover:bg-orange-500/30 animate-pulse border-orange-500/30" 
                  : "bg-black/5 hover:bg-black/10 text-gray-700"
              )}
              title={isSpeaking ? "Stop Speaking" : "Speak Response"}
            >
              {isSpeaking ? <VolumeX size={11} className="shrink-0" /> : <Volume2 size={11} className="shrink-0" />}
              <span>{isSpeaking ? "Speaking..." : "Read Aloud"}</span>
            </button>
          )}
          <div>
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
