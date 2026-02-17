import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import standardArena from "../../assets/arena/standardArena.png";

export default function BattleArenaHome() {
  const [showRules, setShowRules] = useState(false);

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center text-white overflow-hidden"
      style={{ backgroundImage: `url(${standardArena})` }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,400;0,700;0,900;1,900&display=swap" rel="stylesheet" />
      <style>{`.pokedash-font { font-family: 'Kanit', sans-serif; } .scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
      
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
        <Link to="/" className="px-6 py-2.5 rounded-full bg-white text-black font-black text-sm shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:bg-gray-200 hover:scale-105 transition-all uppercase italic">← Main Menu</Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative z-10 pokedash-font flex flex-col items-center gap-8 w-full max-w-4xl px-4"
      >
        <h1 className="text-5xl md:text-7xl font-black text-center tracking-tighter uppercase italic text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] mb-4">
          ⚔ Battle Arena ⚔
        </h1>

        <h2 className="text-3xl md:text-4xl font-black italic uppercase text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">
          Choose Battle Mode
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <Link to="/battle-arena/1v1" className="flex-1 py-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white font-black text-xl md:text-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(79,70,229,0.5)] border-b-[8px] border-indigo-950 active:border-b-0 active:translate-y-2 uppercase italic tracking-wider flex items-center justify-center">
            ⚔️ 1v1 Arena
          </Link>
          <Link to="/battle-arena/tournament" className="flex-1 py-6 rounded-3xl bg-gradient-to-br from-purple-600 to-fuchsia-700 text-white font-black text-xl md:text-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(168,85,247,0.5)] border-b-[8px] border-purple-950 active:border-b-0 active:translate-y-2 uppercase italic tracking-wider flex items-center justify-center">
            🏆 Tournament
          </Link>
          <Link to="/battle-arena/computer" className="flex-1 py-6 rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white font-black text-xl md:text-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(20,184,166,0.5)] border-b-[8px] border-teal-950 active:border-b-0 active:translate-y-2 uppercase italic tracking-wider flex items-center justify-center">
            🤖 Vs Computer
          </Link>
        </div>
        
        <button 
          onClick={() => setShowRules(true)} 
          className="mt-8 flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold uppercase tracking-widest backdrop-blur-md transition-all active:scale-95"
        >
          <span className="text-yellow-400 text-xl leading-none">?</span> Read Battle Manual
        </button>
      </motion.div>

      <AnimatePresence>
        {showRules && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pokedash-font">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-slate-900 border-2 border-indigo-500 rounded-[2rem] p-6 md:p-10 max-w-2xl w-full shadow-[0_0_50px_rgba(79,70,229,0.3)] relative max-h-[90vh] overflow-y-auto scrollbar-hide">
              <button onClick={() => setShowRules(false)} className="absolute top-6 right-6 text-white/50 hover:text-red-500 transition-colors text-2xl font-black">✕</button>
              <h2 className="text-3xl font-black italic uppercase text-yellow-400 mb-6 border-b border-white/10 pb-4">Battle Manual</h2>
              <div className="space-y-6 text-sm md:text-base font-medium text-gray-300">
                <div className="flex items-start gap-4"><div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/50 text-indigo-400 mt-1">📊</div><div><h3 className="text-white font-black uppercase tracking-widest mb-1 text-sm">Base Power (BP)</h3><p>A Pokémon's foundation is its total base stats combined. This determines their starting HP and raw combat potential.</p></div></div>
                <div className="flex items-start gap-4"><div className="p-2 bg-red-500/20 rounded-lg border border-red-500/50 text-red-400 mt-1">🔥</div><div><h3 className="text-white font-black uppercase tracking-widest mb-1 text-sm">Type Advantage</h3><p>Having a super-effective typing against your opponent applies a massive <span className="text-green-400 font-bold">1.5x Multiplier</span> to your Attack Power!</p></div></div>
                <div className="flex items-start gap-4"><div className="p-2 bg-green-500/20 rounded-lg border border-green-500/50 text-green-400 mt-1">🌍</div><div><h3 className="text-white font-black uppercase tracking-widest mb-1 text-sm">Arena Buff</h3><p>If your Pokémon's type matches the current Arena, they receive a flat <span className="text-yellow-400 font-bold">+200 BP Boost</span>.</p></div></div>
                <div className="flex items-start gap-4"><div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/50 text-yellow-400 mt-1">⚡</div><div><h3 className="text-white font-black uppercase tracking-widest mb-1 text-sm">Critical Hits & RNG</h3><p>Every strike has a <span className="text-yellow-400 font-bold">15% chance</span> to become a Critical Hit, dealing double damage.</p></div></div>
                <div className="flex items-start gap-4"><div className="p-2 bg-pink-500/20 rounded-lg border border-pink-500/50 text-pink-400 mt-1">👏</div><div><h3 className="text-white font-black uppercase tracking-widest mb-1 text-sm">The "Cheer" Mechanic</h3><p>You have <span className="text-pink-400 font-bold">5 Cheers</span> per match. Click it during combat to heal instantly!</p></div></div>
                <div className="flex items-start gap-4"><div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/50 text-blue-400 mt-1">👑</div><div><h3 className="text-white font-black uppercase tracking-widest mb-1 text-sm">Trainer Rating Tie-Breaker</h3><p>If two identical Pokémon fight, the combat evaluates the Trainer's Skill Rating to determine the ultimate victor.</p></div></div>
              </div>
              <button onClick={() => setShowRules(false)} className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-xl transition-all active:scale-95">Got it, Let's Battle!</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}