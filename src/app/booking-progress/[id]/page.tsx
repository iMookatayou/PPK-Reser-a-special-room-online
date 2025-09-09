'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

import FadeInWhenVisible from '@/components/ui/FadeInWhenVisible'; // ใช้คอมโพเนนต์ที่ให้มา
import styles from '../styles/BookingProgressPage.module.css';

/* ---------- Types ---------- */
type Status =
  | 'รอตรวจ'
  | 'กำลังตรวจสอบ'
  | 'ได้รับการจอง'
  | 'ได้ห้องแล้ว'
  | 'ยกเลิก';

type Booking = {
  id: string | number;
  fullName: string;
  building: string;
  status: Status | string; // กันกรณี backend ส่งค่าอื่นมา
};

const STEPS: Array<{ key: Status; label: string }> = [
  { key: 'รอตรวจ', label: 'รอตรวจ' },
  { key: 'กำลังตรวจสอบ', label: 'กำลังตรวจสอบ' },
  { key: 'ได้รับการจอง', label: 'ได้รับการจอง' },
  { key: 'ได้ห้องแล้ว', label: 'ได้ห้องแล้ว' },
  { key: 'ยกเลิก', label: 'ยกเลิก' },
];

export default function BookingProgressPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ---------- Derived (hooks ต้องมาก่อน early return เสมอ) ---------- */
  const status = bookingData?.status as Status | undefined;

  const currentIndexRaw = useMemo(() => {
    if (!status) return 0; // ระหว่างยังโหลด ให้ default เป็นสเต็ปแรก
    const idx = STEPS.findIndex((s) => s.key === status);
    return idx < 0 ? 0 : idx;
  }, [status]);

  const currentIndex = currentIndexRaw;
  const isCancelled =
    status === 'ยกเลิก' && currentIndex === STEPS.length - 1;

  /* ---------- Fetch ---------- */
  useEffect(() => {
    if (!id) return;

    const ac = new AbortController();

    async function fetchData() {
      try {
        setError(null);
        setBookingData(null);

        const res = await axios.get<Booking>(`/api/booking/${id}`, {
          signal: ac.signal,
        });
        setBookingData(res.data);
      } catch (err: unknown) {
        if (axios.isCancel(err)) return;
        setError('ไม่พบข้อมูลการจอง');
      }
    }

    fetchData();
    return () => ac.abort();
  }, [id]);

  /* ---------- Early UI States (แสดงด้วย FadeInWhenVisible + AnimatePresence) ---------- */
  if (error) {
    return (
      <div className={styles.wrapper}>
        <AnimatePresence mode="wait">
          <FadeInWhenVisible
            as="p"
            key="error"
            className={styles.error}
            y={20}
            delay={0.05}
            duration={0.4}
            // รองรับ fade-out
            exit={{ opacity: 0, y: 10 }}
          >
            <FaTimes style={{ marginRight: 6 }} />
            {error}
          </FadeInWhenVisible>
        </AnimatePresence>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className={styles.wrapper}>
        <AnimatePresence mode="wait">
          <FadeInWhenVisible
            as="p"
            key="loading"
            className={styles.loading}
            y={20}
            delay={0.05}
            duration={0.4}
            exit={{ opacity: 0, y: 10 }}
          >
            <FaSpinner className={styles.spin} style={{ marginRight: 8 }} />
            กำลังโหลดข้อมูล...
          </FadeInWhenVisible>
        </AnimatePresence>
      </div>
    );
  }

  /* ---------- Helpers (ฟังก์ชันปกติ ไม่ใช่ hook) ---------- */
  const getStatusClass = (index: number) => {
    if (isCancelled && index === currentIndex) return styles.cancelled;
    if (index < currentIndex) return styles.done;
    if (index === currentIndex) return styles.active;
    return styles.pending;
  };

  const getCircleContent = (index: number) => {
    if (isCancelled && index === currentIndex) return <FaTimes aria-hidden />;
    if (index < currentIndex) return <FaCheck aria-hidden />;
    if (index === currentIndex) return <FaSpinner className={styles.spin} aria-hidden />;
    return index + 1;
  };

  /* ---------- Main ---------- */
  return (
    <main className={styles.wrapper}>
      <motion.div
        // คงไว้เป็น motion.div ภายนอกเพื่อ entry รวมทั้งหน้า
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ใช้ FadeInWhenVisible กับหัวข้อ/ซับไตเติล */}
        <FadeInWhenVisible as="h1" className={styles.title} y={20} delay={0.05}>
          สถานะการจอง
        </FadeInWhenVisible>

        <FadeInWhenVisible as="h2" className={styles.subtitle} y={18} delay={0.12}>
          ชื่อ: {bookingData.fullName}
        </FadeInWhenVisible>

        <FadeInWhenVisible as="h3" className={styles.subtitle} y={16} delay={0.18}>
          หอพัก: {bookingData.building}
        </FadeInWhenVisible>

        {/* Stepper ทั้งบล็อก fade-in */}
        <FadeInWhenVisible
          as="div"
          className={styles.lineStepper}
          y={24}
          delay={0.22}
          duration={0.6}
          amount={0.15}
          once
          role="list"
          aria-label="ลำดับสถานะการจอง"
        >
          <AnimatePresence initial={false}>
            {STEPS.map((step, index) => (
              // ใช้ key = step.key เหมือนเดิม
              <FadeInWhenVisible
                as="div"
                key={step.key}
                className={styles.stepContainer}
                role="listitem"
                // ทำ stagger ด้วย delay ไล่ตาม index
                delay={0.28 + index * 0.06}
                y={16}
                duration={0.5}
                // เผื่อรายการหายไป (อนาคต): ให้มี exit ด้วย
                exit={{ opacity: 0, y: 8 }}
              >
                <div
                  className={`${styles.circle} ${getStatusClass(index)}`}
                  aria-current={index === currentIndex ? 'step' : undefined}
                  aria-label={
                    index === currentIndex
                      ? `ขั้นตอนปัจจุบัน: ${step.label}`
                      : `ขั้นตอน: ${step.label}`
                  }
                  title={step.label}
                >
                  {getCircleContent(index)}
                </div>

                {index < STEPS.length - 1 && (
                  <motion.div
                    className={`${styles.line} ${index < currentIndex ? styles.lineActive : ''}`}
                    aria-hidden
                    initial={{ scaleX: 0, opacity: 0.4, originX: 0 }}
                    animate={{
                      scaleX: index < currentIndex ? 1 : 0.2,
                      opacity: index < currentIndex ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.45 }}
                  />
                )}

                <div className={styles.label}>{step.label}</div>
              </FadeInWhenVisible>
            ))}
          </AnimatePresence>
        </FadeInWhenVisible>
      </motion.div>
    </main>
  );
}
