import { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import HeroSlider from '../components/home/HeroSlider'
import Features from '../components/home/Features'
import CategoriesSection from '../components/home/CategoriesSection'
import PromoBanners from '../components/home/PromoBanners'
import SectionTitle from '../components/home/SectionTitle'

const API_BASE = 'https://ecommerce.routemisr.com/api/v1'

export default function Home() {
  // useState stores data that, when changed, makes React re-render the component.
  // It returns [currentValue, setterFunction].
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // useEffect runs code after the component renders (side effects like API calls).
  // The empty dependency array [] means: run only once, when Home first appears.
  useEffect(function () {
    // The effect callback itself can't be async, so we define an async function inside it.
    async function getProducts() {
      try {
        const { data } = await axios.get(`${API_BASE}/products`)
        setProducts(data.data)
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }

    getProducts()
  }, [])

  return (
    <>
      {/* The hero sits outside the container so it spans the full screen width */}
      <HeroSlider />

      <div className="container mx-auto px-4 py-8 space-y-10 md:space-y-12">
        <Features />
        <CategoriesSection />
        <PromoBanners />

        <section>
          <div className="mb-6">
            <SectionTitle title="Featured" highlight="Products" />
          </div>

          {/* Only this section waits for products; the sections above show right away */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(function (product) {
                return <ProductCard key={product._id} product={product} />
              })}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
