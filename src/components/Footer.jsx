import { Link } from 'react-router-dom'

const features = [
  { icon: 'fa-truck', title: 'Free Shipping', text: 'On orders over 500 EGP' },
  { icon: 'fa-rotate-left', title: 'Easy Returns', text: '14-day return policy' },
  { icon: 'fa-shield-halved', title: 'Secure Payment', text: '100% secure checkout' },
  { icon: 'fa-headset', title: '24/7 Support', text: 'Contact us anytime' },
]

const socials = [
  { icon: 'fa-facebook-f', label: 'Facebook' },
  { icon: 'fa-x-twitter', label: 'X' },
  { icon: 'fa-instagram', label: 'Instagram' },
  { icon: 'fa-youtube', label: 'YouTube' },
]

// Links whose "to" starts with "/" are our app routes; "#" means no page yet.
const columns = [
  {
    title: 'Shop',
    links: [
      { name: 'All Products', to: '/products' },
      { name: 'Categories', to: '/categories' },
      { name: 'Brands', to: '/brands' },
      { name: 'Electronics', to: '#' },
      { name: "Men's Fashion", to: '#' },
      { name: "Women's Fashion", to: '#' },
    ],
  },
  {
    title: 'Account',
    links: [
      { name: 'My Account', to: '#' },
      // Protected route: logged-out users get sent to /login automatically.
      { name: 'Order History', to: '/allorders' },
      { name: 'Wishlist', to: '/wishlist' },
      { name: 'Shopping Cart', to: '/cart' },
      { name: 'Sign In', to: '/login' },
      { name: 'Create Account', to: '/register' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Contact Us', to: '#' },
      { name: 'Help Center', to: '#' },
      { name: 'Shipping Info', to: '#' },
      { name: 'Returns & Refunds', to: '#' },
      { name: 'Track Order', to: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', to: '#' },
      { name: 'Terms of Service', to: '#' },
      { name: 'Cookie Policy', to: '#' },
    ],
  },
]

const payments = [
  { icon: 'fa-cc-visa', label: 'Visa' },
  { icon: 'fa-cc-mastercard', label: 'Mastercard' },
  { icon: 'fa-cc-paypal', label: 'PayPal' },
]

const linkClass = 'text-sm text-gray-400 hover:text-green-500'

export default function Footer() {
  return (
    <footer>
      <div className="bg-green-50 border-y border-green-100">
        <div className="container mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(function (feature) {
            return (
              <div key={feature.title} className="flex items-center gap-3">
                <span className="h-10 w-10 shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <i className={`fa-solid ${feature.icon}`}></i>
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-slate-900 text-gray-400">
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="sm:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-white rounded-md px-3 py-2 text-xl font-bold text-gray-900"
            >
              <i className="fa-solid fa-cart-shopping text-green-600"></i>
              FreshCart
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              FreshCart is your one-stop destination for quality products. From fashion to
              electronics, we bring you the best brands at competitive prices with a
              seamless shopping experience.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <i className="fa-solid fa-phone text-green-500 me-2"></i>
                +1 (800) 123-4567
              </li>
              <li>
                <i className="fa-regular fa-envelope text-green-500 me-2"></i>
                support@freshcart.com
              </li>
              <li>
                <i className="fa-solid fa-location-dot text-green-500 me-2"></i>
                123 Commerce Street, New York, NY 10001
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              {socials.map(function (social) {
                return (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="h-9 w-9 rounded-full bg-slate-800 text-gray-300 flex items-center justify-center hover:bg-green-600 hover:text-white"
                  >
                    <i className={`fa-brands ${social.icon}`}></i>
                  </a>
                )
              })}
            </div>
          </div>

          {columns.map(function (column) {
            return (
              <div key={column.title}>
                <h4 className="text-white font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map(function (link) {
                    return (
                      <li key={link.name}>
                        {link.to === '#' ? (
                          <a href="#" className={linkClass}>{link.name}</a>
                        ) : (
                          <Link to={link.to} className={linkClass}>{link.name}</Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="border-t border-slate-800">
          <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <p>© 2026 FreshCart. All rights reserved.</p>
            <div className="flex items-center gap-4 text-2xl">
              {payments.map(function (payment) {
                return (
                  <i
                    key={payment.label}
                    className={`fa-brands ${payment.icon}`}
                    title={payment.label}
                  ></i>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
