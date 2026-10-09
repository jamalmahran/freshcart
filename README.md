# FreshCart

A responsive e-commerce web app built with React, where users can browse products, manage a cart and wishlist, and check out with cash or card.

**Live Demo:** [freshcart.example.com](https://example.com) <!-- replace with the Vercel link -->

## Features

- **Authentication**: sign up, sign in, sign out, with protected routes for logged-in pages
- **Forgot password**: 3-step flow (email code → verify → new password)
- **Products**: listing with category/brand filters and pagination
- **Search**: text search with category, brand and price filters, sorting, grid/list view and pagination
- **Product details**: image gallery, ratings and reviews, quantity picker, related products
- **Cart**: add, update quantity, remove, clear, order summary
- **Wishlist**: save products with the heart icon, move them to the cart
- **Checkout**: cash on delivery or online payment with Stripe
- **Orders**: order history with status and expandable details
- **Categories & Brands**: browse pages that link to filtered product lists
- **Profile**: saved addresses (add, edit, delete) and account settings (profile info, change password)
- Fully responsive (mobile, tablet, desktop)

## Tech Stack

- [React](https://react.dev) + [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) for form validation
- Context API for auth, cart and wishlist state
- [react-hot-toast](https://react-hot-toast.com) for notifications
- [SweetAlert2](https://sweetalert2.github.io) for confirmation dialogs
- [Font Awesome](https://fontawesome.com) icons

## Run Locally

Requires [Node.js](https://nodejs.org) (LTS).

```bash
git clone <your-repo-url>
cd freshcart
npm install
npm run dev
```

Then open the URL shown in the terminal (usually http://localhost:5173).

Other scripts:

- `npm run build`: production build into `dist/`
- `npm run preview`: preview the production build
- `npm run lint`: run ESLint

## API

Data comes from the [Route Academy E-commerce API](https://ecommerce.routemisr.com) (`https://ecommerce.routemisr.com/api/v1`). Thanks to Route Academy for providing it.
