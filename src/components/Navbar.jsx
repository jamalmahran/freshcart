import { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import { WishlistContext } from '../context/WishlistContext'
import { fetchAll } from '../api/catalog'

// "end" makes Home active only on exactly "/", not on every page.
const links = [
  { name: 'Home', path: '/', end: true },
  { name: 'Shop', path: '/products' },
  { name: 'Categories', path: '/categories' },
  { name: 'Brands', path: '/brands' },
]

function getLinkClass({ isActive }) {
  return isActive
    ? 'text-green-600 font-semibold'
    : 'text-gray-600 hover:text-green-600'
}

// Shared logic for both search boxes: keep the typed text in state and,
// on submit, go to /search?q=<text>. onDone lets the mobile menu close itself.
function useSearchBox(onDone) {
  const [text, setText] = useState('')
  const navigate = useNavigate()

  function handleChange(event) {
    setText(event.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const query = text.trim()
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search')
    if (onDone) onDone()
  }

  return { text, handleChange, handleSubmit }
}

function SearchBar() {
  const { text, handleChange, handleSubmit } = useSearchBox()

  return (
    <form onSubmit={handleSubmit} role="search" className="relative w-full">
      <input
        type="search"
        value={text}
        onChange={handleChange}
        aria-label="Search products"
        placeholder="Search for products, brands and more..."
        className="w-full rounded-full border border-gray-300 py-2 ps-4 pe-12 text-sm focus:outline-none focus:border-green-600"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute end-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-green-600 text-white hover:bg-green-700"
      >
        <i className="fa-solid fa-magnifying-glass text-sm"></i>
      </button>
    </form>
  )
}

// The categories shown in the dropdown, in this order (matched by name, not id).
const MENU_CATEGORY_NAMES = ['Electronics', "Women's Fashion", "Men's Fashion", 'Beauty & Health']

// Desktop "Categories" dropdown: opens on hover (mouse) and on click (keyboard/touch).
function CategoriesDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const { pathname } = useLocation()
  const isActive = pathname.startsWith('/categories')

  // Load the categories once, when the navbar first appears.
  useEffect(function () {
    let ignore = false

    async function loadCategories() {
      try {
        const data = await fetchAll('categories')
        if (!ignore) setCategories(data)
      } catch (error) {
        console.error('Failed to load categories for the menu:', error)
      }
    }

    loadCategories()
    return function () {
      ignore = true
    }
  }, [])

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  function toggle() {
    setIsOpen(!isOpen)
  }

  // Pick the 4 menu categories from the fetched list, keeping the order above.
  // .filter(Boolean) drops any name that isn't found (e.g. while still loading).
  const menuCategories = MENU_CATEGORY_NAMES.map(function (name) {
    return categories.find(function (category) {
      return category.name === name
    })
  }).filter(Boolean)

  return (
    <div className="relative" onMouseEnter={open} onMouseLeave={close}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 ${getLinkClass({ isActive })}`}
      >
        Categories
        <i className={`fa-solid fa-chevron-down text-[10px] transition ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        // pt-3 is an invisible "bridge" so the mouse can move down without closing the menu.
        <div className="absolute start-0 top-full z-50 pt-3">
          <ul className="w-60 rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
            <li>
              <Link
                to="/categories"
                onClick={close}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
              >
                All Categories
              </Link>
            </li>
            {menuCategories.map(function (category) {
              return (
                <li key={category._id}>
                  <Link
                    to={`/products?category=${category._id}`}
                    onClick={close}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                  >
                    {category.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

// ---------- Mobile menu helpers ----------

// Wishlist / Cart rows with a colored icon circle and a count badge (counts come from the contexts).
const mobileShortcuts = [
  {
    name: 'Wishlist',
    path: '/wishlist',
    icon: 'fa-regular fa-heart',
    iconClass: 'bg-red-50 text-red-500',
    badgeClass: 'bg-red-500',
  },
  {
    name: 'Cart',
    path: '/cart',
    icon: 'fa-solid fa-cart-shopping',
    iconClass: 'bg-green-50 text-green-600',
    badgeClass: 'bg-green-600',
  },
]

// Shown in the mobile menu when logged out (logged in shows the name + Sign Out).
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

function MobileSearchBar({ onDone }) {
  const { text, handleChange, handleSubmit } = useSearchBox(onDone)

  return (
    <form onSubmit={handleSubmit} role="search" className="relative">
      <input
        type="search"
        value={text}
        onChange={handleChange}
        aria-label="Search products"
        placeholder="Search products..."
        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 ps-4 pe-12 text-sm focus:outline-none focus:border-green-600"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute end-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        <i className="fa-solid fa-magnifying-glass text-sm"></i>
      </button>
    </form>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  function toggleMenu() {
    setIsOpen(!isOpen)
  }

  function closeMenu() {
    setIsOpen(false)
  }

  const { token, user, logout } = useContext(AuthContext)
  // numOfCartItems is already 0 when logged out (see CartContext).
  const { numOfCartItems } = useContext(CartContext)
  // Also 0 when logged out (see WishlistContext).
  const { count: wishlistCount } = useContext(WishlistContext)
  const navigate = useNavigate()

  function handleSignOut() {
    closeMenu()
    logout()
    navigate('/login')
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
            // On desktop, "Categories" is a dropdown instead of a plain link.
            if (link.path === '/categories') {
              return (
                <li key={link.path}>
                  <CategoriesDropdown />
                </li>
              )
            }
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
          <Link to="/wishlist" className="relative hover:text-green-600" aria-label="Wishlist">
            <i className="fa-regular fa-heart"></i>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -end-2 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative hover:text-green-600" aria-label="Cart">
            <i className="fa-solid fa-cart-shopping"></i>
            {numOfCartItems > 0 && (
              <span className="absolute -top-2 -end-2 h-4 min-w-4 px-1 rounded-full bg-green-600 text-white text-[10px] flex items-center justify-center">
                {numOfCartItems}
              </span>
            )}
          </Link>

          {/* Account area: name + Sign Out when logged in, Sign In button otherwise.
              Hidden on phones, where the mobile menu shows it instead. */}
          {token ? (
            <div className="hidden md:flex items-center gap-3 text-sm">
              <Link to="/profile" className="text-gray-700 hover:text-green-600" title="My Account">
                <i className="fa-regular fa-user me-2"></i>
                {user?.name}
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-gray-200 px-4 py-2 font-medium text-gray-600 hover:border-red-200 hover:text-red-600"
              >
                <i className="fa-solid fa-right-from-bracket me-2"></i>
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              <i className="fa-regular fa-user"></i>
              Sign In
            </Link>
          )}

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
              <MobileSearchBar onDone={closeMenu} />
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
                  // Live counts from the cart and wishlist contexts.
                  const count = item.path === '/cart' ? numOfCartItems : wishlistCount
                  return (
                    <li key={item.path}>
                      <NavLink to={item.path} className={getMobileLinkClass} onClick={closeMenu}>
                        <span className={`h-9 w-9 rounded-full flex items-center justify-center ${item.iconClass}`}>
                          <i className={item.icon}></i>
                        </span>
                        {item.name}
                        {count > 0 && (
                          <span className={`ms-auto min-w-6 h-6 px-1.5 rounded-full text-xs font-bold text-white flex items-center justify-center ${item.badgeClass}`}>
                            {count}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>

              {token ? (
                <ul className="flex flex-col gap-1 border-t border-gray-100 pt-4">
                  <li>
                    <NavLink to="/profile" className={getMobileLinkClass} onClick={closeMenu}>
                      <span className="h-9 w-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                        <i className="fa-regular fa-user"></i>
                      </span>
                      {user?.name}
                    </NavLink>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-red-600 hover:bg-red-50"
                    >
                      <span className="h-9 w-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                        <i className="fa-solid fa-right-from-bracket"></i>
                      </span>
                      Sign Out
                    </button>
                  </li>
                </ul>
              ) : (
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
              )}

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
