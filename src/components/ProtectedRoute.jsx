import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

// Only logged-in users can see the page inside (children).
export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext)

  // <Navigate> redirects as soon as it renders. "replace" swaps the current
  // history entry, so the Back button doesn't bounce the user to this page again.
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}
