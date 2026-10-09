import { createContext, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

// Context lets components share data without passing props through every level.
// createContext() makes the "channel"; the Provider below puts values into it;
// any component inside the Provider can read them with useContext(AuthContext).
// (This file exports a non-component too, which only affects hot reload of this one file.)
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

// A JWT (JSON Web Token) is 3 base64 parts: header.payload.signature.
// jwtDecode reads the middle part (the payload), here { id, name, role }.
// It does NOT verify the signature; that's the server's job. We only need the id.
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
  // Passing a function to useState runs it only on the first render, so we read
  // localStorage once and the login survives a page refresh.
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
