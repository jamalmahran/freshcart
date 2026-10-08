import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'

// Builds 5 star icons from a rating like 4.2 → 4 full stars + 1 empty.
// A star is half when the rating reaches at least half of it (e.g. 3.5 → 3 full + 1 half).
function getStarIcons(rating) {
  return [1, 2, 3, 4, 5].map(function (position) {
    if (rating >= position) return 'fa-solid fa-star'
    if (rating >= position - 0.5) return 'fa-solid fa-star-half-stroke'
    return 'fa-regular fa-star'
  })
}

const iconButtonClass =
  'h-9 w-9 rounded-full bg-white shadow-md text-gray-500 flex items-center justify-center hover:text-green-600'

// Props are the inputs a parent passes to a component, like HTML attributes.
// <ProductCard product={p} /> gives us { product: p }, which we destructure here.
export default function ProductCard({ product }) {
  const { token } = useContext(AuthContext)
  const { addToCart, addingId } = useContext(CartContext)
  const navigate = useNavigate()
  const isAdding = addingId === product._id

  async function handleAddToCart() {
    if (!token) {
      // toast shows a small pop-up message (rendered by <Toaster /> in App.jsx).
      toast.error('Please sign in to add items to your cart')
      navigate('/login')
      return
    }
    try {
      await addToCart(product._id)
      toast.success('Added to cart')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add to cart')
    }
  }

  const productUrl = `/products/${product._id}`
  const hasDiscount = Boolean(product.priceAfterDiscount)
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
    : 0

  return (
    <div className="relative flex flex-col rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-lg">
      {hasDiscount && (
        <span className="absolute top-3 start-3 z-10 rounded-md bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
          -{discountPercent}%
        </span>
      )}

      {/* These buttons sit outside the Link below (positioned on top of the card),
          so clicking them never opens the product page. */}
      <div className="absolute top-3 end-3 z-10 flex flex-col gap-2">
        <button type="button" className={iconButtonClass} aria-label="Add to wishlist">
          <i className="fa-regular fa-heart"></i>
        </button>
        <button type="button" className={iconButtonClass} aria-label="Compare">
          <i className="fa-solid fa-arrows-rotate"></i>
        </button>
        <Link to={productUrl} className={iconButtonClass} aria-label="Quick view">
          <i className="fa-regular fa-eye"></i>
        </Link>
      </div>

      <Link to={productUrl} className="block">
        <img
          src={product.imageCover}
          alt={product.title}
          className="mx-auto h-56 md:h-44 lg:h-48 w-full object-contain"
        />
        <p className="mt-4 text-xs text-gray-500">{product.category.name}</p>
        {/* min-h keeps space for 2 lines, so short titles don't break the alignment */}
        <h3 className="mt-1 min-h-10 text-sm font-medium leading-5 text-slate-700 line-clamp-2 hover:text-green-600">
          {product.title}
        </h3>
      </Link>

      <div className="mt-2 flex items-center gap-1.5">
        <div className="flex gap-0.5 text-xs text-yellow-400">
          {getStarIcons(product.ratingsAverage).map(function (icon, index) {
            return <i key={index} className={icon}></i>
          })}
        </div>
        <span className="text-xs text-gray-500">
          {product.ratingsAverage} ({product.ratingsQuantity})
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        {hasDiscount ? (
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-bold text-green-600">{product.priceAfterDiscount} EGP</span>
            <span className="text-xs text-gray-400 line-through">{product.price} EGP</span>
          </div>
        ) : (
          <span className="font-bold text-slate-800">{product.price} EGP</span>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          aria-label="Add to cart"
          className="h-10 w-10 shrink-0 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 disabled:opacity-70"
        >
          <i className={isAdding ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-plus'}></i>
        </button>
      </div>
    </div>
  )
}
