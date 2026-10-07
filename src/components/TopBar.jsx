import { Link } from 'react-router-dom'

export default function TopBar() {
  return (
    // hidden md:block = hidden on small screens, visible from the md breakpoint up
    <div className="hidden md:block border-b border-gray-200 text-xs text-gray-500">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span>
            <i className="fa-solid fa-truck text-green-600 me-2"></i>
            Free Shipping on Orders 500 EGP
          </span>
          <span>
            <i className="fa-solid fa-gift text-green-600 me-2"></i>
            New Arrivals Daily
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span>
            <i className="fa-solid fa-phone me-2"></i>
            +1 (800) 123-4567
          </span>
          <span>
            <i className="fa-regular fa-envelope me-2"></i>
            support@freshcart.com
          </span>
          {/* Logged-out state for now; later this will show the user name + Sign Out */}
          <Link to="/login" className="hover:text-green-600">
            <i className="fa-regular fa-user me-2"></i>
            Login
          </Link>
          <Link to="/register" className="hover:text-green-600">
            <i className="fa-solid fa-user-plus me-2"></i>
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
