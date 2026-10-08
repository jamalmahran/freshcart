import { Link } from 'react-router-dom'

const popularCategories = ['Electronics', 'Fashion', 'Home', 'Beauty']

export default function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto h-32 w-32 md:h-40 md:w-40 rounded-full bg-gray-100 shadow-lg shadow-gray-200/60 flex items-center justify-center">
          <i className="fa-solid fa-box-open text-5xl md:text-6xl text-gray-300"></i>
        </div>

        <h1 className="mt-8 text-2xl md:text-3xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-3 text-gray-500 md:text-lg">
          Looks like you haven't added anything to your cart yet. Start exploring our products!
        </p>

        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-3.5 font-semibold text-white shadow-lg shadow-green-600/25 hover:from-green-700 hover:to-green-800"
        >
          Start Shopping
          <i className="fa-solid fa-arrow-right"></i>
        </Link>

        <div className="mt-10 border-t border-gray-200 pt-8">
          <p className="text-gray-400">Popular Categories</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {popularCategories.map(function (name) {
              return (
                <Link
                  key={name}
                  to="/categories"
                  className="rounded-full bg-gray-100 px-5 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700"
                >
                  {name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
