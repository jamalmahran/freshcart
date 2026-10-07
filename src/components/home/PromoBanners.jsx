import { Link } from 'react-router-dom'

const banners = [
  {
    badge: 'Deal of the Day',
    badgeIcon: 'fa-fire',
    title: 'Fresh Organic Fruits',
    text: 'Get up to 40% off on selected organic fruits',
    discount: '40% OFF',
    code: 'ORGANIC40',
    button: 'Shop Now',
    bgClass: 'bg-gradient-to-br from-green-600 to-emerald-500',
    buttonClass: 'text-green-700',
  },
  {
    badge: 'New Arrivals',
    badgeIcon: 'fa-star',
    title: 'Exotic Vegetables',
    text: 'Discover our latest collection of premium vegetables',
    discount: '25% OFF',
    code: 'FRESH25',
    button: 'Explore Now',
    bgClass: 'bg-gradient-to-br from-orange-400 to-red-500',
    buttonClass: 'text-orange-600',
  },
]

export default function PromoBanners() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {banners.map(function (banner) {
        return (
          <div
            key={banner.title}
            className={`relative overflow-hidden rounded-2xl p-6 md:p-8 text-white ${banner.bgClass}`}
          >
            {/* Decorative circles in the corner */}
            <span className="absolute -top-10 -end-10 h-40 w-40 rounded-full bg-white/10"></span>
            <span className="absolute -bottom-12 end-16 h-28 w-28 rounded-full bg-white/10"></span>

            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                <i className={`fa-solid ${banner.badgeIcon}`}></i>
                {banner.badge}
              </span>
              <h3 className="mt-3 text-xl md:text-2xl font-bold">{banner.title}</h3>
              <p className="mt-1 text-sm text-white/85">{banner.text}</p>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-3xl md:text-4xl font-extrabold">{banner.discount}</span>
                <span className="pb-1 text-xs text-white/85">Use code: {banner.code}</span>
              </div>
              <Link
                to="/products"
                className={`mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold hover:bg-gray-100 ${banner.buttonClass}`}
              >
                {banner.button} <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        )
      })}
    </section>
  )
}
