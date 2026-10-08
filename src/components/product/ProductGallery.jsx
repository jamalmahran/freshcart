// Big main image + clickable thumbnails.
// selectedImage / onSelect come from the parent, which resets them when the product changes.
export default function ProductGallery({ images, title, selectedImage, onSelect }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <img
        src={selectedImage}
        alt={title}
        className="h-80 md:h-72 lg:h-96 w-full object-contain"
      />

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map(function (image) {
            const isActive = image === selectedImage
            return (
              <button
                key={image}
                type="button"
                onClick={function () {
                  onSelect(image)
                }}
                aria-label="Show this image"
                className={`overflow-hidden rounded-md border-2 ${
                  isActive ? 'border-slate-600' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img src={image} alt="" className="h-20 w-full object-cover" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
