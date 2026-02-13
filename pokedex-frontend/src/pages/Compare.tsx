import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { getPokemon, getPokemonById } from "../api/pokemon.api";
import type { Pokemon } from "../types/pokemon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ARENAS = [
  { 
    id: "normal", 
    name: "Standard Arena", 
    color: "from-slate-800 via-gray-700 to-slate-900", 
    buff: null 
  },
  { 
    id: "grass", 
    name: "Jungle Basin", 
    color: "from-green-900 via-emerald-900 to-black", 
    buff: "grass" 
  },
  { 
    id: "water", 
    name: "Whirlpool Island", 
    color: "from-blue-900 via-cyan-900 to-black", 
    buff: "water" 
  },
  { 
    id: "fire", 
    name: "Volcanic Pit", 
    color: "from-red-900 via-orange-900 to-black", 
    buff: "fire" 
  },
];

function Compare() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [playerOne, setPlayerOne] = useState<Pokemon | null>(null);
  const [playerTwo, setPlayerTwo] = useState<Pokemon | null>(null);
  
  const [searchOne, setSearchOne] = useState("");
  const [searchTwo, setSearchTwo] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({ p1: false, p2: false });
  
  const [arena, setArena] = useState(ARENAS[0]);
  const [activeGlow, setActiveGlow] = useState<"p1" | "p2" | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [winner, setWinner] = useState<Pokemon | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getPokemon({ page: 1, limit: 200 });
        setPokemonList(res.data.data);
      } catch (err) {
        console.error("Failed to fetch pokemon", err);
      }
    };
    init();
  }, []);

  const selectPokemon = async (id: number, slot: "p1" | "p2") => {
    const { data } = await getPokemonById(id);
    
    if (slot === "p1") {
      setPlayerOne(data);
      setSearchOne(data.name);
      setDropdownOpen(prev => ({ ...prev, p1: false }));
    } else {
      setPlayerTwo(data);
      setSearchTwo(data.name);
      setDropdownOpen(prev => ({ ...prev, p2: false }));
    }
  };

  const getPowerLevel = useCallback((poke: Pokemon) => {
    const base = poke.stats.reduce((acc, s) => acc + s.value, 0);
    const hasAdvantage = poke.types.includes(arena.buff || "");
    return hasAdvantage ? base + 25 : base;
  }, [arena]);


  const handleReset = () => {
    setPlayerOne(null);
    setPlayerTwo(null);
    setSearchOne("");
    setSearchTwo("");
    setIsBattling(false);
    setIsFinished(false);
    setWinner(null);
    setShowResult(false);
    setActiveGlow(null);
    setArena(ARENAS[0]);
  };

  const handleRandomize = () => {
    if (pokemonList.length < 2) return;

    const idx1 = Math.floor(Math.random() * pokemonList.length);
    let idx2 = Math.floor(Math.random() * pokemonList.length);

    while (idx1 === idx2) {
      idx2 = Math.floor(Math.random() * pokemonList.length);
    }

    selectPokemon(pokemonList[idx1].id, "p1");
    selectPokemon(pokemonList[idx2].id, "p2");
    
    setIsBattling(false);
    setIsFinished(false);
  };

  const runBattleSequence = async () => {
    if (!playerOne || !playerTwo) return;

    setIsBattling(true);
    setIsFinished(false);

    const p1Power = getPowerLevel(playerOne);
    const p2Power = getPowerLevel(playerTwo);
    const finalWinner = p1Power > p2Power ? playerOne : playerTwo;

    let current: "p1" | "p2" = "p1";
    for (let i = 0; i < 18; i++) {
      setActiveGlow(current);
      await new Promise(r => setTimeout(r, 80 + (i * 25)));
      current = current === "p1" ? "p2" : "p1";
    }

    setActiveGlow(finalWinner.id === playerOne.id ? "p1" : "p2");
    setWinner(finalWinner);

    setTimeout(() => {
      setShowResult(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#ef4444", "#3b82f6"],
      });
      setIsFinished(true);
    }, 500);
  };

  const filteredP1 = pokemonList.filter(p => p.name.toLowerCase().includes(searchOne.toLowerCase()));
  const filteredP2 = pokemonList.filter(p => p.name.toLowerCase().includes(searchTwo.toLowerCase()));

  return (
    <div className={`relative min-h-screen transition-all duration-1000 bg-gradient-to-br ${arena.color} text-white px-16 py-12 overflow-hidden`}>
      <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,400;0,700;0,900;1,900&family=Montserrat:wght@700;900&display=swap" rel="stylesheet" />
      
      <style>{`
        .pokedash-font { font-family: 'Kanit', sans-serif; }
        .heading-glow { text-shadow: 0 0 20px rgba(255,255,255,0.3), 4px 4px 0px rgba(0,0,0,0.5); }
        .result-gradient { background: linear-gradient(135deg, rgba(17,24,39,0.95) 0%, rgba(0,0,0,1) 100%); }
      `}</style>

      <div className="absolute inset-0 flex pointer-events-none">
        <div className="w-1/2 bg-gradient-to-r from-red-800/10 via-transparent to-transparent" />
        <div className="w-1/2 bg-gradient-to-l from-blue-800/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 pokedash-font">
        <div className="flex flex-col items-center">
          <div className="w-full">
            <Link to="/" className="px-6 py-2 rounded-full bg-white text-black font-black text-sm shadow-xl hover:bg-gray-200 transition-all uppercase italic">
              ← Back
            </Link>
          </div>
          <h1 className="text-6xl font-black text-center mt-2 mb-4 tracking-tighter uppercase italic heading-glow">
            ⚔ {arena.name} ⚔
          </h1>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          {ARENAS.map((a) => (
            <button
              key={a.id}
              onClick={() => setArena(a)}
              className={`px-6 py-2 rounded-xl border-b-4 transition-all font-bold uppercase text-xs tracking-widest ${
                arena.id === a.id 
                  ? "border-yellow-600 bg-yellow-400 text-black translate-y-1" 
                  : "border-black/40 bg-white/10 hover:bg-white/20"
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="flex gap-6">
            <button onClick={handleRandomize} className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-500 transition-all shadow-lg border-b-4 border-indigo-900 active:border-b-0 active:translate-y-1">
              RANDOMIZE
            </button>
            {isFinished && (
              <button onClick={handleReset} className="px-8 py-3 rounded-2xl bg-red-600 text-white font-black text-lg hover:bg-red-500 transition-all shadow-lg border-b-4 border-red-900 active:border-b-0 active:translate-y-1 uppercase italic tracking-wider">
                RESET ARENA
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="relative">
            <label className="text-xs font-black uppercase tracking-widest ml-2 mb-2 block text-red-500">Player 1</label>
            <input
              value={searchOne}
              onFocus={() => setDropdownOpen(p => ({ ...p, p1: true }))}
              onChange={(e) => setSearchOne(e.target.value)}
              placeholder="Search Pokemon..."
              className="w-full px-6 py-4 rounded-2xl bg-white text-black font-bold text-lg focus:ring-4 ring-red-500/50 outline-none transition-all shadow-inner"
            />
            {dropdownOpen.p1 && searchOne && (
              <div className="absolute z-30 w-full bg-white text-black mt-2 rounded-2xl max-h-60 overflow-y-auto shadow-2xl">
                {filteredP1.map((p) => (
                  <div key={p.id} onClick={() => selectPokemon(p.id, "p1")} className="px-5 py-3 text-lg hover:bg-gray-100 cursor-pointer capitalize font-bold border-b border-gray-100">
                    {p.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="text-xs font-black uppercase tracking-widest ml-2 mb-2 block text-blue-500">Player 2</label>
            <input
              value={searchTwo}
              onFocus={() => setDropdownOpen(p => ({ ...p, p2: true }))}
              onChange={(e) => setSearchTwo(e.target.value)}
              placeholder="Search Pokemon..."
              className="w-full px-6 py-4 rounded-2xl bg-white text-black font-bold text-lg focus:ring-4 ring-blue-500/50 outline-none transition-all shadow-inner"
            />
            {dropdownOpen.p2 && searchTwo && (
              <div className="absolute z-30 w-full bg-white text-black mt-2 rounded-2xl max-h-60 overflow-y-auto shadow-2xl">
                {filteredP2.map((p) => (
                  <div key={p.id} onClick={() => selectPokemon(p.id, "p2")} className="px-5 py-3 text-lg hover:bg-gray-100 cursor-pointer capitalize font-bold border-b border-gray-100">
                    {p.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {playerOne && playerTwo && (
          <>
            <div className="grid md:grid-cols-2 gap-16 items-start">
              {[playerOne, playerTwo].map((poke, idx) => {
                const isCurrentSide = (idx === 0 && activeGlow === "p1") || (idx === 1 && activeGlow === "p2");
                const hasArenaBuff = poke.types.includes(arena.buff || "");

                return (
                  <motion.div
                    key={poke.id}
                    animate={{
                      scale: isCurrentSide ? 1.05 : 1,
                      boxShadow: isCurrentSide ? "0px 20px 80px rgba(255,215,0,0.4)" : "0px 10px 30px rgba(0,0,0,0.5)",
                    }}
                    className="relative p-10 rounded-[3rem] bg-gray-900 border-[6px] border-gray-800 shadow-inner overflow-hidden"
                  >
                    {hasArenaBuff && (
                      <div className="absolute top-6 right-6 bg-yellow-400 text-black px-4 py-1 rounded-lg font-black italic text-xs rotate-12 shadow-lg border-2 border-black z-20">
                        ARENA BOOST!
                      </div>
                    )}
                    <img src={poke.image} alt={poke.name} className="w-64 h-64 mx-auto drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]" />
                    <h2 className="text-4xl font-black text-center mt-6 capitalize italic tracking-tighter text-white">{poke.name}</h2>

                    {isFinished && (
                      <div className="mt-8 bg-black/40 p-6 rounded-3xl border border-white/10">
                        <div className="space-y-4">
                          {poke.stats.map((s) => (
                            <div key={s.name}>
                              <div className="flex justify-between text-xs font-black uppercase tracking-tighter mb-1 opacity-70">
                                <span>{s.name}</span>
                                <span>{s.value}</span>
                              </div>
                              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(s.value / 150) * 100}%` }}
                                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-100"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 text-center text-3xl font-black text-yellow-400 tracking-tighter italic">
                          TOTAL: {getPowerLevel(poke)}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {!isBattling && (
              <div className="mt-16 text-center">
                <button onClick={runBattleSequence} className="px-16 py-6 bg-yellow-400 text-black font-black text-4xl rounded-3xl hover:scale-110 transition-all shadow-[0_20px_50px_rgba(250,204,21,0.3)] uppercase italic border-b-[12px] border-yellow-600 active:border-b-0 active:translate-y-2">
                  Fight!
                </button>
              </div>
            )}

            {isFinished && winner && (
              <div className="mt-12 text-center text-5xl font-black text-white uppercase italic tracking-tighter animate-pulse">
                Winner: <span className="text-yellow-400 underline">{winner.name}</span>
              </div>
            )}
          </>
        )}

        <AlertDialog open={showResult} onOpenChange={setShowResult}>
          <AlertDialogContent className="p-0 border-none bg-transparent max-w-2xl overflow-visible">
            <div className="relative p-1 bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 rounded-[2.5rem] shadow-[0_0_50px_rgba(234,179,8,0.5)]">
              <div className="result-gradient rounded-[2.4rem] p-10 flex flex-col items-center pokedash-font overflow-hidden relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-500/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/20 blur-3xl rounded-full" />
                
                <AlertDialogHeader className="space-y-2">
                  <AlertDialogTitle className="text-6xl font-black text-white uppercase italic tracking-tighter text-center leading-none">
                    <span className="block text-yellow-400 text-2xl tracking-widest mb-2 not-italic">THE CHAMPION</span>
                    {winner?.name}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400 text-center text-xl font-bold italic pt-4">
                    Victory achieved in <span className="text-white border-b-2 border-indigo-500">{arena.name}</span>
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="my-8 py-4 px-10 bg-white/5 rounded-2xl border border-white/10 text-center">
                   <p className="text-gray-500 uppercase text-xs font-black tracking-widest">Final Battle Power</p>
                   <p className="text-5xl font-black text-yellow-400">{winner ? getPowerLevel(winner) : 0}</p>
                </div>

                <AlertDialogFooter className="w-full sm:justify-center">
                  <AlertDialogAction className="w-full sm:w-auto bg-yellow-400 text-black font-black hover:bg-yellow-300 px-16 py-4 text-2xl rounded-2xl transition-all uppercase italic border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1">
                    NEXT BATTLE
                  </AlertDialogAction>
                </AlertDialogFooter>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default Compare;