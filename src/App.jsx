import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './context/AuthContext'
import CartProvider from './context/CartContext'
import WishlistProvider from './context/WishlistContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Search from './pages/Search'
import Cart from './pages/Cart'
import Categories from './pages/Categories'
import Brands from './pages/Brands'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import AllOrders from './pages/AllOrders'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    // Children render inside Layout's <Outlet />.
    // Child paths without a leading "/" are relative to the parent ("/").
    children: [
      // index: true = the default child, shown at exactly "/"
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'search', element: <Search /> },
      // ":id" is a URL parameter: it matches any value, e.g. /products/abc123
      { path: 'products/:id', element: <ProductDetails /> },
      // Logged-in users only
      { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
      { path: 'categories', element: <Categories /> },
      { path: 'brands', element: <Brands /> },
      { path: 'wishlist', element: <ProtectedRoute><Wishlist /></ProtectedRoute> },
      { path: 'checkout', element: <ProtectedRoute><Checkout /></ProtectedRoute> },
      { path: 'allorders', element: <ProtectedRoute><AllOrders /></ProtectedRoute> },
      // Logged-out users only
      { path: 'login', element: <GuestRoute><Login /></GuestRoute> },
      { path: 'register', element: <GuestRoute><Register /></GuestRoute> },
      // "*" matches any URL that didn't match the routes above
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  // Everything inside AuthProvider (the whole app) can read the auth context.
  // CartProvider sits inside it because the cart needs the token.
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <RouterProvider router={router} />
          {/* Toaster renders the little pop-up messages from toast.success() / toast.error() */}
          <Toaster position="top-right" />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}
