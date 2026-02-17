import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Carousel from "../components/Carousel";

export interface StrongestPokemon {
  id: number;
  name: string;
  image: string;
  facts: string[];
  abilities: string[];
}

const STRONGEST_POKEMON_DATA: StrongestPokemon[] = [
  { id: 493, name: "Arceus", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/493.png", abilities: ["Multitype"], facts: ["Creator of the Pokémon universe in lore.", "Can change type using elemental plates.", "Often referred to as the God Pokémon."] },
  { id: 150, name: "Mewtwo", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png", abilities: ["Pressure", "Unnerve"], facts: ["Created through genetic manipulation.", "One of the strongest Psychic-type Pokémon.", "Featured in multiple Pokémon movies."] },
  { id: 384, name: "Rayquaza", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png", abilities: ["Air Lock"], facts: ["Controls the skies.", "Stops battles between Groudon and Kyogre.", "Mega Rayquaza is competitively broken."] },
  { id: 383, name: "Groudon", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/383.png", abilities: ["Drought"], facts: ["Controls the land.", "Primal form boosts its power massively.", "Iconic legendary from Hoenn."] },
  { id: 382, name: "Kyogre", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/382.png", abilities: ["Drizzle"], facts: ["Controls the sea.", "Primal Kyogre dominates rain teams.", "Legendary rival of Groudon."] },
  { id: 445, name: "Garchomp", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png", abilities: ["Sand Veil", "Rough Skin"], facts: ["Pseudo-legendary Dragon/Ground type.", "Extremely high Attack and Speed.", "Fan favorite competitive monster."] },
  { id: 716, name: "Xerneas", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/716.png", abilities: ["Fairy Aura"], facts: ["Life Pokémon.", "Boosts Fairy-type moves.", "Very high Special Attack."] },
  { id: 717, name: "Yveltal", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/717.png", abilities: ["Dark Aura"], facts: ["Destruction Pokémon.", "Absorbs life force when its wings spread.", "Opposite of Xerneas."] },
  { id: 888, name: "Zacian", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/888.png", abilities: ["Intrepid Sword"], facts: ["Crowned Sword form is extremely powerful.", "High base Attack stat.", "Iconic Sword & Shield legendary."] },
  { id: 890, name: "Eternatus", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/890.png", abilities: ["Pressure"], facts: ["Gigantic alien-like Pokémon.", "Has Eternamax form.", "Major threat in Galar region."] },
];

function Strongest() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePageChange = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-8 transition-colors duration-300 overflow-x-hidden selection:bg-indigo-200 relative">
      
      <Link to="/" 
        className="fixed left-6 top-6 z-50 px-5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white shadow-lg hover:scale-105 transition-all font-bold uppercase text-[10px] tracking-widest">
        ← Back
      </Link>

      <div className="max-w-[1400px] mx-auto text-center relative transform scale-90 origin-top">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-[8rem] font-black text-gray-200/40 dark:text-gray-800/20 select-none pointer-events-none uppercase italic">
          Legends
        </div>

        <header className="relative z-10 mb-8 pt-2">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
            Elite <span className="text-indigo-600">Power 10</span>
          </h1>
          <div className="mt-2 flex justify-center items-center gap-3">
            <div className="h-[1px] w-12 bg-indigo-600/30" />
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">
              Top Tier Rankings
            </p>
            <div className="h-[1px] w-12 bg-indigo-600/30" />
          </div>
        </header>

        <div className="max-w-6xl mx-auto h-[550px]">
          <Carousel current={currentIndex} setCurrent={handlePageChange}>
            {STRONGEST_POKEMON_DATA.map((pokemon, index) => (
              <div
                key={pokemon.id}
                className="relative bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border border-white/50 dark:border-gray-800 rounded-[4rem] p-8 md:p-10 shadow-2xl flex flex-col md:flex-row items-center gap-12 text-left mx-4 overflow-hidden h-[500px]"
              >
                <div className="absolute top-8 left-8 w-20 h-20 rounded-full border border-dashed border-indigo-500/30 flex items-center justify-center z-20">
                  <span className="text-2xl font-black text-indigo-600 italic">#{index + 1}</span>
                </div>

                <motion.div 
                  initial={{ x: -100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative group shrink-0 w-full md:w-2/5 flex justify-center"
                >
                  <div className="absolute inset-0 bg-indigo-500/15 blur-[100px] rounded-full scale-90 group-hover:scale-110 transition-transform duration-700" />
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="relative z-10 w-64 h-64 md:w-full md:h-auto max-h-[350px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 right-4 bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-black tracking-widest uppercase shadow-xl z-20">
                    #{String(pokemon.id).padStart(3, '0')}
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ x: 100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  className="flex-1 w-full relative z-10 pr-4"
                >
                  <div className="mb-6">
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                      {pokemon.name}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 flex items-center gap-3">
                        Abilities <div className="h-[1px] flex-1 bg-indigo-500/20" />
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {pokemon.abilities.map(a => (
                          <span key={a} className="px-5 py-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 font-bold text-xs shadow-md">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 flex items-center gap-3">
                        Briefing <div className="h-[1px] flex-1 bg-indigo-500/20" />
                      </h3>
                      <ul className="space-y-3">
                        {pokemon.facts.map((fact) => (
                          <li key={fact} className="flex gap-4 items-start text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium leading-snug italic">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0" />
                            {fact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <div 
                  className="absolute bottom-0 left-0 h-2 bg-indigo-600 transition-all duration-500 shadow-[0_-4px_10px_rgba(79,70,229,0.4)]" 
                  style={{ width: `${((index + 1) / STRONGEST_POKEMON_DATA.length) * 100}%` }} 
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default Strongest;