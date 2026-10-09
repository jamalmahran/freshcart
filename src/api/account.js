import axios from 'axios'

const API_BASE = 'https://ecommerce.routemisr.com/api/v1'

// TEMP: logs the first response of each endpoint so we can check its real shape.
const loggedEndpoints = new Set()
function logOnce(label, body) {
  if (!loggedEndpoints.has(label)) {
    loggedEndpoints.add(label)
    console.log(`Account API ${label}:`, body)
  }
}

function authHeaders(token) {
  return { headers: { token } }
}

// ---------- Addresses ----------

export async function fetchAddresses(token) {
  const response = await axios.get(`${API_BASE}/addresses`, authHeaders(token))
  logOnce('GET /addresses', response.data)
  return response.data.data || []
}

export async function addAddress(address, token) {
  const response = await axios.post(`${API_BASE}/addresses`, address, authHeaders(token))
  logOnce('POST /addresses', response.data)
  return response.data
}

export async function deleteAddress(addressId, token) {
  const response = await axios.delete(`${API_BASE}/addresses/${addressId}`, authHeaders(token))
  logOnce('DELETE /addresses/:id', response.data)
  return response.data
}

// ---------- Profile ----------

export async function updateMe(changes, token) {
  const response = await axios.put(`${API_BASE}/users/updateMe/`, changes, authHeaders(token))
  logOnce('PUT /users/updateMe', response.data)
  return response.data
}

export async function changeMyPassword(passwords, token) {
  const response = await axios.put(`${API_BASE}/users/changeMyPassword`, passwords, authHeaders(token))
  logOnce('PUT /users/changeMyPassword', response.data)
  return response.data
}
