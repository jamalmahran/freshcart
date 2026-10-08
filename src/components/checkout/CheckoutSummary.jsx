import CheckoutCard from './CheckoutCard'

const trustItems = [
  { icon: 'fa-shield-halved', color: 'text-green-600', text: 'Secure' },
  { icon: 'fa-truck', color: 'text-blue-500', text: 'Fast Delivery' },
  { icon: 'fa-box', color: 'text-orange-500', text: 'Easy Returns' },
]

export default function CheckoutSummary({ items, itemsCount, total, placing, isOnline, onPlaceOrder }) {
  return (
    <div className="lg:sticky lg:top-24">
      <CheckoutCard icon="fa-bag-shopping" title="Order Summary" subtitle={`${itemsCount} items`}>
        <ul className="flex max-h-64 flex-col gap-3 overflow-y-auto pe-1">
          {items.map(function (item) {
            return (
              <li key={item.product._id} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <img
                  src={item.product.imageCover}
                  alt={item.product.title}
                  className="h-12 w-12 shrink-0 rounded-lg bg-white object-contain p-1"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-900">{item.product.title}</p>
                  <p className="text-xs text-gray-500">
                    {item.count} × {item.price.toLocaleString()} EGP
                  </p>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {(item.count * item.price).toLocaleString()}
                </span>
              </li>
            )
          })}
        </ul>

        <dl className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
          <div className="flex justify-between text-gray-600">
            <dt>Subtotal</dt>
            <dd className="text-gray-900">{total.toLocaleString()} EGP</dd>
          </div>
          <div className="flex justify-between text-gray-600">
            <dt className="flex items-center gap-2">
              <i className="fa-solid fa-truck text-gray-400"></i>
              Shipping
            </dt>
            <dd className="font-semibold text-green-600">FREE</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-baseline justify-between border-t border-gray-100 pt-4">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span>
            <span className="text-2xl font-bold text-green-600">{total.toLocaleString()}</span>
            <span className="ms-1 text-sm text-gray-500">EGP</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={placing}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 py-3.5 font-semibold text-white shadow-lg shadow-green-600/25 hover:from-green-700 hover:to-green-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <i className={placing ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-box'}></i>
          {isOnline ? 'Proceed to Payment' : 'Place Order'}
        </button>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
          {trustItems.map(function (item, index) {
            return (
              <span key={item.text} className="flex items-center gap-1.5">
                {index > 0 && <span className="me-1.5 h-3 w-px bg-gray-200"></span>}
                <i className={`fa-solid ${item.icon} ${item.color}`}></i>
                {item.text}
              </span>
            )
          })}
        </div>
      </CheckoutCard>
    </div>
  )
}
