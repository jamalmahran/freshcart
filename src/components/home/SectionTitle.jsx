// Shared section heading: green bar on the left, last word highlighted in green.
// Used as <SectionTitle title="Shop By" highlight="Category" />
export default function SectionTitle({ title, highlight }) {
  return (
    <h2 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-gray-900">
      <span className="h-7 w-1.5 rounded-full bg-green-600"></span>
      <span>
        {title} <span className="text-green-600">{highlight}</span>
      </span>
    </h2>
  )
}
