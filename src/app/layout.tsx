// app/layout.tsx (หรือ RootLayout.tsx ถ้าใช้แบบ custom)

import type { ReactNode } from 'react'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'
import './globals.css'

export const metadata = {
  title: 'ระบบจองห้องพิเศษออนไลน์',
  description: 'เพื่อจองห้องพิเศษผ่านเว็บไซต์ของโรงบาล',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body className="layout-root">
        <Navbar />
        <main className="layout-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
