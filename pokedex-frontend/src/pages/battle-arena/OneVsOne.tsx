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

export default function OneVsOne() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [playerOne, setPlayerOne] = useState<Pokemon | null>(null);
  const [playerTwo, setPlayerTwo] = useState<Pokemon | null>(null);
  const [trainerOne, setTrainerOne] = useState<any | null>(null);
  const [trainerTwo, setTrainerTwo] = useState<any | null>(null);
  
  const [dropdownOpen, setDropdownOpen] = useState({ p1: false, p2: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [arena, setArena] = useState(ARENAS[0]);
  const [showResult, setShowResult] = useState(false);

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

  const selectPokemon = async (id: number, slot: "p1" | "p2") => {
    try {
      const { data } = await getPokemonById(id);
      if (slot === "p1") {
        setPlayerOne(data);
        setDropdownOpen(prev => ({ ...prev, p1: false }));
      } else {
        setPlayerTwo(data);
        setDropdownOpen(prev => ({ ...prev, p2: false }));
      }
      setSearchTerm("");
      engine.resetBattle();
    } catch (err) { console.error(err); }
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
    await selectPokemon(pokemonList[pIdx1].id, "p1");
    await selectPokemon(pokemonList[pIdx2].id, "p2");
  };

  const startBattle = async () => {
    await engine.runBattleSequence(playerOne!, playerTwo!, trainerOne.name, trainerTwo.name);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ["#fbbf24", "#ef4444", "#3b82f6"] });
  };

  const renderSelectionUI = (slot: "p1" | "p2") => (
    <>
      <button 
        onClick={() => setDropdownOpen(p => ({ ...p, [slot]: !p[slot] }))}
        className="px-6 py-3 bg-yellow-400 text-black font-black italic rounded-xl hover:scale-105 transition-all text-sm uppercase shadow-xl"
      >
        Select Pokémon
      </button>
      {dropdownOpen[slot] && (
        <div className="absolute inset-x-4 bottom-4 top-4 z-50 bg-slate-900 rounded-[2rem] border-2 border-indigo-500 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Master List</span>
                <button onClick={() => { setDropdownOpen(p => ({ ...p, [slot]: false })); setSearchTerm(""); }} className="text-white hover:text-red-500">✕</button>
              </div>
              <input 
                type="text" autoFocus value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Pokémon..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-yellow-400 transition-colors"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
              {filteredList.map((p) => (
                <div key={p.id} onClick={() => selectPokemon(p.id, slot)} className="px-4 py-2 hover:bg-white/10 cursor-pointer rounded-lg flex justify-between items-center transition-colors group">
                  <span className="capitalize font-bold text-sm group-hover:text-yellow-400">{p.name}</span>
                  <span className="text-[10px] text-white/30 italic">#{p.id}</span>
                </div>
              ))}
            </div>
        </div>
      )}
    </>
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
                <button key={a.id} onClick={() => setArena(a)} className={`px-4 py-1.5 rounded-xl border-b-4 transition-all font-bold uppercase text-xs tracking-widest ${arena.id === a.id ? "border-yellow-600 bg-yellow-400 text-black translate-y-1" : "border-black/40 bg-black/50 hover:bg-black/70 text-white"}`}>{a.name}</button>
              ))}
            </div>
            <button onClick={handleRandomize} className="mb-4 px-10 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-lg hover:scale-105 transition-all shadow-2xl border-b-[6px] border-indigo-950 active:border-b-0 active:translate-y-1 uppercase italic tracking-wider">RANDOMIZE MATCH</button>
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
            <h2 className="text-2xl font-black italic uppercase text-yellow-400 drop-shadow-md mb-6">Select Your Champions</h2>
            <div className="grid md:grid-cols-2 gap-8 w-full max-w-7xl px-4">
              <div className="bg-black/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                  <label className="block text-sm font-black uppercase text-red-500 mb-4 text-center drop-shadow-md tracking-widest">Trainer 1</label>
                  <div className="grid grid-cols-5 gap-3">
                      {CHARACTERS.map(c => (
                          <div key={c.name} className="flex flex-col items-center gap-2 w-full">
                              <button disabled={trainerTwo?.name === c.name} onClick={() => setTrainerOne(c)} className={`rounded-xl overflow-hidden border-2 transition-all aspect-square w-full ${trainerOne?.name === c.name ? 'border-red-500 scale-110 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-transparent opacity-60 hover:opacity-100 disabled:opacity-20'}`}>
                                  <img src={c.image} alt={c.name} className="w-full h-full object-cover object-top bg-black/50" />
                              </button>
                              <span className={`text-[9px] font-black uppercase text-center px-2 py-1 rounded shadow-md border leading-tight w-full ${trainerOne?.name === c.name ? 'text-red-400 bg-black/90 border-red-500/50' : 'text-white bg-black/60 border-white/10'}`}>{c.name}</span>
                          </div>
                      ))}
                  </div>
              </div>
              <div className="bg-black/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                  <label className="block text-sm font-black uppercase text-blue-500 mb-4 text-center drop-shadow-md tracking-widest">Trainer 2</label>
                  <div className="grid grid-cols-5 gap-3">
                      {CHARACTERS.map(c => (
                          <div key={c.name} className="flex flex-col items-center gap-2 w-full">
                              <button disabled={trainerOne?.name === c.name} onClick={() => setTrainerTwo(c)} className={`rounded-xl overflow-hidden border-2 transition-all aspect-square w-full ${trainerTwo?.name === c.name ? 'border-blue-500 scale-110 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-transparent opacity-60 hover:opacity-100 disabled:opacity-20'}`}>
                                  <img src={c.image} alt={c.name} className="w-full h-full object-cover object-top bg-black/50" />
                              </button>
                              <span className={`text-[9px] font-black uppercase text-center px-2 py-1 rounded shadow-md border leading-tight w-full ${trainerTwo?.name === c.name ? 'text-blue-400 bg-black/90 border-blue-500/50' : 'text-white bg-black/60 border-white/10'}`}>{c.name}</span>
                          </div>
                      ))}
                  </div>
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
            onTrainerOneChange={() => setTrainerOne(null)}
            onTrainerTwoChange={() => setTrainerTwo(null)}
            p1SelectUI={renderSelectionUI("p1")}
            p2SelectUI={renderSelectionUI("p2")}
            centerActionUI={
              !engine.isBattling && !engine.isFinished && playerOne && playerTwo && (
                <div className="relative z-20 animate-in slide-in-from-bottom-2 duration-500 mt-4">
                  <button onClick={startBattle} className="px-20 py-4 bg-yellow-400 text-black font-black text-4xl rounded-[2.5rem] hover:scale-110 shadow-2xl border-b-[10px] border-yellow-600 active:border-b-0 active:translate-y-2 uppercase italic transition-all">Fight!</button>
                </div>
              )
            }
          />
        )}

        <AlertDialog open={showResult} onOpenChange={setShowResult}>
          <AlertDialogContent className="p-0 border-none bg-transparent max-w-3xl overflow-visible">
            <div className="relative p-1 bg-gradient-to-b from-yellow-400 via-yellow-600 to-red-700 rounded-[2rem] shadow-[0_0_100px_rgba(251,191,36,0.4)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.4)_0%,transparent_70%)] animate-pulse" />
              <div className="bg-slate-950/95 backdrop-blur-2xl rounded-[1.9rem] p-10 md:p-16 flex flex-col items-center border border-white/10 relative z-10">
                 <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
                 <div className="absolute top-1 inset-x-0 h-[100px] bg-gradient-to-b from-yellow-500/10 to-transparent" />
                 <AlertDialogHeader className="space-y-6 w-full relative z-10">
                   <div className="flex justify-center">
                     <span className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 text-xs font-black uppercase tracking-[0.4em] py-1.5 px-6 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                       Battle Report Decided
                     </span>
                   </div>
                   <AlertDialogTitle className="text-center flex flex-col gap-2">
                     <span className="text-5xl md:text-7xl font-[1000] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 uppercase italic tracking-tighter drop-shadow-2xl">
                       {engine.winner?.name}
                     </span>
                     <span className="text-yellow-400 text-2xl md:text-3xl font-black uppercase tracking-widest drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] mt-2">
                       Champion Ascended
                     </span>
                   </AlertDialogTitle>
                   <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent my-4" />
                   <AlertDialogDescription className="text-gray-300 text-center text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto">
                     <span className="text-white font-black border-b-2 border-yellow-500 pb-0.5">{engine.winner?.id === playerOne?.id ? trainerOne?.name : trainerTwo?.name}</span> has achieved absolute dominance in the <span className="text-yellow-400 font-bold">{arena?.name}</span>.
                   </AlertDialogDescription>
                 </AlertDialogHeader>
                 <div className="mt-12 mb-10 w-full flex justify-center">
                   <div className="relative group">
                      <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full group-hover:bg-yellow-400/30 transition-all" />
                      <div className="relative py-6 px-16 bg-black/60 rounded-3xl border border-yellow-500/30 text-center shadow-[inset_0_0_30px_rgba(251,191,36,0.1)] backdrop-blur-md">
                          <p className="text-yellow-500/80 uppercase text-[11px] font-black tracking-[0.4em] mb-2">Final Battle Rating</p>
                          <p className="text-6xl font-[1000] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">{engine.winner ? engine.getPowerLevel(engine.winner) : 0}</p>
                      </div>
                   </div>
                 </div>
                 <button onClick={() => setShowResult(false)} className="relative group px-12 py-4 rounded-full overflow-hidden transition-all active:scale-95 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-yellow-500/50">
                    <span className="relative text-gray-300 group-hover:text-yellow-400 transition-colors text-sm font-black uppercase tracking-[0.3em]"> Return to Arena </span>
                 </button>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}