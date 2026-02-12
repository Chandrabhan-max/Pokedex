interface Props {
  search: string;
  setSearch: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  setPage: (val: number) => void;
}

const pokemonTypes = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

function SearchBar({ search, setSearch, type, setType, setPage }: Props) {
  return (
    <div className="backdrop-blur-lg bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 justify-center shadow-xl">

      <input
        type="text"
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
      />

      <select
        value={type}
        onChange={(e) => {
          setPage(1);
          setType(e.target.value);
        }}
        className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
      >
        <option value="">All Types</option>

        {pokemonTypes.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}

      </select>

    </div>
  );
}

export default SearchBar;
