import { useEffect, useState, useCallback, useMemo } from 'react';
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

  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const syncUrlParams = useCallback(() => {
    setSearchParams({ page: String(page) });
  }, [page, setSearchParams]);

  const loadPokemonData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await getPokemon({
        page: 1,
        limit: 1025, 
      });

      setAllPokemon(data.data);
    } catch (error) {
      console.error("Failed to load Pokemon list:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPokemonData();
  }, [loadPokemonData]);

  useEffect(() => {
    syncUrlParams();
  }, [syncUrlParams]);

  const filteredPokemon = useMemo(() => {
    return allPokemon.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                            p.id.toString() === debouncedSearch;
      
      const matchesTypes = selectedTypes.length === 0 || 
                           selectedTypes.every(type => p.types.includes(type));

      return matchesSearch && matchesTypes;
    });
  }, [allPokemon, debouncedSearch, selectedTypes]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const searchMatches = allPokemon.filter(p => 
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      p.id.toString() === debouncedSearch
    );
    
    POKEMON_TYPES.forEach(type => {
      counts[type] = searchMatches.filter(p => p.types.includes(type)).length;
    });
    return counts;
  }, [allPokemon, debouncedSearch]);

  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(filteredPokemon.length / itemsPerPage));
  const currentPokemon = filteredPokemon.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearchQuery(e.target.value);
  };

  const toggleType = (type: string) => {
    setPage(1);
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 md:p-10 transition-colors duration-300 selection:bg-indigo-100 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
        <svg width="600" height="600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.34.02-.67.06-1h5.07c.43 1.72 2 3 3.87 3s3.44-1.28 3.87-3h5.07c.04.33.06.66.06 1 0 4.41-3.59 8-8 8zm0-10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
        </svg>
      </div>

      <div className="w-full mb-10 relative z-10"> 
        <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-8 md:gap-12">
          <header>
            <h1
              onClick={() => {
                setPage(1);
                setSelectedTypes([]);
                setSearchQuery('');
              }}
              className="cursor-pointer text-2xl md:text-3xl font-bold tracking-[0.2em] font-['Press_Start_2P'] text-gray-900 dark:text-white transition-opacity hover:opacity-80 uppercase"
            >
              POKEDEX
            </h1>
          </header>

          <div className="flex flex-wrap gap-4 items-center">
            <Link
              to="/strongest"
              className="px-6 py-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all"
            >
              Elite Pokemon's
            </Link>
            <Link
              to="/characters"
              className="px-6 py-3 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all"
            >
              Iconic Trainers
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full mb-12 space-y-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-6 py-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white shadow-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
            />
            {isLoading && (
              <div className="absolute right-5 top-1/2 -translate-y-1/2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-6 h-6 border-4 border-gray-200 border-t-red-500 rounded-full"
                />
              </div>
            )}
          </div>

          <Link
            to="/battle-arena"
            className="w-full lg:w-auto px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-white bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 shadow-xl shadow-red-500/20 hover:scale-105 transition-all text-center whitespace-nowrap"
          >
            ⚔ Combat Arena
          </Link>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
          
          <button
            onClick={() => { setPage(1); setSelectedTypes([]); }}
            className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all shrink-0 border-2 ${
              selectedTypes.length === 0 
              ? 'bg-indigo-600 border-indigo-600 text-white' 
              : 'bg-white dark:bg-gray-800 border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 shadow-sm'
            }`}
          >
            All Species ({filteredPokemon.length})
          </button>
          {POKEMON_TYPES.map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm transition-all shrink-0 border-2 capitalize ${
                selectedTypes.includes(type) 
                ? 'bg-indigo-600 border-indigo-600 text-white' 
                : 'bg-white dark:bg-gray-800 border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 shadow-sm'
              }`}
            >
              {type}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-lg ${selectedTypes.includes(type) ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                {typeCounts[type] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex items-center w-full px-4 z-10">
        <button
          disabled={page === 1}
          onClick={() => setPage(prev => prev - 1)}
          className="absolute -left-2 z-30 p-3 rounded-full bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg border border-white/30 dark:border-gray-700 text-gray-900 dark:text-white disabled:opacity-0 hover:scale-110 transition-all duration-300 shadow-2xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-1 min-h-[400px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-6">
              <motion.div
                animate={{ rotate: 360, y: [0, -20, 0] }}
                transition={{ 
                  rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                  y: { repeat: Infinity, duration: 0.5, ease: "easeInOut" }
                }}
                className="w-20 h-20 border-8 border-gray-900 dark:border-white border-t-red-600 rounded-full relative shadow-2xl"
              >
                <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-900 dark:bg-white -translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gray-900 dark:bg-white rounded-full border-4 border-white dark:border-gray-950" />
              </motion.div>
              <p className="font-bold text-indigo-600 dark:text-indigo-400 animate-pulse tracking-widest uppercase text-xs">Syncing Pokedex...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 overflow-visible w-full"
            >
              {currentPokemon.length > 0 ? (
                currentPokemon.map(p => (
                  <div key={p.id} className="relative group outline-none ring-0">
                    <PokemonCard pokemon={p} />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-6 text-gray-500 dark:text-gray-400">
                     <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                        <path d="M22 12h-5c0 2.76-2.24 5-5 5s-5-2.24-5-5H2"/>
                        <circle cx="12" cy="12" r="3"/>
                     </svg>
                  </motion.div>
                  <p className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">No Pokemon Identified</p>
                  <p className="text-sm font-bold mt-2 text-gray-500 dark:text-gray-400">Adjust your search or filters to scan again</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(prev => prev + 1)}
          className="absolute -right-2 z-30 p-3 rounded-full bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg border border-white/30 dark:border-gray-700 text-gray-900 dark:text-white disabled:opacity-0 hover:scale-110 transition-all duration-300 shadow-2xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center mt-16 gap-8 items-center relative z-10">
        <button
          disabled={page === 1}
          onClick={() => setPage(prev => prev - 1)}
          className="px-6 py-2 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 disabled:opacity-40 transition-all hover:opacity-80 shadow-md active:scale-95"
        >
          Prev
        </button>

        <span className="text-lg font-semibold dark:text-white">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(prev => prev + 1)}
          className="px-6 py-2 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 disabled:opacity-40 transition-all hover:opacity-80 shadow-md active:scale-95"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PokemonList;