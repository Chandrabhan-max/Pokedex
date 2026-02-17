import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { getPokemon, getPokemonById } from "../../api/pokemon.api";
import type { Pokemon } from "../../types/pokemon";

import BattleArenaBoard, { arenaShakeVariants, BattleLog } from "../../components/BattleArenaBoard";
import { useBattleEngine, CHARACTERS, ARENAS } from "../../hooks/useBattleEngine";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function VsComputer() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [playerOne, setPlayerOne] = useState<Pokemon | null>(null);
  const [playerTwo, setPlayerTwo] = useState<Pokemon | null>(null);
  const [trainerOne, setTrainerOne] = useState<any | null>(null);
  const [trainerTwo, setTrainerTwo] = useState<any | null>(null);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [arena, setArena] = useState(ARENAS[0]);
  const [showResult, setShowResult] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const engine = useBattleEngine(arena.buff);

  useEffect(() => {
    const themeBtn = document.querySelector('.theme-toggle') || document.querySelector('[aria-label*="theme"]');
    if (themeBtn instanceof HTMLElement) themeBtn.style.display = 'none';
    return () => { if (themeBtn instanceof HTMLElement) themeBtn.style.display = 'block'; };
  }, []);

  useEffect(() => {
    getPokemon({ page: 1, limit: 1025 }).then(res => setPokemonList(res?.data?.data || []));
  }, []);

  useEffect(() => {
    engine.initPokemon(playerOne, playerTwo);
  }, [playerOne, playerTwo, engine.initPokemon]);

  useEffect(() => {
    if (engine.isFinished) {
      setTimeout(() => setShowResult(true), 1500);
    }
  }, [engine.isFinished]);

  const handleSelectTrainer = (selectedTrainer: any) => {
    setTrainerOne(selectedTrainer);
    
    const availableTrainers = CHARACTERS.filter(c => c.name !== selectedTrainer.name);
    const randomOpponent = availableTrainers[Math.floor(Math.random() * availableTrainers.length)];
    setTrainerTwo(randomOpponent);
  };

  const handleSelectPokemon = async (id: number) => {
    try {
      const { data: p1Data } = await getPokemonById(id);
      setPlayerOne(p1Data);
      setDropdownOpen(false);
      setSearchTerm("");
      
      const randomIdx = Math.floor(Math.random() * pokemonList.length);
      const p2Id = pokemonList[randomIdx].id;
      const { data: p2Data } = await getPokemonById(p2Id);
      setPlayerTwo(p2Data);
      
      engine.resetBattle();
    } catch (err) { 
      console.error(err); 
    }
  };

  const filteredList = useMemo(() => {
    return pokemonList.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString().includes(searchTerm)
    );
  }, [pokemonList, searchTerm]);

  const handleResetBoard = () => {
    setPlayerOne(null); setPlayerTwo(null); setTrainerOne(null); setTrainerTwo(null);
    engine.resetBattle();
    setShowResult(false);
  };

  const handleRandomize = async () => {
    if (pokemonList.length < 2) return;
    engine.resetBattle();
    
    const tIdx1 = Math.floor(Math.random() * CHARACTERS.length);
    let tIdx2 = Math.floor(Math.random() * CHARACTERS.length);
    while (tIdx1 === tIdx2) tIdx2 = Math.floor(Math.random() * CHARACTERS.length);
    setTrainerOne(CHARACTERS[tIdx1]); setTrainerTwo(CHARACTERS[tIdx2]);

    const pIdx1 = Math.floor(Math.random() * pokemonList.length);
    const pIdx2 = Math.floor(Math.random() * pokemonList.length);

    const { data: p1Data } = await getPokemonById(pokemonList[pIdx1].id);
    const { data: p2Data } = await getPokemonById(pokemonList[pIdx2].id);
    setPlayerOne(p1Data);
    setPlayerTwo(p2Data);
  };

  const startBattle = async () => {
    await engine.runBattleSequence(playerOne!, playerTwo!, trainerOne.name, trainerTwo.name);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ["#14b8a6", "#ef4444", "#3b82f6"] });
  };

  const renderPlayerSelectUI = () => (
    <>
      <button 
        onClick={() => setDropdownOpen(p => !p)}
        className="px-6 py-3 bg-teal-400 text-black font-black italic rounded-xl hover:scale-105 transition-all text-sm uppercase shadow-xl"
      >
        Select Pokémon
      </button>
      {dropdownOpen && (
        <div className="absolute inset-x-4 bottom-4 top-4 z-50 bg-slate-900 rounded-[2rem] border-2 border-teal-500 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Master List</span>
                <button onClick={() => { setDropdownOpen(false); setSearchTerm(""); }} className="text-white hover:text-red-500">✕</button>
              </div>
              <input 
                type="text" autoFocus value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Pokémon..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-teal-400 transition-colors"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
              {filteredList.map((p) => (
                <div key={p.id} onClick={() => handleSelectPokemon(p.id)} className="px-4 py-2 hover:bg-white/10 cursor-pointer rounded-lg flex justify-between items-center transition-colors group">
                  <span className="capitalize font-bold text-sm group-hover:text-teal-400">{p.name}</span>
                  <span className="text-[10px] text-white/30 italic">#{p.id}</span>
                </div>
              ))}
            </div>
        </div>
      )}
    </>
  );

  const renderCpuWaitingUI = () => (
    <div className="flex flex-col items-center justify-center h-full opacity-50 animate-pulse">
      <span className="text-4xl mb-2">🤖</span>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">CPU Waiting<br/>For You</span>
    </div>
  );

  return (
    <motion.div 
      variants={arenaShakeVariants} animate={engine.isShaking ? "heavy" : "idle"}
      className="relative min-h-screen w-full flex flex-col transition-all duration-1000 bg-cover bg-center text-white px-4 md:px-16 pt-4 pb-12 overflow-x-hidden"
      style={{ backgroundImage: `url(${arena.image})` }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,400;0,700;0,900;1,900&family=Montserrat:wght@700;900&display=swap" rel="stylesheet" />
      <style>{`
        .pokedash-font { font-family: 'Kanit', sans-serif; }
        .heading-glow { text-shadow: 0 0 20px rgba(255,255,255,0.3), 4px 4px 0px rgba(0,0,0,0.5); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />

      <div className="relative z-10 pokedash-font flex flex-col items-center w-full h-full flex-1">
        
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
          <Link to="/battle-arena" className="px-6 py-2.5 rounded-full bg-white text-black font-black text-sm shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:bg-gray-200 hover:scale-105 transition-all uppercase italic">← Back</Link>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-center mt-10 md:mt-2 mb-4 tracking-tighter uppercase italic heading-glow">⚔ {arena.name} ⚔</h1>

        {!engine.isBattling && !engine.isFinished && (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-4 max-w-2xl">
              {ARENAS.map((a) => (
                <button key={a.id} onClick={() => setArena(a)} className={`px-4 py-1.5 rounded-xl border-b-4 transition-all font-bold uppercase text-xs tracking-widest ${arena.id === a.id ? "border-teal-600 bg-teal-400 text-black translate-y-1" : "border-black/40 bg-black/50 hover:bg-black/70 text-white"}`}>{a.name}</button>
              ))}
            </div>
            <button onClick={handleRandomize} className="mb-4 px-10 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-black text-lg hover:scale-105 transition-all shadow-2xl border-b-[6px] border-teal-950 active:border-b-0 active:translate-y-1 uppercase italic tracking-wider">RANDOMIZE MATCH</button>
          </>
        )}

        {engine.isFinished && (
          <button onClick={handleResetBoard} className="mt-2 mb-6 px-12 py-3 bg-red-600 text-white font-black text-xl rounded-2xl shadow-xl border-b-[8px] border-red-900 hover:scale-105 transition-all uppercase italic animate-bounce">
            Clear Board
          </button>
        )}

        <AnimatePresence>
          {engine.isBattling && engine.combatLog.side === "center" && engine.combatLog.text && <BattleLog message={engine.combatLog.text} />}
        </AnimatePresence>

        {!trainerOne || !trainerTwo ? (
          <div className="flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 w-full flex-1 mt-4">
            <div className="flex flex-col items-center gap-3 mb-6 relative">
              <h2 className="text-2xl font-black italic uppercase text-teal-400 drop-shadow-md">Select Your Champion</h2>
              <button onClick={() => setShowRules(true)} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md transition-all active:scale-95">
                <span className="text-teal-400 text-lg leading-none">?</span> How To Play
              </button>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] max-w-3xl w-full">
                <label className="block text-sm font-black uppercase text-teal-400 mb-6 text-center drop-shadow-md tracking-widest">Player 1 Roster</label>
                <div className="grid grid-cols-5 gap-6">
                    {CHARACTERS.map(c => (
                        <div key={c.name} className="flex flex-col items-center gap-3 w-full">
                            <button onClick={() => handleSelectTrainer(c)} className={`rounded-xl overflow-hidden border-4 transition-all aspect-square w-full hover:scale-110 hover:border-teal-400 border-transparent shadow-lg bg-black/60`}>
                                <img src={c.image} alt={c.name} className="w-full h-full object-cover object-top" />
                            </button>
                            <span className={`text-[10px] font-black uppercase text-center px-2 py-1 rounded shadow-md border leading-tight w-full text-white bg-black/60 border-white/10`}>{c.name}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        ) : (
          <BattleArenaBoard 
            engine={engine}
            arena={arena}
            trainerOne={trainerOne}
            trainerTwo={trainerTwo}
            playerOnePoke={playerOne}
            playerTwoPoke={playerTwo}
            onTrainerOneChange={() => { setTrainerOne(null); setTrainerTwo(null); }}
            p1SelectUI={renderPlayerSelectUI()}
            p2SelectUI={renderCpuWaitingUI()}
            centerActionUI={
              !engine.isBattling && !engine.isFinished && playerOne && playerTwo && (
                <div className="relative z-20 animate-in slide-in-from-bottom-2 duration-500 mt-4">
                  <button onClick={startBattle} className="px-20 py-4 bg-teal-400 text-black font-black text-4xl rounded-[2.5rem] hover:scale-110 shadow-2xl border-b-[10px] border-teal-600 active:border-b-0 active:translate-y-2 uppercase italic transition-all">Fight!</button>
                </div>
              )
            }
          />
        )}

        <AlertDialog open={showResult} onOpenChange={setShowResult}>
          <AlertDialogContent className="p-0 border-none bg-transparent max-w-3xl overflow-visible">
            <div className="relative p-1 bg-gradient-to-b from-teal-400 via-teal-600 to-indigo-700 rounded-[2rem] shadow-[0_0_100px_rgba(20,184,166,0.4)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.4)_0%,transparent_70%)] animate-pulse" />
              <div className="bg-slate-950/95 backdrop-blur-2xl rounded-[1.9rem] p-10 md:p-16 flex flex-col items-center border border-white/10 relative z-10">
                 <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
                 <div className="absolute top-1 inset-x-0 h-[100px] bg-gradient-to-b from-teal-500/10 to-transparent" />
                 <AlertDialogHeader className="space-y-6 w-full relative z-10">
                   <div className="flex justify-center">
                     <span className="bg-teal-500/10 border border-teal-500/50 text-teal-400 text-xs font-black uppercase tracking-[0.4em] py-1.5 px-6 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.2)]">
                       Battle Report Decided
                     </span>
                   </div>
                   <AlertDialogTitle className="text-center flex flex-col gap-2">
                     <span className="text-5xl md:text-7xl font-[1000] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 uppercase italic tracking-tighter drop-shadow-2xl">
                       {engine.winner?.name}
                     </span>
                     <span className="text-teal-400 text-2xl md:text-3xl font-black uppercase tracking-widest drop-shadow-[0_0_15px_rgba(20,184,166,0.6)] mt-2">
                       Champion Ascended
                     </span>
                   </AlertDialogTitle>
                   <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-teal-500/30 to-transparent my-4" />
                   <AlertDialogDescription className="text-gray-300 text-center text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto">
                     <span className="text-white font-black border-b-2 border-teal-500 pb-0.5">{engine.winner?.id === playerOne?.id ? trainerOne?.name : trainerTwo?.name}</span> has achieved absolute dominance in the <span className="text-teal-400 font-bold">{arena?.name}</span>.
                   </AlertDialogDescription>
                 </AlertDialogHeader>
                 <div className="mt-12 mb-10 w-full flex justify-center">
                   <div className="relative group">
                      <div className="absolute inset-0 bg-teal-400/20 blur-xl rounded-full group-hover:bg-teal-400/30 transition-all" />
                      <div className="relative py-6 px-16 bg-black/60 rounded-3xl border border-teal-500/30 text-center shadow-[inset_0_0_30px_rgba(20,184,166,0.1)] backdrop-blur-md">
                          <p className="text-teal-500/80 uppercase text-[11px] font-black tracking-[0.4em] mb-2">Final Battle Rating</p>
                          <p className="text-6xl font-[1000] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">{engine.winner ? engine.getPowerLevel(engine.winner) : 0}</p>
                      </div>
                   </div>
                 </div>
                 <button onClick={() => setShowResult(false)} className="relative group px-12 py-4 rounded-full overflow-hidden transition-all active:scale-95 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-teal-500/50">
                    <span className="relative text-gray-300 group-hover:text-teal-400 transition-colors text-sm font-black uppercase tracking-[0.3em]"> Return to Arena </span>
                 </button>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <AnimatePresence>
        {showRules && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
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
    </motion.div>
  );
}