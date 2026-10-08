import { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import { createCashOrder, createCheckoutSession, fetchUserOrders } from '../api/orders'
import ShippingAddressCard from '../components/checkout/ShippingAddressCard'
import PaymentMethodCard from '../components/checkout/PaymentMethodCard'
import CheckoutSummary from '../components/checkout/CheckoutSummary'

const addressSchema = z.object({
  city: z.string().trim().min(2, 'City must be at least 2 characters'),
  details: z.string().trim().min(5, 'Street address must be at least 5 characters'),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, 'Please enter a valid Egyptian phone number'),
})

// Builds a list of unique addresses (same city + details + phone = same address)
// from the user's previous orders, newest first.
function getSavedAddresses(orders) {
  const sorted = [...orders].sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
  const seen = new Set()
  const addresses = []

  sorted.forEach(function (order) {
    const address = order.shippingAddress
    if (!address?.city || !address?.details || !address?.phone) return
    const key = `${address.city}|${address.details}|${address.phone}`.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    addresses.push({ city: address.city, details: address.details, phone: address.phone })
  })

  return addresses
}

export default function Checkout() {
  const { token, userId } = useContext(AuthContext)
  const { cart, cartId, numOfCartItems, loading: cartLoading, resetCart } = useContext(CartContext)
  const navigate = useNavigate()

  const [savedAddresses, setSavedAddresses] = useState([])
  const [addressesLoading, setAddressesLoading] = useState(true)
  // null = the user hasn't picked yet (we then default to the first saved address).
  const [addressChoice, setAddressChoice] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [placing, setPlacing] = useState(false)
  // Set after a cash order, so emptying the cart doesn't trigger the "go to /cart" redirect.
  const [orderPlaced, setOrderPlaced] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: { city: '', details: '', phone: '' },
  })

  // Load previous orders once to offer their addresses as "Saved Addresses".
  useEffect(
    function () {
      if (!userId) return
      let ignore = false

      async function loadAddresses() {
        try {
          const orders = await fetchUserOrders(userId, token)
          if (!ignore) setSavedAddresses(getSavedAddresses(orders))
        } catch (error) {
          console.error('Failed to load saved addresses:', error)
        } finally {
          if (!ignore) setAddressesLoading(false)
        }
      }

      loadAddresses()
      return function () {
        ignore = true
      }
    },
    [userId, token]
  )

  const choice = addressChoice !== null ? addressChoice : savedAddresses.length > 0 ? 0 : 'manual'
  const isOnline = paymentMethod === 'online'

  async function submitOrder(shippingAddress) {
    if (!cartId) {
      toast.error('Your cart could not be found. Please refresh the page.')
      return
    }

    setPlacing(true)
    try {
      if (isOnline) {
        const body = await createCheckoutSession(cartId, shippingAddress, token)
        const sessionUrl = body.session?.url
        if (!sessionUrl) throw new Error('No payment link was returned. Please try again.')
        // Stripe is a different website, so we leave our app completely with
        // window.location.href. navigate() only moves between routes inside our app.
        window.location.href = sessionUrl
        return
      }

      await createCashOrder(cartId, shippingAddress, token)
      setOrderPlaced(true)
      // The server already emptied the cart; empty our copy too so the badge updates.
      resetCart()
      toast.success('Order placed successfully!')
      navigate('/allorders')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not place the order')
      setPlacing(false)
    }
  }

  function handlePlaceOrder() {
    if (choice === 'manual') {
      // handleSubmit(onValid, onInvalid) returns a function; we call it right away
      // because the button lives outside the <form>.
      handleSubmit(
        function (values) {
          submitOrder({ details: values.details.trim(), phone: values.phone, city: values.city.trim() })
        },
        function () {
          toast.error('Please complete the shipping address')
        }
      )()
    } else {
      submitOrder(savedAddresses[choice])
    }
  }

  if (cartLoading || orderPlaced) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
      </div>
    )
  }

  const items = (cart?.products || []).filter(function (item) {
    return item.product !== null && typeof item.product === 'object'
  })

  // Nothing to check out: send the user back to the cart page.
  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
          <Link to="/" className="hover:text-green-600">
            Home
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link to="/cart" className="hover:text-green-600">
            Cart
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-900">Checkout</span>
        </nav>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-12 w-12 rounded-xl bg-green-600 text-white text-xl shadow-md shadow-green-600/30 flex items-center justify-center">
                <i className="fa-solid fa-receipt"></i>
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Complete Your Order</h1>
            </div>
            <p className="mt-2 text-gray-500">Review your items and complete your purchase</p>
          </div>
          <Link to="/cart" className="font-medium text-green-600 hover:underline">
            <i className="fa-solid fa-arrow-left me-2"></i>
            Back to Cart
          </Link>
        </div>

        <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ShippingAddressCard
              loading={addressesLoading && Boolean(userId)}
              savedAddresses={savedAddresses}
              choice={choice}
              onChoose={setAddressChoice}
              register={register}
              errors={errors}
            />
            <PaymentMethodCard method={paymentMethod} onChange={setPaymentMethod} />
          </div>

          <CheckoutSummary
            items={items}
            itemsCount={numOfCartItems}
            total={cart.totalCartPrice}
            placing={placing}
            isOnline={isOnline}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
    </div>
  )
}
