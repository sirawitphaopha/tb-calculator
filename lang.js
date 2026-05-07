// ════════════════════════════════════════════
//  INTERNATIONALISATION (i18n)
// ════════════════════════════════════════════

const TRANSLATIONS = {
    th: {
        // ── Header ──────────────────────────────
        title:              'Tuberculosis Dose Calculator · สำหรับผู้ใหญ่อายุ >15 ปี',
        subtitle_ref:       'ข้อมูลอ้างอิง:',
        stats_today_label:  'วันนี้',
        stats_total_label:  'รวม',
        stats_unit:         'ครั้ง',
        btn_reset:          'ล้างค่า',
        // ── Validation errors ───────────────────
        err_weight_low:     'น้ำหนักต่ำเกินไป (ต่ำสุด 20 kg)',
        err_weight_high:    'น้ำหนักสูงเกินไป (สูงสุด 200 kg)',
        err_weight_low_lb:  'น้ำหนักต่ำเกินไป (ต่ำสุด 44 lb)',
        err_weight_high_lb: 'น้ำหนักสูงเกินไป (สูงสุด 441 lb)',
        err_height_low:     'ส่วนสูงต่ำเกินไป (ต่ำสุด 100 cm)',
        err_height_high:    'ส่วนสูงสูงเกินไป (สูงสุด 230 cm)',
        err_height_low_in:  'ส่วนสูงต่ำเกินไป (ต่ำสุด 40 in)',
        err_height_high_in: 'ส่วนสูงสูงเกินไป (สูงสุด 91 in)',
        err_age_low:        'อายุต่ำเกินไป (ต่ำสุด 15 ปี)',
        err_age_high:       'อายุสูงเกินไป (สูงสุด 110 ปี)',
        err_scr_low_mgdl:   'ค่า Cr ต่ำเกินไป (ต่ำสุด 0.1 mg/dL)',
        err_scr_high_mgdl:  'ค่า Cr สูงเกินไป (สูงสุด 30 mg/dL)',
        err_scr_low_umol:   'ค่า Cr ต่ำเกินไป (ต่ำสุด 9 μmol/L)',
        err_scr_high_umol:  'ค่า Cr สูงเกินไป (สูงสุด 2652 μmol/L)',
        ph_height_in:       'เช่น 65',
        ph_scr_umol:        'เช่น 88',
        // ── CrCl section ────────────────────────
        crcl_enter_data:        'กรุณากรอกข้อมูลให้ครบ',
        crcl_error:             '⚠️ ข้อมูลบางช่องไม่ถูกต้อง กรุณาตรวจสอบ',
        crcl_short_stature:     (w) => `ส่วนสูง &lt;152 cm → ใช้ <strong>Actual BW (${w} kg)</strong><br><span style="font-size:10px;color:#f97316">⚠️ อาจมีภาวะหลังค่อม ค่า CrCl อาจต่ำกว่าความเป็นจริง</span>`,
        crcl_underweight_warn:  '⚠️ มวลกล้ามเนื้อน้อย ค่า CrCl อาจสูงกว่าความเป็นจริง',
        crcl_renal_low:         '🚨 <strong>CrCl &lt;30</strong> — ปรับ 3 ครั้ง/สัปดาห์',
        crcl_renal_ok:          '✅ CrCl ≥30 — ไม่ต้องปรับขนาดยา',
        egfr_hint:              'กรุณากรอก เพศ อายุ และ Cr',
        bmi_hint:               'กรอกน้ำหนัก + ส่วนสูง',
        scr_low:                (ref) => `⚠️ Serum Creatinine ต่ำกว่าปกติ (ref ${ref}) — ค่า CrCl อาจสูงกว่าความเป็นจริง เนื่องจากการผลิต creatinine ลดลง`,
        scr_high:               (ref) => `⚠️ Serum Creatinine สูงกว่าปกติ (ref ${ref}) — อาจบ่งชี้การทำงานของไตลดลง ควรติดตาม CrCl อย่างใกล้ชิด`,
        scr_ref:                (ref) => `Serum Creatinine อ้างอิง: ${ref}`,
        scr_male_ref:           'ชาย 0.7–1.2 mg/dL',
        scr_female_ref:         'หญิง 0.5–1.0 mg/dL',
        scr_both_ref:           'ชาย 0.7–1.2 · หญิง 0.5–1.0 mg/dL',
        // ── Input section ───────────────────────
        lbl_weight:         'น้ำหนักตัว (ABW)',
        lbl_sex:            'เพศกำเนิด',
        btn_female:         'หญิง',
        btn_male:           'ชาย',
        warn_sex:           '⚠ กรุณาเลือกเพศ',
        lbl_height:         'ส่วนสูง',
        lbl_age:            'อายุ (ปี)',
        ph_scr:             'เช่น 1.0',
        ph_height:          'เช่น 165',
        ph_age:             'เช่น 45',
        warn_crcl_age:      '⚠ CrCl อาจไม่แม่นยำ',
        crcl_bw_basis:      'อิงตาม Actual / Ideal / Adjusted BW',
        age_range_note:     'เฉพาะอายุ 18–92 ปี',
        // ── BMI labels ──────────────────────────
        bmi_underweight:    'Underweight (ผอม)',
        bmi_normal:         'Normal Weight (ปกติ)',
        bmi_overweight:     'Overweight (น้ำหนักเกิน)',
        bmi_obese1:         'Obese I (อ้วนระดับ 1)',
        bmi_obese2:         'Obese II (อ้วนระดับ 2)',
        bmi_obese3:         'Obese III (อ้วนระดับ 3)',
        // ── CrCl BW labels ──────────────────────
        bw_underweight:     'Underweight',
        bw_obese:           'Obese',
        bw_normal:          'Normal',
    },
    en: {
        // ── Header ──────────────────────────────
        title:              'Tuberculosis Dose Calculator · For adults >15 years',
        subtitle_ref:       'References:',
        stats_today_label:  'Today',
        stats_total_label:  'Total',
        stats_unit:         'visits',
        btn_reset:          'Reset',
        // ── Validation errors ───────────────────
        err_weight_low:     'Weight too low (min 20 kg)',
        err_weight_high:    'Weight too high (max 200 kg)',
        err_weight_low_lb:  'Weight too low (min 44 lb)',
        err_weight_high_lb: 'Weight too high (max 441 lb)',
        err_height_low:     'Height too low (min 100 cm)',
        err_height_high:    'Height too high (max 230 cm)',
        err_height_low_in:  'Height too low (min 40 in)',
        err_height_high_in: 'Height too high (max 91 in)',
        err_age_low:        'Age too low (min 15 years)',
        err_age_high:       'Age too high (max 110 years)',
        err_scr_low_mgdl:   'Cr too low (min 0.1 mg/dL)',
        err_scr_high_mgdl:  'Cr too high (max 30 mg/dL)',
        err_scr_low_umol:   'Cr too low (min 9 μmol/L)',
        err_scr_high_umol:  'Cr too high (max 2652 μmol/L)',
        ph_height_in:       'e.g. 65',
        ph_scr_umol:        'e.g. 88',
        // ── CrCl section ────────────────────────
        crcl_enter_data:        'Enter patient data to calculate',
        crcl_error:             '⚠️ Some values are out of range, please review',
        crcl_short_stature:     (w) => `Height &lt;152 cm → Use <strong>Actual BW (${w} kg)</strong><br><span style="font-size:10px;color:#f97316">⚠️ Possible kyphosis — CrCl may be underestimated</span>`,
        crcl_underweight_warn:  '⚠️ Low muscle mass — CrCl may be overestimated',
        crcl_renal_low:         '🚨 <strong>CrCl &lt;30</strong> — Dose 3×/week',
        crcl_renal_ok:          '✅ CrCl ≥30 — No renal dose adjustment',
        egfr_hint:              'Enter sex, age, and Cr',
        bmi_hint:               'Enter weight and height',
        scr_low:                (ref) => `⚠️ Serum Cr below normal range (ref ${ref}) — CrCl may be overestimated due to reduced creatinine production`,
        scr_high:               (ref) => `⚠️ Serum Cr above normal range (ref ${ref}) — may indicate reduced renal function, monitor CrCl closely`,
        scr_ref:                (ref) => `Serum Creatinine reference: ${ref}`,
        scr_male_ref:           'Male 0.7–1.2 mg/dL',
        scr_female_ref:         'Female 0.5–1.0 mg/dL',
        scr_both_ref:           'Male 0.7–1.2 · Female 0.5–1.0 mg/dL',
        // ── Input section ───────────────────────
        lbl_weight:         'Actual Body Weight (ABW)',
        lbl_sex:            'Sex (at birth)',
        btn_female:         'Female',
        btn_male:           'Male',
        warn_sex:           '⚠ Please select sex',
        lbl_height:         'Height',
        lbl_age:            'Age (years)',
        ph_scr:             'e.g. 1.0',
        ph_height:          'e.g. 165',
        ph_age:             'e.g. 45',
        warn_crcl_age:      '⚠ CrCl may be unreliable',
        crcl_bw_basis:      'Based on Actual / Ideal / Adjusted BW',
        age_range_note:     'Valid for ages 18–92',
        // ── BMI labels ──────────────────────────
        bmi_underweight:    'Underweight',
        bmi_normal:         'Normal Weight',
        bmi_overweight:     'Overweight',
        bmi_obese1:         'Obese I',
        bmi_obese2:         'Obese II',
        bmi_obese3:         'Obese III',
        // ── CrCl BW labels ──────────────────────
        bw_underweight:     'Underweight',
        bw_obese:           'Obese',
        bw_normal:          'Normal',
    }
};

let currentLang = 'th';

// ─── ตรวจ IP ผ่าน Cloudflare CDN-CGI trace ─
async function detectCountry() {
    try {
        const res  = await fetch('/cdn-cgi/trace');
        const text = await res.text();
        const loc  = text.match(/loc=(\w+)/)?.[1];
        return loc || 'TH';
    } catch(e) {
        return 'TH';
    }
}

// ─── โหลดภาษาตอนเริ่มต้น ───────────────────
async function initLang() {
    const saved = localStorage.getItem('tbcalc_lang');
    let changed = false;
    if (saved === 'th' || saved === 'en') {
        currentLang = saved;
        changed = currentLang !== 'th';
    } else {
        const country = await detectCountry();
        currentLang = country === 'TH' ? 'th' : 'en';
        changed = currentLang !== 'th';
        localStorage.setItem('tbcalc_lang', currentLang);
    }
    applyLang();
    // re-render dynamic texts ถ้าภาษาต่างจาก default (th)
    if (changed && typeof calculate === 'function') calculate();
}

// ─── สลับภาษา ──────────────────────────────
function toggleLang() {
    currentLang = currentLang === 'th' ? 'en' : 'th';
    localStorage.setItem('tbcalc_lang', currentLang);
    applyLang();
    if (typeof calculate === 'function') calculate();
    if (typeof trackEvent === 'function') trackEvent('toggle_lang', currentLang);
}

// ─── ใส่ข้อความตามภาษาที่เลือก ────────────
function applyLang() {
    const t = TRANSLATIONS[currentLang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key] !== undefined) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (t[key] !== undefined) el.placeholder = t[key];
    });

    const btn  = document.getElementById('langToggleBtn');
    const flag = document.getElementById('langFlag');
    if (flag) {
        flag.className = currentLang === 'th' ? 'fi fi-us' : 'fi fi-th';
    }
    if (btn) {
        const label = btn.childNodes[btn.childNodes.length - 1];
        if (label) label.textContent = currentLang === 'th' ? ' EN' : ' TH';
    }

    document.documentElement.lang = currentLang === 'th' ? 'th' : 'en';
}

// ─── helper: ดึงข้อความตาม key (รองรับ function) ─
function t(key, ...args) {
    const val = (TRANSLATIONS[currentLang] || TRANSLATIONS.th)[key] ?? key;
    return typeof val === 'function' ? val(...args) : val;
}

document.addEventListener('DOMContentLoaded', initLang);
