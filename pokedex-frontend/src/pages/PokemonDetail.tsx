import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import type { Pokemon } from '../types/pokemon';
import { getPokemonById } from '../api/pokemon.api';

const typeBackground: Record<string, string> = {
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
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    if (id) fetchPokemon(Number(id));
  }, [id]);

  const fetchPokemon = async (pokemonId: number) => {
    const res = await getPokemonById(pokemonId);
    setPokemon(res.data);
  };

  if (!pokemon) return null;

  const primaryType = pokemon.types[0];
  const bgGradient =
    typeBackground[primaryType] ||
    "from-indigo-400 via-purple-500 to-indigo-600";

  const height = (pokemon.height / 10).toFixed(1);
  const weight = (pokemon.weight / 10).toFixed(1);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} p-10 transition-all duration-500`}
    >
      <Link
        to="/"
        className="text-white font-semibold opacity-90 hover:opacity-100"
      >
        ← Back
      </Link>

      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto mt-10 rounded-3xl p-12 shadow-2xl border border-white/30"
        style={{
          background:
            "rgba(0,0,0,0.25)",  // darker glass effect
          backdropFilter: "blur(20px)"
        }}
      >
        <div className="flex flex-col items-center text-white">

          <h1 className="text-4xl font-bold capitalize mb-6 tracking-wide">
            {pokemon.name}
          </h1>

          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="w-44 h-44 mb-10 drop-shadow-2xl"
          />

          {/* INFO SECTION */}
          <div className="grid md:grid-cols-2 gap-14 w-full">

            {/* Physical Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">
                Physical Info
              </h3>

              <div className="flex justify-between border-b border-white/30 pb-2">
                <span className="opacity-80">Height</span>
                <span className="font-semibold">{height} m</span>
              </div>

              <div className="flex justify-between border-b border-white/30 pb-2">
                <span className="opacity-80">Weight</span>
                <span className="font-semibold">{weight} kg</span>
              </div>
            </div>

            {/* Abilities */}
            <div>
              <h3 className="text-xl font-semibold mb-6">
                Abilities
              </h3>

              <div className="flex flex-wrap gap-3">
                {pokemon.abilities.map(a => (
                  <span
                    key={a}
                    className="px-4 py-2 rounded-full bg-white/20 border border-white/30 text-sm capitalize"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* STATS */}
          <div className="mt-14 w-full">
            <h3 className="text-xl font-semibold mb-6">
              Battle Stats
            </h3>

            {pokemon.stats.map(stat => {
              const percentage = Math.min(stat.value, 150) / 150 * 100;

              return (
                <div key={stat.name} className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="capitalize opacity-80">
                      {stat.name}
                    </span>
                    <span className="font-semibold">
                      <CountUp end={stat.value} duration={1.2} />
                    </span>
                  </div>

                  <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1 }}
                      className="bg-white h-3 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default PokemonDetail;
