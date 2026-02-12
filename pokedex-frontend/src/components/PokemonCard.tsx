import { Link } from 'react-router-dom';
import type { Pokemon } from '../types/pokemon';
import Tilt from 'react-parallax-tilt';

interface Props {
  pokemon: Pokemon;
}

const typeColorMap: Record<string, string> = {
  fire: "from-red-400 to-orange-500",
  water: "from-blue-400 to-cyan-500",
  grass: "from-green-400 to-emerald-500",
  electric: "from-yellow-300 to-amber-400",
  psychic: "from-pink-400 to-purple-500",
  rock: "from-stone-400 to-yellow-600",
  bug: "from-lime-400 to-green-600",
  steel: "from-gray-400 to-slate-600",
  fighting: "from-orange-600 to-red-700",
  poison: "from-purple-500 to-violet-700",
  ground: "from-yellow-600 to-amber-800",
  dragon: "from-indigo-600 to-purple-700",
  dark: "from-gray-700 to-black",
  fairy: "from-pink-300 to-rose-400",
  ice: "from-cyan-300 to-blue-400",
  flying: "from-indigo-400 to-sky-400",
  ghost: "from-indigo-800 to-purple-800",
  normal: "from-gray-400 to-gray-500",
};

function PokemonCard({ pokemon }: Props) {
  const primaryType = pokemon.types[0];
  const gradient = typeColorMap[primaryType] || "from-indigo-400 to-purple-500";

  return (
    <Tilt scale={1.05} glareEnable glareMaxOpacity={0.2}>
      <Link
        to={`/pokemon/${pokemon.id}`}
        className="group relative flex flex-col justify-between h-64 rounded-3xl p-6 shadow-xl border border-white/30 overflow-hidden"
      >

        {/* Background Gradient Layer */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`} />

        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-lg" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">

          {/* ID */}
          <span className="text-white/80 text-sm font-semibold">
            #{pokemon.id}
          </span>

          {/* Image */}
          <div className="flex justify-center mt-4">
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-24 h-24 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Name */}
          <h3 className="mt-4 text-center text-xl font-bold text-white capitalize tracking-wide">
            {pokemon.name}
          </h3>

          {/* Types */}
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            {pokemon.types.map(type => (
              <span
                key={type}
                className="px-3 py-1 text-xs bg-black/30 text-white rounded-full capitalize"
              >
                {type}
              </span>
            ))}
          </div>

        </div>
      </Link>
    </Tilt>
  );
}

export default PokemonCard;
