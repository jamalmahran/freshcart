import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

// Only logged-in users can see the page inside (children).
export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext)

  // replace: so Back doesn't return to the protected page.
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}
