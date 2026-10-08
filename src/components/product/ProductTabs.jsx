import { useState } from 'react'
import Stars from '../Stars'

const keyFeatures = [
  'Premium Quality Product',
  '100% Authentic Guarantee',
  'Fast & Secure Packaging',
  'Quality Tested',
]

const shippingInfo = [
  {
    title: 'Shipping Information',
    lines: ['Free shipping on orders over 500 EGP', 'Delivery in 3-5 business days', 'Track your order online'],
  },
  {
    title: 'Return Policy',
    lines: ['14-day return policy', 'Free returns for unused items', 'Full refund to original payment method'],
  },
]

function CheckList({ items }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map(function (item) {
        return (
          <li key={item} className="flex items-center gap-3 text-gray-600">
            <i className="fa-solid fa-check text-green-600"></i>
            {item}
          </li>
        )
      })}
    </ul>
  )
}

function DetailsTab({ product, description }) {
  const infoRows = [
    { label: 'Category', value: product.category?.name },
    { label: 'Subcategory', value: product.subcategory?.[0]?.name },
    { label: 'Brand', value: product.brand?.name },
    { label: 'Items Sold', value: `${product.sold}+ sold` },
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">About this Product</h3>
      <p className="mt-2 text-gray-600">{description}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-gray-50 p-5">
          <h4 className="mb-3 font-medium text-gray-900">Product Information</h4>
          <dl className="flex flex-col gap-2 text-sm">
            {infoRows.map(function (row) {
              return (
                <div key={row.label} className="flex justify-between gap-4">
                  <dt className="text-gray-500">{row.label}</dt>
                  <dd className="text-end text-gray-900">{row.value || '—'}</dd>
                </div>
              )
            })}
          </dl>
        </div>

        <div className="rounded-xl bg-gray-50 p-5">
          <h4 className="mb-3 font-medium text-gray-900">Key Features</h4>
          <CheckList items={keyFeatures} />
        </div>
      </div>
    </div>
  )
}

// For each star value (5 down to 1): count the reviews with that rating,
// divide by the total number of reviews, and round to a whole percent.
// With no reviews we skip the division (it would be 0 / 0) and use 0%.
function getRatingBreakdown(reviews) {
  return [5, 4, 3, 2, 1].map(function (star) {
    const count = reviews.filter(function (review) {
      return Math.round(review.rating) === star
    }).length
    const percent = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
    return { star, percent }
  })
}

function ReviewsTab({ product }) {
  const reviews = product.reviews || []
  const breakdown = getRatingBreakdown(reviews)

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        <div className="text-center md:w-48 shrink-0">
          <p className="text-5xl font-bold text-gray-900">{product.ratingsAverage}</p>
          <Stars rating={product.ratingsAverage} className="mt-2 text-lg" />
          <p className="mt-2 text-sm text-gray-500">Based on {reviews.length} reviews</p>
        </div>

        <ul className="flex flex-1 flex-col gap-3">
          {breakdown.map(function (row) {
            return (
              <li key={row.star} className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-12 shrink-0 whitespace-nowrap">{row.star} star</span>
                <div className="h-2 flex-1 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-yellow-400"
                    style={{ width: `${row.percent}%` }}
                  ></div>
                </div>
                <span className="w-10 shrink-0 text-end">{row.percent}%</span>
              </li>
            )
          })}
        </ul>
      </div>

      <hr className="my-6 border-gray-200" />

      {reviews.length === 0 ? (
        <div className="py-8 text-center">
          <i className="fa-solid fa-star text-5xl text-gray-300"></i>
          <p className="mt-3 font-medium text-gray-700">No reviews yet</p>
          <p className="mt-1 text-sm text-gray-500">Be the first to review this product</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {reviews.map(function (review) {
            const name = review.user?.name || 'Anonymous'
            return (
              <li key={review._id} className="rounded-xl bg-gray-50 p-4 md:p-5">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 shrink-0 rounded-full bg-green-500 font-semibold uppercase text-white flex items-center justify-center">
                    {name.charAt(0)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{name}</p>
                    <Stars rating={review.rating} className="text-xs" />
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-3 text-gray-600">{review.review}</p>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function ShippingTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {shippingInfo.map(function (box) {
        return (
          <div key={box.title} className="rounded-xl bg-gray-50 p-5">
            <h4 className="mb-3 font-medium text-gray-900">{box.title}</h4>
            <CheckList items={box.lines} />
          </div>
        )
      })}
    </div>
  )
}

export default function ProductTabs({ product, description }) {
  // Which tab is open: 'details', 'reviews' or 'shipping'.
  const [activeTab, setActiveTab] = useState('details')

  // In this tab we count the reviews actually returned (product.reviews.length), not
  // ratingsQuantity: the API's ratingsQuantity can differ from the real list, and the
  // bars and cards are built from the list, so all numbers in the tab should agree.
  const reviewCount = (product.reviews || []).length

  const tabs = [
    { id: 'details', label: 'Product Details', icon: 'fa-box' },
    { id: 'reviews', label: `Reviews (${reviewCount})`, icon: 'fa-star' },
    { id: 'shipping', label: 'Shipping & Returns', icon: 'fa-truck' },
  ]

  return (
    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* overflow-x-auto lets the tab bar scroll sideways on narrow screens */}
      <div className="flex overflow-x-auto border-b border-gray-200">
        {tabs.map(function (tab) {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type="button"
              onClick={function () {
                setActiveTab(tab.id)
              }}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-5 py-4 font-medium transition ${
                isActive
                  ? 'border-green-600 bg-green-50 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-green-600'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="p-5 md:p-6">
        {activeTab === 'details' && <DetailsTab product={product} description={description} />}
        {activeTab === 'reviews' && <ReviewsTab product={product} />}
        {activeTab === 'shipping' && <ShippingTab />}
      </div>
    </section>
  )
}
