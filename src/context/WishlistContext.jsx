import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from './AuthContext'

const API_BASE = 'https://ecommerce.routemisr.com/api/v1'

// eslint-disable-next-line react-refresh/only-export-components
export const WishlistContext = createContext(null)

// Same "token" header as the cart API.
function authHeaders(token) {
  return { headers: { token } }
}

// POST/DELETE are expected to return only ids, GET full products.
// This accepts either and always gives back an array of id strings.
function toIds(list) {
  return (list || []).map(function (item) {
    return typeof item === 'string' ? item : item._id
  })
}

function isFullProductList(list) {
  return (list || []).every(function (item) {
    return item !== null && typeof item === 'object'
  })
}

async function fetchWishlist(token) {
  const response = await axios.get(`${API_BASE}/wishlist`, authHeaders(token))
  return response.data.data || []
}

// "owner" = the token this wishlist was loaded for (same idea as in CartContext):
// after logout or a different login, the old data is hidden immediately.
const emptyState = { owner: null, products: [], ids: [] }

export default function WishlistProvider({ children }) {
  const { token } = useContext(AuthContext)
  const [state, setState] = useState(emptyState)
  // Id of the product whose heart is being toggled, so only that button spins.
  const [togglingId, setTogglingId] = useState(null)

  // Load the wishlist whenever a user logs in (the token changes).
  useEffect(
    function () {
      if (!token) return
      let ignore = false

      async function loadWishlist() {
        try {
          const products = await fetchWishlist(token)
          if (!ignore) setState({ owner: token, products, ids: toIds(products) })
        } catch (error) {
          console.error('Failed to load wishlist:', error)
          if (!ignore) setState({ ...emptyState, owner: token })
        }
      }

      loadWishlist()
      return function () {
        ignore = true
      }
    },
    [token]
  )

  const isCurrent = Boolean(token) && state.owner === token
  const loading = Boolean(token) && state.owner !== token
  const products = isCurrent ? state.products : []
  const ids = isCurrent ? state.ids : []

  // Stable between renders (until the token changes), so pages can use it in useEffect.
  const getWishlist = useCallback(
    async function () {
      const list = await fetchWishlist(token)
      setState({ owner: token, products: list, ids: toIds(list) })
    },
    [token]
  )

  // After POST/DELETE: always trust the ids from the server. If it sent full products
  // too, use them; otherwise keep the products we have that are still in the list.
  // (A newly added product's details appear when the Wishlist page calls getWishlist.)
  function applyResponse(list) {
    const newIds = toIds(list)
    setState(function (previous) {
      const nextProducts = isFullProductList(list)
        ? list
        : previous.products.filter(function (product) {
            return newIds.includes(product._id)
          })
      return { owner: token, products: nextProducts, ids: newIds }
    })
  }

  async function addToWishlist(productId) {
    const response = await axios.post(`${API_BASE}/wishlist`, { productId }, authHeaders(token))
    applyResponse(response.data.data)
    return response.data
  }

  async function removeFromWishlist(productId) {
    const response = await axios.delete(`${API_BASE}/wishlist/${productId}`, authHeaders(token))
    applyResponse(response.data.data)
    return response.data
  }

  function isInWishlist(productId) {
    return ids.includes(productId)
  }

  // Adds or removes with toasts. Returns false when the user isn't logged in, so the
  // calling button can send them to /login (this provider sits outside the router,
  // so it can't use useNavigate itself).
  async function toggleWishlist(productId) {
    if (!token) {
      toast.error('Please sign in to use your wishlist')
      return false
    }

    setTogglingId(productId)
    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId)
        toast.success('Removed from wishlist')
      } else {
        await addToWishlist(productId)
        toast.success('Added to wishlist')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update your wishlist')
    } finally {
      setTogglingId(null)
    }
    return true
  }

  const value = {
    products,
    ids,
    count: ids.length,
    loading,
    togglingId,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
