const quickPrices = [
  { label: 'Under 500', max: 500 },
  { label: 'Under 1K', max: 1000 },
  { label: 'Under 5K', max: 5000 },
  { label: 'Under 10K', max: 10000 },
]

function CheckboxList({ items, selected, onToggle }) {
  return (
    // Fixed max height + overflow-y-auto: long lists (54 brands) scroll inside the card.
    <div className="mt-3 max-h-48 overflow-y-auto pe-1">
      <ul className="flex flex-col gap-2.5">
      {items.map(function (item) {
        return (
          <li key={item._id}>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700 hover:text-green-700">
              <input
                type="checkbox"
                checked={selected.includes(item._id)}
                onChange={function () {
                  onToggle(item._id)
                }}
                className="h-4 w-4 accent-green-600"
              />
              {item.name}
            </label>
          </li>
        )
      })}
      </ul>
    </div>
  )
}

export default function FiltersPanel({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  onToggleCategory,
  onToggleBrand,
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  onQuickPrice,
  hasActiveFilters,
  onClearAll,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {hasActiveFilters && (
        <div className="mb-3 flex justify-end">
          <button type="button" onClick={onClearAll} className="text-xs font-medium text-red-500 hover:underline">
            <i className="fa-solid fa-xmark me-1"></i>
            Clear all
          </button>
        </div>
      )}

      <h3 className="font-bold text-gray-900">Categories</h3>
      <CheckboxList items={categories} selected={selectedCategories} onToggle={onToggleCategory} />

      <hr className="my-5 border-gray-100" />

      <h3 className="font-bold text-gray-900">Price Range</h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="text-xs text-gray-500">
          Min (EGP)
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={minPrice}
            onChange={onMinChange}
            placeholder="0"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-green-600 focus:outline-none"
          />
        </label>
        <label className="text-xs text-gray-500">
          Max (EGP)
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={maxPrice}
            onChange={onMaxChange}
            placeholder="No limit"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-green-600 focus:outline-none"
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {quickPrices.map(function (chip) {
          const isActive = minPrice === '' && maxPrice === String(chip.max)
          return (
            <button
              key={chip.label}
              type="button"
              onClick={function () {
                onQuickPrice(chip.max)
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                isActive ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              {chip.label}
            </button>
          )
        })}
      </div>

      <hr className="my-5 border-gray-100" />

      <h3 className="font-bold text-gray-900">Brands</h3>
      <CheckboxList items={brands} selected={selectedBrands} onToggle={onToggleBrand} />
    </div>
  )
}
