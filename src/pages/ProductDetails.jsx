import { useParams } from 'react-router-dom'

export default function ProductDetails() {
  // useParams reads the dynamic parts of the URL.
  // The route is "products/:id", so /products/abc123 gives { id: 'abc123' }.
  const { id } = useParams()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Product Details: {id}</h1>
    </div>
  )
}
