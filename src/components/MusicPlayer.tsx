import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from "lucide-react";
import { TRACKS } from "../constants";

const MusicPlayer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Playback failed:", e));
    }
  }, [currentIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="w-full max-w-md bg-black/60 backdrop-blur-xl rounded-3xl p-6 neon-border-pink flex flex-col gap-6">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        src={currentTrack.audioUrl}
      />
      
      {/* Album Art Section */}
      <div className="flex gap-6 items-center">
        <motion.div 
          animate={{ 
            rotate: isPlaying ? 360 : 0,
            scale: isPlaying ? [1, 1.05, 1] : 1
          }}
          transition={{ 
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,0,229,0.3)]"
        >
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>

        <div className="flex-1 overflow-hidden">
          <motion.h3 
            key={currentTrack.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-bold text-white truncate neon-glow-pink"
          >
            {currentTrack.title}
          </motion.h3>
          <p className="text-white/60 font-mono text-sm">{currentTrack.artist}</p>
          
          <div className="mt-4 flex items-center gap-2 text-neon-blue">
            <Volume2 className="w-4 h-4" />
            <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-neon-blue"
                initial={{ width: 0 }}
                animate={{ width: "70%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer group">
          <motion.div 
            className="h-full bg-neon-pink shadow-[0_0_10px_#ff00e5]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <span>{audioRef.current ? Math.floor(audioRef.current.currentTime) : 0}s</span>
          <span>{audioRef.current ? Math.floor(audioRef.current.duration || 0) : 0}s</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-8">
        <button onClick={prevTrack} className="text-white/60 hover:text-neon-blue transition-colors cursor-pointer p-2">
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-16 h-16 flex items-center justify-center bg-neon-pink rounded-full text-black hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_#ff00e5] cursor-pointer"
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-0.5" />}
        </button>

        <button onClick={nextTrack} className="text-white/60 hover:text-neon-blue transition-colors cursor-pointer p-2">
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Playlist Preview */}
      <div className="border-t border-white/10 pt-4 flex gap-4 overflow-hidden mask-fade-right">
        {TRACKS.map((track, idx) => (
          <button 
            key={track.id}
            onClick={() => { setCurrentIndex(idx); setIsPlaying(true); }}
            className={`flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-neon-blue scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
          >
            <img src={track.coverUrl} className="w-full h-full object-cover" alt={track.title} referrerPolicy="no-referrer" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MusicPlayer;
