import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

// "end" makes Home active only on exactly "/", not on every page.
const links = [
  { name: 'Home', path: '/', end: true },
  { name: 'Shop', path: '/products' },
  { name: 'Categories', path: '/categories' },
  { name: 'Brands', path: '/brands' },
]

// NavLink calls this function with { isActive }, which is true when the
// link's path matches the current URL, so we can style the active page differently.
function getLinkClass({ isActive }) {
  return isActive
    ? 'text-green-600 font-semibold'
    : 'text-gray-600 hover:text-green-600'
}

function SearchBar() {
  // Stop the browser from reloading the page when Enter is pressed (no search logic yet).
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        placeholder="Search for products, brands and more..."
        className="w-full rounded-full border border-gray-300 py-2 ps-4 pe-12 text-sm focus:outline-none focus:border-green-600"
      />
      <button
        type="button"
        className="absolute end-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-green-600 text-white hover:bg-green-700"
      >
        <i className="fa-solid fa-magnifying-glass text-sm"></i>
      </button>
    </form>
  )
}

// ---------- Mobile menu helpers ----------

// Wishlist / Cart rows with a colored icon circle and a count badge (0 for now).
const mobileShortcuts = [
  {
    name: 'Wishlist',
    path: '/wishlist',
    icon: 'fa-regular fa-heart',
    iconClass: 'bg-red-50 text-red-500',
    badgeClass: 'bg-red-500',
    count: 0,
  },
  {
    name: 'Cart',
    path: '/cart',
    icon: 'fa-solid fa-cart-shopping',
    iconClass: 'bg-green-50 text-green-600',
    badgeClass: 'bg-green-600',
    count: 0,
  },
]

// Logged-out state for now; later this becomes the user name + Sign Out.
const mobileAccountLinks = [
  { name: 'Login', path: '/login', icon: 'fa-regular fa-user', iconClass: 'bg-gray-100 text-gray-500' },
  { name: 'Register', path: '/register', icon: 'fa-solid fa-user-plus', iconClass: 'bg-green-50 text-green-600' },
]

function getMobileLinkClass({ isActive }) {
  const base = 'flex items-center gap-3 rounded-lg px-4 py-2.5 transition'
  return isActive
    ? `${base} bg-green-50 text-green-600 font-semibold`
    : `${base} text-gray-700 hover:bg-gray-50`
}

function MobileSearchBar() {
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 ps-4 pe-12 text-sm focus:outline-none focus:border-green-600"
      />
      <button
        type="button"
        className="absolute end-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        <i className="fa-solid fa-magnifying-glass text-sm"></i>
      </button>
    </form>
  )
}

export default function Navbar() {
  // isOpen remembers whether the mobile menu is open (starts closed).
  const [isOpen, setIsOpen] = useState(false)

  // Toggle: set isOpen to the opposite of its current value.
  function toggleMenu() {
    setIsOpen(!isOpen)
  }

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <i className="fa-solid fa-cart-shopping text-green-600"></i>
          FreshCart
        </Link>

        <div className="hidden lg:block flex-1 max-w-xl">
          <SearchBar />
        </div>

        <ul className="hidden lg:flex items-center gap-6">
          {links.map(function (link) {
            return (
              <li key={link.path}>
                <NavLink to={link.path} end={link.end} className={getLinkClass}>
                  {link.name}
                </NavLink>
              </li>
            )
          })}
        </ul>

        <div className="hidden xl:flex items-center gap-2">
          <i className="fa-solid fa-headset text-2xl text-green-600"></i>
          <div className="leading-tight">
            <p className="text-xs text-gray-500">Support</p>
            <p className="text-sm font-semibold text-gray-800">24/7 Help</p>
          </div>
        </div>

        <div className="ms-auto flex items-center gap-5 text-xl text-gray-600">
          <Link to="/wishlist" className="hover:text-green-600" aria-label="Wishlist">
            <i className="fa-regular fa-heart"></i>
          </Link>
          <Link to="/cart" className="relative hover:text-green-600" aria-label="Cart">
            <i className="fa-solid fa-cart-shopping"></i>
            <span className="absolute -top-2 -end-2 h-4 w-4 rounded-full bg-green-600 text-white text-[10px] flex items-center justify-center">
              0
            </span>
          </Link>
          <Link to="/login" className="hover:text-green-600" aria-label="Account">
            <i className="fa-regular fa-user"></i>
          </Link>

          <button
            type="button"
            onClick={toggleMenu}
            className="lg:hidden w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700"
            aria-label="Toggle menu"
          >
            <i className={isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
          </button>
        </div>
      </div>

      {/* Conditional rendering with &&: if isOpen is true, React renders the
          element after &&; if it's false, nothing is rendered. */}
      {isOpen && (
        <div className="lg:hidden">
          {/* Dark overlay behind the drawer; clicking it closes the menu */}
          <div className="fixed inset-0 bg-black/40" onClick={closeMenu}></div>

          {/* The drawer panel itself, fixed to the right side of the screen */}
          <aside className="fixed top-0 end-0 h-full w-80 max-w-[85%] bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between bg-gray-50 px-4 py-4 border-b border-gray-100">
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center gap-2 text-2xl font-bold text-gray-900"
              >
                <i className="fa-solid fa-cart-shopping text-green-600"></i>
                FreshCart
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                className="h-9 w-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                aria-label="Close menu"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-4 border-b border-gray-100">
              <MobileSearchBar />
            </div>

            <div className="p-4 flex flex-col gap-4">
              <ul className="flex flex-col gap-1">
                {links.map(function (link) {
                  return (
                    <li key={link.path}>
                      <NavLink
                        to={link.path}
                        end={link.end}
                        className={getMobileLinkClass}
                        onClick={closeMenu}
                      >
                        {link.name}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>

              <ul className="flex flex-col gap-1 border-t border-gray-100 pt-4">
                {mobileShortcuts.map(function (item) {
                  return (
                    <li key={item.path}>
                      <NavLink to={item.path} className={getMobileLinkClass} onClick={closeMenu}>
                        <span className={`h-9 w-9 rounded-full flex items-center justify-center ${item.iconClass}`}>
                          <i className={item.icon}></i>
                        </span>
                        {item.name}
                        <span className={`ms-auto min-w-6 h-6 px-1.5 rounded-full text-xs font-bold text-white flex items-center justify-center ${item.badgeClass}`}>
                          {item.count}
                        </span>
                      </NavLink>
                    </li>
                  )
                })}
              </ul>

              <ul className="flex flex-col gap-1 border-t border-gray-100 pt-4">
                {mobileAccountLinks.map(function (item) {
                  return (
                    <li key={item.path}>
                      <NavLink to={item.path} className={getMobileLinkClass} onClick={closeMenu}>
                        <span className={`h-9 w-9 rounded-full flex items-center justify-center ${item.iconClass}`}>
                          <i className={item.icon}></i>
                        </span>
                        {item.name}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>

              <a
                href="#"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                <span className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="fa-solid fa-headset"></i>
                </span>
                <span>
                  <span className="block text-sm font-semibold text-gray-800">Need Help?</span>
                  <span className="block text-sm text-green-600">Contact Support</span>
                </span>
              </a>
            </div>
          </aside>
        </div>
      )}
    </nav>
  )
}
