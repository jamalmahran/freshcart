import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'

const API_BASE = 'https://ecommerce.routemisr.com/api/v1'

// Each key describes one field; Zod checks them in order and reports the first failure.
// .refine() adds a custom check on the whole object: here, password === rePassword.
// "path" tells Zod which field the error belongs to, so it shows under Confirm Password.
const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(20, 'Name must be at most 20 characters'),
    email: z.email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[0-9]/, 'Password must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain a symbol'),
    rePassword: z.string().min(1, 'Please confirm your password'),
    phone: z.string().regex(/^01[0125][0-9]{8}$/, 'Please enter a valid Egyptian phone number'),
    terms: z.boolean().refine(function (value) {
      return value === true
    }, 'You must agree to the terms'),
  })
  .refine(
    function (data) {
      return data.password === data.rePassword
    },
    { message: 'Passwords do not match', path: ['rePassword'] }
  )

// autoComplete tells the browser / password manager what each field is,
// so it can autofill it (and offer to generate a password for "new-password").
const fields = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Ali', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'ali@example.com', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'create a strong password', autoComplete: 'new-password' },
  { name: 'rePassword', label: 'Confirm Password', type: 'password', placeholder: 'confirm your password', autoComplete: 'new-password' },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '01xxxxxxxxx', autoComplete: 'tel' },
]

const benefits = [
  {
    icon: 'fa-star',
    title: 'Premium Quality',
    text: 'Premium quality products sourced from trusted suppliers.',
  },
  {
    icon: 'fa-truck-fast',
    title: 'Fast Delivery',
    text: 'Same-day delivery available in most areas',
  },
  {
    icon: 'fa-shield-halved',
    title: 'Secure Shopping',
    text: 'Your data and payments are completely secure',
  },
]

// Scores the password on 4 rules and returns how to display its strength.
function getPasswordStrength(password) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const width = `${score * 25}%`

  if (score === 4) return { label: 'Strong', width, textClass: 'text-green-600', barClass: 'bg-green-500' }
  if (score === 3) return { label: 'Medium', width, textClass: 'text-yellow-500', barClass: 'bg-yellow-400' }
  return { label: 'Weak', width, textClass: 'text-red-500', barClass: 'bg-red-500' }
}

function inputClass(hasError) {
  return `w-full rounded-md border bg-white px-4 py-2.5 text-sm focus:outline-none ${
    hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-green-600'
  }`
}

export default function Register() {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')

  // register() connects each input to the form, and formState.errors holds the
  // Zod messages. control is the form's "engine", used by useWatch below.
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: '',
      terms: false,
    },
  })

  // useWatch reads a field's current value while the user types (same idea as
  // watch("password"), but the hook version that React's compiler/linter prefers).
  // The component re-renders on each keystroke, so the bar updates live.
  const password = useWatch({ control, name: 'password' })
  const strength = getPasswordStrength(password || '')

  async function onSubmit(values) {
    setApiError('')
    // Send only what the API expects (no "terms").
    const body = {
      name: values.name,
      email: values.email,
      password: values.password,
      rePassword: values.rePassword,
      phone: values.phone,
    }

    try {
      await axios.post(`${API_BASE}/auth/signup`, body)
      navigate('/login')
    } catch (error) {
      setApiError(error.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
        {/* ---------- Left column (shown above the card on mobile) ---------- */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome to <span className="text-green-600">FreshCart</span>
          </h1>
          <p className="mt-3 text-lg md:text-xl text-gray-600">
            Join thousands of happy customers who enjoy fresh groceries delivered right to their
            doorstep.
          </p>

          <ul className="mt-8 flex flex-col gap-6">
            {benefits.map(function (benefit) {
              return (
                <li key={benefit.title} className="flex items-start gap-4">
                  <span className="h-12 w-12 shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <i className={`fa-solid ${benefit.icon}`}></i>
                  </span>
                  <div>
                    <p className="text-lg font-medium text-gray-800">{benefit.title}</p>
                    <p className="text-gray-600">{benefit.text}</p>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-8 rounded-lg bg-white p-4 md:p-5 shadow-md">
            <div className="flex items-center gap-4">
              <span className="h-12 w-12 shrink-0 rounded-full bg-green-500 text-white font-semibold flex items-center justify-center">
                SJ
              </span>
              <div>
                <p className="text-gray-800">Sarah Johnson</p>
                <div className="flex gap-0.5 text-yellow-400">
                  {[1, 2, 3, 4, 5].map(function (star) {
                    return <i key={star} className="fa-solid fa-star"></i>
                  })}
                </div>
              </div>
            </div>
            <p className="mt-4 italic text-gray-600">
              "FreshCart has transformed my shopping experience. The quality of the products is
              outstanding, and the delivery is always on time. Highly recommend!"
            </p>
          </div>
        </div>

        {/* ---------- Right column: the card ---------- */}
        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-xl">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Create Your Account</h2>
            <p className="mt-2 text-gray-600">Start your fresh journey with us today</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-md border border-gray-300 py-2.5 font-medium text-gray-800 hover:bg-gray-50"
            >
              <i className="fa-brands fa-google text-red-500"></i>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-md border border-gray-300 py-2.5 font-medium text-gray-800 hover:bg-gray-50"
            >
              <i className="fa-brands fa-facebook text-blue-600"></i>
              Facebook
            </button>
          </div>

          <div className="my-6 flex items-center gap-4 text-gray-600">
            <span className="h-px flex-1 bg-gray-200"></span>
            or
            <span className="h-px flex-1 bg-gray-200"></span>
          </div>

          {apiError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <i className="fa-solid fa-circle-exclamation me-2"></i>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            {fields.map(function (field) {
              const error = errors[field.name]
              return (
                <div key={field.name}>
                  <label htmlFor={field.name} className="mb-2 block text-gray-800">
                    {field.label}
                    <span className="text-gray-400">*</span>
                  </label>
                  <input
                    id={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    className={inputClass(error)}
                    {...register(field.name)}
                  />

                  {/* Strength bar only under the Password field */}
                  {field.name === 'password' && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 rounded-full bg-gray-200">
                          <div
                            className={`h-1 rounded-full transition-all ${strength.barClass}`}
                            style={{ width: strength.width }}
                          ></div>
                        </div>
                        <span className={`text-sm ${strength.textClass}`}>{strength.label}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Must be at least 8 characters with numbers and symbols
                      </p>
                    </div>
                  )}

                  {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
                </div>
              )
            })}

            <div>
              <label className="flex items-start gap-3 text-gray-700">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-green-600" {...register('terms')} />
                <span>
                  I agree to the{' '}
                  <a href="#" className="text-green-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-green-600 hover:underline">
                    Privacy Policy
                  </a>{' '}
                  <span className="text-gray-400">*</span>
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 py-2.5 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <i className="fa-solid fa-user-plus"></i>
              )}
              {isSubmitting ? 'Creating Account...' : 'Create My Account'}
            </button>
          </form>

          <p className="mt-6 border-t border-gray-100 pt-6 text-center text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
