import CheckoutCard from './CheckoutCard'

const options = [
  {
    id: 'cash',
    icon: 'fa-money-bill-wave',
    title: 'Cash on Delivery',
    text: 'Pay when your order arrives at your doorstep',
    cards: [],
  },
  {
    id: 'online',
    icon: 'fa-credit-card',
    title: 'Pay Online',
    text: 'Secure payment with Credit/Debit Card via Stripe',
    cards: ['fa-cc-visa', 'fa-cc-mastercard', 'fa-cc-amex'],
  },
]

const cardColors = {
  'fa-cc-visa': 'text-blue-700',
  'fa-cc-mastercard': 'text-orange-500',
  'fa-cc-amex': 'text-sky-600',
}

export default function PaymentMethodCard({ method, onChange }) {
  return (
    <CheckoutCard icon="fa-wallet" title="Payment Method" subtitle="Choose how you'd like to pay">
      <div className="flex flex-col gap-3">
        {options.map(function (option) {
          const isSelected = method === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={function () {
                onChange(option.id)
              }}
              className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-start transition ${
                isSelected
                  ? 'border-green-500 bg-gradient-to-r from-green-50 to-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span
                className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center text-lg ${
                  isSelected ? 'bg-green-600 text-white shadow-md shadow-green-600/30' : 'bg-gray-100 text-gray-500'
                }`}
              >
                <i className={`fa-solid ${option.icon}`}></i>
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block font-semibold ${isSelected ? 'text-green-700' : 'text-gray-900'}`}>
                  {option.title}
                </span>
                <span className="block text-sm text-gray-500">{option.text}</span>
                {option.cards.length > 0 && (
                  <span className="mt-1.5 flex gap-2 text-xl">
                    {option.cards.map(function (card) {
                      return <i key={card} className={`fa-brands ${card} ${cardColors[card]}`}></i>
                    })}
                  </span>
                )}
              </span>
              {isSelected ? (
                <span className="h-7 w-7 shrink-0 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
                  <i className="fa-solid fa-check"></i>
                </span>
              ) : (
                <span className="h-7 w-7 shrink-0 rounded-full border-2 border-gray-300"></span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-green-50 to-gray-50 p-4">
        <span className="h-9 w-9 shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
          <i className="fa-solid fa-shield-halved"></i>
        </span>
        <div>
          <p className="text-sm font-medium text-green-800">Secure &amp; Encrypted</p>
          <p className="text-xs text-green-700">Your payment info is protected with 256-bit SSL encryption</p>
        </div>
      </div>
    </CheckoutCard>
  )
}
