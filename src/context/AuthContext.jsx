import { createContext, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

// Only reads the payload ({ id, name, role }); the server verifies the signature.
function readTokenPayload(token) {
  if (!token) return {}
  try {
    return jwtDecode(token) || {}
  } catch {
    return {}
  }
}

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}

export default function AuthProvider({ children }) {
  // Restored from localStorage so the login survives a page refresh.
  const [token, setToken] = useState(function () {
    return localStorage.getItem('token')
  })
  const [user, setUser] = useState(readStoredUser)
  const payload = readTokenPayload(token)
  const userId = payload.id || null
  const role = payload.role || null

  function login(newToken, newUser) {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  // Changes the saved user (e.g. a new name) without touching the token.
  function updateUser(newUser) {
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, userId, role, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
