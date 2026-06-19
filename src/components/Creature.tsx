import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCreatureStore } from '../stores/creatureStore';

export const Creature: React.FC<{ className?: string }> = ({ className }) => {
  const { mood, responseLength, responseSentiment } = useCreatureStore();

  const moodVariants: any = {
    idle: { y: [0, -10, 0], rotate: [0, 2, -2, 0], scale: 1, transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } },
    thinking: { y: [0, -5, 0], rotate: [-5, 5, -5], scale: 1.05, transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } },
    typing: { y: [0, -15, 0], rotate: [0, -2, 2, 0], scale: 1, transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" } },
    happy: { y: [0, -20, 0], rotate: [0, 10, -10, 0], scale: 1.1, transition: { repeat: Infinity, duration: 1, ease: "easeOut" } },
    celebrating: { y: [0, -30, 0], rotate: [0, 360], scale: 1.2, transition: { repeat: Infinity, duration: 2, ease: "circOut" } },
    roasting: { y: 0, rotate: 5, scale: 1.1, skewX: -5, transition: { duration: 0.5 } },
    chaos: { y: [0, -20, 10, -5, 0], x: [-10, 10, -20, 20, 0], rotate: [0, 45, -45, 90, 0], transition: { repeat: Infinity, duration: 0.5, ease: "linear" } },
    sleepy: { y: [0, 5, 0], scale: 0.95, opacity: 0.8, transition: { repeat: Infinity, duration: 5, ease: "easeInOut" } },
    sad: { y: 10, scale: 0.9, rotate: -5, opacity: 0.7, transition: { duration: 1 } },
    proud: { y: -10, scale: 1.15, rotate: 0, transition: { duration: 0.5 } },
    confused: { y: 0, rotate: [0, 15, -15, 0], x: [0, 10, -10, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } },
  };

  // Dynamically tweak duration and scaling depending on the AI's response length and sentiment
  const activeVariant = moodVariants[mood] || moodVariants.idle;
  
  // Create a copy or overrides to build runtime responsive animation speeds
  let customTransition = { ...(activeVariant.transition || { duration: 0.5 }) };
  if (customTransition.duration) {
    if (responseLength === 'long') {
      customTransition.duration *= 1.5; // slow down for long explanations, tired look
    } else if (responseLength === 'short') {
      customTransition.duration *= 0.6; // speed up for short snappy roasts!
    }
  }

  const eyeVariants: any = {
    idle: { scaleY: [1, 1, 1, 0.1, 1, 1], transition: { repeat: Infinity, duration: 3, times: [0, 0.4, 0.45, 0.5, 0.55, 1] } },
    thinking: { scaleY: 0.8, x: 2, y: -2 },
    typing: { scaleY: [1, 0.5, 1], transition: { repeat: Infinity, duration: 0.2 } },
    happy: { scaleY: 0.2, scaleX: 1.2, y: -2 },
    celebrating: { scaleY: 0.2, scaleX: 1.2, y: -4 },
    roasting: { scaleY: 0.4, scaleX: 1.1, rotate: -10 },
    chaos: { scaleY: [1, 0.1, 1.5, 0.5], scaleX: [1, 1.5, 0.5, 1], transition: { repeat: Infinity, duration: 0.3 } },
    sleepy: { scaleY: 0.1, y: 2 },
    sad: { scaleY: 0.8, scaleX: 1.1, rotate: 10, y: 2 },
    proud: { scaleY: 0.8, y: -2 },
    confused: { scaleY: [1, 0.5, 1], scaleX: [1, 1.2, 1], x: [0, 2, 0], transition: { repeat: Infinity, duration: 1 } },
  };
  
  const mouthVariants: any = {
    idle: { scaleY: 1, borderRadius: "50%", borderBottomWidth: "4px" },
    thinking: { scaleY: 0.5, scaleX: 0.5, borderBottomWidth: "2px" },
    typing: { scaleY: [1, 1.2, 1], scaleX: [1, 0.8, 1], transition: { repeat: Infinity, duration: 0.5 } },
    happy: { scaleY: 1.5, borderRadius: "10% 10% 50% 50%", borderBottomWidth: "6px" },
    celebrating: { scaleY: 2, scaleX: 1.5, borderRadius: "10% 10% 50% 50%", borderBottomWidth: "8px", background: "#111" },
    roasting: { scaleY: 0.2, scaleX: 1.2, rotate: 5, borderRadius: "0%", borderBottomWidth: "4px" },
    chaos: { scaleY: [1, 2, 0.5], scaleX: [1, 0.5, 2], transition: { repeat: Infinity, duration: 0.2 } },
    sleepy: { scaleY: 0.5, scaleX: 0.5, borderRadius: "50%", borderBottomWidth: "2px", opacity: 0.5 },
    sad: { scaleY: 1, borderRadius: "50% 50% 10% 10%", borderTopWidth: "4px", borderBottomWidth: "0px", y: 2 },
    proud: { scaleY: 1, scaleX: 1.2, borderRadius: "20% 20% 50% 50%", borderBottomWidth: "4px" },
    confused: { scaleY: 0.2, scaleX: 0.5, x: -2, borderBottomWidth: "4px" },
  };

  let gradientClass = "from-orange-300 via-orange-400 to-orange-600";
  if (mood === 'sleepy') gradientClass = "from-indigo-300 via-indigo-400 to-indigo-600";
  if (mood === 'sad') gradientClass = "from-blue-300 via-blue-400 to-blue-600";
  if (mood === 'chaos') gradientClass = "from-fuchsia-400 via-purple-500 to-red-500";

  // Additional graphical border styles or classes depending on reaction sentiment
  let feedbackRingClass = "";
  if (responseSentiment === 'savage') {
    feedbackRingClass = "shadow-[0_0_35px_rgba(239,68,68,0.7)] border-2 border-red-500/50";
  } else if (responseSentiment === 'chaotic') {
    feedbackRingClass = "shadow-[0_0_35px_rgba(217,70,239,0.7)] border-2 border-fuchsia-500/50 animate-pulse";
  } else if (responseSentiment === 'friendly') {
    feedbackRingClass = "shadow-[0_0_30px_rgba(234,179,8,0.6)] border-2 border-amber-400/40";
  } else if (responseSentiment === 'cool') {
    feedbackRingClass = "shadow-[0_0_30px_rgba(52,211,153,0.5)] border-2 border-emerald-400/30";
  }

  return (
    <motion.div 
      className={`relative z-20 cursor-pointer drop-shadow-2xl ${className || ''}`}
      animate={activeVariant}
      transition={customTransition}
      onClick={() => useCreatureStore.getState().setMood(mood === 'chaos' ? 'idle' : 'chaos')}
    >
      <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 select-none">
        {/* Dynamic Halo Effects */}
        <AnimatePresence>
          {responseSentiment === 'savage' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.15, 1], opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="absolute inset-[-10px] rounded-[45%] bg-gradient-to-tr from-red-600 to-orange-500 blur-md -z-20 opacity-40 mix-blend-screen"
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
          )}
          {responseSentiment === 'chaotic' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.25, 0.9, 1], rotate: 360, opacity: 0.9 }}
              exit={{ opacity: 0 }}
              className="absolute inset-[-14px] rounded-[50%] bg-gradient-to-r from-fuchsia-600 via-pink-500 to-purple-600 blur-lg -z-20 opacity-45"
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          )}
          {responseSentiment === 'friendly' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.1, 1], y: [-4, 4, -4], opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="absolute inset-[-8px] rounded-[45%] bg-yellow-400/30 blur-md -z-20"
              transition={{ repeat: Infinity, duration: 2.5 }}
            />
          )}
          {responseSentiment === 'cool' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.05, 1], opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="absolute inset-[-6px] rounded-[45%] bg-emerald-400/25 blur-sm -z-20"
              transition={{ repeat: Infinity, duration: 3.5 }}
            />
          )}
        </AnimatePresence>

        {/* Main Body */}
        <div className={`w-full h-full bg-gradient-to-br ${gradientClass} ${feedbackRingClass} rounded-[40%] shadow-inner relative overflow-hidden transition-all duration-1000`}>
            {/* Shiny highlight */}
            <div className="absolute top-2 left-4 w-1/3 h-1/4 bg-white/20 rounded-full blur-md mix-blend-overlay"></div>
            
            {/* Eyes - ALWAYS rendered & visible */}
            <motion.div variants={eyeVariants} animate={mood} className="absolute top-[35%] left-[25%] w-5 h-8 lg:w-6 lg:h-10 bg-[#111111] rounded-full flex items-center justify-center overflow-hidden z-10">
              <div className="w-2 h-2 bg-white rounded-full translate-y-[-2px] translate-x-[1px]"></div>
            </motion.div>
            <motion.div variants={eyeVariants} animate={mood} className="absolute top-[35%] right-[25%] w-5 h-8 lg:w-6 lg:h-10 bg-[#111111] rounded-full flex items-center justify-center overflow-hidden z-10">
              <div className="w-2 h-2 bg-white rounded-full translate-y-[-2px] translate-x-[1px]"></div>
            </motion.div>
            
            {/* Mouth - ALWAYS rendered & visible with strong borders */}
            <motion.div 
              variants={mouthVariants} 
              animate={mood}
              className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-10 lg:w-12 h-5 lg:h-6 border-b-4 border-solid border-[#111111] z-10"
            />
            
            {/* Blush */}
            <AnimatePresence>
              {['happy', 'celebrating', 'proud'].includes(mood) && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="z-10">
                  <div className="absolute top-[50%] left-[15%] w-6 h-3 lg:w-8 lg:h-4 bg-red-400/50 rounded-full blur-sm"></div>
                  <div className="absolute top-[50%] right-[15%] w-6 h-3 lg:w-8 lg:h-4 bg-red-400/50 rounded-full blur-sm"></div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* ZZZs for Sleepy */}
            <AnimatePresence>
              {mood === 'sleepy' && (
                <motion.div 
                   className="absolute top-4 right-10 text-white font-bold opacity-70 z-10"
                   animate={{ y: [-10, -30], opacity: [0, 0.7, 0], scale: [0.5, 1.5] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                >Zzz</motion.div>
              )}
            </AnimatePresence>
        </div>
        
        {/* Small ears/antennas */}
        <motion.div animate={{ rotate: mood === 'sad' ? -45 : -15, y: mood === 'sad' ? 5 : 0 }} className={`absolute -top-3 lg:-top-4 left-8 lg:left-10 w-6 h-10 lg:w-8 lg:h-12 bg-gradient-to-t ${gradientClass} rounded-full shadow-lg -z-10 transition-transform`}></motion.div>
        <motion.div animate={{ rotate: mood === 'sad' ? 45 : 15, y: mood === 'sad' ? 5 : 0 }} className={`absolute -top-3 lg:-top-4 right-8 lg:right-10 w-6 h-10 lg:w-8 lg:h-12 bg-gradient-to-t ${gradientClass} rounded-full shadow-lg -z-10 transition-transform`}></motion.div>
      </div>
    </motion.div>
  );
};
