// ════════════════════════════════════════════
//  INTERNATIONALISATION (i18n)
// ════════════════════════════════════════════

const TRANSLATIONS = {
    th: {
        // ── Header ──────────────────────────────
        title:              'Tuberculosis Dose Calculator · สำหรับผู้ใหญ่อายุ >15 ปี',
        title_mobile:       'Tuberculosis Dose Calculator · สำหรับอายุ >15 ปี',
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
        crcl_no_height:         '⚠ กรอกส่วนสูงเพื่อความแม่นยำ',
        crcl_enter_height:      'กรอกส่วนสูง',
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
        // ── Footer ──────────────────────────────
        footer_disclaimer:  'โปรแกรมนี้ช่วยคำนวณขนาดยาวัณโรคเบื้องต้นเท่านั้น การตัดสินใจรักษาขึ้นอยู่กับดุลยพินิจของผู้ประกอบวิชาชีพ',
        footer_visitors:    'ผู้เข้าชม',
        footer_dev:         'พัฒนาโดย เภสัชกร สิรวิชญ์ เผ่าผา · โรงพยาบาลปรางค์กู่ จังหวัดศรีสะเกษ',
        footer_version:     'Version 1.6.5 · เผยแพร่ 14 พฤษภาคม พ.ศ. 2569',
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
        // ── Table headers ───────────────────────
        tbl_tabs_caps:      '+ จำนวนเม็ด/แคป',
        tbl_actual_dose:    'โดสจริง',
        tbl_actual_mgkg:    'mg/kg จริง',
        // ── Drug units ──────────────────────────
        unit_tablet:        'เม็ด',
        unit_capsule:       'แคป',
        warn_cap_unsplit:   '⚠️ ~12–15 mg/kg สูงกว่า range เพราะแคปหักไม่ได้',
        // ── Renal labels ────────────────────────
        renal_no_adj:       'ไม่ต้องปรับ',
        renal_3x_week:      '3 ครั้ง/สัปดาห์',
        renal_2_3x_week:    '2–3 ครั้ง/สัปดาห์',
        renal_mwf:          '(จ.พ.ศ.)',
        renal_reduce_3x:    'ปรับเป็น 3 ครั้ง/สัปดาห์',
        renal_3x_mwf:       '3 ครั้ง/สัปดาห์ (จ.พ.ศ.)',
        renal_adjust_if:    (thresh) => `ต้องปรับ CrCl <${thresh}`,
        // ── mg/kg labels ────────────────────────
        mgkg_too_low:       'ต่ำมาก',
        mgkg_slightly_low:  'ต่ำเล็กน้อย',
        mgkg_too_high:      'สูงมาก',
        mgkg_slightly_high: 'สูงเล็กน้อย',
        mgkg_normal:        'ปกติ',
        mgkg_exceeds_max:   '⛔ เกิน Max',
        // ── Age warnings >65 ────────────────────
        age_warn_h:         'เสี่ยง peripheral neuropathy และ hepatotoxicity สูงขึ้น แนะนำให้ Pyridoxine (B6) 25–50 mg/day ร่วมด้วย',
        age_warn_r:         'เสี่ยง hyperbilirubinemia ติดตามอาการตัวเหลืองตาเหลือง',
        age_warn_z:         'เสี่ยง hepatotoxicity สูงขึ้น ติดตาม LFT อย่างใกล้ชิด',
        age_warn_e:         'เสี่ยง optic neuropathy สูงขึ้น ตรวจ visual acuity ก่อนและระหว่างการรักษา',
        age_warn_s:         'เสี่ยง ototoxicity และ nephrotoxicity สูง พิจารณาลด dose ติดตามการได้ยินและไตใกล้ชิด',
        age_warn_am:        'เสี่ยง ototoxicity และ nephrotoxicity สูงขึ้น ติดตาม TDM (ถ้า รพ. ทำได้)',
        age_warn_lfx:       'เสี่ยง QT prolongation และ tendon rupture สูงขึ้น ตรวจ ECG ก่อนใช้ ระวังการหกล้ม',
        age_65_prefix:      '>65 ปี:',
        bdq_14_days:        '14 วัน',
        bdq_then:           'จากนั้น',
        cs_renal_alt:       'หรือ 500 mg 3 ครั้ง/สัปดาห์',
        // ── Dose input ──────────────────────────
        dose_placeholder:   'กรอกโดสจริง (mg)',
        dose_placeholder_mobile: 'กรอกโดสจริง',
        word_or:            'หรือ',
        calc_range_exceeds: (mg) => `⚠️ calc range เกิน max (${mg} mg)`,
        // ── FDC Table ────────────────────────────
        tbl1_title:          '1. ยาต้านวัณโรคแนวที่ 1',
        fdc_title:           '2. ยาเม็ดรวม (FDC)',
        tbl3_title:          '3. ยาวัณโรคดื้อยา (MDR-TB)',
        fdc_subtitle:        '*แถบสีเขียว = น้ำหนักปัจจุบัน*',
        fdc_col_weight:      'น้ำหนัก',
        fdc_splittable:      'หักได้',
        fdc_low_banner:      '❌ น้ำหนัก <30 kg — WHO ไม่แนะนำให้ใช้ FDC ในผู้ใหญ่ที่น้ำหนักน้อยกว่า 30 kg ให้ใช้ยาเดี่ยวแทน',
        fdc_no_fdc_lowwt:    '❌ WHO ไม่แนะนำ FDC สำหรับน้ำหนัก <30 kg — ใช้ยาเดี่ยวตามตาราง First-Line ด้านบน',
        fdc_renal_title:     '🚨 CrCl <30 mL/min — ห้ามใช้ HRZE (Rifafour)',
        fdc_renal_p1:        'Z และ E ต้องปรับเป็น <strong>3 ครั้ง/สัปดาห์</strong> แต่ Rifafour เป็น fixed combination แยก dose ไม่ได้ — ถ้ากิน Rifafour 3 ครั้ง/สัปดาห์ จะทำให้ H และ R ต่ำเกินไปด้วย',
        fdc_renal_p2:        '✅ <strong>ให้แยกยาเดี่ยว:</strong> H + R กินทุกวัน · Z + E ปรับเป็น 3 ครั้ง/สัปดาห์ (ดูตารางยาเดี่ยวด้านบน)',
        fdc_renal_p3:        '✅ <strong>Rifinah (HR) ยังใช้ได้ตามปกติ</strong> — ไม่มี Z และ E จึงไม่กระทบ',
        fdc_contraindicated: '❌ ห้ามใช้',
        fdc_reverse_title:   '🔁 คำนวณย้อนกลับ — กรอกจำนวนเม็ดที่ผู้ป่วยได้รับ',
        fdc_reverse_hint:    'รับทศนิยมได้ เช่น 1.5, 2.5 เม็ด · กรอกได้เพียง 1 ชนิด FDC ต่อครั้ง (Rifafour หรือ Rifinah)',
        fdc_reverse_note:    '* Z และ E มาจาก Rifafour เท่านั้น · Rifinah ให้เฉพาะ R และ H',
        ph_fdc_tabs:         'เม็ด',
        fdc_enter_weight:    'กรอกน้ำหนัก',
        fdc_rev_too_low:     'ต่ำมาก ↓',
        fdc_rev_sl_low:      'ค่อนข้างต่ำ ↓',
        fdc_rev_too_high:    'สูงมาก ↑',
        fdc_rev_sl_high:     'ค่อนข้างสูง ↑',
        fdc_rev_normal:      'ปกติ ✓',
        // ── Hepatotoxicity (DILI) ─────────────────
        dili_title:          'เฝ้าระวัง Hepatotoxicity / Drug-Induced Liver Injury (DILI)',
        dili_stop:           'หยุด H, R, Z ทันที เมื่อ ALT/AST:',
        dili_sym_desc:       'มีอาการ (คลื่นไส้ อาเจียน อ่อนเพลีย ตาเหลือง)',
        dili_asym_desc:      'ไม่มีอาการ',
        dili_while:          'ระหว่างหยุด H,R,Z → ให้ E + Lfx/Mfx + S (หรือ Am) · ติดตาม LFT ทุกสัปดาห์',
        dili_rechallenge:    'Rechallenge เมื่อ ALT &lt;2× ULN: RE + Lfx → 3–7 วัน → HRE (หยุด Lfx) · <span class="text-red-600 font-bold">ห้ามนำ Z กลับ</span>',
        dili_no_z_regimen:   'หาก Z rechallenge ไม่ได้ → ต่อด้วย 2HRE/7HR (รวม 9 เดือน)',
        dili_bili_note:      '* ภาวะ indirect bilirubin สูงเพียงอย่างเดียวจาก RIF (ไม่มี ALT ↑) — ไม่ต้องหยุดยา',
    },
    en: {
        // ── Header ──────────────────────────────
        title:              'Tuberculosis Dose Calculator · For adults >15 years',
        title_mobile:       'Tuberculosis Dose Calculator · For age >15 years',
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
        crcl_no_height:         '⚠ Enter height for accuracy',
        crcl_enter_height:      'Enter height',
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
        // ── Footer ──────────────────────────────
        footer_disclaimer:  'This calculator is intended as a dosing reference only. Clinical decisions remain the responsibility of the treating clinician.',
        footer_visitors:    'Visitors',
        footer_dev:         'Developed by Sirawit Phaopha, Pharmacist · Prang Ku Hospital, Sisaket, Thailand',
        footer_version:     'Version 1.6.5 · Released 14 May 2026',
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
        // ── Table headers ───────────────────────
        tbl_tabs_caps:      '+ tablets/capsules',
        tbl_actual_dose:    'Actual Dose',
        tbl_actual_mgkg:    'Actual mg/kg',
        // ── Drug units ──────────────────────────
        unit_tablet:        'tablet',
        unit_capsule:       'capsule',
        warn_cap_unsplit:   '⚠️ ~12–15 mg/kg above range (capsule unsplittable)',
        // ── Renal labels ────────────────────────
        renal_no_adj:       'No adjustment',
        renal_3x_week:      '3 times/week',
        renal_2_3x_week:    '2–3 times/week',
        renal_mwf:          '(Mon/Wed/Fri)',
        renal_reduce_3x:    'Reduce to 3 times/week',
        renal_3x_mwf:       '3 times/week (Mon/Wed/Fri)',
        renal_adjust_if:    (thresh) => `Adjust if CrCl <${thresh}`,
        // ── mg/kg labels ────────────────────────
        mgkg_too_low:       'Too low',
        mgkg_slightly_low:  'Slightly low',
        mgkg_too_high:      'Too high',
        mgkg_slightly_high: 'Slightly high',
        mgkg_normal:        'Normal',
        mgkg_exceeds_max:   '⛔ Exceeds Max',
        // ── Age warnings >65 ────────────────────
        age_warn_h:         'Increased risk of peripheral neuropathy and hepatotoxicity — recommend Pyridoxine (B6) 25–50 mg/day',
        age_warn_r:         'Increased risk of hyperbilirubinemia — monitor LFT and signs of jaundice',
        age_warn_z:         'Increased risk of hepatotoxicity — monitor LFT closely',
        age_warn_e:         'Increased risk of optic neuropathy — baseline and periodic visual acuity testing recommended',
        age_warn_s:         'High risk of ototoxicity and nephrotoxicity — consider dose reduction; monitor audiometry and renal function',
        age_warn_am:        'Increased risk of ototoxicity and nephrotoxicity — monitor TDM if available',
        age_warn_lfx:       'Increased risk of QT prolongation and tendon rupture — ECG before use, fall precautions',
        age_65_prefix:      '>65 yrs:',
        bdq_14_days:        '14 days',
        bdq_then:           'Then',
        cs_renal_alt:       'or 500 mg 3 times/week',
        // ── Dose input ──────────────────────────
        dose_placeholder:   'Enter dose (mg)',
        dose_placeholder_mobile: 'Enter dose',
        word_or:            'or',
        calc_range_exceeds: (mg) => `⚠️ calculated range exceeds maximum (${mg} mg)`,
        // ── FDC Table ────────────────────────────
        tbl1_title:          '1. First-Line Antituberculosis Drugs',
        fdc_title:           '2. Fixed-Dose Combinations (FDC)',
        tbl3_title:          '3. Drug-Resistant Tuberculosis (MDR-TB)',
        fdc_subtitle:        '*Green row = current weight*',
        fdc_col_weight:      'Weight',
        fdc_splittable:      'splittable',
        fdc_low_banner:      '❌ Weight <30 kg — WHO does not recommend FDC for adults below 30 kg; use individual drugs instead',
        fdc_no_fdc_lowwt:    '❌ WHO does not recommend FDC for weight <30 kg — use individual drugs from the First-Line table above',
        fdc_renal_title:     '🚨 CrCl <30 mL/min — Rifafour (HRZE) is contraindicated',
        fdc_renal_p1:        'Z and E require dose reduction to <strong>3 times/week</strong>; however, Rifafour is a fixed combination and cannot be dose-separated — administering Rifafour 3 times/week would result in subtherapeutic H and R levels',
        fdc_renal_p2:        '✅ <strong>Switch to individual drugs:</strong> H + R daily · Z + E 3 times/week (see First-Line table above)',
        fdc_renal_p3:        '✅ <strong>Rifinah (HR) may be continued</strong> — contains no Z or E, therefore unaffected',
        fdc_contraindicated: '❌ Contraindicated',
        fdc_reverse_title:   '🔁 Reverse Calculator — Enter number of tablets dispensed',
        fdc_reverse_hint:    'Accepts decimals e.g. 1.5, 2.5 tablets · Enter one FDC type at a time (Rifafour or Rifinah)',
        fdc_reverse_note:    '* Z and E are derived from Rifafour only · Rifinah provides R and H only',
        ph_fdc_tabs:         'tabs',
        fdc_enter_weight:    'Enter weight',
        fdc_rev_too_low:     'Too low ↓',
        fdc_rev_sl_low:      'Slightly low ↓',
        fdc_rev_too_high:    'Too high ↑',
        fdc_rev_sl_high:     'Slightly high ↑',
        fdc_rev_normal:      'Normal ✓',
        // ── Hepatotoxicity (DILI) ─────────────────
        dili_title:          'Monitor Hepatotoxicity / Drug-Induced Liver Injury (DILI)',
        dili_stop:           'Discontinue H, R, Z immediately when ALT/AST:',
        dili_sym_desc:       'symptoms (nausea, vomiting, fatigue, jaundice)',
        dili_asym_desc:      'without symptoms',
        dili_while:          'While withholding H,R,Z → give E + Lfx/Mfx + S (or Am) · Monitor LFT weekly',
        dili_rechallenge:    'Rechallenge when ALT &lt;2× ULN: RE + Lfx → 3–7 days → HRE (stop Lfx) · <span class="text-red-600 font-bold">Do not reintroduce Z</span>',
        dili_no_z_regimen:   'If Z cannot be reintroduced → complete 2HRE/7HR (9 months total)',
        dili_bili_note:      '* Isolated indirect hyperbilirubinemia from RIF (no ALT elevation) — no need to discontinue',
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
    document.body.classList.toggle('lang-en', currentLang === 'en');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key] !== undefined) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (t[key] !== undefined) el.placeholder = t[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.dataset.i18nHtml;
        const val = t[key];
        if (val !== undefined) el.innerHTML = typeof val === 'function' ? val() : val;
    });

    const btn  = document.getElementById('langToggleBtn');
    const flag = document.getElementById('langFlag');
    if (flag) flag.className = currentLang === 'th' ? 'fi fi-us' : 'fi fi-th';
    if (btn) {
        const label = btn.childNodes[btn.childNodes.length - 1];
        if (label) label.textContent = currentLang === 'th' ? ' EN' : ' TH';
    }
    const footerFlag  = document.getElementById('footerLangFlag');
    const footerLabel = document.getElementById('footerLangLabel');
    if (footerFlag)  footerFlag.className  = currentLang === 'th' ? 'fi fi-us' : 'fi fi-th';
    if (footerLabel) footerLabel.textContent = currentLang === 'th' ? 'EN' : 'TH';

    document.documentElement.lang = currentLang === 'th' ? 'th' : 'en';
}

// ─── helper: ดึงข้อความตาม key (รองรับ function) ─
function t(key, ...args) {
    const val = (TRANSLATIONS[currentLang] || TRANSLATIONS.th)[key] ?? key;
    return typeof val === 'function' ? val(...args) : val;
}

document.addEventListener('DOMContentLoaded', initLang);
