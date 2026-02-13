import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { getPokemon } from '../api/pokemon.api';
import type { Pokemon } from '../types/pokemon';
import PokemonCard from '../components/PokemonCard';
import useDebounce from '../hooks/useDebounce';

const POKEMON_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting",
  "poison", "ground", "flying", "psychic", "bug", "rock",
  "ghost", "dragon", "dark", "steel", "fairy"
];

function PokemonList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const syncUrlParams = useCallback(() => {
    setSearchParams({ page: String(page) });
  }, [page, setSearchParams]);

  const loadPokemonData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await getPokemon({
        page,
        limit: 12,
        search: debouncedSearch,
        type: selectedType,
      });

      setPokemon(data.data);
      setTotalCount(data.total);
    } catch (error) {
      console.error("Failed to load Pokemon list:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, selectedType]);

  useEffect(() => {
    syncUrlParams();
  }, [syncUrlParams]);

  useEffect(() => {
    loadPokemonData();
  }, [loadPokemonData]);

  const totalPages = Math.ceil(totalCount / 12);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearchQuery(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setSelectedType(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-10 transition-colors duration-300 selection:bg-indigo-100 relative">
      <div className="flex justify-between items-center mb-8">
        <h1
          onClick={() => setPage(1)}
          className="cursor-pointer text-3xl font-bold tracking-widest font-['Press_Start_2P'] text-gray-900 dark:text-white"
        >
          POKEDEX
        </h1>
      </div>

      {page === 1 && (
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border border-white/40 dark:border-gray-800 shadow-xl rounded-3xl px-8 py-6">
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search Pokémon..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-sm outline-none ring-0 focus:ring-0 focus:border-indigo-400 transition-all duration-200"
                />
              </div>

              <div className="relative w-full md:w-60">
                <select
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="appearance-none w-full px-5 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-sm outline-none ring-0 focus:ring-0 focus:border-indigo-400 transition-all duration-200"
                >
                  <option value="">All Types</option>
                  {POKEMON_TYPES.map(t => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  ▾
                </div>
              </div>

              <Link
                to="/strongest"
                className="px-6 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                See Strongest Pokémon’s
              </Link>

              {/* <Link
                to="/characters"
                className="px-6 py-3 rounded-2xl bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-300 dark:border-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1"
              >
                See Characters
              </Link> */}
            </div>

            <Link
              to="/compare"
              className="relative px-10 py-4 rounded-3xl font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                ⚔ Fight Mode
              </span>
              <span className="absolute inset-0 bg-white opacity-10 blur-2xl"></span>
            </Link>
          </div>
        </div>
      )}

      <div className="relative flex items-center group">
        <button
          disabled={page === 1}
          onClick={() => setPage(prev => prev - 1)}
          className="absolute -left-6 z-30 p-3 rounded-full bg-white/20 dark:bg-gray-800/40 backdrop-blur-lg border border-white/30 dark:border-gray-700 text-gray-900 dark:text-white disabled:opacity-0 hover:scale-110 transition-all duration-300 shadow-2xl"
          aria-label="Previous Page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 dark:bg-gray-800 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 overflow-visible"
            >
              {pokemon.map(p => (
                <div key={p.id} className="relative group outline-none ring-0 border-none focus:ring-0 focus:outline-none">
                  <PokemonCard pokemon={p} />
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(prev => prev + 1)}
          className="absolute -right-6 z-30 p-3 rounded-full bg-white/20 dark:bg-gray-800/40 backdrop-blur-lg border border-white/30 dark:border-gray-700 text-gray-900 dark:text-white disabled:opacity-0 hover:scale-110 transition-all duration-300 shadow-2xl"
          aria-label="Next Page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center mt-16 gap-8 items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(prev => prev - 1)}
          className="px-6 py-2 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 disabled:opacity-40 transition-all hover:opacity-80 outline-none focus:ring-0"
        >
          Prev
        </button>

        <span className="text-lg font-semibold dark:text-white">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(prev => prev + 1)}
          className="px-6 py-2 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 disabled:opacity-40 transition-all hover:opacity-80 outline-none focus:ring-0"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PokemonList;