import { createContext, useState } from 'react'

// Context lets components share data without passing props through every level.
// createContext() makes the "channel"; the Provider below puts values into it;
// any component inside the Provider can read them with useContext(AuthContext).
// (This file exports a non-component too, which only affects hot reload of this one file.)
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

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

  function login(newToken, newUser) {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
