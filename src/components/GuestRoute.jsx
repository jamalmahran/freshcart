import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

// Only logged-out users can see the page inside (Login, Register).
export default function GuestRoute({ children }) {
  const { token } = useContext(AuthContext)

  if (token) {
    return <Navigate to="/" replace />
  }

  return children
}
