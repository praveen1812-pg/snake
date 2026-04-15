import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "NEON_DREAMS_V1",
    artist: "CYBER_GEN_AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/200/200"
  },
  {
    id: 2,
    title: "GLITCH_IN_THE_MATRIX",
    artist: "CYBER_GEN_AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/200/200"
  },
  {
    id: 3,
    title: "SYNTH_WAVE_OS",
    artist: "CYBER_GEN_AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/200/200"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md bg-black/60 backdrop-blur-md p-6 glitch-border-magenta relative overflow-hidden">
      {/* Background visualizer mock */}
      <div className="absolute bottom-0 left-0 w-full h-1 flex items-end gap-1 opacity-30">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-neon-magenta"
            animate={{
              height: isPlaying ? [2, Math.random() * 20 + 5, 2] : 2
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.05
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <motion.img
            key={currentTrack.cover}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src={currentTrack.cover}
            alt="Cover"
            className="w-full h-full object-cover glitch-border"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <motion.div 
              className="absolute inset-0 border-2 border-neon-cyan"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.2, repeat: Infinity }}
            />
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="truncate"
            >
              <h3 className="text-neon-cyan font-bold tracking-tighter text-lg truncate">{currentTrack.title}</h3>
              <p className="text-xs text-neon-magenta opacity-70 tracking-widest uppercase">{currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 space-y-2">
            <div className="h-1 w-full bg-white/10 relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-neon-cyan shadow-[0_0_10px_#00ffff]"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <button onClick={prevTrack} className="text-glitch-white hover:text-neon-cyan transition-colors">
                  <SkipBack size={20} />
                </button>
                <button 
                  onClick={togglePlay} 
                  className="w-10 h-10 rounded-full bg-neon-magenta flex items-center justify-center text-white hover:scale-110 transition-transform shadow-[0_0_15px_#ff00ff]"
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>
                <button onClick={nextTrack} className="text-glitch-white hover:text-neon-cyan transition-colors">
                  <SkipForward size={20} />
                </button>
              </div>
              <div className="flex items-center gap-2 opacity-50">
                <Volume2 size={14} />
                <div className="w-12 h-1 bg-white/20 rounded-full">
                  <div className="w-2/3 h-full bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
    </div>
  );
};
