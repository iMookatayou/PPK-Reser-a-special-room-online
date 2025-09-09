// Footer.tsx
'use client'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.copy}>© 2025 โรงพยาบาลพระปกเกล้าจันทบุรี</p>
          <p className={styles.team}>พัฒนาโดยทีมงานฝ่ายสารสนเทศ</p>
        </div>
        <div className={styles.right}>
          <a href="/privacy" className={styles.link}>นโยบายความเป็นส่วนตัว</a>
          <a href="/contact" className={styles.link}>ติดต่อเรา</a>
        </div>
      </div>
    </footer>
  )
}
