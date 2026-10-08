// White card with the green gradient header used by all checkout sections.
export default function CheckoutCard({ icon, title, subtitle, children, className = '' }) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ${className}`}>
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 md:px-6 py-4 md:py-5 text-white">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <i className={`fa-solid ${icon}`}></i>
          {title}
        </h2>
        <p className="mt-1 text-sm text-green-50">{subtitle}</p>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  )
}
