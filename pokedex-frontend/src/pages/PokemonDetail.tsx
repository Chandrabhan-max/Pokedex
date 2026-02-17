import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import type { Pokemon } from '../types/pokemon';
import { getPokemonById } from '../api/pokemon.api';

const TYPE_GRADIENTS: Record<string, string> = {
  grass: "from-green-400 via-emerald-500 to-green-600",
  water: "from-blue-400 via-cyan-500 to-blue-600",
  fire: "from-red-400 via-orange-500 to-red-600",
  electric: "from-yellow-300 via-amber-400 to-yellow-500",
  rock: "from-stone-400 via-yellow-600 to-stone-700",
  bug: "from-lime-400 via-green-500 to-lime-600",
  poison: "from-purple-400 via-violet-500 to-purple-700",
  psychic: "from-pink-400 via-fuchsia-500 to-pink-600",
  ice: "from-cyan-300 via-blue-400 to-cyan-500",
  dragon: "from-indigo-500 via-purple-600 to-indigo-700",
  dark: "from-gray-700 via-gray-800 to-black",
  fairy: "from-pink-300 via-rose-400 to-pink-500",
  fighting: "from-orange-600 via-red-600 to-orange-700",
  ground: "from-yellow-600 via-amber-700 to-yellow-800",
  flying: "from-sky-400 via-indigo-400 to-sky-500",
  ghost: "from-indigo-700 via-purple-800 to-indigo-900",
  steel: "from-gray-400 via-slate-500 to-gray-600",
  normal: "from-gray-300 via-gray-400 to-gray-500",
};

function PokemonDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const { data } = await getPokemonById(Number(id));
        setPokemon(data);
      } catch (error) {
        console.error("Error fetching pokemon details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const { bgGradient, height, weight, prevId, nextId } = useMemo(() => {
    if (!pokemon) return { bgGradient: "", height: "0", weight: "0", prevId: 0, nextId: 0 };

    const primaryType = pokemon.types[0];
    const currentId = Number(pokemon.id);
    
    return {
      bgGradient: TYPE_GRADIENTS[primaryType] || "from-indigo-400 via-purple-500 to-indigo-600",
      height: (pokemon.height / 10).toFixed(1),
      weight: (pokemon.weight / 10).toFixed(1),
      prevId: currentId > 1 ? currentId - 1 : 1025, // Loop to end if at start
      nextId: currentId < 1025 ? currentId + 1 : 1 // Loop to start if at end
    };
  }, [pokemon]);

  if (isLoading || !pokemon) return null;

  return (
    <div className="relative min-h-screen p-10 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} bg-[length:200%_200%] animate-gradient`} />
      
      <div className="absolute inset-0 bg-black/0 dark:bg-black/50 transition-all duration-500" />

      <Link
        to={`/pokemon/${prevId}${location.search}`}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all hover:scale-110 shadow-2xl group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      <Link
        to={`/pokemon/${nextId}${location.search}`}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all hover:scale-110 shadow-2xl group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      <div className="relative z-10">
        <Link
          to={`/${location.search}`}
          className="inline-block mb-6 px-6 py-2 rounded-xl bg-white text-black dark:bg-black dark:text-white shadow-lg hover:scale-105 transition-all duration-300 font-bold"
        >
          ← Back
        </Link>

        <motion.div
          key={pokemon.id}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto mt-10 rounded-3xl p-12 shadow-2xl border border-white/30 dark:border-gray-700 bg-white/20 dark:bg-gray-900/70 backdrop-blur-2xl transition-all duration-500"
        >
          <div className="flex flex-col items-center text-white dark:text-gray-100">
            
            <div className="flex flex-col items-center mb-8">
              <span className="text-white/60 text-lg font-black tracking-widest mb-2">
                #{String(pokemon.id).padStart(3, '0')}
              </span>
              <h1 className="text-5xl font-black capitalize tracking-wide italic">
                {pokemon.name}
              </h1>
            </div>

            <div className="relative mb-12">
              <div className="absolute inset-0 blur-3xl opacity-30 bg-white dark:bg-indigo-500 rounded-full" />
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="relative w-64 h-64 object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-110"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-14 w-full">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold border-l-4 border-white/40 pl-4">Physical Info</h3>
                
                <div className="flex justify-between border-b border-white/30 dark:border-gray-600 pb-2">
                  <span className="opacity-80">Height</span>
                  <span className="font-semibold">{height} m</span>
                </div>

                <div className="flex justify-between border-b border-white/30 dark:border-gray-600 pb-2">
                  <span className="opacity-80">Weight</span>
                  <span className="font-semibold">{weight} kg</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6 border-l-4 border-white/40 pl-4">Abilities</h3>
                <div className="flex flex-wrap gap-3">
                  {pokemon.abilities.map(ability => (
                    <span
                      key={ability}
                      className="px-4 py-2 rounded-full text-sm font-bold capitalize bg-white/10 dark:bg-black/20 border border-white/20 dark:border-gray-600 backdrop-blur-md shadow-sm"
                    >
                      {ability}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-14 w-full">
              <h3 className="text-xl font-semibold mb-6 border-l-4 border-white/40 pl-4">Battle Stats</h3>

              {pokemon.stats.map(stat => {
                const barWidth = Math.min(stat.value, 150) / 150 * 100;

                return (
                  <div key={stat.name} className="mb-6">
                    <div className="flex justify-between mb-2 px-1">
                      <span className="capitalize opacity-80 font-medium">{stat.name}</span>
                      <span className="font-bold">
                        <CountUp end={stat.value} duration={1.2} redraw={true} />
                      </span>
                    </div>

                    <div className="w-full bg-black/20 dark:bg-gray-800/60 h-4 rounded-full overflow-hidden border border-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-4 rounded-full bg-white dark:bg-indigo-400 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            animation: gradientMove 8s ease infinite;
          }
        `}
      </style>
    </div>
  );
}

export default PokemonDetail;