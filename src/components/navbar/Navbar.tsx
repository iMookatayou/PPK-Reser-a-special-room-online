'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.logoContainer}>
        <a
          href="https://www.ppkhosp.go.th/default.php"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.logoWrapper}
        >
          <Image
            src="/images/logoppk4.png"
            alt="โลโก้โรงพยาบาล"
            width={48}
            height={48}
            priority
          />
        </a>
        <div className={styles.logoText}>
          <span className={styles.thaiName}>โรงพยาบาลพระปกเกล้าจันทบุรี</span>
          <span className={styles.engName}>PHRAPOKKLAO HOSPITAL</span>
        </div>
      </div>

      <nav className={styles.menu}>
        <Link href="/">หน้าแรก</Link>
        <Link href="/special-room">จองห้องพิเศษ</Link>
        <Link href="/checkbooking-status">ตรวจสอบการจอง</Link>
        <Link href="/contact">ติดต่อเรา</Link>
      </nav>
    </header>
  )
}
