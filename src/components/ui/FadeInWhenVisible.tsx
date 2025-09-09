'use client';

import React, { forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';

/** พิมพ์รวม: รองรับ as, motion props และ HTML attributes ของแท็กที่เลือก */
type FadeInProps<E extends React.ElementType> = {
  /** ใช้แท็กอะไรห่อ (เช่น 'div' | 'section' | 'article') */
  as?: E;
  /** หน่วงเวลาเริ่ม (วินาที) */
  delay?: number;
  /** ระยะเวลาอนิเมชัน (วินาที) */
  duration?: number;
  /** ระยะ offset แกน Y ตอนเริ่ม (px) */
  y?: number;
  /** เล่นครั้งเดียวไหม */
  once?: boolean;
  /** สัดส่วนการมองเห็นที่ทริกเกอร์ (0–1) */
  amount?: number;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as'> & MotionProps;

type FadeInWhenVisibleComponent = <E extends React.ElementType = 'div'>(
  props: FadeInProps<E> & { ref?: React.Ref<Element> }
) => React.ReactElement | null;

const FadeInWhenVisible = forwardRef(function FadeInWhenVisible<
  E extends React.ElementType = 'div'
>(
  {
    as,
    delay = 0,
    duration = 0.8,
    y = 40,
    once = true,
    amount = 0.2,
    children,
    ...rest
  }: FadeInProps<E>,
  ref: React.Ref<Element>
) {
  // เลือก motion tag ตาม as; ถ้าไม่เจอใช้ motion.div
  const M = (motion as any)[as || 'div'] ?? motion.div;

  return (
    <M
      ref={ref}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, ease: 'easeOut', delay }}
      {...rest}
    >
      {children}
    </M>
  );
}) as FadeInWhenVisibleComponent;

export default FadeInWhenVisible;
