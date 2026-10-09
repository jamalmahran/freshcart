import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchAll } from '../api/catalog'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import FiltersPanel from '../components/search/FiltersPanel'

const PAGE_SIZE = 12

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'sold', label: 'Best Selling' },
  { value: 'name', label: 'Name A-Z' },
]

function finalPrice(product) {
  return product.priceAfterDiscount || product.price
}

const comparators = {
  'price-asc': function (a, b) {
    return finalPrice(a) - finalPrice(b)
  },
  'price-desc': function (a, b) {
    return finalPrice(b) - finalPrice(a)
  },
  rating: function (a, b) {
    return b.ratingsAverage - a.ratingsAverage
  },
  sold: function (a, b) {
    return b.sold - a.sold
  },
  name: function (a, b) {
    return a.title.localeCompare(b.title)
  },
}

// Adds the id if it's missing, removes it if it's there.
function toggleId(list, id) {
  return list.includes(id)
    ? list.filter(function (item) {
        return item !== id
      })
    : [...list, id]
}

export default function Search() {
  // The search text lives in the URL (?q=...), so the navbar can send us there
  // and a refresh keeps the search.
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('relevance')
  const [view, setView] = useState('grid')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // The API's ?keyword= search always returns 0 results, so we load every product
  // once (there are only ~56) and search, filter, sort and paginate in our own code.
  useEffect(function () {
    let ignore = false

    async function loadAll() {
      try {
        const [products, categoryList, brandList] = await Promise.all([
          fetchAll('products'),
          fetchAll('categories'),
          fetchAll('brands'),
        ])
        if (ignore) return
        setAllProducts(products)
        setCategories(categoryList)
        setBrands(brandList)
      } catch (error) {
        console.error('Failed to load search data:', error)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadAll()
    return function () {
      ignore = true
    }
  }, [])

  // The page number remembers which filters it belongs to. When the search, a filter
  // or the sort changes, the key changes and we're automatically back on page 1.
  const filterKey = JSON.stringify([query, selectedCategories, selectedBrands, minPrice, maxPrice, sort])
  const [pageInfo, setPageInfo] = useState({ key: '', page: 1 })
  const page = pageInfo.key === filterKey ? pageInfo.page : 1

  function handlePageChange(newPage) {
    setPageInfo({ key: filterKey, page: newPage })
  }

  function handleQueryChange(event) {
    const value = event.target.value
    // replace: no history entry per keystroke.
    setSearchParams(value ? { q: value } : {}, { replace: true })
  }

  function handleSearchSubmit(event) {
    event.preventDefault()
  }

  function handleToggleCategory(id) {
    setSelectedCategories(toggleId(selectedCategories, id))
  }

  function handleToggleBrand(id) {
    setSelectedBrands(toggleId(selectedBrands, id))
  }

  function handleMinChange(event) {
    setMinPrice(event.target.value)
  }

  function handleMaxChange(event) {
    setMaxPrice(event.target.value)
  }

  function handleQuickPrice(max) {
    setMinPrice('')
    setMaxPrice(String(max))
  }

  function handleSortChange(event) {
    setSort(event.target.value)
  }

  function clearFilters() {
    setSelectedCategories([])
    setSelectedBrands([])
    setMinPrice('')
    setMaxPrice('')
  }

  function clearEverything() {
    clearFilters()
    setSearchParams({}, { replace: true })
  }

  function openDrawer() {
    setIsFiltersOpen(true)
  }

  function closeDrawer() {
    setIsFiltersOpen(false)
  }

  // ---------- filter → sort → paginate (all in our code) ----------
  const searchText = query.trim().toLowerCase()
  const min = minPrice === '' ? null : Number(minPrice)
  const max = maxPrice === '' ? null : Number(maxPrice)

  const filtered = allProducts.filter(function (product) {
    if (searchText && !product.title.toLowerCase().includes(searchText)) return false
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category?._id)) return false
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand?._id)) return false
    const price = finalPrice(product)
    if (min !== null && price < min) return false
    if (max !== null && price > max) return false
    return true
  })

  // Sort a copy: .sort() mutates, and "Relevance" needs the original order.
  const sorted = sort === 'relevance' ? filtered : [...filtered].sort(comparators[sort])

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const visible = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeFilterCount =
    selectedCategories.length + selectedBrands.length + (minPrice !== '' || maxPrice !== '' ? 1 : 0)

  const filtersPanel = (
    <FiltersPanel
      categories={categories}
      brands={brands}
      selectedCategories={selectedCategories}
      selectedBrands={selectedBrands}
      onToggleCategory={handleToggleCategory}
      onToggleBrand={handleToggleBrand}
      minPrice={minPrice}
      maxPrice={maxPrice}
      onMinChange={handleMinChange}
      onMaxChange={handleMaxChange}
      onQuickPrice={handleQuickPrice}
      hasActiveFilters={activeFilterCount > 0}
      onClearAll={clearFilters}
    />
  )

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ---------- Top bar ---------- */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 py-5 md:py-6">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
            <Link to="/" className="hover:text-green-600">
              Home
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-900">Search Results</span>
          </nav>
          <form onSubmit={handleSearchSubmit} role="search" className="relative mt-4 max-w-3xl">
            <i className="fa-solid fa-magnifying-glass absolute start-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="search"
              value={query}
              onChange={handleQueryChange}
              aria-label="Search for products"
              placeholder="Search for products..."
              className="w-full rounded-xl border border-gray-200 py-3 md:py-3.5 ps-11 pe-4 focus:border-green-600 focus:outline-none"
            />
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* lg+: 4-column grid → sidebar takes 1 column (1/4), results take 3.
            Below lg the sidebar is hidden and only shown in the drawer. */}
        <div className="lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
          {/* ---------- Sidebar (desktop only) ---------- */}
          {/* A normal static column: hidden below lg, its own grid column from lg up. */}
          <aside className="hidden lg:block lg:col-span-1">{filtersPanel}</aside>

          {/* ---------- Results ---------- */}
          <div className="min-w-0 lg:col-span-3">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openDrawer}
                  className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-green-600"
                >
                  <i className="fa-solid fa-sliders"></i>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="h-5 min-w-5 rounded-full bg-green-600 px-1.5 text-xs text-white flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <div className="flex rounded-lg border border-gray-200 bg-white p-1">
                  <button
                    type="button"
                    onClick={function () {
                      setView('grid')
                    }}
                    aria-label="Grid view"
                    aria-pressed={view === 'grid'}
                    className={`h-8 w-8 rounded-md ${view === 'grid' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-green-600'}`}
                  >
                    <i className="fa-solid fa-grip"></i>
                  </button>
                  <button
                    type="button"
                    onClick={function () {
                      setView('list')
                    }}
                    aria-label="List view"
                    aria-pressed={view === 'list'}
                    className={`h-8 w-8 rounded-md ${view === 'list' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-green-600'}`}
                  >
                    <i className="fa-solid fa-list"></i>
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-500">
                Sort by:
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-600 focus:outline-none"
                >
                  {sortOptions.map(function (option) {
                    return (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    )
                  })}
                </select>
              </label>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
              </div>
            ) : sorted.length === 0 ? (
              <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
                <i className="fa-solid fa-magnifying-glass text-5xl text-gray-300"></i>
                <h2 className="mt-4 text-xl font-bold text-gray-800">No products match your filters</h2>
                <p className="mt-1 text-gray-500">Try a different search or remove some filters.</p>
                <button
                  type="button"
                  onClick={clearEverything}
                  className="mt-6 rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-gray-500">
                  {searchText ? (
                    <>
                      <span className="font-semibold text-gray-900">{sorted.length}</span> results for "
                      <span className="font-semibold text-gray-900">{query.trim()}</span>"
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-gray-900">{sorted.length}</span> products
                    </>
                  )}
                </p>

                <div
                  className={
                    view === 'grid' ? 'grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4' : 'flex flex-col gap-4'
                  }
                >
                  {visible.map(function (product) {
                    return <ProductCard key={product._id} product={product} layout={view} />
                  })}
                </div>

                <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Filters drawer (mobile / tablet) ----------
          Only in the page while open, and lg:hidden so it can never show on desktop. */}
      {isFiltersOpen && (
        <div className="lg:hidden">
          {/* Dark overlay: covers the page, click it to close the drawer */}
          <div className="fixed inset-0 z-40 bg-black/40" onClick={closeDrawer}></div>
          {/* The panel: pinned to the left edge, full height, scrolls on its own */}
          <div className="fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4">
              <h2 className="flex items-center gap-2 font-bold text-gray-900">
                <i className="fa-solid fa-sliders text-green-600"></i>
                Filters
              </h2>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close filters"
                className="h-9 w-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-4">{filtersPanel}</div>
            <div className="sticky bottom-0 border-t border-gray-100 bg-white p-4">
              <button
                type="button"
                onClick={closeDrawer}
                className="w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white hover:bg-green-700"
              >
                Show {sorted.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
