import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'

const API_BASE = 'https://ecommerce.routemisr.com/api/v1'
const PAGE_SIZE = 40

export default function Products() {
  // Filters live in the URL so a refresh or a shared link keeps them.
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || ''
  const brand = searchParams.get('brand') || ''
  const page = Number(searchParams.get('page')) || 1

  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  // { id, name } of the category/brand in the URL, for the header title.
  const [filterInfo, setFilterInfo] = useState({ id: '', name: '' })

  // Server-side filtering: the API does the work, we only send the filters.
  useEffect(
    function () {
      let ignore = false

      async function loadProducts() {
        setLoading(true)
        const params = { limit: PAGE_SIZE, page }
        if (category) params['category[in]'] = category
        if (brand) params.brand = brand

        try {
          const response = await axios.get(`${API_BASE}/products`, { params })
          if (ignore) return
          setProducts(response.data.data)
          setTotalPages(response.data.metadata?.numberOfPages || 1)
        } catch (error) {
          console.error('Failed to load products:', error)
          if (!ignore) setProducts([])
        } finally {
          if (!ignore) setLoading(false)
        }
      }

      loadProducts()
      return function () {
        ignore = true
      }
    },
    [category, brand, page]
  )

  // Load the name of the filtered category or brand for the header.
  useEffect(
    function () {
      const id = category || brand
      if (!id) return
      let ignore = false

      async function loadFilterName() {
        try {
          const resource = category ? 'categories' : 'brands'
          const response = await axios.get(`${API_BASE}/${resource}/${id}`)
          if (!ignore) setFilterInfo({ id, name: response.data.data.name })
        } catch (error) {
          console.error('Failed to load filter name:', error)
        }
      }

      loadFilterName()
      return function () {
        ignore = true
      }
    },
    [category, brand]
  )

  const filterId = category || brand
  const filterName = filterId && filterInfo.id === filterId ? filterInfo.name : ''

  function handlePageChange(newPage) {
    // Copy the current params so the category/brand filter stays in the URL.
    const next = new URLSearchParams(searchParams)
    next.set('page', newPage)
    setSearchParams(next)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ---------- Green header ---------- */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <nav aria-label="Breadcrumb" className="text-sm text-green-50">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2 opacity-60">/</span>
            {filterId ? (
              <>
                <Link to={category ? '/categories' : '/brands'} className="hover:text-white">
                  {category ? 'Categories' : 'Brands'}
                </Link>
                <span className="mx-2 opacity-60">/</span>
                <span className="text-white">{filterName || '...'}</span>
              </>
            ) : (
              <span className="text-white">All Products</span>
            )}
          </nav>

          <div className="mt-4 flex items-center gap-4">
            <span className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-xl bg-white/20 text-xl md:text-2xl backdrop-blur flex items-center justify-center">
              <i className="fa-solid fa-box-open"></i>
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {filterId ? filterName || 'Loading...' : 'All Products'}
              </h1>
              <p className="text-sm text-green-50">
                {filterId ? 'Products in this collection' : 'Explore our complete product collection'}
              </p>
            </div>
          </div>

          {filterId && (
            <Link
              to="/products"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium hover:bg-white/30"
            >
              <i className="fa-solid fa-xmark"></i>
              Clear filter
            </Link>
          )}
        </div>
      </div>

      {/* ---------- Grid ---------- */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <i className="fa-solid fa-box-open text-5xl text-gray-300"></i>
            <h2 className="mt-4 text-xl font-bold text-gray-800">No products found</h2>
            <p className="mt-1 text-gray-500">Try another category or brand.</p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700"
            >
              View all products
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500">Showing {products.length} products</p>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map(function (product) {
                return <ProductCard key={product._id} product={product} />
              })}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  )
}
