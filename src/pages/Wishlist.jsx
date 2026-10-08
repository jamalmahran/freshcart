import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CartContext } from '../context/CartContext'
import { WishlistContext } from '../context/WishlistContext'

function Price({ product, align = 'center' }) {
  const hasDiscount = Boolean(product.priceAfterDiscount)
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <p className="font-bold text-gray-900">
        {(hasDiscount ? product.priceAfterDiscount : product.price).toLocaleString()} EGP
      </p>
      {hasDiscount && (
        <p className="text-xs text-gray-400 line-through">{product.price.toLocaleString()} EGP</p>
      )}
    </div>
  )
}

function StatusPill({ product }) {
  // Only "Out of Stock" when the API says exactly 0 (missing quantity = treat as in stock).
  const inStock = product.quantity !== 0
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        inStock ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
      {inStock ? 'In Stock' : 'Out of Stock'}
    </span>
  )
}

function ProductInfo({ product }) {
  const url = `/products/${product._id}`
  return (
    <div className="flex items-center gap-4">
      <Link to={url} className="h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-xl border border-gray-100 bg-gray-50 p-2">
        <img src={product.imageCover} alt={product.title} className="h-full w-full object-contain" />
      </Link>
      <div className="min-w-0">
        <Link to={url} className="line-clamp-2 text-gray-900 hover:text-green-600">
          {product.title}
        </Link>
        <p className="mt-1 text-sm text-gray-400">{product.category?.name}</p>
      </div>
    </div>
  )
}

// Add to Cart + trash buttons, shared by the table row and the mobile card.
function Actions({ product, fullWidth }) {
  const { addToCart, addingId } = useContext(CartContext)
  const { toggleWishlist, togglingId } = useContext(WishlistContext)
  const isAdding = addingId === product._id
  const isRemoving = togglingId === product._id
  const inStock = product.quantity !== 0

  async function handleAddToCart() {
    // The product stays in the wishlist; we only add it to the cart.
    try {
      await addToCart(product._id)
      toast.success('Added to cart')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add to cart')
    }
  }

  function handleRemove() {
    // It's in the wishlist, so toggling removes it (with its own toast).
    toggleWishlist(product._id)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding || !inStock}
        className={`${fullWidth ? 'flex-1' : ''} inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <i className={isAdding ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-cart-shopping'}></i>
        Add to Cart
      </button>
      <button
        type="button"
        onClick={handleRemove}
        disabled={isRemoving}
        aria-label="Remove from wishlist"
        className="h-10 w-10 shrink-0 rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-60"
      >
        <i className={isRemoving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-trash'}></i>
      </button>
    </div>
  )
}

export default function Wishlist() {
  const { products, count, loading, getWishlist } = useContext(WishlistContext)

  // Refresh when the page opens: POST /wishlist only returns ids, so this brings in
  // the full details of anything added since the wishlist was last loaded.
  useEffect(
    function () {
      getWishlist().catch(function (error) {
        console.error('Failed to refresh wishlist:', error)
      })
    },
    [getWishlist]
  )

  // Also wait when we know there are items (ids) but their details haven't arrived yet.
  if (loading || (products.length === 0 && count > 0)) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto h-32 w-32 md:h-40 md:w-40 rounded-full bg-red-50 shadow-lg shadow-red-100/60 flex items-center justify-center">
            <i className="fa-solid fa-heart text-5xl md:text-6xl text-red-300"></i>
          </div>
          <h1 className="mt-8 text-2xl md:text-3xl font-bold text-gray-900">Your wishlist is empty</h1>
          <p className="mt-3 text-gray-500 md:text-lg">
            Save items you love by tapping the heart icon on any product.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-3.5 font-semibold text-white shadow-lg shadow-green-600/25 hover:from-green-700 hover:to-green-800"
          >
            Browse Products
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ---------- Header ---------- */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
            <Link to="/" className="hover:text-green-600">
              Home
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-900">Wishlist</span>
          </nav>
          <div className="mt-4 flex items-center gap-4">
            <span className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-red-50 text-xl md:text-2xl text-red-500 flex items-center justify-center">
              <i className="fa-solid fa-heart"></i>
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-500">
                {count} {count === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* ---------- Table (tablet / desktop) ---------- */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-start">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-4 text-start font-medium">Product</th>
                <th scope="col" className="px-4 py-4 text-center font-medium">Price</th>
                <th scope="col" className="px-4 py-4 text-center font-medium">Status</th>
                <th scope="col" className="px-6 py-4 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(function (product) {
                return (
                  <tr key={product._id}>
                    <td className="px-6 py-5">
                      <ProductInfo product={product} />
                    </td>
                    <td className="px-4 py-5">
                      <Price product={product} />
                    </td>
                    <td className="px-4 py-5 text-center">
                      <StatusPill product={product} />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <Actions product={product} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ---------- Cards (mobile) ---------- */}
        <div className="md:hidden divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {products.map(function (product) {
            return (
              <div key={product._id} className="flex flex-col gap-4 p-4">
                <ProductInfo product={product} />
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">Price:</span>
                  <Price product={product} align="start" />
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">Status:</span>
                  <StatusPill product={product} />
                </div>
                <Actions product={product} fullWidth />
              </div>
            )
          })}
        </div>

        <Link to="/products" className="mt-6 inline-block text-gray-600 hover:text-green-600">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  )
}
