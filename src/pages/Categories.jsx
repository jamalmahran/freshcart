import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAll } from '../api/catalog'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  // Changing this number re-runs the effect below (used by the Retry button).
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(
    function () {
      let ignore = false

      async function loadCategories() {
        setLoading(true)
        setError(false)
        try {
          const data = await fetchAll('categories')
          if (!ignore) setCategories(data)
        } catch (loadError) {
          console.error('Failed to load categories:', loadError)
          if (!ignore) setError(true)
        } finally {
          if (!ignore) setLoading(false)
        }
      }

      loadCategories()
      return function () {
        ignore = true
      }
    },
    [reloadKey]
  )

  function retry() {
    setReloadKey(reloadKey + 1)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ---------- Green header ---------- */}
      <div className="bg-gradient-to-br from-green-600 via-green-500 to-green-400 text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-green-50">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-white">Categories</span>
          </nav>
          <div className="mt-5 flex items-center gap-4">
            <span className="h-14 w-14 md:h-16 md:w-16 shrink-0 rounded-2xl bg-white/20 text-2xl md:text-3xl shadow-lg backdrop-blur flex items-center justify-center">
              <i className="fa-solid fa-layer-group"></i>
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">All Categories</h1>
              <p className="mt-1 text-green-50 md:text-lg">Browse our wide range of product categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Grid ---------- */}
      <div className="container mx-auto px-4 py-8 md:py-10">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
            <i className="fa-solid fa-triangle-exclamation text-4xl text-red-400"></i>
            <p className="mt-4 font-medium text-gray-800">Couldn't load the categories.</p>
            <button
              type="button"
              onClick={retry}
              className="mt-5 rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700"
            >
              <i className="fa-solid fa-rotate-right me-2"></i>
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {categories.map(function (category) {
              return (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="group flex flex-col items-center rounded-2xl border-2 border-transparent bg-white p-4 md:p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                    <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                  </div>
                  <h2 className="mt-4 font-bold text-gray-900 md:text-lg group-hover:text-green-600">
                    {category.name}
                  </h2>
                  {/* Invisible until hover, but keeps its space so cards don't jump */}
                  <span className="mt-1 text-sm text-green-600 opacity-0 transition group-hover:opacity-100">
                    View Products <i className="fa-solid fa-arrow-right ms-1 text-xs"></i>
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
