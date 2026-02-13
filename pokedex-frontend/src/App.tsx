import { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PokemonList from "./pages/PokemonList";
import PokemonDetail from "./pages/PokemonDetail";
import Strongest from "./pages/Strongest";
// import Characters from "./pages/Characters";
import Compare from "./pages/Compare";

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
      <button
        onClick={handleThemeToggle}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-2 rounded-full shadow-lg transition-all duration-300 bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:scale-105 active:scale-95"
      >
        {isDarkMode ? (
          <>
            <span>☀</span>
            <span className="font-medium">Light</span>
          </>
        ) : (
          <>
            <span>🌙</span>
            <span className="font-medium">Dark</span>
          </>
        )}
      </button>

      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
        <Route path="/strongest" element={<Strongest />} />
        {/* <Route path="/characters" element={<Characters />} /> */}
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;