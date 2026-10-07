import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import SectionTitle from './SectionTitle'

const API_BASE = 'https://ecommerce.routemisr.com/api/v1'

export default function CategoriesSection() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Runs once when the section first appears (empty dependency array).
  useEffect(function () {
    async function getCategories() {
      try {
        const response = await axios.get(`${API_BASE}/categories`)
        setCategories(response.data.data)
      } catch (error) {
        console.error('Failed to load categories:', error)
      } finally {
        setLoading(false)
      }
    }

    getCategories()
  }, [])

  return (
    <section>
      {/* Mobile: title on top, link below it on the right. From sm: one row. */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-6">
        <div className="whitespace-nowrap">
          <SectionTitle title="Shop By" highlight="Category" />
        </div>
        <Link
          to="/categories"
          className="self-end sm:self-auto text-sm font-medium text-green-600 hover:text-green-700 whitespace-nowrap"
        >
          View All Categories <i className="fa-solid fa-arrow-right ms-1"></i>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(function (category) {
            return (
              <Link
                key={category._id}
                to="/categories"
                className="flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-center transition hover:shadow-md hover:-translate-y-1 hover:border-green-200"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-20 w-20 rounded-full object-cover bg-gray-50"
                />
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
