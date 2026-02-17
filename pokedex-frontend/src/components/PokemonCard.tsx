import { Link, useLocation } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import type { Pokemon } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const TYPE_COLORS: Record<string, string> = {
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

function PokemonCard({ pokemon }: PokemonCardProps) {
  const location = useLocation();
  const { id, name, image, types } = pokemon;

  const gradientClass = TYPE_COLORS[types[0]] || "from-indigo-400 to-purple-500";

  return (
    <Tilt 
      scale={1.05} 
      glareEnable={false}
      perspective={1000}
      className="h-full"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <Link
        to={`/pokemon/${id}${location.search}`}
        style={{ clipPath: 'inset(0 round 2rem)' }} 
        className="group relative flex flex-col justify-between h-72 p-6 transition-all duration-300 border-none outline-none focus:ring-0 focus:outline-none ring-0 shadow-none"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-100 transition-opacity`} />
        
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start">
            <span className="text-white/90 text-[10px] font-black tracking-widest uppercase bg-black/20 px-2 py-1 rounded-md backdrop-blur-sm">
              #{String(id).padStart(3, '0')}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <img
              src={image}
              alt={name}
              className="w-32 h-32 object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <div className="mt-2">
            <h3 className="text-center text-xl font-black text-white capitalize italic tracking-tight">
              {name}
            </h3>

            <div className="flex justify-center gap-1.5 mt-3">
              {types.map(type => (
                <span
                  key={type}
                  className="px-3 py-0.5 text-[10px] font-bold bg-black/40 text-white rounded-lg capitalize border border-white/10"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </Tilt>
  );
}

export default PokemonCard;