import { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Standard Pages
import PokemonList from "./pages/PokemonList";
import PokemonDetail from "./pages/PokemonDetail";
import Strongest from "./pages/Strongest";
import Characters from "./pages/Characters";

// Battle Arena Pages
import BattleArenaHome from "./pages/battle-arena/BattleArenaHome";
import OneVsOne from "./pages/battle-arena/OneVsOne";
import Tournament from "./pages/battle-arena/Tournament";
import VsComputer from "./pages/battle-arena/VsComputer";
// import VsComputer from "./pages/battle-arena/VsComputer"; // Uncomment this when you create it!

function AppContent({ isDarkMode, onThemeToggle }: { isDarkMode: boolean, onThemeToggle: () => void }) {
  const location = useLocation();
  
  // Cleanly check if we are ANYWHERE inside the battle arena feature
  const isArenaPage = location.pathname.startsWith("/battle-arena");

  return (
    /* Flex container ensures footer stays at bottom */
    <div className="flex flex-col min-h-screen">
      
      {/* Main Content Area */}
      <main className="flex-grow relative">
        {/* Hide Theme Toggle in the Arena (it uses its own dark mode) */}
        {!isArenaPage && (
          <button
            onClick={onThemeToggle}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-2 rounded-full shadow-lg transition-all duration-300 bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:scale-105 active:scale-95"
          >
            {isDarkMode ? (
              <><span>☀</span><span className="font-medium">Light</span></>
            ) : (
              <><span>🌙</span><span className="font-medium">Dark</span></>
            )}
          </button>
        )}

        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/strongest" element={<Strongest />} />
          <Route path="/characters" element={<Characters />} />
          
          {/* Grouped Battle Arena Routes */}
          <Route path="/battle-arena" element={<BattleArenaHome />} />
          <Route path="/battle-arena/1v1" element={<OneVsOne />} />
          <Route path="/battle-arena/tournament" element={<Tournament />} />
          <Route path="/battle-arena/computer" element={<VsComputer />} />
        </Routes>
      </main>

      {/* Hide the footer on Arena pages so the background covers the whole screen */}
      {!isArenaPage && (
        <footer className="w-full py-8 mt-auto border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
          <div className="max-w-[1440px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-600 dark:text-indigo-400 mb-1">
                Built & Designed by
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                Chandrabhan Singh Chouhan
              </p>
            </div>

            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              © 2026 • Pokedex Database
            </div>

            <div className="flex gap-6 text-[10px] font-black tracking-widest uppercase text-gray-500 dark:text-gray-400">
              <span className="hover:text-indigo-500 cursor-default transition-colors">React</span>
              <span className="hover:text-indigo-500 cursor-default transition-colors">Tailwind</span>
              <span className="hover:text-indigo-500 cursor-default transition-colors">Framer Motion</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleThemeToggle = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  return (
    <BrowserRouter>
      <AppContent isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />
    </BrowserRouter>
  );
}

export default App;