import axios from 'axios'

const API_BASE = 'https://ecommerce.routemisr.com/api/v1'

// Same "token" header as the cart API.
function authHeaders(token) {
  return { headers: { token } }
}

export async function fetchUserOrders(userId, token) {
  const response = await axios.get(`${API_BASE}/orders/user/${userId}`, authHeaders(token))
  // This endpoint returns the array directly (not inside { data }).
  return Array.isArray(response.data) ? response.data : response.data.data || []
}

// The cartId goes in the URL path: it tells the server WHICH cart to turn into an order.
export async function createCashOrder(cartId, shippingAddress, token) {
  const response = await axios.post(
    `${API_BASE}/orders/${cartId}`,
    { shippingAddress },
    authHeaders(token)
  )
  return response.data
}

// ?url= tells the server where our site lives. Stripe uses it to send the user back
// to <url>/allorders after paying. We pass window.location.origin so it works both on
// localhost and on the deployed site.
export async function createCheckoutSession(cartId, shippingAddress, token) {
  const response = await axios.post(
    `${API_BASE}/orders/checkout-session/${cartId}`,
    { shippingAddress },
    { ...authHeaders(token), params: { url: window.location.origin } }
  )
  return response.data
}
