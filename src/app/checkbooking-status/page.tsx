'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaSearch, FaSpinner, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Lottie from 'lottie-react';
import animationData from '@/animations/Online-doctor.json';
import FadeInWhenVisible from '@/components/ui/FadeInWhenVisible';

import styles from './styles/Checkbooking-status.module.css';

/* ---------- Types ---------- */
type ToastKind = 'success' | 'error';
type ToastData = { icon: ReactNode; text: string; type: ToastKind };

type BookingAPI =
  | { error?: undefined; bookingId: string; status: string }
  | { error: string };

export default function CheckBookingPage() {
  const [bookingId, setBookingId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const toastTimer = useRef<number | null>(null);
  const router = useRouter();

  const showToast = (content: ToastData) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast(content);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = bookingId.trim();
    if (!id || loading) return;

    setLoading(true);
    try {
      const { data } = await axios.get<BookingAPI>(`/api/booking/${encodeURIComponent(id)}`);
      if ('error' in data && data.error) throw new Error(data.error);

      showToast({
        icon: <FaCheckCircle className={styles.toastIcon} />,
        text: 'ค้นหาสำเร็จ! กำลังไปยังหน้าสถานะ...',
        type: 'success',
      });
      setTimeout(() => router.push(`/booking-progress/${id}`), 900);
    } catch {
      showToast({
        icon: <FaTimesCircle className={styles.toastIcon} />,
        text: 'ไม่พบข้อมูลการจอง',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- ARIA state ---------- */
  const isInvalid = toast?.type === 'error';
  const errorId = 'bookingId-error';

  const ariaInvalidProps = isInvalid
    ? { 'aria-invalid': 'true' as const, 'aria-errormessage': errorId }
    : {};

  return (
    <main className={styles.wrapper}>
      {/* Toast */}
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.text + toast.type}
            className={`${styles.toastContainer} ${toast.type === 'error' ? styles.error : ''}`}
            role="alert"
            aria-live="polite"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <div className={styles.toastContent}>
              {toast.type === 'error' ? (
                <FaTimesCircle className={`${styles.toastIcon} ${styles.error}`} />
              ) : (
                <FaCheckCircle className={styles.toastIcon} />
              )}
              <span className={`${styles.toastText} ${toast.type === 'error' ? styles.error : ''}`}>
                {toast.text}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card */}
      <FadeInWhenVisible as="div" className={styles.card}>
        <div className={styles.contentRow}>
          {/* Lottie image */}
          <div className={styles.leftImage} aria-hidden="true">
            <Lottie animationData={animationData} loop />
          </div>

          {/* Search form */}
          <div className={styles.rightForm}>
            <h1 className={styles.title}>ตรวจสอบสถานะการจอง</h1>
            <p className={styles.subtitle}>
              กรอกเลขที่การจองที่ได้รับจากเจ้าหน้าที่เพื่อตรวจสอบข้อมูล
            </p>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <label htmlFor="bookingId" className={styles.label}>
                เลขที่การจอง
              </label>
              <input
                id="bookingId"
                name="bookingId"
                className={styles.input}
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="กรอกเลขที่การจอง"
                title="เลขที่การจอง"
                required
                {...ariaInvalidProps}   /* ✅ กระจายแค่เมื่อ invalid */
              />

              {/* ข้อความ error สำหรับ screen reader */}
              {isInvalid && (
                <span id={errorId} className="sr-only">
                  ไม่พบข้อมูลการจอง กรุณาตรวจสอบเลขที่การจองอีกครั้ง
                </span>
              )}

              <div className={styles.buttonRow}>
                <button
                  type="submit"
                  className={styles.btnCheck}
                  disabled={loading || !bookingId.trim()}
                >
                  {loading ? (
                    <>
                      <FaSpinner className={styles.iconSpin} /> กำลังตรวจสอบ...
                    </>
                  ) : (
                    <>
                      <FaSearch /> ตรวจสอบสถานะ
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className={styles.btnBack}
                  onClick={() => router.push('/')}
                  disabled={loading}
                >
                  <FaArrowLeft /> กลับหน้าแรก
                </button>
              </div>
            </form>
          </div>
        </div>
      </FadeInWhenVisible>
    </main>
  );
}
