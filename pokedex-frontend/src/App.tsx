import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PokemonList from './pages/PokemonList';
import PokemonDetail from './pages/PokemonDetail';

function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDark(!dark);
  };

  return (
    <div>
      <BrowserRouter>

        <button
          onClick={toggleTheme}
          className="fixed top-6 right-6 z-50 px-5 py-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-600 transition"
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>

        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
