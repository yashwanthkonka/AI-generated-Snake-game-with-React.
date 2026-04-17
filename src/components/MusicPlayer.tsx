import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Track } from "../types";
import { DUMMY_TRACKS } from "../constants";

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
      />
      
      <div className="flex items-center gap-6">
        <div className="relative group">
          <motion.div 
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-neon-cyan/20 group-hover:border-neon-cyan/50 transition-colors"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          {isPlaying && (
            <div className="absolute -bottom-2 -right-2 bg-neon-cyan p-1.5 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.6)]">
              <Music className="w-3 h-3 text-black" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h3 className="text-xl font-display font-bold text-white truncate neon-glow-cyan">
                {currentTrack.title}
              </h3>
              <p className="text-zinc-500 font-sans text-sm truncate uppercase tracking-widest">
                {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-4 mt-4">
            <button 
              onClick={prevTrack}
              className="p-2 text-zinc-400 hover:text-neon-cyan transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg hover:shadow-neon-cyan/40"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 translate-x-0.5 fill-current" />}
            </button>
            <button 
              onClick={nextTrack}
              className="p-2 text-zinc-400 hover:text-neon-cyan transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
