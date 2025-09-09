'use client';

import { useEffect, useRef, useState } from 'react';
import FadeInWhenVisible from '@/components/ui/FadeInWhenVisible'; // << ใช้ตัวนี้
import './styles/form-layout.css';

type ToastKind = 'success' | 'error';
type ToastData = { text: string; type: ToastKind };

export default function SpecialRoomPage() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [right, setRight] = useState<string>('');
  const toastTimer = useRef<number | null>(null);

  const showToast = (text: string, type: ToastKind) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ text, type });
    toastTimer.current = window.setTimeout(() => setToast(null), 2500);
  };

  const onlyDigits = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const ok = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (ok.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (right === 'other') {
      const other = (form.elements.namedItem('rightOther') as HTMLInputElement)?.value?.trim();
      if (!other) {
        setFormStatus('error');
        showToast('โปรดระบุสิทธิการรักษา (อื่น ๆ)', 'error');
        window.setTimeout(() => setFormStatus('idle'), 700);
        return;
      }
    }

    if (!form.checkValidity()) {
      setFormStatus('error');
      showToast('กรอกข้อมูลให้ครบถ้วนและยอมรับเงื่อนไข', 'error');
      window.setTimeout(() => setFormStatus('idle'), 700);
      return;
    }

    setFormStatus('success');
    showToast('บันทึกข้อมูลสำเร็จ', 'success');
    window.setTimeout(() => {
      form.reset();
      setRight('');
      setFormStatus('idle');
    }, 1000);
  };

  useEffect(() => () => { if (toastTimer.current) window.clearTimeout(toastTimer.current); }, []);

  return (
    <main className="gov-form container">
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`} role="status" aria-live="polite">
          {toast.text}
        </div>
      )}

      {/* ห่อหัวเรื่องด้วย FadeInWhenVisible */}
      <FadeInWhenVisible as="h2" className="page-title" y={16} duration={0.5} amount={0.15}>
        จองห้องพิเศษออนไลน์
      </FadeInWhenVisible>

      <form onSubmit={handleSubmit} className={`form ${formStatus === 'error' ? 'is-error' : ''}`} noValidate>
        {/* 1) ผู้ป่วย */}
        <FadeInWhenVisible as="fieldset" className="fieldset card" y={18} delay={0.02} duration={0.45}>
          <legend className="legend"><span className="legend-no">1)</span> ข้อมูลผู้ป่วย</legend>

          <div className="grid-3 gap-12">
            <div className="form-group">
              <label htmlFor="title" className="form-label">คำนำหน้า</label>
              <select id="title" name="title" className="form-control select" defaultValue="">
                <option value="">--เลือกคำนำหน้า--</option>
                <option>นาย</option>
                <option>นาง</option>
                <option>นางสาว</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="firstName" className="form-label">ชื่อ<span className="req">*</span></label>
              <input id="firstName" name="firstName" className="form-control" type="text" required placeholder="ชื่อ" />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">นามสกุล<span className="req">*</span></label>
              <input id="lastName" name="lastName" className="form-control" type="text" required placeholder="นามสกุล" />
            </div>
          </div>

          <div className="grid-3 gap-12">
            <div className="form-group">
              <label htmlFor="cid" className="form-label">เลขบัตรประชาชน<span className="req">*</span></label>
              <input
                id="cid"
                name="cid"
                className="form-control"
                type="text"
                inputMode="numeric"
                pattern="^[0-9]{13}$"
                onKeyDown={onlyDigits}
                required
                placeholder="กรอกเลขบัตร 13 หลัก"
                title="เลขบัตรประชาชน 13 หลัก"
              />
            </div>

            <div className="form-group">
              <label htmlFor="an" className="form-label">เลข AN</label>
              <input id="an" name="an" className="form-control" type="text" placeholder="AN (ถ้ามี)" />
            </div>

            <div className="form-group">
              <label htmlFor="hn" className="form-label">เลข HN</label>
              <input id="hn" name="hn" className="form-control" type="text" placeholder="HN (ถ้ามี)" />
            </div>
          </div>
        </FadeInWhenVisible>

        {/* 2) สิทธิการรักษา */}
        <FadeInWhenVisible as="fieldset" className="fieldset card" aria-labelledby="rightLegend" y={18} delay={0.06} duration={0.45}>
          <legend id="rightLegend" className="legend"><span className="legend-no">2)</span> สิทธิการรักษา <span className="req">*</span></legend>

          <div className="grid-2 gap-8" role="radiogroup" aria-labelledby="rightLegend">
            <label className="radio"><input type="radio" name="right" value="government" checked={right === 'government'} onChange={e=>setRight(e.target.value)} required /> ข้าราชการ</label>
            <label className="radio"><input type="radio" name="right" value="gold"       checked={right === 'gold'}       onChange={e=>setRight(e.target.value)} /> บัตรทอง</label>
            <label className="radio"><input type="radio" name="right" value="social"     checked={right === 'social'}     onChange={e=>setRight(e.target.value)} /> ประกันสังคม</label>
            <label className="radio"><input type="radio" name="right" value="volunteer"  checked={right === 'volunteer'}  onChange={e=>setRight(e.target.value)} /> อสม.</label>

            <div className="grid-2 gap-8 align-center">
              <label className="radio m-0">
                <input id="right-other" type="radio" name="right" value="other" checked={right === 'other'} onChange={e=>setRight(e.target.value)} />
                อื่น ๆ
              </label>
              <input
                id="rightOther"
                name="rightOther"
                type="text"
                className="form-control input-small"
                placeholder="โปรดระบุ"
                disabled={right !== 'other'}
                aria-label="โปรดระบุสิทธิการรักษาเมื่อเลือก อื่น ๆ"
              />
            </div>
          </div>
        </FadeInWhenVisible>

        {/* 3) วันที่เข้ารักษา */}
        <FadeInWhenVisible as="fieldset" className="fieldset card" y={18} delay={0.10} duration={0.45}>
          <legend className="legend"><span className="legend-no">3)</span> วันที่เข้ารักษา (Admit)<span className="req">*</span></legend>

          <div className="grid-3 gap-12">
            <div className="form-group">
              <label htmlFor="admitDay" className="form-label">วัน</label>
              <select id="admitDay" name="admitDay" className="form-control select" required defaultValue="">
                <option value="">--เลือกวัน--</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="admitMonth" className="form-label">เดือน</label>
              <select id="admitMonth" name="admitMonth" className="form-control select" required defaultValue="">
                <option value="">--เลือกเดือน--</option>
                {['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'].map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="admitYear" className="form-label">ปี</label>
              <input id="admitYear" name="admitYear" className="form-control" type="number" min={2567} required placeholder="เช่น 2568" />
            </div>
          </div>
        </FadeInWhenVisible>

        {/* 4) แผนก */}
        <FadeInWhenVisible as="fieldset" className="fieldset card" y={18} delay={0.14} duration={0.45}>
          <legend className="legend"><span className="legend-no">4)</span> แผนกผู้ป่วย <span className="req">*</span></legend>

          <div className="form-group">
            <label htmlFor="department" className="form-label">แผนก</label>
            <select id="department" name="department" className="form-control select" required defaultValue="">
              <option value="">--เลือกแผนกผู้ป่วย--</option>
              <option>อายุรกรรม</option>
              <option>ศัลยกรรม</option>
              <option>กุมารเวช</option>
            </select>
          </div>
        </FadeInWhenVisible>

        {/* 5) ห้องพิเศษ */}
        <FadeInWhenVisible as="fieldset" className="fieldset card" y={18} delay={0.18} duration={0.45}>
          <legend className="legend"><span className="legend-no">5)</span> ราคาห้องพิเศษ/คืน <span className="req">*</span></legend>

          <div className="form-group">
            <label htmlFor="roomPrice" className="form-label">ประเภท/ราคาห้อง</label>
            <input id="roomPrice" name="roomPrice" className="form-control" type="text" required placeholder="กรอกประเภทหรือราคาห้องพิเศษ" />
          </div>
        </FadeInWhenVisible>

        {/* 6) ผู้จอง */}
        <FadeInWhenVisible as="fieldset" className="fieldset card" y={18} delay={0.22} duration={0.45}>
          <legend className="legend"><span className="legend-no">6)</span> ชื่อผู้จอง <span className="req">*</span></legend>

          <div className="form-group">
            <label htmlFor="bookerName" className="form-label">ชื่อผู้จอง</label>
            <input id="bookerName" name="bookerName" className="form-control" type="text" required placeholder="ชื่อ–สกุล" />
          </div>
        </FadeInWhenVisible>

        {/* 7) เบอร์ติดต่อ */}
        <FadeInWhenVisible as="fieldset" className="fieldset card" y={18} delay={0.26} duration={0.45}>
          <legend className="legend"><span className="legend-no">7)</span> เบอร์ติดต่อ <span className="req">*</span></legend>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">เบอร์ติดต่อ</label>
            <input
              id="phone"
              name="phone"
              className="form-control"
              type="tel"
              inputMode="tel"
              pattern="^0[0-9]{9}$"
              onKeyDown={onlyDigits}
              required
              placeholder="0XXXXXXXXX"
              title="เบอร์ติดต่อ (10 หลัก)"
            />
          </div>
        </FadeInWhenVisible>

        {/* 8) สาเหตุ */}
        <FadeInWhenVisible as="fieldset" className="fieldset card" y={18} delay={0.30} duration={0.45}>
          <legend className="legend"><span className="legend-no">8)</span> สาเหตุการ Admit <span className="req">*</span></legend>

          <div className="form-group">
            <label htmlFor="admitReason" className="form-label">สาเหตุการ Admit</label>
            <textarea id="admitReason" name="admitReason" className="form-control textarea" required placeholder="สาเหตุการ Admit" />
          </div>
        </FadeInWhenVisible>

        {/* Rule & Accept */}
        <FadeInWhenVisible as="fieldset" className="fieldset card" aria-labelledby="ruleLegend" y={18} delay={0.34} duration={0.45}>
          <legend id="ruleLegend" className="legend">ข้อปฏิบัติในการเข้าห้องพิเศษ</legend>

          <div className="scroll-box" id="rulesBox">
            <p className="text-danger">* กรุณาอ่านก่อนบันทึกข้อมูล</p>
            <ol>
              <li>ก่อนออกจากห้องตรวจ ต้องได้รับอนุญาตจากแพทย์</li>
              <li>กรอกข้อมูลตามแบบฟอร์มให้ครบถ้วน</li>
              <li>จองห้องพิเศษล่วงหน้าได้ไม่เกิน 1 วัน</li>
              <li>ห้องพิเศษมีผู้เข้าพักได้ 1 คน</li>
            </ol>
          </div>

          <label className="check mt-12">
            <input id="acceptRule" name="acceptRule" type="checkbox" required aria-describedby="rulesBox" />
            <span>ยอมรับเงื่อนไข</span>
          </label>
        </FadeInWhenVisible>

        {/* Buttons (คงเดิม ไม่ต้องอนิเมต) */}
        <div className="button-row mt-16">
          <button type="submit" className="btn btn-primary">บันทึกข้อมูล</button>
          <button type="reset" className="btn btn-secondary">เริ่มใหม่</button>
        </div>
      </form>
    </main>
  );
}
