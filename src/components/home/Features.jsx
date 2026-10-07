const features = [
  {
    icon: 'fa-truck',
    title: 'Free Shipping',
    text: 'On orders over 500 EGP',
    iconClass: 'bg-blue-50 text-blue-500',
  },
  {
    icon: 'fa-shield-halved',
    title: 'Secure Payment',
    text: '100% secure transactions',
    iconClass: 'bg-green-50 text-green-600',
  },
  {
    icon: 'fa-rotate-left',
    title: 'Easy Returns',
    text: '14-day return policy',
    iconClass: 'bg-orange-50 text-orange-500',
  },
  {
    icon: 'fa-headset',
    title: '24/7 Support',
    text: 'Dedicated support team',
    iconClass: 'bg-purple-50 text-purple-500',
  },
]

export default function Features() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {features.map(function (feature) {
        return (
          <div
            key={feature.title}
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 md:p-4 shadow-sm"
          >
            <span
              className={`h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-full flex items-center justify-center ${feature.iconClass}`}
            >
              <i className={`fa-solid ${feature.icon}`}></i>
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800">{feature.title}</p>
              <p className="text-xs text-gray-500">{feature.text}</p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
