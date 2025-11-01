import React from 'react';

function Sidebar({ 
  searchTerm, onSearchChange, 
  onCategoryChange, 
  minPrice, onMinPriceChange, 
  maxPrice, onMaxPriceChange 
}) {
  const categories = [
    { id: 'dairy', label: 'Dairy Cattle' },
    { id: 'poultry', label: 'Poultry' },
    { id: 'goats', label: 'Goats' },
    { id: 'sheep', label: 'Sheep' },
    { id: 'supplements', label: 'Supplements' },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white p-6 rounded-lg shadow-md md:sticky top-24 h-fit">
      <h3 className="text-xl font-bold text-gray-800 mb-5">Filters</h3>
      
      {/* Search Filter */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="search">
          Search Products
        </label>
        <input
          type="text"
          id="search"
          placeholder="Search cattle feed..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="block text-gray-700 font-medium mb-3">Feed Type</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center text-gray-600">
              <input
                type="checkbox"
                value={category.id}
                onChange={onCategoryChange}
                className="h-4 w-4 text-brand-green rounded border-gray-300 focus:ring-brand-green"
              />
              <span className="ml-3">{category.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Price Filter */}
      <div>
        <h4 className="block text-gray-700 font-medium mb-3">Price Range (₹)</h4>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="Min"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
            value={minPrice}
            onChange={onMinPriceChange}
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
            value={maxPrice}
            onChange={onMaxPriceChange}
          />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;