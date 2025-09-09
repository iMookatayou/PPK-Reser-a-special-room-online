'use client'

import React from 'react'
import Image from 'next/image'
import { Building2, Newspaper, Info } from 'lucide-react'
import FadeInWhenVisible from '@/components/ui/FadeInWhenVisible'
import styles from './HomePage.module.css'
import './globals.css'

// ---------- Types ----------
type Card = {
  title: string
  icon: React.ReactNode
  text: string
  img: string
}

export default function HomePage() {
  const cards: Card[] = [
    {
      title: 'ห้องพิเศษ',
      icon: <Building2 size={28} strokeWidth={1.8} />,
      text: 'ข้อมูลห้องพัก สิ่งอำนวยความสะดวก และราคา',
      img: '/images/specialroom-placeholder.jpg'
    },
    {
      title: 'ข่าวสารและกิจกรรม',
      icon: <Newspaper size={28} strokeWidth={1.8} />,
      text: 'อัปเดตกิจกรรมและข่าวสารล่าสุดจากโรงพยาบาล',
      img: '/images/news-placeholder.jpg'
    },
    {
      title: 'ข้อมูลหน่วยงาน',
      icon: <Info size={28} strokeWidth={1.8} />,
      text: 'แนะนำข้อมูลเกี่ยวกับโรงพยาบาลและบริการต่าง ๆ',
      img: '/images/info-placeholder.jpg'
    }
  ]

  return (
    <>
      {/* MAIN SECTION */}
      <FadeInWhenVisible
        as="section"
        id="main-home"
        className={styles.mainSection}
        amount={0.2}
      >
        <h2 className={styles.sectionTitle}>บริการของเรา</h2>
        <p className={styles.sectionDescription}>
          เลือกบริการที่คุณสนใจจากหมวดหมู่ด้านล่าง เพื่อดูรายละเอียดเพิ่มเติม
        </p>

        <div className={styles.cardGrid}>
          {cards.map((card, i) => (
            <FadeInWhenVisible key={card.title} delay={i * 0.1}>
              <div className={styles.card}>
                <div className={styles.cardImageWrapper}>
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    className={styles.cardImage}
                  />
                </div>
                <h3 className={styles.cardTitle}>
                  {card.icon}
                  <span>{card.title}</span>
                </h3>
                <p className={styles.cardText}>{card.text}</p>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </FadeInWhenVisible>

      {/* BIG IMAGE SECTION */}
      <FadeInWhenVisible as="section" className={styles.bigImageSection} amount={0.2}>
        <h2 className={styles.sectionTitle}>ห้องพักพิเศษของเรา</h2>

        <div className={styles.bigImageGrid}>
          <FadeInWhenVisible delay={0.2}>
            <div className={styles.bigImageCard}>
              <Image
                src="/images/onebed.png"
                alt="ห้องพิเศษแบบเตียงเดี่ยว"
                fill
                className={styles.bigImage}
              />
              <div className={styles.bigImageCaption}>ห้องพิเศษแบบเตียงเดี่ยว</div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.4}>
            <div className={styles.bigImageCard}>
              <Image
                src="/images/twobed.png"
                alt="ห้องพิเศษแบบสองเตียง"
                fill
                className={styles.bigImage}
              />
              <div className={styles.bigImageCaption}>ห้องพิเศษแบบสองเตียง</div>
            </div>
          </FadeInWhenVisible>
        </div>
      </FadeInWhenVisible>
    </>
  )
}
