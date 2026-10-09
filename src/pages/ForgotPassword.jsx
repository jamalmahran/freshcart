import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'

const API_BASE = 'https://ecommerce.routemisr.com/api/v1'
const RESEND_SECONDS = 60

function apiMessage(error) {
  return error.response?.data?.message || 'Something went wrong. Please try again.'
}

function sendResetCode(email) {
  return axios.post(`${API_BASE}/auth/forgotPasswords`, { email })
}

// ---------- Schemas ----------

const emailSchema = z.object({
  email: z.email('Please enter a valid email address'),
})

const codeSchema = z.object({
  resetCode: z.string().regex(/^\d{6}$/, 'The code must be exactly 6 digits'),
})

// Same password rules as Register; .refine checks that both fields match.
const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[0-9]/, 'Password must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain a symbol'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(
    function (data) {
      return data.newPassword === data.confirmPassword
    },
    { message: 'Passwords do not match', path: ['confirmPassword'] }
  )

// ---------- Small shared pieces ----------

const steps = [
  { number: 1, icon: 'fa-envelope' },
  { number: 2, icon: 'fa-key' },
  { number: 3, icon: 'fa-lock' },
]

// 3 circles joined by lines: done = green check, current = green with a ring, future = gray.
function StepIndicator({ current }) {
  return (
    <div className="mx-auto mt-6 flex max-w-xs items-center">
      {steps.map(function (step, index) {
        const isDone = step.number < current
        const isCurrent = step.number === current
        return (
          <div key={step.number} className={`flex items-center ${index > 0 ? 'flex-1' : ''}`}>
            {/* The line BEFORE this circle turns green once the previous step is done */}
            {index > 0 && (
              <span className={`mx-2 h-0.5 flex-1 ${step.number <= current ? 'bg-green-600' : 'bg-gray-200'}`}></span>
            )}
            <span
              className={`h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-full text-sm flex items-center justify-center ${
                isDone || isCurrent ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'
              } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}
            >
              <i className={`fa-solid ${isDone ? 'fa-check' : step.icon}`}></i>
            </span>
          </div>
        )
      })}
    </div>
  )
}

function inputClass(hasError, extra = '') {
  return `w-full rounded-xl border-2 bg-white py-3 ps-11 pe-4 focus:outline-none ${
    hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-green-600'
  } ${extra}`
}

function FieldError({ error }) {
  return error ? <p className="mt-1 text-sm text-red-500">{error.message}</p> : null
}

function SubmitButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-lg font-semibold text-white shadow-lg shadow-green-600/25 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading && <i className="fa-solid fa-spinner fa-spin"></i>}
      {children}
    </button>
  )
}

// ---------- Step 1: email ----------

function EmailStep({ defaultEmail, onSent }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(emailSchema), defaultValues: { email: defaultEmail } })

  async function onSubmit(values) {
    try {
      await sendResetCode(values.email)
      toast.success('Reset code sent to your email')
      onSent(values.email)
    } catch (error) {
      toast.error(apiMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-5">
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
            placeholder="Enter your email address"
            className={inputClass(errors.email)}
            {...register('email')}
          />
        </div>
        <FieldError error={errors.email} />
      </div>

      <SubmitButton loading={isSubmitting}>Send Reset Code</SubmitButton>

      <Link to="/login" className="text-center font-medium text-green-600 hover:underline">
        <i className="fa-solid fa-arrow-left me-2"></i>
        Back to Sign In
      </Link>

      <p className="border-t border-gray-100 pt-5 text-center text-gray-600">
        Remember your password?{' '}
        <Link to="/login" className="font-semibold text-green-600 hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  )
}

// ---------- Step 2: code ----------

function CodeStep({ email, onVerified, onChangeEmail }) {
  // Step 1 just sent a code, so the resend button starts locked for 60 seconds.
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [resending, setResending] = useState(false)
  const isCounting = secondsLeft > 0

  // Cleanup clears the interval when the countdown ends or the step unmounts.
  useEffect(
    function () {
      if (!isCounting) return
      const timer = setInterval(function () {
        setSecondsLeft(function (previous) {
          return previous - 1
        })
      }, 1000)
      return function () {
        clearInterval(timer)
      }
    },
    [isCounting]
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(codeSchema), defaultValues: { resetCode: '' } })

  // Keep only digits as the user types or pastes.
  const codeField = register('resetCode')
  function handleCodeChange(event) {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6)
    codeField.onChange(event)
  }

  async function handleResend() {
    setResending(true)
    try {
      await sendResetCode(email)
      toast.success('A new code was sent to your email')
      setSecondsLeft(RESEND_SECONDS)
    } catch (error) {
      toast.error(apiMessage(error))
    } finally {
      setResending(false)
    }
  }

  async function onSubmit(values) {
    try {
      await axios.post(`${API_BASE}/auth/verifyResetCode`, { resetCode: values.resetCode })
      onVerified()
    } catch (error) {
      toast.error(apiMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-5">
      <div>
        <label htmlFor="resetCode" className="mb-2 block text-sm font-medium text-gray-800">
          Verification Code
        </label>
        <input
          id="resetCode"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="••••••"
          className={`w-full rounded-xl border-2 bg-white py-4 text-center text-2xl tracking-[0.6em] focus:outline-none ${
            errors.resetCode ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-green-600'
          }`}
          {...codeField}
          onChange={handleCodeChange}
        />
        <FieldError error={errors.resetCode} />
      </div>

      <p className="text-center text-sm text-gray-500">
        Didn't receive the code?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={isCounting || resending}
          className="font-semibold text-green-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
        >
          {resending ? 'Sending...' : isCounting ? `Resend in ${secondsLeft}s` : 'Resend Code'}
        </button>
      </p>

      <SubmitButton loading={isSubmitting}>Verify Code</SubmitButton>

      <button type="button" onClick={onChangeEmail} className="text-center text-gray-500 hover:text-gray-700">
        <i className="fa-solid fa-arrow-left me-2"></i>
        Change email address
      </button>
    </form>
  )
}

// ---------- Step 3: new password ----------

function PasswordInput({ id, label, placeholder, error, registration }) {
  const [visible, setVisible] = useState(false)

  function toggleVisible() {
    setVisible(!visible)
  }

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-800">
        {label}
      </label>
      <div className="relative">
        <i className="fa-solid fa-lock absolute start-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={placeholder}
          className={inputClass(error, 'pe-11')}
          {...registration}
        />
        <button
          type="button"
          onClick={toggleVisible}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <i className={visible ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
        </button>
      </div>
      <FieldError error={error} />
    </div>
  )
}

function PasswordStep({ email }) {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { newPassword: '', confirmPassword: '' } })

  async function onSubmit(values) {
    try {
      await axios.put(`${API_BASE}/auth/resetPassword`, {
        email,
        newPassword: values.newPassword,
      })
    } catch (error) {
      toast.error(apiMessage(error))
      return
    }

    // Sign in with the new password to get the same token + user object that
    // Login.jsx uses (the reset response doesn't reliably include the user's name).
    try {
      const response = await axios.post(`${API_BASE}/auth/signin`, {
        email,
        password: values.newPassword,
      })
      login(response.data.token, response.data.user)
      toast.success('Password reset successfully!')
      navigate('/')
    } catch {
      toast.success('Password reset! Please sign in with your new password')
      navigate('/login')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-5">
      {/* Hidden, but tells the browser / password manager which account this
          new password belongs to, so it can save it for the right email. */}
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      <PasswordInput
        id="newPassword"
        label="New Password"
        placeholder="Enter new password"
        error={errors.newPassword}
        registration={register('newPassword')}
      />
      <PasswordInput
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm new password"
        error={errors.confirmPassword}
        registration={register('confirmPassword')}
      />
      <SubmitButton loading={isSubmitting}>Reset Password</SubmitButton>
    </form>
  )
}

// ---------- Page ----------

const stepTexts = {
  1: { title: 'Forgot Password?', subtitle: "No worries, we'll send you a reset code" },
  2: { title: 'Check Your Email', subtitle: 'Enter the 6-digit code sent to' },
  3: { title: 'Create New Password', subtitle: 'Your new password must be different from previous passwords' },
}

const features = [
  { icon: 'fa-envelope', text: 'Email Verification' },
  { icon: 'fa-shield-halved', text: 'Secure Reset' },
  { icon: 'fa-lock', text: 'Encrypted' },
]

export default function ForgotPassword() {
  // The email from step 1 is kept here so steps 2 and 3 can reuse it.
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')

  function handleCodeSent(sentEmail) {
    setEmail(sentEmail)
    setStep(2)
  }

  function goToStep3() {
    setStep(3)
  }

  function backToStep1() {
    setStep(1)
  }

  const text = stepTexts[step]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* ---------- Illustration (desktop only) ---------- */}
        <div className="hidden lg:block text-center">
          <div className="relative h-96 overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 to-gray-50 shadow-lg">
            <span className="absolute top-12 left-12 h-40 w-40 rounded-full bg-green-100/70 blur-sm"></span>
            <span className="absolute top-20 right-28 h-24 w-24 rounded-full bg-green-100/70 blur-sm"></span>
            <span className="absolute bottom-8 right-16 h-52 w-52 rounded-full bg-green-100/60 blur-sm"></span>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex items-center gap-4">
                <span className="h-20 w-20 -rotate-12 rounded-2xl bg-white text-3xl text-green-600 shadow-lg flex items-center justify-center">
                  <i className="fa-solid fa-envelope"></i>
                </span>
                <span className="h-36 w-36 rounded-3xl bg-white p-4 shadow-xl">
                  <span className="h-full w-full rounded-2xl bg-green-100 text-5xl text-green-600 flex items-center justify-center">
                    <i className="fa-solid fa-lock"></i>
                  </span>
                </span>
                <span className="h-20 w-20 rotate-12 rounded-2xl bg-white text-3xl text-green-600 shadow-lg flex items-center justify-center">
                  <i className="fa-solid fa-shield-halved"></i>
                </span>
              </div>
              <div className="mt-8 flex gap-3">
                <span className="h-3 w-3 rounded-full bg-green-400"></span>
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="h-3 w-3 rounded-full bg-green-600"></span>
              </div>
            </div>
          </div>

          <h2 className="mt-8 text-3xl font-bold text-slate-800">Reset Your Password</h2>
          <p className="mx-auto mt-3 max-w-lg text-lg text-gray-500">
            Don't worry, it happens to the best of us. We'll help you get back into your account in no time.
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-6 text-gray-500">
            {features.map(function (feature) {
              return (
                <li key={feature.text} className="flex items-center gap-2">
                  <i className={`fa-solid ${feature.icon} text-green-600`}></i>
                  {feature.text}
                </li>
              )
            })}
          </ul>
        </div>

        {/* ---------- Card ---------- */}
        <div className="w-full max-w-lg mx-auto lg:max-w-none rounded-3xl bg-white p-6 md:p-10 shadow-2xl">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold">
              <span className="text-green-600">Fresh</span>
              <span className="text-slate-800">Cart</span>
            </p>
            <h1 className="mt-4 text-2xl md:text-3xl font-bold text-slate-800">{text.title}</h1>
            <p className="mt-2 text-gray-600">
              {text.subtitle}
              {step === 2 && <span className="block sm:inline sm:ms-1 font-medium text-gray-700">{email}</span>}
            </p>
          </div>

          <StepIndicator current={step} />

          {step === 1 && <EmailStep defaultEmail={email} onSent={handleCodeSent} />}
          {step === 2 && <CodeStep email={email} onVerified={goToStep3} onChangeEmail={backToStep1} />}
          {step === 3 && <PasswordStep email={email} />}
        </div>
      </div>
    </div>
  )
}
