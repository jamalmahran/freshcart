import CheckoutCard from './CheckoutCard'

function inputWrapperClass(hasError) {
  return `flex gap-3 rounded-xl border-2 bg-white px-3 py-2.5 focus-within:border-green-600 ${
    hasError ? 'border-red-400' : 'border-gray-200'
  }`
}

function FieldIcon({ icon }) {
  return (
    <span className="h-8 w-8 shrink-0 rounded-lg bg-gray-100 text-gray-500 text-sm flex items-center justify-center">
      <i className={`fa-solid ${icon}`}></i>
    </span>
  )
}

function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-gray-800">
      {children} <span className="text-red-500">*</span>
    </label>
  )
}

// choice = index of the selected saved address, or 'manual' for the form.
export default function ShippingAddressCard({ loading, savedAddresses, choice, onChoose, register, errors }) {
  const isManual = choice === 'manual'

  // Wait for the saved addresses, so the form doesn't disappear while the user types.
  if (loading) {
    return (
      <CheckoutCard icon="fa-house" title="Shipping Address" subtitle="Where should we deliver your order?">
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
        </div>
      </CheckoutCard>
    )
  }

  return (
    <CheckoutCard icon="fa-house" title="Shipping Address" subtitle="Where should we deliver your order?">
      {savedAddresses.length > 0 && (
        <div className="mb-3">
          <h3 className="flex items-center gap-2 font-medium text-gray-900">
            <i className="fa-solid fa-bookmark text-green-600"></i>
            Saved Addresses
          </h3>
          <p className="mt-1 text-sm text-gray-500">Select a saved address or enter a new one below</p>

          <div className="mt-4 flex flex-col gap-3">
            {savedAddresses.map(function (address, index) {
              const isSelected = choice === index
              return (
                <button
                  key={address.id}
                  type="button"
                  onClick={function () {
                    onChoose(index)
                  }}
                  className={`flex w-full items-start gap-3 rounded-xl border-2 p-4 text-start transition ${
                    isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span
                    className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <i className="fa-solid fa-location-dot"></i>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-gray-900">{address.name || address.city}</span>
                    <span className="block text-sm text-gray-600">{address.details}</span>
                    <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>
                        <i className="fa-solid fa-phone me-1"></i>
                        {address.phone}
                      </span>
                      <span>
                        <i className="fa-solid fa-city me-1"></i>
                        {address.city}
                      </span>
                    </span>
                  </span>
                  {isSelected && <i className="fa-solid fa-circle-check text-xl text-green-600"></i>}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={function () {
          onChoose('manual')
        }}
        className={`flex w-full items-center gap-3 rounded-xl border-2 border-dashed p-4 text-start transition ${
          isManual ? 'border-green-500 bg-green-50' : 'border-green-300 bg-green-50/40 hover:bg-green-50'
        }`}
      >
        <span className="h-9 w-9 shrink-0 rounded-lg bg-green-500 text-white flex items-center justify-center">
          <i className="fa-solid fa-plus"></i>
        </span>
        <span>
          <span className="block font-medium text-green-700">Use a different address</span>
          <span className="block text-xs text-gray-500">Enter a new shipping address manually</span>
        </span>
      </button>

      {isManual && (
        <div className="mt-5 border-t border-gray-100 pt-5">
          <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4">
            <span className="h-8 w-8 shrink-0 rounded-full bg-white text-blue-600 flex items-center justify-center">
              <i className="fa-solid fa-circle-info"></i>
            </span>
            <div>
              <p className="text-sm font-medium text-blue-800">Delivery Information</p>
              <p className="text-xs text-blue-700">Please ensure your address is accurate for smooth delivery</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-5">
            <div>
              <Label htmlFor="city">City</Label>
              <div className={inputWrapperClass(errors.city)}>
                <FieldIcon icon="fa-city" />
                <input
                  id="city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="e.g. Cairo, Alexandria, Giza"
                  className="min-w-0 flex-1 bg-transparent focus:outline-none"
                  {...register('city')}
                />
              </div>
              {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
            </div>

            <div>
              <Label htmlFor="details">Street Address</Label>
              <div className={`${inputWrapperClass(errors.details)} items-start`}>
                <FieldIcon icon="fa-location-dot" />
                <textarea
                  id="details"
                  rows={3}
                  autoComplete="street-address"
                  placeholder="Street name, building number, floor, apartment..."
                  className="min-w-0 flex-1 resize-none bg-transparent pt-1 focus:outline-none"
                  {...register('details')}
                ></textarea>
              </div>
              {errors.details && <p className="mt-1 text-sm text-red-500">{errors.details.message}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className={`${inputWrapperClass(errors.phone)} items-center`}>
                <FieldIcon icon="fa-phone" />
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="01xxxxxxxxx"
                  className="min-w-0 flex-1 bg-transparent focus:outline-none"
                  {...register('phone')}
                />
                <span className="hidden sm:inline shrink-0 text-xs text-gray-400">Egyptian numbers only</span>
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
            </div>
          </div>
        </div>
      )}
    </CheckoutCard>
  )
}
