import { Link, NavLink, Outlet } from 'react-router-dom'

const tabs = [
  { name: 'My Addresses', path: '/profile/addresses', icon: 'fa-location-dot' },
  { name: 'Settings', path: '/profile/settings', icon: 'fa-gear' },
]

export default function Profile() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ---------- Green header ---------- */}
      <div className="bg-gradient-to-br from-green-600 via-green-500 to-green-400 text-white">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <nav aria-label="Breadcrumb" className="text-sm text-green-50">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-white">My Account</span>
          </nav>
          <div className="mt-5 flex items-center gap-4">
            <span className="h-14 w-14 md:h-16 md:w-16 shrink-0 rounded-2xl bg-white/20 text-2xl md:text-3xl shadow-lg backdrop-blur flex items-center justify-center">
              <i className="fa-solid fa-user"></i>
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Account</h1>
              <p className="mt-1 text-green-50">Manage your addresses and account settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* ---------- Sidebar (on top on mobile) ---------- */}
          <aside className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <h2 className="border-b border-gray-100 px-5 py-4 font-bold text-gray-900">My Account</h2>
            <ul className="flex flex-col gap-1 p-2">
              {tabs.map(function (tab) {
                return (
                  <li key={tab.path}>
                    <NavLink
                      to={tab.path}
                      className={function ({ isActive }) {
                        return `flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                          isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }}
                    >
                      {function ({ isActive }) {
                        return (
                          <>
                            <span
                              className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${
                                isActive ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              <i className={`fa-solid ${tab.icon}`}></i>
                            </span>
                            <span className="flex-1">{tab.name}</span>
                            <i className={`fa-solid fa-chevron-right text-xs ${isActive ? 'text-green-600' : 'text-gray-400'}`}></i>
                          </>
                        )
                      }}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </aside>

          {/* ---------- Active tab ---------- */}
          <section className="lg:col-span-3 min-w-0">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  )
}
