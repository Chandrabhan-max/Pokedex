// import { useState } from "react";
// import { Link } from "react-router-dom";
// import Carousel from "../components/Carousel";

// import ash from "../assets/characters/ash.png";
// import misty from "../assets/characters/misty.png";
// import brock from "../assets/characters/brock.png";
// import jessie from "../assets/characters/jessie.png";
// import james from "../assets/characters/james.png";
// import nurseJoy from "../assets/characters/nurse-joy.png";
// import officerJenny from "../assets/characters/officer-jenny.png";
// import dawn from "../assets/characters/dawn.png";
// import gary from "../assets/characters/gary.png";
// import meowth from "../assets/characters/meowth.png";
// import professorOak from "../assets/characters/professor-oak.png";

// interface Character {
//   name: string;
//   age: string;
//   image: string;
//   description: string;
//   achievements: string[];
// }

// const characters: Character[] = [
//   {
//     name: "Ash Ketchum",
//     age: "10",
//     image: ash,
//     description: "Main protagonist of the Pokémon anime and World Champion.",
//     achievements: [
//       "World Coronation Series Winner",
//       "Alola League Champion",
//       "Traveled across all regions"
//     ],
//   },
//   {
//     name: "Misty",
//     age: "12",
//     image: misty,
//     description: "Cerulean City Gym Leader and Water-type specialist.",
//     achievements: [
//       "Water-type Expert",
//       "Original Travel Companion"
//     ],
//   },
//   {
//     name: "Brock",
//     age: "15",
//     image: brock,
//     description: "Pewter City Gym Leader and Pokémon Breeder.",
//     achievements: [
//       "Rock-type Specialist",
//       "Strategic Team Member"
//     ],
//   },
//   {
//     name: "Jessie",
//     age: "25",
//     image: jessie,
//     description: "Team Rocket member known for dramatic entrances.",
//     achievements: [
//       "Persistent Antagonist",
//       "Master of Disguises"
//     ],
//   },
//   {
//     name: "James",
//     age: "25",
//     image: james,
//     description: "Team Rocket member with creative schemes.",
//     achievements: [
//       "Comedic Villain",
//       "Loyal Partner to Jessie"
//     ],
//   },
//   {
//     name: "Meowth",
//     age: "Unknown",
//     image: meowth,
//     description: "Talking Pokémon member of Team Rocket.",
//     achievements: [
//       "Only human-speaking Meowth",
//       "Team Rocket Strategist"
//     ],
//   },
//   {
//     name: "Nurse Joy",
//     age: "16 to 25+",
//     image: nurseJoy,
//     description: "Kind and caring Pokémon nurse found in every region.",
//     achievements: [
//       "Heals countless trainers",
//       "Iconic Pokémon Center figure"
//     ],
//   },
//   {
//     name: "Officer Jenny",
//     age: "20 to 30",
//     image: officerJenny,
//     description: "Police officer maintaining peace in the Pokémon world.",
//     achievements: [
//       "Protects Trainers",
//       "Law Enforcement Authority"
//     ],
//   },
//   {
//     name: "Dawn",
//     age: "10",
//     image: dawn,
//     description: "Sinnoh Coordinator and Pokémon Contest enthusiast.",
//     achievements: [
//       "Grand Festival Finalist",
//       "Strong Contest Performer"
//     ],
//   },
//   {
//     name: "Gary Oak",
//     age: "10",
//     image: gary,
//     description: "Ash's rival turned Pokémon researcher.",
//     achievements: [
//       "Research Prodigy",
//       "Multiple Gym Challenges"
//     ],
//   },
//   {
//     name: "Professor Oak",
//     age: "50",
//     image: professorOak,
//     description: "Renowned Pokémon researcher and mentor.",
//     achievements: [
//       "Pokémon Evolution Researcher",
//       "Mentor to Trainers"
//     ],
//   },
// ];

// function Characters() {
//   const [current, setCurrent] = useState(0);

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-12 text-center">

//       <Link
//         to="/"
//         className="
//           absolute left-8 top-8
//           px-6 py-2
//           rounded-xl
//           bg-black text-white
//           dark:bg-white dark:text-black
//           shadow-lg
//           hover:scale-105
//           transition-all duration-300
//         "
//       >
//         ← Back
//       </Link>

//       <h1 className="text-5xl font-bold mb-16 dark:text-white">
//         Iconic Pokémon Characters
//       </h1>

//       <Carousel current={current} setCurrent={setCurrent}>
//         {characters.map((char) => (
//           <div
//             key={char.name}
//             className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl"
//           >
//             <img
//               src={char.image}
//               alt={char.name}
//               className="w-72 h-72 mx-auto object-contain"
//             />

//             <h2 className="text-4xl font-bold mt-6 dark:text-white">
//               {char.name}
//             </h2>

//             <p className="mt-2 dark:text-gray-300">
//               Age: {char.age}
//             </p>

//             <div className="mt-8 text-left max-w-xl mx-auto">

//               <p className="mb-6 dark:text-gray-300">
//                 {char.description}
//               </p>

//               <h3 className="font-semibold mb-2 dark:text-white">
//                 Achievements
//               </h3>

//               <ul className="list-disc list-inside dark:text-gray-300">
//                 {char.achievements.map(a => (
//                   <li key={a} className="mb-2">{a}</li>
//                 ))}
//               </ul>

//             </div>
//           </div>
//         ))}
//       </Carousel>

//     </div>
//   );
// }

// export default Characters;
