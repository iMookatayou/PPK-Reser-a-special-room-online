'use client';

import * as React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import FadeInWhenVisible from '@/components/ui/FadeInWhenVisible'; // ใช้ตัว reusable ที่รองรับ as + MotionProps
import styles from './styles/ContactPage.module.css';

export default function ContactPage() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    // TODO: ส่งข้อมูลจริง เช่น fetch('/api/contact', { method: 'POST', body: form })
    console.log('Form submit:', {
      name: form.get('name'),
      email: form.get('email'),
      message: form.get('message'),
    });
  };

  return (
    <main className={styles.contactPage}>
      <AnimatePresence mode="wait">
        {/* Header */}
        <FadeInWhenVisible
          as="header"
          className={styles.header}
          y={24}
          delay={0.02}
          duration={0.55}
          once
          // เผื่อมีการซ่อน/แสดงหน้าด้วย client routing
          exit={{ opacity: 0, y: 8 }}
        >
          <FadeInWhenVisible as="h1" className={styles.title} y={14} delay={0.06}>
            ติดต่อเรา
          </FadeInWhenVisible>
          <FadeInWhenVisible as="p" className={styles.subtitle} y={12} delay={0.12}>
            เรายินดีให้บริการและตอบคำถามของคุณ
          </FadeInWhenVisible>
        </FadeInWhenVisible>

        {/* Contact Info */}
        <FadeInWhenVisible
          as="section"
          className={styles.contactInfoSection}
          y={30}
          delay={0.10}
          duration={0.6}
          amount={0.2}
          once
          aria-label="ข้อมูลการติดต่อ"
          exit={{ opacity: 0, y: 10 }}
        >
          <FadeInWhenVisible as="article" className={styles.infoCard} y={16} delay={0.14}>
            <Phone size={28} strokeWidth={1.8} aria-hidden />
            <h3>โทรศัพท์</h3>
            <p>0-2123-xxxx</p>
          </FadeInWhenVisible>

          <FadeInWhenVisible as="article" className={styles.infoCard} y={16} delay={0.20}>
            <Mail size={28} strokeWidth={1.8} aria-hidden />
            <h3>อีเมล</h3>
            <p>contact@hospital.go.th</p>
          </FadeInWhenVisible>

          <FadeInWhenVisible as="article" className={styles.infoCard} y={16} delay={0.26}>
            <MapPin size={28} strokeWidth={1.8} aria-hidden />
            <h3>ที่อยู่</h3>
            <p>xxx/45 xxx แขวงศูนย์กลาง xxx กรุงเทพฯ</p>
          </FadeInWhenVisible>
        </FadeInWhenVisible>

        {/* Form */}
        <FadeInWhenVisible
          as="section"
          className={styles.formSection}
          y={30}
          delay={0.14}
          duration={0.6}
          amount={0.2}
          once
          aria-labelledby="contact-form-title"
          exit={{ opacity: 0, y: 10 }}
        >
          <FadeInWhenVisible as="h2" id="contact-form-title" className={styles.formTitle} y={14} delay={0.18}>
            ส่งข้อความถึงเรา
          </FadeInWhenVisible>

          <form className={styles.contactForm} onSubmit={onSubmit} noValidate>
            <FadeInWhenVisible as="div" className={styles.formGroup} y={12} delay={0.22}>
              <label htmlFor="name">ชื่อของคุณ</label>
              <input id="name" name="name" type="text" placeholder="กรอกชื่อของคุณ" />
            </FadeInWhenVisible>

            <FadeInWhenVisible as="div" className={styles.formGroup} y={12} delay={0.26}>
              <label htmlFor="email">อีเมล</label>
              <input id="email" name="email" type="email" placeholder="กรอกอีเมลของคุณ" />
            </FadeInWhenVisible>

            <FadeInWhenVisible as="div" className={styles.formGroup} y={12} delay={0.30}>
              <label htmlFor="message">ข้อความ</label>
              <textarea id="message" name="message" rows={5} placeholder="พิมพ์ข้อความของคุณ"></textarea>
            </FadeInWhenVisible>

            <FadeInWhenVisible as="div" y={12} delay={0.34}>
              <button type="submit" className={styles.submitButton}>
                <Send size={20} strokeWidth={1.8} aria-hidden />
                <span className="sr-only">ส่งข้อความ</span>
                <span aria-hidden>ส่งข้อความ</span>
              </button  >
            </FadeInWhenVisible>
          </form>
        </FadeInWhenVisible>
      </AnimatePresence>
    </main>
  );
}
