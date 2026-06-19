import React from 'react';
import { Creature } from '../components/Creature';

export const LandingPage: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => {
  return (
    <div className="w-full min-h-screen bg-[#F7F7F5] text-[#111111] font-sans relative overflow-x-hidden flex flex-col">
      {/* Aurora Glass Blurs */}
      <div className="absolute top-[-150px] left-[-150px] w-[600px] h-[600px] rounded-full bg-orange-300/20 blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[700px] h-[700px] rounded-full bg-amber-200/25 blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-[10%] w-[450px] h-[450px] rounded-full bg-rose-200/15 blur-[120px] pointer-events-none z-0"></div>

      {/* Navigation */}
      <nav className="mx-4 md:mx-12 my-6 px-6 py-4 flex justify-between items-center z-20 relative bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.03)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#111111] rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
          <span className="font-bold text-xl tracking-tight">
            NIG <span className="text-orange-500 italic">AI</span>
          </span>
        </div>
        <div className="hidden md:flex gap-10 text-sm font-medium opacity-60 uppercase tracking-widest">
        </div>
        <button 
           onClick={onLaunch}
           className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full text-sm font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:from-orange-600 hover:to-amber-700 transition-all cursor-pointer"
        >
          Adopt Now
        </button>
      </nav>

      {/* Main Hero Content */}
      <main className="flex-1 flex flex-col lg:flex-row px-6 md:px-12 xl:px-24 relative items-center justify-center lg:justify-between pb-12 lg:pb-0 z-10 max-w-[1600px] mx-auto w-full">
        {/* Left Side: Editorial Content */}
        <div className="flex flex-col justify-center items-center lg:items-start lg:pr-12 xl:pr-24 lg:w-1/2 pt-4 sm:pt-8 lg:pt-0 text-center lg:text-left">
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#EFEFEA] rounded-full shadow-sm w-fit">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-tighter">Live: Version 2.0 “The Friend Update”</span>
          </div>
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-[80px] lg:text-[112px] xl:text-[130px] leading-[1.05] md:leading-[0.85] xl:leading-[0.85] font-bold tracking-tighter mb-6 md:mb-8 max-w-2xl xl:max-w-3xl">
            AI That<br />Actually Feels<br /><span className="text-orange-600 italic">Alive.</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[#111111] opacity-70 leading-relaxed max-w-md font-medium px-4 lg:px-0">
            Short replies. Hinglish. Smart conversations. <span className="font-bold text-[#111111] opacity-100 italic">Zero corporate nonsense.</span>
          </p>
          
          <div className="mt-6 sm:mt-8 md:mt-12 flex flex-col items-center lg:items-start gap-4 w-full">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-orange-600 animate-pulse flex items-center gap-2 relative">
               <div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div>
               Warning: Highly unpredictable personality inside
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative w-full sm:w-auto px-4 lg:px-0">
              <button 
                onClick={onLaunch}
                className="group relative px-6 sm:px-10 py-4 sm:py-5 bg-[#111111] text-white rounded-2xl font-bold text-lg sm:text-xl shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all active:scale-95 overflow-hidden w-full sm:w-auto text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                   Adopt Your Companion 🧸
                </span>
              </button>
              <div className="text-xs sm:text-sm font-medium text-gray-500 max-w-[200px] leading-tight text-center sm:text-left">
                (Clicking this might be the best or worst decision of your day)
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: The Creature & Floating Browser */}
        <div className="flex items-center justify-center relative mt-24 lg:mt-0 lg:w-1/2 w-full xl:pl-12">
          <div className="relative w-full max-w-sm sm:max-w-xl xl:max-w-[44rem] px-2 sm:px-0">
            {/* Floating Browser Frame Mockup */}
            <div className="w-full aspect-[4/3] bg-white/40 backdrop-blur-xl rounded-3xl shadow-[0_45px_100px_-25px_rgba(0,0,0,0.12)] border border-white/60 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-700">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
              </div>
              <div className="flex-1 bg-gradient-to-b from-zinc-200/40 to-zinc-100/10 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 overflow-y-auto border border-white/20">
                <div className="self-end bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 text-white p-3 sm:p-4 rounded-3xl rounded-tr-sm shadow-md text-xs sm:text-sm md:text-base font-semibold w-fit max-w-[85%] border border-white/10">
                  Yaar, 8 hours padh liya aaj.
                </div>
                <div className="self-start flex gap-2 sm:gap-3 items-end">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shrink-0 shadow-inner"></div>
                  <div className="bg-gradient-to-br from-white/90 via-white/70 to-white/50 border border-white/60 p-3 sm:p-4 rounded-3xl rounded-tl-sm text-xs sm:text-sm md:text-base shadow-md w-fit max-w-[85%] backdrop-blur-md text-[#111111]">
                    <span className="font-bold text-orange-600 mr-2">NIG AI:</span> 
                    Oho! Proud of you saale! Party kab dega?
                  </div>
                </div>
                <div className="self-end bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 text-white p-3 sm:p-4 rounded-3xl rounded-tr-sm shadow-md text-xs sm:text-sm md:text-base font-semibold w-fit max-w-[85%] border border-white/10">
                  Ab reels dekhne ja raha...
                </div>
                <div className="self-start flex gap-2 sm:gap-3 items-end">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shrink-0 shadow-inner"></div>
                  <div className="bg-gradient-to-br from-white/90 via-white/70 to-white/50 border border-white/60 p-3 sm:p-4 rounded-3xl rounded-tl-sm text-xs sm:text-sm md:text-base shadow-md italic text-gray-500 w-fit max-w-[85%] backdrop-blur-md">
                    NIG AI is judging you intensely... 😒
                  </div>
                </div>
              </div>
            </div>

            {/* The Creature component imported */}
            <div className="absolute -top-12 sm:-top-16 lg:-top-24 right-0 sm:-right-4 lg:-right-12 z-20">
               <Creature className="scale-90 sm:scale-110 md:scale-125 lg:scale-150 origin-bottom" />
            </div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square border border-[#EFEFEA]/80 rounded-full -z-10 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square border border-[#EFEFEA]/50 rounded-full -z-10 pointer-events-none"></div>
        </div>
      </main>

      {/* Bottom Bar: Feature Highlights */}
      <footer className="px-6 md:px-12 py-8 border-t border-[#EFEFEA] flex flex-col md:flex-row justify-between flex-wrap gap-8 items-center bg-white/80 backdrop-blur-md z-20 mt-auto w-full">
        <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-8 lg:gap-12">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#111111] opacity-40 mb-1">Architecture</span>
            <span className="text-sm lg:text-base font-serif text-[#111111] font-medium">Gemini 2.5</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#111111] opacity-40 mb-1">Stack</span>
            <span className="text-sm lg:text-base font-serif text-[#111111] font-medium">React • Tailwind • Express</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#111111] opacity-40 mb-1">Hosted on</span>
            <span className="text-sm lg:text-base font-serif text-[#111111] font-medium">Railway 🚂</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#111111] opacity-40 mb-1">Version</span>
            <span className="text-sm lg:text-base font-serif text-[#111111] font-medium">2.0.0</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="http://github.com/aadi-o" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#EFEFEA] hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path></svg>
            <span className="text-sm font-bold opacity-80">Source Code</span>
          </a>
          <div className="flex items-center gap-4 bg-orange-50 px-4 py-2 rounded-full border border-orange-100/50 shadow-sm">
             <div className="text-[10px] sm:text-xs font-bold opacity-60 uppercase tracking-widest">
               Built by
             </div>
             <div className="flex items-center gap-2">
               <img src="https://robohash.org/aadi.png?set=set4&bgset=bg1" alt="Aadi cat profile" className="w-8 h-8 rounded-full border border-orange-200 bg-white" />
               <span className="font-bold text-orange-800 text-sm">Aadi</span>
             </div>
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
