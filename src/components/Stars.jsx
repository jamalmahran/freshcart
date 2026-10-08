// 5 star icons for a rating like 4.2 → 4 full + 1 empty, 3.5 → 3 full + 1 half + 1 empty.
export default function Stars({ rating, className = '' }) {
  const icons = [1, 2, 3, 4, 5].map(function (position) {
    if (rating >= position) return 'fa-solid fa-star'
    if (rating >= position - 0.5) return 'fa-solid fa-star-half-stroke'
    return 'fa-regular fa-star'
  })

  return (
    <span className={`inline-flex gap-0.5 text-yellow-400 ${className}`}>
      {icons.map(function (icon, index) {
        return <i key={index} className={icon}></i>
      })}
    </span>
  )
}
