import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import SnakeGame from "./components/SnakeGame";
import MusicPlayer from "./components/MusicPlayer";
import { Activity, Radio, Cpu, Zap, Dna } from "lucide-react";

export default function App() {
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("neon_snake_high_score");
    return saved ? parseInt(saved) : 0;
  });
  const [currentScore, setCurrentScore] = useState(0);

  const handleScoreChange = (score: number) => {
    setCurrentScore(score);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("neon_snake_high_score", score.toString());
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-neon-blue selection:text-black">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 242, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-20%)',
            transformOrigin: 'top'
          }}
        />
        
        {/* Glow Spheres */}
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-neon-blue/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-neon-pink/10 blur-[120px] rounded-full" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 lg:p-8">
        
        {/* Top Header Navigation */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              className="p-3 bg-neon-blue/10 rounded-xl border border-neon-blue/30"
            >
              <Zap className="w-8 h-8 text-neon-blue" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold tracking-tighter uppercase neon-glow-blue opacity-90">
                NEON<span className="text-neon-pink">.</span>RHYTHM
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">
                <Activity className="w-3 h-3" /> System: Stable | Session: Live
              </div>
            </div>
          </div>

          <div className="flex gap-4">
             <div className="flex flex-col items-end px-6 py-2 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Current Score</span>
                <motion.span 
                  key={currentScore}
                  initial={{ scale: 1.2, color: '#00f2ff' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="text-2xl font-mono font-bold leading-none"
                >
                  {currentScore.toString().padStart(5, '0')}
                </motion.span>
             </div>
             <div className="flex flex-col items-end px-6 py-2 bg-neon-blue/10 rounded-2xl border border-neon-blue/20">
                <span className="text-[10px] font-mono text-neon-blue/60 tracking-widest uppercase">High Score</span>
                <span className="text-2xl font-mono font-bold leading-none text-neon-blue">
                  {highScore.toString().padStart(5, '0')}
                </span>
             </div>
          </div>
        </header>

        {/* Dynamic Content Grid */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Status (Visible on Large Screens) */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6 h-full">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
              <h4 className="flex items-center gap-2 text-[10px] font-bold text-white/40 tracking-widest uppercase">
                <Cpu className="w-4 h-4" /> Hardware Status
              </h4>
              <div className="space-y-3">
                {[
                  { label: "Core Temp", val: "42°C", color: "bg-neon-green" },
                  { label: "Power Grid", val: "Operational", color: "bg-neon-blue" },
                  { label: "Neural Link", val: "Active", color: "bg-neon-pink" }
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-white/60">{stat.label}</span>
                      <span className="font-mono text-white/80">{stat.val}</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "80%" }}
                        className={`h-full ${stat.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 p-6 bg-neon-blue/5 rounded-3xl border border-neon-blue/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent opacity-50" />
              <Dna className="absolute -bottom-4 -right-4 w-32 h-32 text-neon-blue/10 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
              <h4 className="relative text-[10px] font-bold text-neon-blue/60 tracking-widest uppercase mb-4">Tactical Log</h4>
              <div className="relative space-y-4 font-mono text-[10px] text-white/40 overflow-y-auto max-h-[300px]">
                <p>&gt; Connection established...</p>
                <p>&gt; Initializing neural drivers...</p>
                <p>&gt; Loading audio buffer...</p>
                <p className="text-neon-pink">&gt; ALERT: Intruder detected in grid sector 7.</p>
                <p className="text-neon-blue">&gt; Countermeasures active.</p>
                <p>&gt; Ready for input sequence.</p>
              </div>
            </div>
          </aside>

          {/* Center Game View */}
          <div className="lg:col-span-6 flex justify-center items-center py-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
               <SnakeGame onScoreChange={handleScoreChange} />
            </motion.div>
          </div>

          {/* Right Music Interface */}
          <aside className="lg:col-span-3 flex flex-col items-center lg:items-end gap-8">
            <MusicPlayer />
            
            {/* Visualizer Mock */}
            <div className="w-full bg-white/5 rounded-3xl p-6 border border-white/5">
              <div className="flex items-end justify-between gap-1 h-12">
                {[...Array(20)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [10, Math.random() * 40 + 8, 10] }}
                    transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" }}
                    className="flex-1 bg-neon-pink/40 rounded-t-sm"
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="flex items-center gap-2 text-neon-pink/60">
                   <Radio className="w-4 h-4 animate-pulse" />
                   <span className="text-[10px] font-mono uppercase tracking-widest">Signal: Synchronized</span>
                </div>
              </div>
            </div>
          </aside>
        </main>

        {/* Footer Navigation Hints */}
        <footer className="mt-8 flex flex-wrap justify-center gap-8 text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] border-t border-white/5 pt-6">
          <div className="flex items-center gap-2"><span className="text-neon-blue">[ARROWS]</span> MOVEMENT</div>
          <div className="flex items-center gap-2"><span className="text-neon-pink">[SPACE]</span> PAUSE/INITIATE</div>
          <div className="flex items-center gap-2"><span className="text-neon-blue">[M]</span> MASTER VOLUME</div>
        </footer>
      </div>
    </div>
  );
}
