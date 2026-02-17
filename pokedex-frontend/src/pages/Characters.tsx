import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Carousel from "../components/Carousel";

import ash from "../assets/characters/ash.png";
import misty from "../assets/characters/misty.png";
import red from "../assets/characters/red.png";
import cynthia from "../assets/characters/cynthia.png";
import gary from "../assets/characters/gary.png"; 
import leon from "../assets/characters/leon.png";
import lance from "../assets/characters/lance.png";
import steven from "../assets/characters/steven.png";
import n_trainer from "../assets/characters/n.png";
import iris from "../assets/characters/iris.png";

interface Character {
  name: string;
  age: string;
  image: string;
  description: string;
  achievements: string[];
}

const characters: Character[] = [
  {
    name: "Red",
    age: "11",
    image: red,
    description: "The legendary silent protagonist of Kanto. Known as the strongest trainer in history, he awaits challengers at the peak of Mt. Silver.",
    achievements: ["Indigo Plateau Champion", "Defeated Team Rocket", "Battle Tree Legend"],
  },
  {
    name: "Cynthia",
    age: "26",
    image: cynthia,
    description: "The formidable Sinnoh Champion and archeologist. Her strategic perfection makes her the most feared opponent in the regional circuits.",
    achievements: ["Sinnoh League Champion", "Master Class Strategist", "Renowned Mythologist"],
  },
  {
    name: "Ash Ketchum",
    age: "10",
    image: ash,
    description: "The World Coronation Series Monarch. His unorthodox battling style and unbreakable bond with Pikachu have conquered every region.",
    achievements: ["World Monarch", "Alola League Champion", "Orange Islands Winner"],
  },
  {
    name: "Leon",
    age: "25",
    image: leon,
    description: "The 'Unbeatable' Galar Champion. Until his loss to Ash, he maintained a legendary undefeated streak in professional matches.",
    achievements: ["Undefeated Galar Leader", "Battle Tower Chairman", "Gigantamax Expert"],
  },
  {
    name: "Steven Stone",
    age: "25",
    image: steven,
    description: "The Hoenn Champion specializing in Steel-types. An intellectual master of Mega Evolution who searches the world for rare stones.",
    achievements: ["Hoenn League Champion", "Mega Evolution Master", "Rare Stone Expert"],
  },
  {
    name: "Lance",
    age: "28",
    image: lance,
    description: "The Dragon-type master and Champion of the Johto/Kanto regions. He leads the Elite Four with an iron-clad offensive strategy.",
    achievements: ["Indigo Grand Champion", "Dragon Clan Leader", "G-Men Special Agent"],
  },
  {
    name: "N",
    age: "20",
    image: n_trainer,
    description: "The enigmatic former King of Team Plasma. He possesses the unique ability to hear the voices of Pokémon and lead Legendary dragons.",
    achievements: ["Hero of Ideals/Truth", "Dragon Whisperer", "Former Plasma King"],
  },
  {
    name: "Blue (Gary Oak)",
    age: "11",
    image: gary,
    description: "Red's original rival and a tactical genius. After his time as Champion, he dedicated himself to research and Viridian City's Gym.",
    achievements: ["Former Kanto Champion", "Viridian Gym Leader", "Master Researcher"],
  },
  {
    name: "Iris",
    age: "14",
    image: iris,
    description: "A Dragon-type prodigy who ascended from Gym Leader to Unova League Champion through raw talent and spirit.",
    achievements: ["Unova League Champion", "Dragon Master Pro", "Opelucid Gym Successor"],
  },
  {
    name: "Misty",
    age: "12",
    image: misty,
    description: "The iconic Water-type specialist from Cerulean City. A veteran trainer known for her fierce competitive drive and mastery of the seas.",
    achievements: ["Cerulean City Leader", "Whirl Cup Finalist", "Master of Water Types"],
  }
];

function Characters() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-8 transition-colors duration-300 overflow-x-hidden selection:bg-indigo-200">
      
      <Link
        to="/"
        className="fixed left-6 top-6 z-50 px-5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white shadow-lg hover:scale-105 transition-all font-bold uppercase text-[10px] tracking-widest"
      >
        ← Back
      </Link>

      <div className="max-w-6xl mx-auto text-center relative transform scale-90 origin-top">
        <header className="relative z-10 mb-8 pt-2">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
            Iconic <span className="text-indigo-600">Trainers</span>
          </h1>
          <div className="mt-2 flex justify-center items-center gap-3">
            <div className="h-[1px] w-8 bg-indigo-600/30" />
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">
              Master Ranking
            </p>
            <div className="h-[1px] w-8 bg-indigo-600/30" />
          </div>
        </header>

        <div className="max-w-5xl mx-auto h-[600px]">
          <Carousel current={current} setCurrent={setCurrent}>
            {characters.map((char, index) => {
              const isNOrGary = char.name === "N" || char.name === "Blue (Gary Oak)";
              const isMisty = char.name === "Misty";

              return (
                <div
                  key={char.name}
                  className="relative bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border border-white/50 dark:border-gray-800 rounded-[3rem] p-6 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-10 text-left mx-4 overflow-hidden h-[550px]"
                >
                  <div className="absolute top-6 left-6 w-16 h-16 rounded-full border border-dashed border-indigo-500/30 flex items-center justify-center z-20">
                    <span className="text-xl font-black text-indigo-600 italic">#{index + 1}</span>
                  </div>

                  <motion.div 
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`relative group shrink-0 flex justify-center items-center ${isNOrGary ? 'md:w-[42%]' : 'md:w-1/3'}`}
                  >
                    <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full scale-110" />
                    
                    <img
                      src={char.image}
                      alt={char.name}
                      style={{ 
                        imageRendering: isMisty ? 'pixelated' : 'smooth',
                        filter: isMisty 
                          ? 'contrast(1.2) brightness(1.05) drop-shadow(0 0 1px rgba(0,0,0,0.5))' 
                          : 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' 
                      }}
                      className={`relative z-10 object-contain transition-all duration-700 
                        ${isNOrGary ? 'w-[130%] scale-125 md:min-w-[450px]' : 'w-full h-auto max-h-[400px]'}
                        ${isMisty ? 'scale-105' : ''}
                        group-hover:scale-110`}
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className="flex-1 w-full relative z-10"
                  >
                    <div className="mb-6">
                      <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                        {char.name}
                      </h2>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-1 block">
                        Age: {char.age}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                          Profile <div className="h-[1px] flex-1 bg-indigo-500/20" />
                        </h3>
                        <p className="text-[14px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed italic line-clamp-4">
                          "{char.description}"
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                          Achievements <div className="h-[1px] flex-1 bg-indigo-500/20" />
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {char.achievements.map(a => (
                            <span key={a} className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-bold text-[10px] shadow-sm whitespace-nowrap">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div 
                    className="absolute bottom-0 left-0 h-1.5 bg-indigo-600 transition-all duration-500" 
                    style={{ width: `${((index + 1) / characters.length) * 100}%` }} 
                  />
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default Characters;