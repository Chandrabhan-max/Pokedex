import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { getPokemon } from "../../api/pokemon.api";
import type { Pokemon } from "../../types/pokemon";

import BattleArena, { arenaShakeVariants, BattleLog } from "../../components/BattleArenaBoard";
import { useBattleEngine, CHARACTERS, ARENAS, calculatePowerLevel, checkAdvantage, playRetroSound } from "../../hooks/useBattleEngine";

import standardArena from "../../assets/arena/standardArena.png";

type TournamentPlayer = {
  id: string;
  trainer: any;
  team: Pokemon[];
  isUser: boolean;
};

export default function Tournament() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [view, setView] = useState<"LOADING" | "SELECT_TRAINER" | "BRACKET" | "BATTLE" | "GAME_OVER" | "CHAMPION">("LOADING");
  
  const [userPlayer, setUserPlayer] = useState<TournamentPlayer | null>(null);
  const [qf, setQf] = useState<TournamentPlayer[]>([]); 
  const [sf, setSf] = useState<TournamentPlayer[]>([]); 
  const [finals, setFinals] = useState<TournamentPlayer[]>([]); 
  const [champion, setChampion] = useState<TournamentPlayer | null>(null);
  const [currentRound, setCurrentRound] = useState<"QF" | "SF" | "F">("QF");
  
  const [activeArena, setActiveArena] = useState(ARENAS[0]);
  const [opponent, setOpponent] = useState<TournamentPlayer | null>(null);
  const [playerOnePoke, setPlayerOnePoke] = useState<Pokemon | null>(null);
  const [playerTwoPoke, setPlayerTwoPoke] = useState<Pokemon | null>(null);
  const [showRules, setShowRules] = useState(false);

  const engine = useBattleEngine(activeArena.buff);

  useEffect(() => {
    getPokemon({ page: 1, limit: 1025 }).then(res => {
      setAllPokemon(res.data?.data || []);
      setView("SELECT_TRAINER");
    });
  }, []);

  const generateUniqueTeam = () => {
    const team: Pokemon[] = [];
    const usedTypes = new Set<string>();
    const shuffled = [...allPokemon].sort(() => 0.5 - Math.random());
    for (const p of shuffled) {
      const primaryType = p.types[0];
      if (!usedTypes.has(primaryType)) {
        team.push(p);
        usedTypes.add(primaryType);
        if (team.length === 5) break;
      }
    }
    return team;
  };

  const initializeTournament = (selectedTrainer: any) => {
    setView("LOADING");
    setTimeout(() => {
      const user: TournamentPlayer = { id: 'user', trainer: selectedTrainer, team: generateUniqueTeam(), isUser: true };
      setUserPlayer(user);
      
      const ais: TournamentPlayer[] = [];
      const shuffledTrainers = [...CHARACTERS].filter(c => c.name !== selectedTrainer.name).sort(() => 0.5 - Math.random());
      for (let i = 0; i < 7; i++) {
        ais.push({ id: `ai-${i}`, trainer: shuffledTrainers[i], team: generateUniqueTeam(), isUser: false });
      }
      
      const initialBracket = [user, ...ais].sort(() => 0.5 - Math.random());
      setQf(initialBracket);
      setCurrentRound("QF");
      setView("BRACKET");
    }, 1500);
  };

  const getOpponentForRound = () => {
    const bracket = currentRound === "QF" ? qf : currentRound === "SF" ? sf : finals;
    const userIndex = bracket.findIndex(p => p.isUser);
    if (userIndex === -1) return null; 
    const opponentIndex = userIndex % 2 === 0 ? userIndex + 1 : userIndex - 1;
    return bracket[opponentIndex];
  };

  const startMatch = () => {
    const opp = getOpponentForRound();
    if (!opp) return;
    setOpponent(opp);
    setActiveArena(ARENAS[Math.floor(Math.random() * ARENAS.length)]);
    setPlayerOnePoke(null);
    setPlayerTwoPoke(null);
    engine.resetBattle();
    setView("BATTLE");
  };

  const resolveAIMatch = (p1: TournamentPlayer, p2: TournamentPlayer) => {
    const poke1 = p1.team[Math.floor(Math.random() * p1.team.length)];
    const poke2 = p2.team[Math.floor(Math.random() * p2.team.length)];
    const pow1 = calculatePowerLevel(poke1, null) * (checkAdvantage(poke1.types, poke2.types) ? 1.5 : 1);
    const pow2 = calculatePowerLevel(poke2, null) * (checkAdvantage(poke2.types, poke1.types) ? 1.5 : 1);
    return pow1 > pow2 ? p1 : p2;
  };

  const progressTournament = () => {
    const didUserWin = engine.winner?.id === playerOnePoke?.id;
    if (!didUserWin) {
      playRetroSound("eliminate");
      setView("GAME_OVER");
      return;
    }

    if (currentRound === "QF") {
      const newSf: TournamentPlayer[] = [];
      for (let i = 0; i < 8; i += 2) {
        const p1 = qf[i];
        const p2 = qf[i + 1];
        if (p1.isUser) newSf.push(p1);
        else if (p2.isUser) newSf.push(p2);
        else newSf.push(resolveAIMatch(p1, p2));
      }
      setSf(newSf);
      setCurrentRound("SF");
      setView("BRACKET");
    } else if (currentRound === "SF") {
      const newFinals: TournamentPlayer[] = [];
      for (let i = 0; i < 4; i += 2) {
        const p1 = sf[i];
        const p2 = sf[i + 1];
        if (p1.isUser) newFinals.push(p1);
        else if (p2.isUser) newFinals.push(p2);
        else newFinals.push(resolveAIMatch(p1, p2));
      }
      setFinals(newFinals);
      setCurrentRound("F");
      setView("BRACKET");
    } else if (currentRound === "F") {
      setChampion(userPlayer);
      setView("CHAMPION");
      playRetroSound("victory");
      confetti({ particleCount: 300, spread: 100, origin: { y: 0.5 }, zIndex: 999 });
    }
  };

  const handleSelectFighter = async (selectedPoke: Pokemon) => {
    if (!opponent || !userPlayer) return;
    const aiPoke = opponent.team[Math.floor(Math.random() * 5)];
    setPlayerOnePoke(selectedPoke);
    setPlayerTwoPoke(aiPoke);
    engine.initPokemon(selectedPoke, aiPoke);
    await new Promise(r => setTimeout(r, 500));
    engine.runBattleSequence(selectedPoke, aiPoke, userPlayer.trainer.name, opponent.trainer.name);
  };

  const renderBracketBox = (player: TournamentPlayer | undefined, isWinner: boolean = false) => {
    const isUser = player?.isUser;
    const baseClass = isUser ? 'bg-indigo-600/90 border-indigo-400 text-white' : 'bg-slate-800/95 border-slate-400 text-gray-100';
    const emptyClass = 'bg-black/60 border-white/10 text-white/30';
    const glowClass = isWinner ? 'shadow-[0_0_15px_rgba(250,204,21,0.9)] border-yellow-400 z-10 scale-110' : 'shadow-md';

    return (
      <div className={`relative px-1 py-2 w-16 md:w-28 rounded-xl border-[2px] flex flex-col items-center text-center backdrop-blur-md transition-all ${!player ? emptyClass : baseClass} ${glowClass}`}>
        {player ? (
          <>
            <img src={player.trainer.image} alt={player.trainer.name} className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-slate-900 object-cover object-top border-2 border-white/20 shadow-inner mb-1.5" />
            <span className="font-black text-[8px] md:text-xs uppercase italic tracking-wider truncate w-full px-1">{player.trainer.name}</span>
          </>
        ) : (
          <span className="font-black text-[10px] md:text-xs uppercase italic my-auto tracking-widest py-4">? ? ?</span>
        )}
      </div>
    );
  };

  return (
    <div className="relative h-screen overflow-hidden bg-slate-950 text-white" style={{ 
      backgroundImage: view === 'BATTLE' ? `url(${activeArena.image})` : view === 'BRACKET' ? `url(${standardArena})` : 'none', 
      backgroundSize: 'cover', backgroundPosition: 'center' 
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,400;0,700;0,900;1,900&family=Montserrat:wght@700;900&display=swap" rel="stylesheet" />
      <style>{`.pokedash-font { font-family: 'Kanit', sans-serif; } .scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
      
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      <div className="relative z-10 pokedash-font flex flex-col items-center h-full p-6">
        <div className="absolute top-4 left-4 z-50">
          <Link to="/battle-arena" className="px-6 py-2.5 rounded-full bg-white text-black font-black text-sm shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:bg-gray-200 hover:scale-105 transition-all uppercase italic">← Back</Link>
        </div>

        {view === "LOADING" && (
          <div className="flex-1 flex flex-col items-center justify-center animate-pulse">
            <h2 className="text-4xl font-black text-yellow-400 italic uppercase drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">Drafting 40 Unique Pokémon...</h2>
          </div>
        )}

        {view === "SELECT_TRAINER" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-full w-full max-w-5xl">
            <div className="flex flex-col items-center gap-4 mb-8">
              <h1 className="text-5xl md:text-7xl font-[1000] italic text-yellow-400 uppercase drop-shadow-[0_0_30px_rgba(250,204,21,0.5)] text-center">Grand Tournament</h1>
              <button onClick={() => setShowRules(true)} className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md transition-all active:scale-95">
                <span className="text-yellow-400 text-lg leading-none">?</span> Tournament Rules
              </button>
            </div>
            <p className="text-indigo-300 font-black tracking-[0.3em] uppercase mb-12 text-center text-sm bg-indigo-900/30 px-6 py-2 rounded-full border border-indigo-500/30">Select your Champion to begin the 8-Player Draft</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {CHARACTERS.map(c => (
                <div key={c.name} className="flex flex-col items-center gap-3">
                  <button onClick={() => initializeTournament(c)} className="rounded-3xl overflow-hidden border-[4px] border-white/10 hover:border-indigo-400 hover:scale-110 transition-all bg-black/40 shadow-xl aspect-square w-32 group relative">
                    <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/20 transition-all z-10" />
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover object-top relative z-0" />
                  </button>
                  <span className="text-xs font-black uppercase text-center px-4 py-1.5 rounded-full shadow-md bg-black/60 border border-white/10 text-white tracking-widest">{c.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {view === "BRACKET" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-start w-full max-w-6xl h-full flex-1 relative z-10 overflow-y-auto scrollbar-hide pt-4 pb-12">
            <div className="flex flex-col items-center mb-10 shrink-0">
              <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] mb-2">Tournament Bracket</h2>
              <h3 className="text-yellow-400 font-bold uppercase tracking-[0.4em] text-xs md:text-sm bg-black/60 px-6 py-1.5 rounded-full border border-yellow-500/50 shadow-lg">
                Round: {currentRound === 'QF' ? 'Quarter-Finals' : currentRound === 'SF' ? 'Semi-Finals' : 'Finals'}
              </h3>
            </div>
            <div className="flex flex-col items-center w-full gap-8 md:gap-10 scale-[0.85] md:scale-100 origin-top shrink-0">
              <div className="flex justify-between w-full px-2 md:px-0 z-10">
                {[0, 2, 4, 6].map(i => (
                  <div key={i} className="flex justify-between w-[23%] relative">
                    {renderBracketBox(qf[i], sf.includes(qf[i]))}
                    {renderBracketBox(qf[i+1], sf.includes(qf[i+1]))}
                    <div className="absolute top-[100%] left-[25%] right-[25%] h-6 md:h-8 border-x-2 border-b-2 border-white/40 rounded-b-xl -z-10" />
                    <div className="absolute top-[100%] mt-6 md:mt-8 left-1/2 w-[2px] h-6 md:h-8 bg-white/40 -z-10" />
                  </div>
                ))}
              </div>
              <div className="flex justify-around w-full px-4 md:px-12 mt-4 z-10">
                {[0, 2].map(i => (
                  <div key={i} className="flex justify-between w-[40%] relative">
                    {renderBracketBox(sf[i], finals.includes(sf[i]))}
                    {renderBracketBox(sf[i+1], finals.includes(sf[i+1]))}
                    <div className="absolute top-[100%] left-[25%] right-[25%] h-6 md:h-8 border-x-2 border-b-2 border-white/40 rounded-b-xl -z-10" />
                    <div className="absolute top-[100%] mt-6 md:mt-8 left-1/2 w-[2px] h-6 md:h-8 bg-white/40 -z-10" />
                  </div>
                ))}
              </div>
              <div className="flex justify-center w-full mt-4 z-10">
                <div className="flex justify-between w-[45%] md:w-[35%] relative">
                  {renderBracketBox(finals[0], champion === finals[0])}
                  {renderBracketBox(finals[1], champion === finals[1])}
                  <div className="absolute top-[100%] left-[25%] right-[25%] h-8 md:h-10 border-x-2 border-b-2 border-yellow-400/60 rounded-b-xl shadow-[0_5px_15px_rgba(250,204,21,0.3)] -z-10" />
                  <div className="absolute top-[100%] mt-8 md:mt-10 left-1/2 w-[3px] h-8 md:h-10 bg-yellow-400/60 shadow-[0_0_15px_rgba(250,204,21,0.5)] -z-10" />
                </div>
              </div>
              <div className="flex justify-center w-full mt-6 relative z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400/30 blur-2xl rounded-full animate-pulse" />
                  <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-700 p-1.5 rounded-3xl shadow-[0_0_40px_rgba(250,204,21,0.8)] scale-110 md:scale-125">
                    <div className="bg-slate-950 p-4 rounded-2xl flex flex-col items-center gap-2 w-32 md:w-48 text-center border-2 border-yellow-500/50">
                      <span className="text-yellow-400 font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px] drop-shadow-md">Grand Champion</span>
                      {champion ? (
                        <>
                          <img src={champion.trainer.image} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover object-top border-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.9)] bg-slate-900" />
                          <span className="text-white font-black italic uppercase text-xs md:text-sm drop-shadow-md truncate w-full">{champion.trainer.name}</span>
                        </>
                      ) : <span className="text-white/20 text-3xl font-black pb-2">?</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100]">
              <button onClick={startMatch} className="flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-lg md:text-2xl hover:scale-110 shadow-[0_0_40px_rgba(79,70,229,0.8)] border-b-[6px] border-indigo-950 active:border-b-0 active:translate-y-1 uppercase italic tracking-wider transition-all">
                Start Match <span className="text-2xl md:text-4xl leading-none mt-[-2px]">➔</span>
              </button>
            </div>
          </motion.div>
        )}

        {view === "BATTLE" && (
          <motion.div variants={arenaShakeVariants} animate={engine.isShaking ? "heavy" : "idle"} className="w-full flex-1 flex flex-col items-center pt-4">
            <h1 className="text-4xl md:text-5xl font-black text-center mt-2 mb-8 tracking-tighter uppercase italic heading-glow">⚔ {activeArena.name} ⚔</h1>
            <AnimatePresence>
              {engine.isBattling && engine.combatLog.side === "center" && engine.combatLog.text && <BattleLog message={engine.combatLog.text} />}
            </AnimatePresence>

            {!playerOnePoke ? (
               <div className="bg-black/60 backdrop-blur-xl p-8 rounded-[3rem] border border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.2)] w-full max-w-5xl animate-in fade-in zoom-in-95 duration-500 text-center">
                 <h3 className="text-3xl font-black italic uppercase text-white mb-2">Choose Your Fighter</h3>
                 <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-8">Match {currentRound} vs {opponent?.trainer.name}</p>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                   {userPlayer?.team.map((poke) => {
                     const arenaAdv = poke.types.includes(activeArena.buff || "");
                     return (
                       <button key={poke.id} onClick={() => handleSelectFighter(poke)} className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 hover:bg-indigo-900/40 hover:border-indigo-400 p-4 rounded-2xl transition-all hover:scale-105 relative group shadow-xl">
                         {arenaAdv && <div className="absolute -top-3 px-3 py-1 bg-yellow-500 text-black text-[9px] font-black uppercase rounded-full shadow-lg z-10 animate-bounce">Arena Buff</div>}
                         <img src={poke.image} className="w-20 h-20 object-contain drop-shadow-xl group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all" />
                         <span className="text-white font-black text-sm uppercase italic truncate w-full">{poke.name}</span>
                         <div className="flex flex-wrap justify-center gap-1 mb-2">
                           {poke.types.map(t => <span key={t} className="text-[8px] px-1.5 py-0.5 rounded bg-black/60 font-bold text-gray-300 uppercase">{t}</span>)}
                         </div>
                         <div className="w-full bg-black/50 rounded-lg p-2 flex flex-col gap-1 shadow-inner border border-white/5">
                           <div className="text-[10px] font-black text-white flex justify-between uppercase tracking-widest border-b border-white/10 pb-1 mb-1">
                             <span>BP:</span><span className="text-yellow-400">{engine.getPowerLevel(poke)}</span>
                           </div>
                           <div className="text-[9px] font-bold text-gray-400 flex justify-between uppercase">
                             <span>HP:</span><span className="text-green-400">{poke.stats.find(s=>s.name==='hp')?.value || 0}</span>
                           </div>
                           <div className="text-[9px] font-bold text-gray-400 flex justify-between uppercase">
                             <span>ATK:</span><span className="text-red-400">{poke.stats.find(s=>s.name==='attack')?.value || 0}</span>
                           </div>
                           <div className="text-[9px] font-bold text-gray-400 flex justify-between uppercase">
                             <span>DEF:</span><span className="text-blue-400">{poke.stats.find(s=>s.name==='defense')?.value || 0}</span>
                           </div>
                         </div>
                       </button>
                     )
                   })}
                 </div>
               </div>
            ) : (
              <BattleArena 
                engine={engine}
                arena={activeArena}
                trainerOne={userPlayer?.trainer}
                trainerTwo={opponent?.trainer}
                playerOnePoke={playerOnePoke}
                playerTwoPoke={playerTwoPoke}
                bottomActionUI={
                  engine.isFinished && (
                    <div className="fixed bottom-6 right-6 md:bottom-4 md:right-10 z-[100]">
                      {engine.winner?.id === playerOnePoke?.id ? (
                        <button onClick={progressTournament} className="px-16 py-5 bg-red-600 text-white font-black text-2xl rounded-full shadow-[0_0_50px_rgba(220,38,38,0.8)] border-b-[6px] border-red-900 hover:scale-105 active:scale-95 transition-all uppercase italic tracking-widest">
                          Next
                        </button>
                      ) : (
                        <button onClick={progressTournament} className="px-16 py-5 bg-red-600 text-white font-black text-2xl rounded-full shadow-[0_0_50px_rgba(127,29,29,0.8)] border-b-[6px] border-red-950 hover:scale-105 active:scale-95 transition-all uppercase italic tracking-widest">
                          Go Back
                        </button>
                      )}
                    </div>
                  )
                }
              />
            )}
          </motion.div>
        )}

        {view === "GAME_OVER" && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full h-full bg-red-900/50 absolute inset-0 backdrop-blur-md">
            <h1 className="text-7xl md:text-9xl font-black text-red-500 uppercase italic drop-shadow-[0_0_50px_rgba(239,68,68,0.8)]">Eliminated</h1>
            <p className="text-white text-2xl font-bold uppercase tracking-[0.3em] mt-4 mb-12">Your Tournament Run Ends Here</p>
            <Link to="/battle-arena" className="px-10 py-4 bg-white/10 text-white border border-white/20 hover:bg-white/20 font-black uppercase tracking-widest rounded-full transition-all">Back to Menu</Link>
          </motion.div>
        )}

        {view === "CHAMPION" && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full h-full bg-yellow-900/40 absolute inset-0 backdrop-blur-md">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.4)_0%,transparent_70%)] animate-pulse" />
            <h2 className="text-3xl text-yellow-500 font-black uppercase tracking-[0.5em] mb-4 relative z-10">Grand Champion</h2>
            <h1 className="text-7xl md:text-9xl font-[1000] text-transparent bg-clip-text bg-gradient-to-b from-white to-yellow-400 uppercase italic drop-shadow-[0_0_50px_rgba(250,204,21,0.8)] relative z-10">{champion?.trainer.name}</h1>
            <img src={champion?.trainer.image} className="h-64 mt-8 object-contain drop-shadow-[0_0_30px_rgba(250,204,21,0.6)] relative z-10" />
            <Link to="/battle-arena" className="mt-12 px-10 py-4 bg-yellow-500 text-black border-b-[6px] border-yellow-700 hover:scale-105 active:scale-95 font-black uppercase tracking-widest rounded-full transition-all relative z-10">Play Again</Link>
          </motion.div>
        )}

        <AnimatePresence>
          {showRules && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-slate-900 border-2 border-indigo-500 rounded-[2rem] p-6 md:p-10 max-w-2xl w-full shadow-[0_0_50px_rgba(79,70,229,0.3)] relative max-h-[90vh] overflow-y-auto scrollbar-hide">
                <button onClick={() => setShowRules(false)} className="absolute top-6 right-6 text-white/50 hover:text-red-500 transition-colors text-2xl font-black">✕</button>
                <h2 className="text-3xl font-black italic uppercase text-yellow-400 mb-6 border-b border-white/10 pb-4">Tournament Rules</h2>
                
                <div className="space-y-6 text-sm md:text-base font-medium text-gray-300">
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/50 text-purple-400 mt-1">🎲</div>
                    <div>
                      <h3 className="text-white font-black uppercase tracking-widest mb-1 text-sm">The Draft Roster</h3>
                      <p>Upon entering the tournament, you and 7 CPU trainers are automatically assigned a random roster of <span className="text-purple-400 font-bold">5 unique Pokémon</span>. Before each match, you will choose one Pokémon from this roster to fight.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/50 text-orange-400 mt-1">🏆</div>
                    <div>
                      <h3 className="text-white font-black uppercase tracking-widest mb-1 text-sm">Single Elimination Bracket</h3>
                      <p>This is a sudden-death, 8-player bracket. Each match is Eliminatory, You must survive the Quarter-Finals, Semi-Finals, and Finals. <span className="text-red-400 font-bold">If your Pokémon loses a match, your tournament run is instantly over!</span></p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/50 text-indigo-400 mt-1">📊</div>
                    <div>
                      <h3 className="text-white font-black uppercase tracking-widest mb-1 text-sm">Combat Stats (BP)</h3>
                      <p>A Pokémon's starting HP and base damage are determined by their total base stats combined, referred to as Base Power (BP).</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/50 text-green-400 mt-1">🌍</div>
                    <div>
                      <h3 className="text-white font-black uppercase tracking-widest mb-1 text-sm">Type & Arena Advantage</h3>
                      <p>Super-effective typing against your opponent applies a <span className="text-green-400 font-bold">1.5x Multiplier</span> to damage. Matching your Pokémon's type to the current randomized Arena gives a flat <span className="text-yellow-400 font-bold">+200 BP Boost</span>.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-pink-500/20 rounded-lg border border-pink-500/50 text-pink-400 mt-1">👏</div>
                    <div>
                      <h3 className="text-white font-black uppercase tracking-widest mb-1 text-sm">Crits & Cheers</h3>
                      <p>Every strike has a <span className="text-yellow-400 font-bold">15% chance</span> to become a Critical Hit (double damage). You also have <span className="text-pink-400 font-bold">5 Cheers</span> per match; click the cheer button during combat to instantly heal <span className="text-green-400 font-bold">+35 HP</span>.</p>
                    </div>
                  </div>

                </div>
                <button onClick={() => setShowRules(false)} className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-xl transition-all active:scale-95">I'm Ready, Let's Battle!</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}