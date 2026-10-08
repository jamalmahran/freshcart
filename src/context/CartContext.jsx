import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from './AuthContext'

const API_BASE = 'https://ecommerce.routemisr.com/api/v1'

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext(null)

// The cart API identifies the user by a header literally named "token"
// (not "Authorization: Bearer ..."). axios sends whatever we put in `headers`.
function authHeaders(token) {
  return { headers: { token } }
}

// Some endpoints (e.g. POST /cart) return each item's product as just an id string.
// We need the full product (title, image...) to render the cart.
function hasFullProducts(data) {
  return (data?.products || []).every(function (item) {
    return item.product !== null && typeof item.product === 'object'
  })
}

async function fetchCart(token) {
  const response = await axios.get(`${API_BASE}/cart`, authHeaders(token))
  return response.data
}

// "owner" = the token this cart was loaded for. If the token changes (logout, or
// another user logs in), the stored cart no longer belongs to them and is hidden.
const emptyState = { owner: null, cart: null, numOfCartItems: 0, cartId: null }

function toCartState(owner, body) {
  return { owner, cart: body.data, numOfCartItems: body.numOfCartItems, cartId: body.cartId }
}

export default function CartProvider({ children }) {
  const { token } = useContext(AuthContext)
  const [cartState, setCartState] = useState(emptyState)
  // Id of the product currently being added, so its button can show a spinner.
  const [addingId, setAddingId] = useState(null)

  // Load the cart whenever the token changes (i.e. when a user logs in).
  useEffect(
    function () {
      if (!token) return
      let ignore = false

      async function loadCart() {
        try {
          const body = await fetchCart(token)
          if (!ignore) setCartState(toCartState(token, body))
        } catch (error) {
          // A user who never added anything has no cart yet; treat any failure as empty.
          if (error.response?.status !== 404) console.error('Failed to load cart:', error)
          if (!ignore) setCartState({ ...emptyState, owner: token })
        }
      }

      loadCart()
      return function () {
        ignore = true
      }
    },
    [token]
  )

  // Derived values instead of extra state: the cart is "ours" only if it was loaded
  // for the current token. Logging out (token = null) therefore resets everything
  // instantly, and a new user never sees the previous user's cart for a moment.
  const isCurrent = Boolean(token) && cartState.owner === token
  const loading = Boolean(token) && cartState.owner !== token

  async function getCart() {
    try {
      const body = await fetchCart(token)
      setCartState(toCartState(token, body))
    } catch (error) {
      if (error.response?.status === 404) {
        setCartState({ ...emptyState, owner: token })
      } else {
        throw error
      }
    }
  }

  // We update our state from the API's answer (not by editing it ourselves), so the
  // UI always shows exactly what the server saved: prices, counts and totals included.
  async function applyResponse(body) {
    if (hasFullProducts(body.data)) {
      setCartState(toCartState(token, body))
    } else {
      await getCart()
    }
  }

  async function addToCart(productId) {
    setAddingId(productId)
    try {
      const response = await axios.post(`${API_BASE}/cart`, { productId }, authHeaders(token))
      await applyResponse(response.data)
      return response.data
    } finally {
      setAddingId(null)
    }
  }

  async function updateCount(productId, count) {
    const response = await axios.put(`${API_BASE}/cart/${productId}`, { count }, authHeaders(token))
    await applyResponse(response.data)
    return response.data
  }

  async function removeItem(productId) {
    const response = await axios.delete(`${API_BASE}/cart/${productId}`, authHeaders(token))
    await applyResponse(response.data)
    return response.data
  }

  async function clearCart() {
    const response = await axios.delete(`${API_BASE}/cart`, authHeaders(token))
    setCartState({ ...emptyState, owner: token })
    return response.data
  }

  const value = {
    cart: isCurrent ? cartState.cart : null,
    numOfCartItems: isCurrent ? cartState.numOfCartItems : 0,
    cartId: isCurrent ? cartState.cartId : null,
    loading,
    addingId,
    getCart,
    addToCart,
    updateCount,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
