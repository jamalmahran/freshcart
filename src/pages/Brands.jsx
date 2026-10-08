import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAll } from '../api/catalog'

export default function Brands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  // Changing this number re-runs the effect below (used by the Retry button).
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(
    function () {
      let ignore = false

      async function loadBrands() {
        setLoading(true)
        setError(false)
        try {
          // There are 54 brands but the API returns at most 50 per request,
          // so fetchAll() also gets page 2.
          const data = await fetchAll('brands')
          if (!ignore) setBrands(data)
        } catch (loadError) {
          console.error('Failed to load brands:', loadError)
          if (!ignore) setError(true)
        } finally {
          if (!ignore) setLoading(false)
        }
      }

      loadBrands()
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
      {/* ---------- Purple header ---------- */}
      <div className="bg-gradient-to-br from-violet-600 via-violet-500 to-purple-400 text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-violet-100">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-white">Brands</span>
          </nav>
          <div className="mt-5 flex items-center gap-4">
            <span className="h-14 w-14 md:h-16 md:w-16 shrink-0 rounded-2xl bg-white/20 text-2xl md:text-3xl shadow-lg backdrop-blur flex items-center justify-center">
              <i className="fa-solid fa-tags"></i>
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Top Brands</h1>
              <p className="mt-1 text-violet-100 md:text-lg">Shop from your favorite brands</p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Grid ---------- */}
      <div className="container mx-auto px-4 py-8 md:py-10">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-violet-600 animate-spin"></div>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
            <i className="fa-solid fa-triangle-exclamation text-4xl text-red-400"></i>
            <p className="mt-4 font-medium text-gray-800">Couldn't load the brands.</p>
            <button
              type="button"
              onClick={retry}
              className="mt-5 rounded-lg bg-violet-600 px-5 py-2.5 font-semibold text-white hover:bg-violet-700"
            >
              <i className="fa-solid fa-rotate-right me-2"></i>
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {brands.map(function (brand) {
              return (
                <Link
                  key={brand._id}
                  to={`/products?brand=${brand._id}`}
                  className="group flex flex-col items-center rounded-2xl border-2 border-transparent bg-white p-3 md:p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
                >
                  {/* Light gray square with a white box inside holding the logo */}
                  <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-gray-50 p-3">
                    <div className="flex h-3/5 w-full items-center justify-center rounded-md bg-white">
                      <img src={brand.image} alt={brand.name} className="h-full w-full object-contain" />
                    </div>
                  </div>
                  <h2
                    title={brand.name}
                    className="mt-3 w-full truncate text-sm font-medium text-gray-800 group-hover:text-violet-600"
                  >
                    {brand.name}
                  </h2>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
