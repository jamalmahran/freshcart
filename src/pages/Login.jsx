import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import loginCart from '../assets/login-cart.png'

const API_BASE = 'https://ecommerce.routemisr.com/api/v1'

// A Zod schema describes what valid form data looks like.
// zodResolver (below) runs it on submit and turns failures into field errors.
const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

const perks = [
  { icon: 'fa-truck', text: 'Free Delivery' },
  { icon: 'fa-shield-halved', text: 'Secure Payment' },
  { icon: 'fa-clock', text: '24/7 Support' },
]

const trustItems = [
  { icon: 'fa-lock', text: 'SSL Secured' },
  { icon: 'fa-users', text: '50K+ Users' },
  { icon: 'fa-star', text: '4.9 Rating' },
]

function inputClass(hasError) {
  return `w-full rounded-lg border-2 bg-white py-3 ps-11 pe-4 text-sm focus:outline-none ${
    hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-green-600'
  }`
}

export default function Login() {
  // useContext reads the values the AuthProvider shares (here we need login()).
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState('')

  // register() connects an input to the form (name, value, onChange...).
  // formState.errors holds the Zod error for each field.
  // isSubmitting is true while our async onSubmit is running.
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  function togglePassword() {
    setShowPassword(!showPassword)
  }

  // handleSubmit only calls this when the Zod validation passes.
  async function onSubmit(values) {
    setApiError('')
    try {
      const response = await axios.post(`${API_BASE}/auth/signin`, values)
      login(response.data.token, response.data.user)
      navigate('/')
    } catch (error) {
      setApiError(error.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* ---------- Left column (desktop only) ---------- */}
        <div className="hidden lg:block text-center">
          <div className="overflow-hidden rounded-2xl bg-white shadow-md">
            <img src={loginCart} alt="Shopping cart full of fresh vegetables" className="w-full h-96 object-cover" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-800">
            FreshCart - Your One-Stop Shop for Fresh Products
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of happy customers who trust FreshCart for their daily grocery needs
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {perks.map(function (perk) {
              return (
                <li key={perk.text} className="flex items-center gap-2">
                  <i className={`fa-solid ${perk.icon} text-green-600`}></i>
                  {perk.text}
                </li>
              )
            })}
          </ul>
        </div>

        {/* ---------- Right column: the card ---------- */}
        <div className="w-full max-w-lg mx-auto lg:max-w-none rounded-2xl bg-white p-6 md:p-10 shadow-xl">
          <div className="text-center">
            <p className="text-3xl font-bold">
              <span className="text-green-600">Fresh</span>
              <span className="text-gray-800">Cart</span>
            </p>
            <h1 className="mt-3 text-2xl font-bold text-gray-900">Welcome Back!</h1>
            <p className="mt-2 text-gray-600">Sign in to continue your fresh shopping experience</p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              <i className="fa-brands fa-google text-red-500"></i>
              Continue with Google
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              <i className="fa-brands fa-facebook text-blue-600"></i>
              Continue with Facebook
            </button>
          </div>

          <div className="my-6 flex items-center gap-4 text-xs text-gray-500">
            <span className="h-px flex-1 bg-gray-200"></span>
            OR CONTINUE WITH EMAIL
            <span className="h-px flex-1 bg-gray-200"></span>
          </div>

          {apiError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <i className="fa-solid fa-circle-exclamation me-2"></i>
              {apiError}
            </div>
          )}

          {/* noValidate: let Zod handle validation instead of the browser's popups */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-800">
                Email Address
              </label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute start-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={inputClass(errors.email)}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-800">
                  Password
                </label>
                <a href="#" className="text-sm text-green-600 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <i className="fa-solid fa-lock absolute start-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`${inputClass(errors.password)} pe-11`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="h-4 w-4 accent-green-600" />
              Keep me signed in
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-lg font-semibold text-white shadow-md hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && <i className="fa-solid fa-spinner fa-spin"></i>}
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-100 pt-6 text-center">
            <p className="text-gray-600">
              New to FreshCart?{' '}
              <Link to="/register" className="font-semibold text-green-600 hover:underline">
                Create an account
              </Link>
            </p>
            <ul className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              {trustItems.map(function (item) {
                return (
                  <li key={item.text} className="flex items-center gap-1.5">
                    <i className={`fa-solid ${item.icon}`}></i>
                    {item.text}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
