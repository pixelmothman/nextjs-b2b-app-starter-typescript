import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google'
import './globals.css'
import {AuthProvider} from "@propelauth/nextjs/client";
import NotForMobileScreen from './ui/miscelaneous/notForMobileScreen';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'pixelmothman/nextjs-b2b-app-starter',
  description: 'Start fast.',
}

export default function RootLayout({ children }: {
children: ReactNode
}) {

  if(!process.env.NEXT_PUBLIC_AUTH_URL){
    throw new Error('The env variable is not set.')
  }

  return (
    <html lang="en">
      <AuthProvider authUrl={process.env.NEXT_PUBLIC_AUTH_URL}>
        <body className={`${inter.className} antialiased w-screen h-screen bg-neutral-100`}>
          <NotForMobileScreen />
          {children}
        </body>
      </AuthProvider>
    </html>
  )
}