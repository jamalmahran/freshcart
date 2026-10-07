import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
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
      { path: 'cart', element: <Cart /> },
      { path: 'categories', element: <Categories /> },
      { path: 'brands', element: <Brands /> },
      { path: 'wishlist', element: <Wishlist /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      // "*" matches any URL that didn't match the routes above
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
