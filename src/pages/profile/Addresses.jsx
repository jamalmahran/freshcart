import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { AuthContext } from '../../context/AuthContext'
import { addAddress, deleteAddress, fetchAddresses } from '../../api/account'

const addressSchema = z.object({
  name: z.string().trim().min(2, 'Address name must be at least 2 characters'),
  city: z.string().trim().min(2, 'City must be at least 2 characters'),
  details: z.string().trim().min(5, 'Details must be at least 5 characters'),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, 'Please enter a valid Egyptian phone number'),
})

const emptyValues = { name: '', city: '', details: '', phone: '' }

function apiMessage(error) {
  return error.response?.data?.message || 'Something went wrong. Please try again.'
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-800">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  )
}

function inputClass(hasError) {
  return `w-full rounded-xl border-2 bg-white px-4 py-2.5 focus:outline-none ${
    hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-green-600'
  }`
}

// Add / Edit form in a modal. `address` is null when adding a new one.
function AddressModal({ address, onClose, onSave }) {
  const isEdit = Boolean(address)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: isEdit
      ? { name: address.name, city: address.city, details: address.details, phone: address.phone }
      : emptyValues,
  })

  async function onSubmit(values) {
    await onSave({
      name: values.name.trim(),
      city: values.city.trim(),
      details: values.details.trim(),
      phone: values.phone,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-modal-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="address-modal-title" className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-9 w-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Field id="name" label="Address Name" error={errors.name}>
            <input id="name" type="text" placeholder="e.g. Home, Work" className={inputClass(errors.name)} {...register('name')} />
          </Field>
          <Field id="city" label="City" error={errors.city}>
            <input
              id="city"
              type="text"
              autoComplete="address-level2"
              placeholder="e.g. Cairo, Alexandria, Giza"
              className={inputClass(errors.city)}
              {...register('city')}
            />
          </Field>
          <Field id="details" label="Details" error={errors.details}>
            <textarea
              id="details"
              rows={3}
              autoComplete="street-address"
              placeholder="Street name, building number, floor, apartment..."
              className={`${inputClass(errors.details)} resize-none`}
              {...register('details')}
            ></textarea>
          </Field>
          <Field id="phone" label="Phone" error={errors.phone}>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="01xxxxxxxxx"
              className={inputClass(errors.phone)}
              {...register('phone')}
            />
          </Field>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-gray-200 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 font-semibold text-white hover:bg-green-700 disabled:opacity-70"
            >
              {isSubmitting && <i className="fa-solid fa-spinner fa-spin"></i>}
              {isEdit ? 'Save Address' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white shadow-lg shadow-green-600/25 hover:bg-green-700"
    >
      <i className="fa-solid fa-plus"></i>
      Add Address
    </button>
  )
}

export default function Addresses() {
  const { token } = useContext(AuthContext)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  // null = modal closed, 'new' = adding, an address object = editing it.
  const [modal, setModal] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(
    function () {
      let ignore = false

      async function load() {
        try {
          const list = await fetchAddresses(token)
          if (!ignore) setAddresses(list)
        } catch (error) {
          toast.error(apiMessage(error))
        } finally {
          if (!ignore) setLoading(false)
        }
      }

      load()
      return function () {
        ignore = true
      }
    },
    [token]
  )

  async function reload() {
    setAddresses(await fetchAddresses(token))
  }

  function openAdd() {
    setModal('new')
  }

  function closeModal() {
    setModal(null)
  }

  async function handleSave(values) {
    const editing = modal !== 'new' ? modal : null
    try {
      // The API has no "update address" endpoint, so editing = add the new
      // version first, then delete the old one only if the add succeeded.
      await addAddress(values, token)
      if (editing) {
        try {
          await deleteAddress(editing._id, token)
        } catch {
          toast.error('The new address was saved, but the old one could not be removed')
        }
      }
      await reload()
      toast.success(editing ? 'Address updated' : 'Address added')
      setModal(null)
    } catch (error) {
      toast.error(apiMessage(error))
    }
  }

  async function handleDelete(address) {
    const result = await Swal.fire({
      title: 'Delete this address?',
      text: `"${address.name}" will be removed from your saved addresses.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
    })
    if (!result.isConfirmed) return

    setDeletingId(address._id)
    try {
      await deleteAddress(address._id, token)
      await reload()
      toast.success('Address deleted')
    } catch (error) {
      toast.error(apiMessage(error))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
          <p className="mt-1 text-gray-500">Manage your saved delivery addresses</p>
        </div>
        {addresses.length > 0 && <AddButton onClick={openAdd} />}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin"></div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-14 text-center shadow-sm">
          <span className="mx-auto h-20 w-20 rounded-full bg-gray-100 text-3xl text-gray-300 flex items-center justify-center">
            <i className="fa-solid fa-location-dot"></i>
          </span>
          <h3 className="mt-4 text-lg font-bold text-gray-900">No addresses yet</h3>
          <p className="mt-1 mb-6 text-gray-500">Add your first address to speed up checkout</p>
          <AddButton onClick={openAdd} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(function (address) {
            const isDeleting = deletingId === address._id
            return (
              <article key={address._id} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <span className="h-11 w-11 shrink-0 rounded-xl bg-green-50 text-lg text-green-600 flex items-center justify-center">
                  <i className="fa-solid fa-location-dot"></i>
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900">{address.name}</h3>
                  <p className="mt-0.5 text-sm text-gray-600">{address.details}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span>
                      <i className="fa-solid fa-phone me-1.5"></i>
                      {address.phone}
                    </span>
                    <span>
                      <i className="fa-solid fa-city me-1.5"></i>
                      {address.city}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={function () {
                      setModal(address)
                    }}
                    disabled={isDeleting}
                    aria-label={`Edit ${address.name}`}
                    className="h-9 w-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 disabled:opacity-50"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    type="button"
                    onClick={function () {
                      handleDelete(address)
                    }}
                    disabled={isDeleting}
                    aria-label={`Delete ${address.name}`}
                    className="h-9 w-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                  >
                    <i className={isDeleting ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-trash'}></i>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* key makes React create a fresh form for each address opened */}
      {modal && (
        <AddressModal
          key={modal === 'new' ? 'new' : modal._id}
          address={modal === 'new' ? null : modal}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
