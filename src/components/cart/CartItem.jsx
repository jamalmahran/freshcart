import { Link } from 'react-router-dom'

// One product row in the cart. "busy" = this item is being updated or removed.
export default function CartItem({ item, busy, onChangeCount, onRemove }) {
  const product = item.product
  // Some cart responses don't include product.quantity (stock), so it can be undefined.
  // `undefined > 0` is false, which wrongly showed "Out of Stock"; we only call it out
  // of stock when the API explicitly says 0, and only cap the count when we know the stock.
  const inStock = product.quantity !== 0
  const hasStockInfo = typeof product.quantity === 'number'
  const sku = product._id.slice(-6).toUpperCase()
  const itemTotal = item.price * item.count

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 md:p-5 shadow-sm">
      <div className="flex gap-4 md:gap-6">
        {/* Image + stock pill */}
        <div className="flex w-24 md:w-32 shrink-0 flex-col items-end gap-2">
          <Link
            to={`/products/${product._id}`}
            className="block aspect-square w-full rounded-xl border border-gray-100 bg-gray-50 p-2"
          >
            <img src={product.imageCover} alt={product.title} className="h-full w-full object-contain" />
          </Link>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium text-white ${
              inStock ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {inStock ? '✓ In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <Link
            to={`/products/${product._id}`}
            className="font-medium text-gray-900 md:text-lg hover:text-green-600"
          >
            {product.title}
          </Link>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">
              {product.category?.name}
            </span>
            <span>· SKU: {sku}</span>
          </div>

          <p className="mt-3">
            <span className="text-lg font-bold text-green-600">{item.price.toLocaleString()} EGP</span>
            <span className="ms-2 text-xs text-gray-400">per unit</span>
          </p>

          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            {/* Quantity control */}
            <div className="inline-flex w-fit items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
              <button
                type="button"
                onClick={function () {
                  onChangeCount(item.count - 1)
                }}
                disabled={busy || item.count <= 1}
                aria-label="Decrease quantity"
                className="h-8 w-8 rounded-md text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
              >
                <i className="fa-solid fa-minus text-sm"></i>
              </button>
              <span className="w-8 text-center font-semibold text-gray-900">
                {busy ? <i className="fa-solid fa-spinner fa-spin text-sm text-green-600"></i> : item.count}
              </span>
              <button
                type="button"
                onClick={function () {
                  onChangeCount(item.count + 1)
                }}
                disabled={busy || (hasStockInfo && item.count >= product.quantity)}
                aria-label="Increase quantity"
                className="h-8 w-8 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <i className="fa-solid fa-plus text-sm"></i>
              </button>
            </div>

            {/* Item total + delete */}
            <div className="flex items-end gap-3">
              <div className="md:text-end">
                <p className="text-xs text-gray-400">Total</p>
                <p className="leading-none">
                  <span className="text-xl font-bold text-gray-900">{itemTotal.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">EGP</span>
                </p>
              </div>
              <button
                type="button"
                onClick={onRemove}
                disabled={busy}
                aria-label="Remove item"
                className="h-10 w-10 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
