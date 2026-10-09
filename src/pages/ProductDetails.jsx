import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import { WishlistContext } from '../context/WishlistContext'
import Stars from '../components/Stars'
import ProductGallery from '../components/product/ProductGallery'
import ProductTabs from '../components/product/ProductTabs'
import RelatedProducts from '../components/product/RelatedProducts'

const API_BASE = 'https://ecommerce.routemisr.com/api/v1'

const guarantees = [
  { icon: 'fa-truck-fast', title: 'Free Delivery', text: 'Orders over $50' },
  { icon: 'fa-rotate-left', title: '30 Days Return', text: 'Money back' },
  { icon: 'fa-shield-halved', title: 'Secure Payment', text: '100% Protected' },
]

export default function ProductDetails() {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [related, setRelated] = useState([])
  const [selectedImage, setSelectedImage] = useState('')
  const [count, setCount] = useState(1)
  const [copied, setCopied] = useState(false)
  // Which cart button is busy: 'cart', 'buy' or null.
  const [pendingAction, setPendingAction] = useState(null)

  const { token } = useContext(AuthContext)
  const { addToCart, updateCount } = useContext(CartContext)
  const { isInWishlist, toggleWishlist, togglingId } = useContext(WishlistContext)
  const navigate = useNavigate()
  // The id in the URL is this product's _id.
  const inWishlist = isInWishlist(id)
  const isTogglingWishlist = togglingId === id

  async function handleToggleWishlist() {
    const done = await toggleWishlist(id)
    // false = not logged in (the context already showed the toast)
    if (!done) navigate('/login')
  }

  // Used by both "Add to Cart" and "Buy Now" (which then goes to the cart page).
  async function handleAddToCart(action) {
    if (!token) {
      toast.error('Please sign in to add items to your cart')
      navigate('/login')
      return
    }

    setPendingAction(action)
    try {
      await addToCart(product._id)
      // POST /cart always adds 1, so set the chosen quantity afterwards.
      if (count > 1) {
        await updateCount(product._id, count)
      }
      toast.success('Added to cart')
      if (action === 'buy') navigate('/cart')
    } catch (cartError) {
      toast.error(cartError.response?.data?.message || 'Could not add to cart')
    } finally {
      setPendingAction(null)
    }
  }

  // [id]: clicking a related product only changes the URL (same component stays
  // mounted), so the effect must re-run to load the new product.
  useEffect(
    function () {
      // If the id changes again before this request finishes, ignore its late answer.
      let ignore = false
      window.scrollTo(0, 0)

      async function getProduct() {
        setLoading(true)
        setError(false)
        setRelated([])
        try {
          const response = await axios.get(`${API_BASE}/products/${id}`)
          if (ignore) return
          const data = response.data.data
          setProduct(data)
          // Reset the per-product choices for the new product.
          setSelectedImage(data.imageCover)
          setCount(1)

          // Related products: same category, minus the current one.
          try {
            const relatedResponse = await axios.get(`${API_BASE}/products`, {
              params: { 'category[in]': data.category._id },
            })
            if (ignore) return
            setRelated(
              relatedResponse.data.data.filter(function (item) {
                return item._id !== data._id
              })
            )
          } catch (relatedError) {
            console.error('Failed to load related products:', relatedError)
          }
        } catch {
          if (!ignore) setError(true)
        } finally {
          if (!ignore) setLoading(false)
        }
      }

      getProduct()

      return function () {
        ignore = true
      }
    },
    [id]
  )

  function decrease() {
    setCount(Math.max(1, count - 1))
  }

  function increase() {
    setCount(Math.min(product.quantity, count + 1))
  }

  async function handleShare() {
    const url = window.location.href

    // Native share sheet where available (mostly phones).
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, url })
      } catch {
        // The user closed the share sheet; nothing to do.
      }
      return
    }

    // Fallback: copy the link and show "Link copied!" for 2 seconds.
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(function () {
        setCopied(false)
      }, 2000)
    } catch (copyError) {
      console.error('Could not copy the link:', copyError)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <i className="fa-solid fa-box-open text-5xl text-gray-300"></i>
        <h1 className="mt-4 text-2xl font-bold text-gray-800">Product not found</h1>
        <p className="mt-2 text-gray-500">This product may have been removed or the link is wrong.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to products
        </Link>
      </div>
    )
  }

  const description = product.description.replace(/[\t\n]+/g, ' ')
  const images = product.images?.length ? product.images : [product.imageCover]
  const hasDiscount = Boolean(product.priceAfterDiscount)
  const unitPrice = hasDiscount ? product.priceAfterDiscount : product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
    : 0
  const inStock = product.quantity > 0
  const subcategoryName = product.subcategory?.[0]?.name

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-8 md:space-y-10">
      {/* ---------- Breadcrumb ---------- */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-green-600">
          <i className="fa-solid fa-house me-1.5"></i>
          Home
        </Link>
        <i className="fa-solid fa-chevron-right text-[10px]"></i>
        <Link to="/categories" className="hover:text-green-600">
          {product.category?.name}
        </Link>
        {subcategoryName && (
          <>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <span>{subcategoryName}</span>
          </>
        )}
        <i className="fa-solid fa-chevron-right text-[10px]"></i>
        <span className="text-gray-900">{product.title}</span>
      </nav>

      {/* ---------- Main section ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <ProductGallery
          images={images}
          title={product.title}
          selectedImage={selectedImage}
          onSelect={setSelectedImage}
        />

        <div className="md:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
              {product.category?.name}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
              {product.brand?.name}
            </span>
          </div>

          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900">{product.title}</h1>

          <div className="mt-2 flex items-center gap-2">
            <Stars rating={product.ratingsAverage} />
            <span className="text-sm text-gray-600">
              {product.ratingsAverage} ({product.ratingsQuantity} reviews)
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {hasDiscount ? (
              <>
                <span className="text-3xl font-bold text-green-600">{product.priceAfterDiscount} EGP</span>
                <span className="text-lg text-gray-400 line-through">{product.price} EGP</span>
                <span className="rounded-md bg-red-500 px-2 py-0.5 text-sm font-medium text-white">
                  -{discountPercent}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">{product.price} EGP</span>
            )}
          </div>

          <span
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
              inStock ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>

          <hr className="my-5 border-gray-100" />

          <p className="text-gray-600">{description}</p>

          {/* Quantity */}
          <p className="mt-5 mb-2 text-sm text-gray-800">Quantity</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-lg border-2 border-gray-200">
              <button
                type="button"
                onClick={decrease}
                disabled={count <= 1}
                aria-label="Decrease quantity"
                className="h-10 w-10 text-gray-600 hover:text-green-600 disabled:opacity-40"
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <span className="w-10 text-center font-medium">{count}</span>
              <button
                type="button"
                onClick={increase}
                disabled={count >= product.quantity}
                aria-label="Increase quantity"
                className="h-10 w-10 text-gray-600 hover:text-green-600 disabled:opacity-40"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
            <span className="text-sm text-gray-500">{product.quantity} available</span>
          </div>

          {/* Total price */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-4">
            <span className="text-gray-600">Total Price:</span>
            <span className="text-2xl font-bold text-green-600">
              {(unitPrice * count).toFixed(2)} EGP
            </span>
          </div>

          {/* Actions */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={function () {
                handleAddToCart('cart')
              }}
              disabled={!inStock || pendingAction !== null}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-medium text-white shadow-lg shadow-green-600/20 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <i
                className={pendingAction === 'cart' ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-cart-shopping'}
              ></i>
              Add to Cart
            </button>
            <button
              type="button"
              onClick={function () {
                handleAddToCart('buy')
              }}
              disabled={!inStock || pendingAction !== null}
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <i className={pendingAction === 'buy' ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-bolt'}></i>
              Buy Now
            </button>
          </div>

          <div className="relative mt-3 flex gap-3">
            <button
              type="button"
              onClick={handleToggleWishlist}
              disabled={isTogglingWishlist}
              aria-pressed={inWishlist}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 py-2.5 font-medium transition disabled:opacity-70 ${
                inWishlist
                  ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                  : 'border-gray-200 text-gray-700 hover:border-green-600 hover:text-green-600'
              }`}
            >
              <i
                className={
                  isTogglingWishlist
                    ? 'fa-solid fa-spinner fa-spin'
                    : inWishlist
                      ? 'fa-solid fa-heart text-red-500'
                      : 'fa-regular fa-heart'
                }
              ></i>
              {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share this product"
              className="h-12 w-12 shrink-0 rounded-lg border-2 border-gray-200 text-gray-700 hover:border-green-600 hover:text-green-600"
            >
              <i className="fa-solid fa-share-nodes"></i>
            </button>
            {copied && (
              <span className="absolute -top-9 end-0 rounded-md bg-slate-900 px-3 py-1 text-xs text-white">
                Link copied!
              </span>
            )}
          </div>

          <hr className="my-5 border-gray-100" />

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guarantees.map(function (item) {
              return (
                <li key={item.title} className="flex items-center gap-3">
                  <span className="h-11 w-11 shrink-0 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.text}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* key resets the open tab back to "Product Details" when the product changes */}
      <ProductTabs key={product._id} product={product} description={description} />

      {related.length > 0 && <RelatedProducts products={related} />}
    </div>
  )
}
