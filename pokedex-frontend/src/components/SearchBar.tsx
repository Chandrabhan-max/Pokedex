interface SearchBarProps {
  search: string;
  setSearch: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  setPage: (val: number) => void;
}

const POKEMON_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting",
  "poison", "ground", "flying", "psychic", "bug", "rock",
  "ghost", "dragon", "dark", "steel", "fairy",
];

function SearchBar({ search, setSearch, type, setType, setPage }: SearchBarProps) {
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearch(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setType(e.target.value);
  };

  return (
    <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-900/40 border border-white/20 dark:border-gray-800 rounded-3xl p-6 flex flex-col sm:flex-row gap-4 justify-center shadow-2xl transition-all duration-300">
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={handleSearchChange}
          className="w-full px-5 py-3 rounded-2xl border-none focus:ring-4 focus:ring-indigo-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-inner outline-none transition-all placeholder:text-gray-400"
        />
      </div>

      <div className="relative">
        <select
          value={type}
          onChange={handleTypeChange}
          className="appearance-none w-full sm:w-48 px-5 py-3 rounded-2xl border-none focus:ring-4 focus:ring-indigo-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-inner outline-none cursor-pointer font-medium capitalize"
        >
          <option value="">All Elements</option>
          {POKEMON_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          ▾
        </div>
      </div>
    </div>
  );
}
export default SearchBar;