import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { CartContext } from '../context/CartContext'
import CartItem from '../components/cart/CartItem'
import OrderSummary from '../components/cart/OrderSummary'
import EmptyCart from '../components/cart/EmptyCart'

export default function Cart() {
  const { cart, numOfCartItems, loading, updateCount, removeItem, clearCart } = useContext(CartContext)
  // Id of the item being updated/removed, so only that card shows a spinner.
  const [busyId, setBusyId] = useState(null)
  const [clearing, setClearing] = useState(false)

  async function handleChangeCount(productId, newCount) {
    setBusyId(productId)
    try {
      await updateCount(productId, newCount)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update the quantity')
    } finally {
      setBusyId(null)
    }
  }

  async function handleRemove(productId) {
    setBusyId(productId)
    try {
      await removeItem(productId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove the item')
    } finally {
      setBusyId(null)
    }
  }

  async function handleClearAll() {
    const result = await Swal.fire({
      title: 'Clear your cart?',
      text: 'All items will be removed from your cart.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
    })
    if (!result.isConfirmed) return

    setClearing(true)
    try {
      await clearCart()
      toast.success('Your cart has been cleared')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not clear the cart')
    } finally {
      setClearing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
      </div>
    )
  }

  // Skip any item whose product didn't come back as a full object (e.g. a deleted product).
  const items = (cart?.products || []).filter(function (item) {
    return item.product !== null && typeof item.product === 'object'
  })

  if (items.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
          <Link to="/" className="hover:text-green-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Shopping Cart</span>
        </nav>

        <div className="mt-4 flex items-center gap-3">
          <span className="h-12 w-12 rounded-xl bg-green-600 text-white text-xl flex items-center justify-center">
            <i className="fa-solid fa-cart-shopping"></i>
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
        <p className="mt-2 text-gray-500">
          You have <span className="font-semibold text-green-600">{numOfCartItems} items</span> in your cart
        </p>

        <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ---------- Items (2/3) ---------- */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-4">
              {items.map(function (item) {
                const productId = item.product._id
                return (
                  <CartItem
                    key={productId}
                    item={item}
                    busy={busyId === productId || clearing}
                    onChangeCount={function (newCount) {
                      handleChangeCount(productId, newCount)
                    }}
                    onRemove={function () {
                      handleRemove(productId)
                    }}
                  />
                )
              })}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-5 text-sm">
              <Link to="/products" className="font-medium text-green-600 hover:underline">
                ← Continue Shopping
              </Link>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={clearing}
                className="text-gray-400 hover:text-red-500 disabled:opacity-50"
              >
                <i className={clearing ? 'fa-solid fa-spinner fa-spin me-2' : 'fa-solid fa-trash me-2'}></i>
                Clear all items
              </button>
            </div>
          </div>

          {/* ---------- Summary (1/3) ---------- */}
          <OrderSummary total={cart.totalCartPrice} itemsCount={numOfCartItems} />
        </div>
      </div>
    </div>
  )
}
