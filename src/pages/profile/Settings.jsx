import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { AuthContext } from '../../context/AuthContext'
import { changeMyPassword, updateMe } from '../../api/account'

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(20, 'Name must be at most 20 characters'),
  email: z.email('Please enter a valid email address'),
  // Optional: either empty or a valid Egyptian number.
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, 'Please enter a valid Egyptian phone number')
    .or(z.literal('')),
})

// Same password rules as Register; .refine checks the confirmation matches.
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Please enter your current password'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[0-9]/, 'Password must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain a symbol'),
    rePassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine(
    function (data) {
      return data.password === data.rePassword
    },
    { message: 'Passwords do not match', path: ['rePassword'] }
  )

function apiMessage(error) {
  return error.response?.data?.message || 'Something went wrong. Please try again.'
}

function inputClass(hasError, extra = '') {
  return `w-full rounded-xl border-2 bg-white px-4 py-2.5 focus:outline-none ${
    hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-green-600'
  } ${extra}`
}

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-800">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  )
}

function CardHeader({ icon, iconClass, title, subtitle }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className={`h-12 w-12 shrink-0 rounded-xl text-xl flex items-center justify-center ${iconClass}`}>
        <i className={`fa-solid ${icon}`}></i>
      </span>
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  )
}

function PasswordField({ id, label, placeholder, autoComplete, error, hint, registration }) {
  const [visible, setVisible] = useState(false)

  function toggleVisible() {
    setVisible(!visible)
  }

  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
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
    </Field>
  )
}

function ProfileCard() {
  const { token, user, userId, role, updateUser } = useContext(AuthContext)
  const initial = { name: user?.name || '', email: user?.email || '', phone: user?.phone || '' }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(profileSchema), defaultValues: initial })

  async function onSubmit(values) {
    // Only send what changed: re-sending the same email can be rejected as "already in use".
    const changes = {}
    if (values.name.trim() !== initial.name) changes.name = values.name.trim()
    if (values.email !== initial.email) changes.email = values.email
    if (values.phone && values.phone !== initial.phone) changes.phone = values.phone

    if (Object.keys(changes).length === 0) {
      toast('Nothing to update')
      return
    }

    try {
      const body = await updateMe(changes, token)
      // Prefer the user object from the server; fall back to our own changes.
      const updatedUser = { ...user, ...changes, ...(body.user || {}) }
      updateUser(updatedUser)
      reset({ name: updatedUser.name || '', email: updatedUser.email || '', phone: updatedUser.phone || '' })
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(apiMessage(error))
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="p-5 md:p-7">
        <CardHeader
          icon="fa-user"
          iconClass="bg-green-50 text-green-600"
          title="Profile Information"
          subtitle="Update your personal details"
        />
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Field id="name" label="Full Name" error={errors.name}>
            <input id="name" type="text" autoComplete="name" placeholder="Enter your name" className={inputClass(errors.name)} {...register('name')} />
          </Field>
          <Field id="email" label="Email Address" error={errors.email}>
            <input id="email" type="email" autoComplete="email" placeholder="Enter your email" className={inputClass(errors.email)} {...register('email')} />
          </Field>
          <Field id="phone" label="Phone Number" error={errors.phone}>
            <input id="phone" type="tel" autoComplete="tel" placeholder="01xxxxxxxxx" className={inputClass(errors.phone)} {...register('phone')} />
          </Field>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/25 hover:bg-green-700 disabled:opacity-70"
            >
              <i className={isSubmitting ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-floppy-disk'}></i>
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="border-t border-gray-100 bg-gray-50 p-5 md:px-7">
        <h4 className="mb-3 font-bold text-gray-900">Account Information</h4>
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-gray-500">User ID</dt>
            <dd className="break-all text-end font-mono text-xs text-gray-700">{userId || '—'}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-gray-500">Role</dt>
            <dd className="rounded-md bg-green-100 px-2.5 py-0.5 capitalize text-green-700">{role || 'user'}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

function PasswordCard() {
  const { token, user, login } = useContext(AuthContext)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', password: '', rePassword: '' },
  })

  async function onSubmit(values) {
    try {
      const body = await changeMyPassword(values, token)
      // Changing the password makes the server issue a NEW token and reject the old one.
      // Saving it keeps us logged in, and the cart/wishlist requests keep working.
      if (body.token) {
        login(body.token, body.user || user)
      }
      reset()
      toast.success('Password changed successfully')
    } catch (error) {
      toast.error(apiMessage(error))
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 md:p-7 shadow-sm">
      <CardHeader
        icon="fa-lock"
        iconClass="bg-amber-100 text-orange-500"
        title="Change Password"
        subtitle="Update your account password"
      />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {/* Lets the password manager know which account the new password belongs to */}
        <input type="email" name="username" autoComplete="username" value={user?.email || ''} readOnly hidden />
        <PasswordField
          id="currentPassword"
          label="Current Password"
          placeholder="Enter your current password"
          autoComplete="current-password"
          error={errors.currentPassword}
          registration={register('currentPassword')}
        />
        <PasswordField
          id="password"
          label="New Password"
          placeholder="Enter your new password"
          autoComplete="new-password"
          hint="Must be at least 8 characters with numbers and symbols"
          error={errors.password}
          registration={register('password')}
        />
        <PasswordField
          id="rePassword"
          label="Confirm New Password"
          placeholder="Confirm your new password"
          autoComplete="new-password"
          error={errors.rePassword}
          registration={register('rePassword')}
        />
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 disabled:opacity-70"
          >
            <i className={isSubmitting ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-lock'}></i>
            Change Password
          </button>
        </div>
      </form>
    </div>
  )
}

export default function Settings() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        <p className="mt-1 text-gray-500">Update your profile information and change your password</p>
      </div>
      <div className="flex flex-col gap-6">
        <ProfileCard />
        <PasswordCard />
      </div>
    </div>
  )
}
