import React from "react";
import SnakeGame from "./components/SnakeGame";
import MusicPlayer from "./components/MusicPlayer";
import { Disc, Zap, Activity } from "lucide-react";

export default function App() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0 bg-[#020202]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Stats/Decor (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-neon-cyan font-display font-bold tracking-tighter text-2xl">
              <Activity className="w-6 h-6" />
              NEON RHYTHM
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed font-sans">
              Experience the convergence of classic gameplay and synthetic soundscapes.
            </p>
          </div>

          <div className="p-6 border border-zinc-900 bg-zinc-900/40 rounded-2xl space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-zinc-600 font-mono">System Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-500">Processing</span>
                <span className="text-neon-cyan italic">OPTIMIZED</span>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-neon-cyan shadow-[0_0_8px_rgba(0,255,255,0.4)]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-500">Audio Cache</span>
                <span className="text-neon-pink italic">SYNCHRONIZED</span>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-full h-full bg-neon-pink shadow-[0_0_8px_rgba(255,0,255,0.4)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Center: The Game */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <SnakeGame />
        </div>

        {/* Right Side: Music Player & More Stats */}
        <div className="lg:col-span-3 flex flex-col gap-8 items-center lg:items-end">
          <MusicPlayer />
          
          <div className="hidden lg:block w-full text-right space-y-2">
             <div className="flex items-center justify-end gap-2 text-zinc-500 hover:text-white transition-colors cursor-default group">
               <span className="text-[10px] uppercase font-mono tracking-widest">Protocol v1.0.4</span>
               <Zap className="w-3 h-3 group-hover:text-amber-400" />
             </div>
             <div className="flex items-center justify-end gap-2 text-zinc-500 hover:text-white transition-colors cursor-default group">
               <span className="text-[10px] uppercase font-mono tracking-widest">Live Sync Enabled</span>
               <Disc className="w-3 h-3 animate-spin duration-3000" />
             </div>
          </div>
        </div>
      </div>

      {/* Footer Mobile Info */}
      <div className="lg:hidden mt-8 text-zinc-600 text-[10px] font-mono tracking-widest uppercase text-center w-full">
        Best experienced on desktop with headphones
      </div>
    </div>
  );
}
