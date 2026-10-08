import { useRef } from 'react'
import ProductCard from '../ProductCard'
import SectionTitle from '../home/SectionTitle'

const arrowClass =
  'h-10 w-10 rounded-full border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:border-green-600 hover:text-green-600'

export default function RelatedProducts({ products }) {
  // useRef gives us a direct handle to a DOM element (the scrolling row here).
  // Unlike state, changing a ref doesn't re-render; we only use it to call scrollBy.
  const rowRef = useRef(null)

  // scrollBy moves the row by one "page" (its visible width), left or right.
  // behavior: 'smooth' animates the scroll instead of jumping.
  function scrollRow(direction) {
    const row = rowRef.current
    row.scrollBy({ left: direction * row.clientWidth, behavior: 'smooth' })
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <SectionTitle title="You May Also" highlight="Like" />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={function () {
              scrollRow(-1)
            }}
            aria-label="Previous products"
            className={arrowClass}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            type="button"
            onClick={function () {
              scrollRow(1)
            }}
            aria-label="Next products"
            className={arrowClass}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Each card takes 1/1, 1/4 or 1/5 of the row width (minus the gaps).
          snap classes make the row stop neatly on a card edge. */}
      <div
        ref={rowRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none]"
      >
        {products.map(function (product) {
          return (
            <div
              key={product._id}
              className="w-full shrink-0 snap-start md:w-[calc((100%-3rem)/4)] lg:w-[calc((100%-4rem)/5)]"
            >
              <ProductCard product={product} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
