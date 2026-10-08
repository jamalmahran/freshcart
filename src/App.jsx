import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Categories from './pages/Categories'
import Brands from './pages/Brands'
import Wishlist from './pages/Wishlist'
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
      // ":id" is a URL parameter: it matches any value, e.g. /products/abc123
      { path: 'products/:id', element: <ProductDetails /> },
      // Logged-in users only
      { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
      { path: 'categories', element: <Categories /> },
      { path: 'brands', element: <Brands /> },
      { path: 'wishlist', element: <ProtectedRoute><Wishlist /></ProtectedRoute> },
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
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
