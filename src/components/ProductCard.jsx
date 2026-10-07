import { Link } from 'react-router-dom'

// Props are the inputs a parent passes to a component, like HTML attributes.
// <ProductCard product={p} /> gives us { product: p }, which we destructure here.
export default function ProductCard({ product }) {
  const hasDiscount = Boolean(product.priceAfterDiscount)

  return (
    <div className="flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden transition hover:shadow-lg hover:-translate-y-1">
      <Link to={`/products/${product._id}`} className="flex flex-col flex-1 p-4">
        <img
          src={product.imageCover}
          alt={product.title}
          className="w-full aspect-square object-contain mb-3"
        />
        <span className="text-sm text-green-600">{product.category.name}</span>
        <h3 className="font-semibold text-gray-800 line-clamp-2 my-1">
          {product.title}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            {hasDiscount ? (
              <>
                <span className="font-bold text-gray-900">
                  {product.priceAfterDiscount} EGP
                </span>
                <span className="ms-2 text-sm text-gray-400 line-through">
                  {product.price} EGP
                </span>
              </>
            ) : (
              <span className="font-bold text-gray-900">{product.price} EGP</span>
            )}
          </div>
          <span className="text-sm text-gray-700">
            <span className="text-yellow-400">★</span> {product.ratingsAverage}
          </span>
        </div>
      </Link>

      {/* The button is outside the Link so clicking it won't open the product page */}
      <div className="px-4 pb-4">
        <button
          type="button"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition"
        >
          + Add to cart
        </button>
      </div>
    </div>
  )
}
