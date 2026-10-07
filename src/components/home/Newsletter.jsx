import { useState } from 'react'

const perks = [
  { icon: 'fa-seedling', text: 'Fresh Picks Weekly' },
  { icon: 'fa-truck', text: 'Free Delivery Codes' },
  { icon: 'fa-tag', text: 'Members-Only Deals' },
]

const stores = [
  { icon: 'fa-apple', small: 'DOWNLOAD ON', name: 'App Store' },
  { icon: 'fa-google-play', small: 'GET IT ON', name: 'Google Play' },
]

export default function Newsletter() {
  const [email, setEmail] = useState('')
  // null = no message yet, otherwise { type: 'success' | 'error', text: '...' }
  const [message, setMessage] = useState(null)

  // Controlled input: the input shows whatever is in `email` (value={email}),
  // and every keystroke updates that state through onChange.
  function handleEmailChange(event) {
    setEmail(event.target.value)
  }

  function handleSubmit(event) {
    // Stop the browser's default form submit, which would reload the page.
    event.preventDefault()

    if (email.includes('@') && email.includes('.')) {
      setMessage({ type: 'success', text: 'Thanks for subscribing!' })
      setEmail('')
    } else {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' })
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-50 bg-gray-50/60 p-6 md:p-10 lg:p-14 shadow-sm">
      {/* Soft blurred glows in the corners (decoration only) */}
      <span className="absolute -top-20 -end-20 h-64 w-64 rounded-full bg-emerald-200 opacity-40 blur-3xl"></span>
      <span className="absolute -bottom-20 -start-20 h-64 w-64 rounded-full bg-emerald-200 opacity-40 blur-3xl"></span>
      <span className="absolute -bottom-24 -end-10 h-64 w-64 rounded-full bg-rose-200 opacity-30 blur-3xl"></span>

      <div className="relative flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* ---------- Left: newsletter ---------- */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white text-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <i className="fa-solid fa-envelope"></i>
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-emerald-600">NEWSLETTER</p>
              <p className="text-xs text-gray-500">50,000+ subscribers</p>
            </div>
          </div>

          <h2 className="mt-6 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Get the Freshest Updates <span className="text-emerald-600">Delivered Free</span>
          </h2>
          <p className="mt-3 text-gray-500 md:text-lg">
            Weekly recipes, seasonal offers &amp; exclusive member perks.
          </p>

          <ul className="mt-5 flex flex-col items-start sm:flex-row sm:flex-wrap gap-3">
            {perks.map(function (perk) {
              return (
                <li
                  key={perk.text}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm"
                >
                  <span className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-600 text-xs flex items-center justify-center">
                    <i className={`fa-solid ${perk.icon}`}></i>
                  </span>
                  {perk.text}
                </li>
              )
            })}
          </ul>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              placeholder="you@example.com"
              className="w-full flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-700 hover:to-emerald-600"
            >
              Subscribe <i className="fa-solid fa-arrow-right ms-2"></i>
            </button>
          </form>

          {/* Conditional rendering: show the message only after a submit */}
          {message && (
            <p
              className={`mt-2 text-sm font-medium ${
                message.type === 'success' ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {message.text}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-400">✨ Unsubscribe anytime. No spam, ever.</p>
        </div>

        {/* Thin vertical divider, only when the two parts are side by side */}
        <div className="hidden md:block w-px bg-emerald-100"></div>

        {/* ---------- Right: mobile app card ---------- */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 md:p-8 md:w-2/5">
          <span className="absolute -top-12 -end-12 h-40 w-40 rounded-full bg-emerald-500 opacity-25 blur-3xl"></span>
          <span className="absolute -bottom-12 -start-12 h-32 w-32 rounded-full bg-emerald-500 opacity-20 blur-3xl"></span>

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <i className="fa-solid fa-mobile-screen"></i>
              MOBILE APP
            </span>
            <h3 className="mt-4 text-xl md:text-2xl font-bold text-white">Shop Faster on Our App</h3>
            <p className="mt-3 text-sm text-gray-400">
              Get app-exclusive deals &amp; 15% off your first order.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {stores.map(function (store) {
                return (
                  <a
                    key={store.name}
                    href="#"
                    className="flex w-full items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white hover:bg-white/10"
                  >
                    <i className={`fa-brands ${store.icon} text-xl`}></i>
                    <span className="leading-tight">
                      <span className="block text-[10px] text-gray-400">{store.small}</span>
                      <span className="block text-sm font-semibold">{store.name}</span>
                    </span>
                  </a>
                )
              })}
            </div>

            <p className="mt-6 text-sm text-gray-400">
              <span className="text-yellow-400">★★★★★</span> 4.9 · 100K+ downloads
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
