import React, { useState, useEffect } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { GlitchText } from './components/GlitchText';
import { Terminal, Cpu, Activity, Shield, Wifi } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [booting, setBooting] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const bootSequence = [
      "INITIALIZING NEON_SNAKE_OS v4.2.0...",
      "LOADING KERNEL MODULES...",
      "ESTABLISHING NEURAL LINK...",
      "MOUNTING AUDIO_DRIVE_0...",
      "SYNCING GAME_ENGINE_CORE...",
      "SYSTEM READY."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < bootSequence.length) {
        setLogs(prev => [...prev, `> ${bootSequence[i]}`]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 1000);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  if (booting) {
    return (
      <div className="fixed inset-0 bg-glitch-black flex flex-col items-center justify-center p-8 font-mono">
        <div className="w-full max-w-lg space-y-2">
          {logs.map((log, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-neon-cyan text-sm"
            >
              {log}
            </motion.div>
          ))}
          <motion.div 
            animate={{ opacity: [0, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="w-2 h-4 bg-neon-cyan inline-block ml-1"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-glitch-black text-glitch-white flex flex-col relative overflow-hidden">
      {/* CRT Overlay Effects */}
      <div className="scanline pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50" />
      
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-neon-cyan flex items-center justify-center rounded-sm">
            <Terminal size={20} className="text-black" />
          </div>
          <GlitchText text="NEON_SNAKE_OS" className="text-xl font-bold tracking-tighter" />
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] opacity-50">
          <div className="flex items-center gap-2">
            <Cpu size={12} /> CPU: 42%
          </div>
          <div className="flex items-center gap-2">
            <Activity size={12} /> LATENCY: 12MS
          </div>
          <div className="flex items-center gap-2">
            <Shield size={12} /> SECURE: YES
          </div>
          <div className="flex items-center gap-2 text-neon-cyan">
            <Wifi size={12} /> CONNECTED
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] opacity-50 uppercase">Session Score</div>
            <div className="text-neon-magenta font-bold">{score.toString().padStart(6, '0')}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 lg:p-8 gap-8 items-center justify-center overflow-auto">
        {/* Left Sidebar - System Info */}
        <div className="hidden xl:flex flex-col gap-4 w-64 self-start">
          <div className="glitch-border p-4 bg-black/40">
            <h4 className="text-xs font-bold mb-4 text-neon-cyan border-b border-neon-cyan/30 pb-2">SYSTEM_LOGS</h4>
            <div className="space-y-2 text-[10px] opacity-70">
              <p className="text-green-400">[OK] AUDIO_DRIVER_LOADED</p>
              <p className="text-green-400">[OK] VIDEO_BUFFER_SYNC</p>
              <p className="text-neon-magenta">[WARN] GLITCH_DETECTED</p>
              <p>[INFO] USER_CONNECTED: {Math.random().toString(36).substring(7)}</p>
              <p>[INFO] GAME_SPEED: 100ms</p>
            </div>
          </div>
          
          <div className="glitch-border-magenta p-4 bg-black/40">
            <h4 className="text-xs font-bold mb-4 text-neon-magenta border-b border-neon-magenta/30 pb-2">CONTROLS</h4>
            <div className="space-y-2 text-[10px] opacity-70">
              <p>ARROWS: MOVE_SNAKE</p>
              <p>SPACE: PAUSE_SYSTEM</p>
              <p>ESC: SHUTDOWN</p>
            </div>
          </div>
        </div>

        {/* Center - Game Window */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full">
          <SnakeGame onScoreChange={setScore} />
        </div>

        {/* Right Sidebar - Music Player */}
        <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-8 self-center lg:self-end">
          <MusicPlayer />
          
          <div className="hidden lg:block w-full max-w-md glitch-border p-4 bg-black/40">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-neon-cyan uppercase">Active_Processes</h4>
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-1 bg-white/10 relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-neon-cyan"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ 
                      duration: Math.random() * 2 + 1, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-8 border-t border-white/10 flex items-center justify-between px-8 text-[9px] uppercase tracking-widest opacity-40 bg-black/20">
        <div>NEON_SNAKE_OS // BUILD_2024.04.15</div>
        <div className="flex gap-4">
          <span>MEM: 128MB</span>
          <span>DISK: 2.4GB</span>
          <span className="text-neon-cyan">STATUS: NOMINAL</span>
        </div>
      </footer>
    </div>
  );
}
