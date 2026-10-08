import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import { fetchUserOrders } from '../api/orders'
import OrderCard from '../components/orders/OrderCard'

export default function AllOrders() {
  const { token, userId } = useContext(AuthContext)
  const { getCart } = useContext(CartContext)

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  // Only one order can be open at a time: we store the id of the open one.
  const [openOrderId, setOpenOrderId] = useState(null)

  useEffect(
    function () {
      if (!userId) return
      let ignore = false

      async function loadOrders() {
        try {
          const data = await fetchUserOrders(userId, token)
          const newestFirst = [...data].sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt)
          })
          if (!ignore) setOrders(newestFirst)
        } catch (error) {
          console.error('Failed to load orders:', error)
        } finally {
          if (!ignore) setLoading(false)
        }
      }

      loadOrders()
      // After an online payment the server empties the cart, so refresh our copy
      // (otherwise the navbar badge would still show the old count).
      getCart().catch(function (error) {
        console.error('Failed to refresh cart:', error)
      })

      return function () {
        ignore = true
      }
    },
    [userId, token, getCart]
  )

  function toggleOrder(orderId) {
    setOpenOrderId(openOrderId === orderId ? null : orderId)
  }

  if (loading && userId) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center">
          <i className="fa-solid fa-bag-shopping text-5xl text-gray-300"></i>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">No orders yet</h1>
        <p className="mt-2 text-gray-500">When you place an order, it will show up here.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-3.5 font-semibold text-white shadow-lg shadow-green-600/25 hover:from-green-700 hover:to-green-800"
        >
          Start Shopping
          <i className="fa-solid fa-arrow-right"></i>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
        <Link to="/" className="hover:text-green-600">
          Home
        </Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-gray-900">My Orders</span>
      </nav>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-green-500 text-white text-xl shadow-md shadow-green-500/30 flex items-center justify-center">
            <i className="fa-solid fa-bag-shopping"></i>
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500">Track and manage your {orders.length} orders</p>
          </div>
        </div>
        <Link to="/products" className="text-sm font-medium text-green-600 hover:underline">
          <i className="fa-solid fa-bag-shopping me-2"></i>
          Continue Shopping
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {orders.map(function (order) {
          return (
            <OrderCard
              key={order._id}
              order={order}
              isOpen={openOrderId === order._id}
              onToggle={function () {
                toggleOrder(order._id)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
