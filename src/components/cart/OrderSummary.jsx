import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const FREE_SHIPPING_MIN = 500

export default function OrderSummary({ total, itemsCount }) {
  const [showPromo, setShowPromo] = useState(false)
  const [promoCode, setPromoCode] = useState('')

  const hasFreeShipping = total >= FREE_SHIPPING_MIN
  const remaining = FREE_SHIPPING_MIN - total
  const progress = Math.min(100, (total / FREE_SHIPPING_MIN) * 100)

  function togglePromo() {
    setShowPromo(!showPromo)
  }

  function handlePromoChange(event) {
    setPromoCode(event.target.value)
  }

  function handleApplyPromo(event) {
    event.preventDefault()
    toast.error('Promo codes are not available right now')
  }

  return (
    <aside className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:sticky lg:top-24">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 text-white">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <i className="fa-solid fa-bag-shopping"></i>
          Order Summary
        </h2>
        <p className="mt-1 text-sm text-green-50">{itemsCount} items in your cart</p>
      </div>

      <div className="p-5 md:p-6">
        {hasFreeShipping ? (
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-green-50 to-gray-50 p-4">
            <span className="h-10 w-10 shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <i className="fa-solid fa-truck"></i>
            </span>
            <div>
              <p className="font-semibold text-green-700">Free Shipping!</p>
              <p className="text-sm text-green-600">You qualify for free delivery</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-700">
              Add <span className="font-semibold text-green-600">{remaining.toLocaleString()} EGP</span> more
              for free shipping
            </p>
            <div className="mt-2 h-2 rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-green-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        <dl className="mt-5 flex flex-col gap-3">
          <div className="flex justify-between text-gray-600">
            <dt>Subtotal</dt>
            <dd className="text-gray-900">{total.toLocaleString()} EGP</dd>
          </div>
          <div className="flex justify-between text-gray-600">
            <dt>Shipping</dt>
            {hasFreeShipping ? (
              <dd className="font-medium text-green-600">FREE</dd>
            ) : (
              <dd className="text-sm text-gray-400">Calculated at checkout</dd>
            )}
          </div>
        </dl>

        <div className="my-4 border-t border-dashed border-gray-200"></div>

        <div className="flex items-baseline justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span>
            <span className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</span>
            <span className="ms-1 text-sm text-gray-500">EGP</span>
          </span>
        </div>

        <button
          type="button"
          onClick={togglePromo}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-gray-700 hover:border-green-300 hover:text-green-600"
        >
          <i className="fa-solid fa-tag"></i>
          Apply Promo Code
        </button>

        {showPromo && (
          <form onSubmit={handleApplyPromo} className="mt-3 flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={handlePromoChange}
              placeholder="Enter promo code"
              className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Apply
            </button>
          </form>
        )}

        <Link
          to="/checkout"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 py-3.5 font-semibold text-white shadow-lg shadow-green-600/25 hover:from-green-700 hover:to-green-800"
        >
          <i className="fa-solid fa-lock"></i>
          Secure Checkout
        </Link>

        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-shield-halved text-green-600"></i>
            Secure Payment
          </span>
          <span className="h-4 w-px bg-gray-200"></span>
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-truck text-blue-500"></i>
            Fast Delivery
          </span>
        </div>

        <Link
          to="/products"
          className="mt-5 block text-center text-sm font-medium text-green-600 hover:underline"
        >
          ← Continue Shopping
        </Link>
      </div>
    </aside>
  )
}
