import React from 'react';
import { Creature } from '../components/Creature';

export const LandingPage: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => {
  return (
    <div className="w-full min-h-screen bg-[#F7F7F5] text-[#111111] font-sans relative overflow-x-hidden flex flex-col">
      {/* Navigation */}
      <nav className="px-6 md:px-12 py-8 flex justify-between items-center z-20 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#111111] rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
          <span className="font-bold text-xl tracking-tight">
            ChatPata <span className="text-orange-500 italic">AI</span>
          </span>
        </div>
        <div className="hidden md:flex gap-10 text-sm font-medium opacity-60 uppercase tracking-widest">
          <a href="#" className="hover:opacity-100 transition-opacity">The Creature</a>
          <a href="#" className="hover:opacity-100 transition-opacity">How it Works</a>
        </div>
        <button 
           onClick={onLaunch}
           className="px-6 py-2 bg-[#111111] text-white rounded-full text-sm font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
        >
          Launch App
        </button>
      </nav>

      {/* Main Hero Content */}
      <main className="flex-1 flex flex-col lg:flex-row px-6 md:px-12 relative items-center justify-center lg:justify-between pb-12 lg:pb-0 z-10 max-w-[1600px] mx-auto w-full">
        {/* Left Side: Editorial Content */}
        <div className="flex flex-col justify-center lg:pr-12 lg:w-1/2 pt-8 lg:pt-0">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#EFEFEA] rounded-full shadow-sm w-fit">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-[10px] uppercase font-bold tracking-tighter">Live: Version 2.0 “The Friend Update”</span>
          </div>
          <h1 className="text-6xl md:text-[80px] lg:text-[112px] leading-[0.95] md:leading-[0.85] font-bold tracking-tighter mb-8 max-w-2xl">
            AI That<br />Actually Feels<br /><span className="text-blue-600 italic">Human.</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#111111] opacity-70 leading-relaxed max-w-md font-medium">
            Short replies. Hinglish. Smart conversations. <span className="font-bold text-[#111111] opacity-100 italic">Zero corporate nonsense.</span>
          </p>
          
          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button 
              onClick={onLaunch}
              className="px-10 py-5 bg-[#111111] text-white rounded-2xl font-bold text-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all active:scale-95"
            >
              Adopt Your Companion
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase opacity-40 tracking-wider">Current Status</span>
              <span className="font-serif italic text-lg text-orange-600">“Feeling mischief today”</span>
            </div>
          </div>
        </div>

        {/* Right Side: The Creature & Floating Browser */}
        <div className="flex items-center justify-center relative mt-24 lg:mt-0 lg:w-1/2 w-full">
          {/* Floating Browser Frame Mockup */}
          <div className="w-full max-w-xl xl:max-w-2xl aspect-[4/3] bg-white rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-[#EFEFEA] p-4 flex flex-col gap-4 relative z-10 overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-700">
            <div className="flex gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 bg-[#F7F7F5] rounded-2xl p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
              <div className="self-end bg-blue-600 text-white p-4 rounded-3xl rounded-tr-sm shadow-sm text-base font-medium w-fit max-w-[80%]">
                Yaar, 8 hours padh liya aaj.
              </div>
              <div className="self-start flex gap-3 items-end">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shrink-0 shadow-inner"></div>
                <div className="bg-white border border-[#EFEFEA] p-4 rounded-3xl rounded-tl-sm text-base shadow-sm w-fit max-w-[80%]">
                  <span className="font-bold text-orange-500 mr-2">ChatPata:</span> 
                  Oho! Proud of you! 🥳 Party kab hai?
                </div>
              </div>
              <div className="self-end bg-blue-600 text-white p-4 rounded-3xl rounded-tr-sm shadow-sm text-base font-medium w-fit max-w-[80%]">
                Ab reels dekhne ja raha...
              </div>
              <div className="self-start flex gap-3 items-end">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shrink-0 shadow-inner"></div>
                <div className="bg-white border border-[#EFEFEA] p-4 rounded-3xl rounded-tl-sm text-base shadow-sm italic text-gray-500 w-fit max-w-[80%]">
                  ChatPata is judging you intensely... 😒
                </div>
              </div>
            </div>
          </div>

          {/* The Creature component imported */}
          <div className="absolute -top-16 lg:-top-24 -right-4 lg:-right-12 z-20">
             <Creature className="scale-110 md:scale-125 lg:scale-150 transform-origin-bottom" />
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square border border-[#EFEFEA]/80 rounded-full -z-10 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square border border-[#EFEFEA]/50 rounded-full -z-10 pointer-events-none"></div>
        </div>
      </main>

      {/* Bottom Bar: Feature Highlights */}
      <footer className="px-6 md:px-12 py-8 border-t border-[#EFEFEA] flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-md gap-6 md:gap-0 z-20 mt-auto">
        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-8 lg:gap-20">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#111111] opacity-40 mb-1">Architecture</span>
            <span className="text-base lg:text-xl font-serif text-[#111111]">Gemini 2.5 Flash</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#111111] opacity-40 mb-1">Vibe Check</span>
            <span className="text-base lg:text-xl font-serif text-[#111111]">98% Corporate Free</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#111111] opacity-40 mb-1">Language</span>
            <span className="text-base lg:text-xl font-serif text-[#111111]">Fluent in Hinglish</span>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="text-sm font-bold opacity-40 uppercase tracking-widest flex items-center">
             Made with AI Studio
           </div>
        </div>
      </footer>

      {/* Subtle Grid Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
        style={{ backgroundImage: 'radial-gradient(#111 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      ></div>
    </div>
  );
};
