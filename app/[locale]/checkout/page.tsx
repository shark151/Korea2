
import { Metadata } from 'next'
import CheckoutForm from './checkout-form'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Checkout',
}

export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/checkout')
  }
  return <CheckoutForm />
}

//=================================

// import { Metadata } from 'next'
// import CheckoutForm from './checkout-form'
// import { auth } from '@/auth'
// import { redirect } from 'next/navigation'
// import { getTranslations } from 'next-intl/server'

// export async function generateMetadata(): Promise<Metadata> {
//   const t = await getTranslations('Checkout')

//   return {
//     title: t('title'),
//   }
// }

// export default async function CheckoutPage() {
//   const session = await auth()

//   if (!session?.user) {
//     redirect('/sign-in?callbackUrl=/checkout')
//   }

//   return <CheckoutForm />
// }