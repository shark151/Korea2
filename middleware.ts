import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const publicPages = [
  '/',
  '/search',
  '/sign-in',
  '/sign-up',
  '/cart',
  '/cart/(.*)',
  '/product/(.*)',
  '/page/(.*)',
]

const intlMiddleware = createMiddleware(routing)

export default async function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  )

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

  if (isPublicPage) {
    return intlMiddleware(req)
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })

  if (!token) {
    const newUrl = new URL(
      `/sign-in?callbackUrl=${encodeURIComponent(req.nextUrl.pathname)}`,
      req.nextUrl.origin
    )

    return Response.redirect(newUrl)
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api/uploadthing|api/auth|_next|favicon.ico|.*\\..*).*)'],
}

//========================================

// import createMiddleware from 'next-intl/middleware'
// import { routing } from './i18n/routing'

// import NextAuth from 'next-auth'
// import authConfig from './auth.config'

// const publicPages = [
//   '/',
//   '/search',
//   '/sign-in',
//   '/sign-up',
//   '/cart',
//   '/cart/(.*)',
//   '/product/(.*)',
//   '/page/(.*)',
// ]

// const intlMiddleware = createMiddleware(routing)
// const { auth } = NextAuth(authConfig)

// export default auth((req) => {
//   const pathname = req.nextUrl.pathname

//   // ✅ استثناء UploadThing من الـ middleware
//   if (pathname.startsWith("/api/uploadthing")) {
//     return
//   }

//   const publicPathnameRegex = RegExp(
//     `^(/(${routing.locales.join('|')}))?(${publicPages
//       .flatMap((p) => (p === '/' ? ['', '/'] : p))
//       .join('|')})/?$`,
//     'i'
//   )

//   const isPublicPage = publicPathnameRegex.test(pathname)

//   if (isPublicPage) {
//     return intlMiddleware(req)
//   } else {
//     if (!req.auth) {
//       const newUrl = new URL(
//         `/sign-in?callbackUrl=${
//           encodeURIComponent(pathname) || '/'
//         }`,
//         req.nextUrl.origin
//       )
//       return Response.redirect(newUrl)
//     } else {
//       return intlMiddleware(req)
//     }
//   }
// })

// export const config = {
//   matcher: ['/((?!api|_next|.\\..).*)'],
// }