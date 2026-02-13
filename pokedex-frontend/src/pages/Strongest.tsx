import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";

export interface StrongestPokemon {
  id: number;
  name: string;
  image: string;
  facts: string[];
  abilities: string[];
}

const STRONGEST_POKEMON_DATA: StrongestPokemon[] = [
  {
    id: 493,
    name: "Arceus",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/493.png",
    abilities: ["Multitype"],
    facts: [
      "Creator of the Pokémon universe in lore.",
      "Can change type using elemental plates.",
      "Often referred to as the God Pokémon."
    ],
  },
  {
    id: 150,
    name: "Mewtwo",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
    abilities: ["Pressure", "Unnerve"],
    facts: [
      "Created through genetic manipulation.",
      "One of the strongest Psychic-type Pokémon.",
      "Featured in multiple Pokémon movies."
    ],
  },
  {
    id: 384,
    name: "Rayquaza",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png",
    abilities: ["Air Lock"],
    facts: [
      "Controls the skies.",
      "Stops battles between Groudon and Kyogre.",
      "Mega Rayquaza is competitively broken."
    ],
  },
  {
    id: 383,
    name: "Groudon",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/383.png",
    abilities: ["Drought"],
    facts: [
      "Controls the land.",
      "Primal form boosts its power massively.",
      "Iconic legendary from Hoenn."
    ],
  },
  {
    id: 382,
    name: "Kyogre",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/382.png",
    abilities: ["Drizzle"],
    facts: [
      "Controls the sea.",
      "Primal Kyogre dominates rain teams.",
      "Legendary rival of Groudon."
    ],
  },
  {
    id: 445,
    name: "Garchomp",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png",
    abilities: ["Sand Veil", "Rough Skin"],
    facts: [
      "Pseudo-legendary Dragon/Ground type.",
      "Extremely high Attack and Speed.",
      "Fan favorite competitive monster."
    ],
  },
  {
    id: 716,
    name: "Xerneas",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/716.png",
    abilities: ["Fairy Aura"],
    facts: [
      "Life Pokémon.",
      "Boosts Fairy-type moves.",
      "Very high Special Attack."
    ],
  },
  {
    id: 717,
    name: "Yveltal",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/717.png",
    abilities: ["Dark Aura"],
    facts: [
      "Destruction Pokémon.",
      "Absorbs life force when its wings spread.",
      "Opposite of Xerneas."
    ],
  },
  {
    id: 888,
    name: "Zacian",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/888.png",
    abilities: ["Intrepid Sword"],
    facts: [
      "Crowned Sword form is extremely powerful.",
      "High base Attack stat.",
      "Iconic Sword & Shield legendary."
    ],
  },
  {
    id: 890,
    name: "Eternatus",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/890.png",
    abilities: ["Pressure"],
    facts: [
      "Gigantic alien-like Pokémon.",
      "Has Eternamax form.",
      "Major threat in Galar region."
    ],
  },
];

function Strongest() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePageChange = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-12 text-center transition-colors duration-300">
      <Link
        to="/"
        className="fixed left-8 top-8 px-6 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 z-50"
      >
        ← Back
      </Link>

      <h1 className="text-5xl font-bold mb-16 dark:text-white tracking-tight">
        Top 10 Strongest Pokémon
      </h1>

      <Carousel current={currentIndex} setCurrent={handlePageChange}>
        {STRONGEST_POKEMON_DATA.map((pokemon, index) => {
          const { id, name, image, abilities, facts } = pokemon;

          return (
            <div
              key={id}
              className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl transition-all duration-300"
            >
              <div className="text-lg font-semibold mb-4 text-gray-500 dark:text-gray-400">
                Rank #{index + 1}
              </div>

              <div className="relative group">
                <img
                  src={image}
                  alt={name}
                  className="w-72 h-72 mx-auto object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h2 className="text-4xl font-bold mt-6 dark:text-white capitalize tracking-wide">
                {name}
              </h2>

              <div className="mt-8 text-left max-w-xl mx-auto space-y-8">
                <section>
                  <h3 className="font-bold text-xl mb-3 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-1">
                    Unique Abilities
                  </h3>
                  <ul className="grid grid-cols-2 gap-2 dark:text-gray-300">
                    {abilities.map((ability) => (
                      <li key={ability} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="font-medium">{ability}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-xl mb-3 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-1">
                    Legendary Facts
                  </h3>
                  <ul className="space-y-3 dark:text-gray-300">
                    {facts.map((fact) => (
                      <li key={fact} className="leading-relaxed italic opacity-90">
                        "{fact}"
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}

export default Strongest;