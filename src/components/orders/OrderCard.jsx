// Status pill: delivered > paid (on the way) > processing.
function getStatus(order) {
  if (order.isDelivered) {
    return { label: 'Delivered', icon: 'fa-circle-check', className: 'bg-green-100 text-green-700' }
  }
  if (order.isPaid) {
    return { label: 'On the way', icon: 'fa-truck', className: 'bg-blue-100 text-blue-700' }
  }
  return { label: 'Processing', icon: 'fa-clock', className: 'bg-amber-100 text-amber-700' }
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function OrderCard({ order, isOpen, onToggle }) {
  const items = order.cartItems || []
  const firstProduct = items[0]?.product
  const extraProducts = items.length - 1
  const itemsCount = items.reduce(function (sum, item) {
    return sum + item.count
  }, 0)
  const subtotal = items.reduce(function (sum, item) {
    return sum + item.count * item.price
  }, 0)
  const status = getStatus(order)
  const isCard = order.paymentMethodType === 'card'
  const address = order.shippingAddress || {}

  return (
    <article
      className={`overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition ${
        isOpen ? 'border-green-200' : 'border-transparent'
      }`}
    >
      <div className="flex gap-4 p-4 md:p-5">
        {/* First product image + "+N" badge */}
        <div className="relative h-20 w-20 md:h-24 md:w-24 shrink-0">
          <div className="h-full w-full rounded-xl border border-gray-100 bg-gray-50 p-2">
            {firstProduct && (
              <img src={firstProduct.imageCover} alt={firstProduct.title} className="h-full w-full object-contain" />
            )}
          </div>
          {extraProducts > 0 && (
            <span className="absolute -top-2 -end-2 h-7 w-7 rounded-full bg-slate-900 text-[11px] font-bold text-white ring-2 ring-white flex items-center justify-center">
              +{extraProducts}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${status.className}`}>
                <i className={`fa-solid ${status.icon}`}></i>
                {status.label}
              </span>
              <p className="mt-1.5 text-lg font-bold text-gray-900">
                <span className="me-1.5 font-normal text-gray-400">#</span>
                {order.id}
              </p>
            </div>
            <span
              title={isCard ? 'Paid by card' : 'Cash on delivery'}
              className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${
                isCard ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <i className={isCard ? 'fa-solid fa-credit-card' : 'fa-solid fa-money-bill-wave'}></i>
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm text-gray-500">
            <span>
              <i className="fa-regular fa-calendar me-1.5"></i>
              {formatDate(order.createdAt)}
            </span>
            <span className="text-gray-300">•</span>
            <span>
              <i className="fa-solid fa-box me-1.5"></i>
              {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
            </span>
            {address.city && (
              <>
                <span className="text-gray-300">•</span>
                <span>
                  <i className="fa-solid fa-location-dot me-1.5"></i>
                  {address.city}
                </span>
              </>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <p>
              <span className="text-2xl font-bold text-gray-900">{order.totalOrderPrice.toLocaleString()}</span>
              <span className="ms-1 text-sm text-gray-400">EGP</span>
            </p>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                isOpen
                  ? 'bg-green-600 text-white shadow-md shadow-green-600/30 hover:bg-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isOpen ? 'Hide' : 'Details'}
              <i className={`fa-solid ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-xs`}></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-100 bg-gray-50 p-4 md:p-5">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <span className="h-6 w-6 rounded-md bg-green-100 text-green-600 text-xs flex items-center justify-center">
              <i className="fa-solid fa-receipt"></i>
            </span>
            Order Items
          </h3>

          <ul className="mt-3 flex flex-col gap-2">
            {items.map(function (item) {
              return (
                <li key={item._id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
                  <img
                    src={item.product?.imageCover}
                    alt={item.product?.title}
                    className="h-12 w-12 shrink-0 rounded-lg bg-gray-50 object-contain p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-gray-900">{item.product?.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.count} × {item.price.toLocaleString()} EGP
                    </p>
                  </div>
                  <p className="text-end">
                    <span className="block font-bold text-gray-900">{(item.count * item.price).toLocaleString()}</span>
                    <span className="block text-xs text-gray-400">EGP</span>
                  </p>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <h4 className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <span className="h-6 w-6 rounded-md bg-blue-100 text-blue-600 text-xs flex items-center justify-center">
                  <i className="fa-solid fa-location-dot"></i>
                </span>
                Delivery Address
              </h4>
              <p className="mt-3 font-medium text-gray-900">{address.city || '—'}</p>
              <p className="mt-1 text-sm text-gray-600">
                {address.city} , {address.details}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                <i className="fa-solid fa-phone me-2 text-gray-400"></i>
                {address.phone}
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h4 className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <span className="h-6 w-6 rounded-md bg-amber-500 text-white text-xs flex items-center justify-center">
                  <i className="fa-solid fa-clock"></i>
                </span>
                Order Summary
              </h4>
              <dl className="mt-3 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <dt>Subtotal</dt>
                  <dd>{subtotal.toLocaleString()} EGP</dd>
                </div>
                <div className="flex justify-between text-gray-600">
                  <dt>Shipping</dt>
                  <dd>{order.shippingPrice ? `${order.shippingPrice.toLocaleString()} EGP` : 'Free'}</dd>
                </div>
                <div className="mt-1 flex justify-between border-t border-amber-200 pt-2 font-bold text-gray-900">
                  <dt>Total</dt>
                  <dd className="text-base">{order.totalOrderPrice.toLocaleString()} EGP</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
