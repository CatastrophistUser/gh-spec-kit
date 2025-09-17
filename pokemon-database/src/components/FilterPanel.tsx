import { usePokemonStore } from '../stores/pokemonStore';

export default function FilterPanel() {
  const { filters, setFilters, clearFilters } = usePokemonStore();

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.types, type]
      : filters.types.filter(t => t !== type);
    setFilters({ types: newTypes });
  };

  const handleBSTChange = (field: 'minBST' | 'maxBST', value: number) => {
    setFilters({ [field]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Type Filters */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Types</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {[
            'normal', 'fire', 'water', 'electric', 'grass', 'ice',
            'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
            'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
          ].map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.types.includes(type)}
                onChange={(e) => handleTypeChange(type, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* BST Range */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Base Stat Total</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Min BST</label>
            <input
              type="number"
              min="0"
              max="1000"
              value={filters.minBST}
              onChange={(e) => handleBSTChange('minBST', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max BST</label>
            <input
              type="number"
              min="0"
              max="1000"
              value={filters.maxBST}
              onChange={(e) => handleBSTChange('maxBST', parseInt(e.target.value) || 1000)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Count */}
      {filters.types.length > 0 || filters.minBST > 0 || filters.maxBST < 1000 ? (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filters.types.length + (filters.minBST > 0 ? 1 : 0) + (filters.maxBST < 1000 ? 1 : 0)} filter(s) active
        </div>
      ) : null}
    </div>
  );
}
