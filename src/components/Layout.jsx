import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    // <>...</> is a Fragment: it groups elements without adding an extra
    // <div> to the page (a component can only return one parent element).
    <>
      <TopBar />
      <Navbar />
      {/* No container here: each page adds its own, so Home's hero can be full width */}
      <main className="min-h-screen">
        {/* Outlet is a placeholder: React Router renders the matching
            child route (Home, Cart, ...) here, so Navbar and Footer
            stay on every page. */}
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
