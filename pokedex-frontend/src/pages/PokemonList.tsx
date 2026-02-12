import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPokemon } from '../api/pokemon.api';
import type { Pokemon } from '../types/pokemon';
import PokemonCard from '../components/PokemonCard';
import useDebounce from '../hooks/useDebounce';

function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    fetchPokemon();
  }, [page, debouncedSearch, type]);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const res = await getPokemon({
        page,
        limit: 12,
        search: debouncedSearch,
        type,
      });

      setPokemon(res.data.data);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-10 transition-colors duration-300">

      <h1 className="text-5xl font-extrabold text-center mb-14 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
        Pokédex
      </h1>

      {/* SEARCH + FILTER CARD */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-14 border border-gray-200 dark:border-gray-700">

        <div className="flex flex-col md:flex-row gap-6 items-center">

          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Search Pokémon by name..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div className="w-full md:w-60">
            <select
              value={type}
              onChange={(e) => {
                setPage(1);
                setType(e.target.value);
              }}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
            >
              <option value="">All Types</option>
              {[
                "normal","fire","water","electric","grass","ice","fighting",
                "poison","ground","flying","psychic","bug","rock",
                "ghost","dragon","dark","steel","fairy"
              ].map(t => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8"
        >
          {pokemon.map(p => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </motion.div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center mt-16 gap-8 items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-6 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-lg font-semibold dark:text-white">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-6 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default PokemonList;
