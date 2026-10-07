import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// Importing an image gives us its final URL after Vite builds the project.
import hero from '../../assets/hero.jpg'

const slides = [
  {
    title: 'Fresh Products Delivered to your Door',
    subtitle: 'Get 20% off your first order',
  },
  {
    title: 'Organic Fruits & Vegetables Every Day',
    subtitle: 'Farm-fresh picks at the best prices',
  },
  {
    title: 'Big Savings on Your Weekly Groceries',
    subtitle: 'Free delivery on orders over 500 EGP',
  },
]

export default function HeroSlider() {
  // Index of the slide currently shown (0, 1 or 2).
  const [current, setCurrent] = useState(0)

  function nextSlide() {
    // Passing a function to the setter gives us the latest value (prev),
    // which is safer than reading `current` inside a timer.
    setCurrent(function (prev) {
      return (prev + 1) % slides.length
    })
  }

  function prevSlide() {
    setCurrent(function (prev) {
      return (prev - 1 + slides.length) % slides.length
    })
  }

  // Auto-play: move to the next slide every 5 seconds.
  useEffect(
    function () {
      const timer = setInterval(nextSlide, 5000)

      // Cleanup function: React runs it before the effect runs again and when
      // the component is removed from the page. clearInterval stops the old
      // timer, so we never end up with several timers running at once.
      return function () {
        clearInterval(timer)
      }
    },
    // Re-run when `current` changes, so clicking an arrow or dot restarts
    // the 5-second countdown instead of jumping right after your click.
    [current]
  )

  return (
    <section className="relative overflow-hidden h-64 md:h-80 lg:h-[400px]">
      {/* The track holds all slides side by side; moving it left by
          100% per index shows one slide at a time. */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map(function (slide) {
          return (
            <div
              key={slide.title}
              className="relative w-full h-full shrink-0 flex items-center bg-cover bg-center"
              style={{ backgroundImage: `url(${hero})` }}
            >
              {/* Green overlay: strong on the left (readable text), lighter on the right (image shows) */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/95 via-green-500/70 to-green-400/40"></div>

              <div className="relative px-6 md:px-16 lg:px-20 max-w-xl">
                <h2 className="text-white font-bold text-2xl md:text-3xl lg:text-4xl leading-tight">
                  {slide.title}
                </h2>
                <p className="text-green-50 mt-2 text-sm md:text-base">{slide.subtitle}</p>
                <div className="mt-4 md:mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/products"
                    className="bg-white text-green-600 font-semibold text-sm px-5 py-2 rounded-lg hover:bg-green-50"
                  >
                    Shop Now
                  </Link>
                  <Link
                    to="/products"
                    className="bg-transparent border-2 border-white text-white font-semibold text-sm px-5 py-2 rounded-lg hover:bg-white/10"
                  >
                    View Deals
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute start-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white text-green-600 shadow hidden md:flex items-center justify-center hover:bg-green-50"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute end-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white text-green-600 shadow hidden md:flex items-center justify-center hover:bg-green-50"
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map(function (slide, index) {
          return (
            <button
              key={slide.title}
              type="button"
              onClick={function () {
                setCurrent(index)
              }}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                index === current ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
            ></button>
          )
        })}
      </div>
    </section>
  )
}
