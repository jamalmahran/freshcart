import axios from 'axios'

const API_BASE = 'https://ecommerce.routemisr.com/api/v1'

function authHeaders(token) {
  return { headers: { token } }
}

// ---------- Addresses ----------

export async function fetchAddresses(token) {
  const response = await axios.get(`${API_BASE}/addresses`, authHeaders(token))
  return response.data.data || []
}

export async function addAddress(address, token) {
  const response = await axios.post(`${API_BASE}/addresses`, address, authHeaders(token))
  return response.data
}

export async function deleteAddress(addressId, token) {
  const response = await axios.delete(`${API_BASE}/addresses/${addressId}`, authHeaders(token))
  return response.data
}

// ---------- Profile ----------

export async function updateMe(changes, token) {
  const response = await axios.put(`${API_BASE}/users/updateMe/`, changes, authHeaders(token))
  return response.data
}

export async function changeMyPassword(passwords, token) {
  const response = await axios.put(`${API_BASE}/users/changeMyPassword`, passwords, authHeaders(token))
  return response.data
}
