import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <>
      <TopBar />
      <Navbar />
      {/* No container here: each page adds its own, so Home's hero can be full width */}
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
