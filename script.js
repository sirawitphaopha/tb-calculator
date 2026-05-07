// ════════════════════════════════════════════
//  DRUG DOSE HELPERS
//  ยาที่มี: H100 (หัก) · R300/R450 (แคป หักไม่ได้) · Z500 (หัก) · E400/E500 (หัก)
// ════════════════════════════════════════════

function hDose(w) {
    // Thai NTP ตาราง 5.1: ≥35 kg → 300 mg · <35 kg → คำนวณตาม H100
    if (w < 25) return { mg:100, tab:'H100 × 1 เม็ด',   warn:false };
    if (w < 35) return { mg:150, tab:'H100 × 1½ เม็ด',  warn:false };
    return       { mg:300, tab:'H100 × 3 เม็ด',   warn:false };
}

function rDose(w) {
    // R capsule หักไม่ได้ → ต้องใช้ขนาดเต็มแคป
    // 20-24 kg: R300 = 12.5–15 mg/kg → เกิน range 8–12 (แต่เลี่ยงไม่ได้)
    if (w < 25)  return { mg:300, tab:'R300 × 1 แคป', warn:true,  warnMsg:'⚠️ ~12–15 mg/kg สูงกว่า range เพราะแคปหักไม่ได้' };
    if (w < 35)  return { mg:300, tab:'R300 × 1 แคป', warn:false };
    if (w <= 49) return { mg:450, tab:'R450 × 1 แคป', warn:false };
    return        { mg:600, tab:'R300 × 2 แคป', warn:false };
}

function zDose(w) {
    // Thai NTP ตาราง 5.1: 35-49→1,000 · 50-69→1,500 · ≥70→2,000
    if (w < 25)  return { mg:500,  tab:'Z500 × 1 เม็ด'  };
    if (w < 35)  return { mg:750,  tab:'Z500 × 1½ เม็ด' };
    if (w <= 49) return { mg:1000, tab:'Z500 × 2 เม็ด'  };
    if (w <= 69) return { mg:1500, tab:'Z500 × 3 เม็ด'  };
    return        { mg:2000, tab:'Z500 × 4 เม็ด'  };
}

function eDose(w) {
    // Thai NTP ตาราง 5.1: 35-49→800 · 50-69→1,000 · ≥70→1,200
    if (w < 25)  return { mg:400,  tab:'E400 × 1 เม็ด'  };
    if (w < 35)  return { mg:500,  tab:'E500 × 1 เม็ด'  };
    if (w <= 49) return { mg:800,  tab:'E400 × 2 เม็ด'  };
    if (w <= 69) return { mg:1000, tab:'E500 × 2 เม็ด'  };
    return        { mg:1200, tab:'E400 × 3 เม็ด'  };
}

function sDose(w, ageOver65) {
    // Streptomycin IM injection (vial 1g)
    let mg;
    if (w < 35)      mg = Math.round(w * 15 / 50) * 50;  // ~15 mg/kg ปัดร้อยมิลลิกรัม
    else if (w <= 49) mg = 500;
    else if (w <= 69) mg = 750;
    else              mg = 1000;

    const tabTxt  = `${mg >= 1000 ? '1 g' : mg + ' mg'} IM`;
    const ageWarn = ageOver65 && mg > 750;
    return { mg, tab: tabTxt, warn: false, ageWarn };
}

// ─── Format: rec dose column ───────────────
function fmtRec(d, w) {
    const mgStr = d.mg.toLocaleString('th-TH') + ' mg';
    const col   = d.warn ? 'text-orange-600' : 'text-teal-900';
    let html    = `<div class="font-bold leading-tight ${col}" style="font-size:16px">${mgStr}</div>`;
    html       += `<div class="text-slate-500 leading-tight" style="font-size:12px">${d.tab}</div>`;
    if (w < 35) {
        html += `<div class="text-[9px] text-slate-400">(${(d.mg/w).toFixed(1)} mg/kg)</div>`;
    }
    if (d.warn && d.warnMsg) {
        html += `<div class="text-[9px] text-orange-600 font-semibold mt-0.5">${d.warnMsg}</div>`;
    }
    return html;
}

// ─── Format: renal dose column ─────────────
function fmtRenal(d, requiresAdj) {
    if (!requiresAdj) return '<span class="text-slate-400" style="font-size:14px">ไม่ต้องปรับ</span>';
    const mgStr = d.mg.toLocaleString('th-TH') + ' mg';
    return `<div class="font-bold text-red-700 leading-tight" style="font-size:16px">${mgStr}</div>
            <div class="text-slate-500 leading-tight" style="font-size:12px">${d.tab}</div>
            <div class="text-[11px] text-red-600 font-bold mt-0.5 leading-tight">3 ครั้ง/สัปดาห์<br>(จ.พ.ศ.)</div>`;
}

// ════════════════════════════════════════════
//  FDC — WHO Adult Bands (Rifinah-300 หักได้)
// ════════════════════════════════════════════
const fdcBands = [
    { min:30, max:37,  label:'30–37 kg', rfr:'2 เม็ด', rf150:'2 เม็ด', rf300:'1 เม็ด' },
    { min:38, max:54,  label:'38–54 kg', rfr:'3 เม็ด', rf150:'3 เม็ด', rf300:'1½ เม็ด' },
    { min:55, max:70,  label:'55–70 kg', rfr:'4 เม็ด', rf150:'4 เม็ด', rf300:'2 เม็ด' },
    { min:71, max:999, label:'&gt;70 kg', rfr:'5 เม็ด', rf150:'4 เม็ด', rf300:'2½ เม็ด' }
];

// ════════════════════════════════════════════
//  CrCl helper
// ════════════════════════════════════════════
function calcCrCl(bw, age, scr, gender) {
    let v = ((140 - age) * bw) / (72 * scr);
    return gender === 'female' ? v * 0.85 : v;
}

// ════════════════════════════════════════════
//  DOSE CACHE — เก็บค่า input โดสจริงไม่ให้หายตอน re-render
// ════════════════════════════════════════════
const doseCache = {};
const _validationErrorCache = {};  // field → last tracked invalid value
const _validationErrorTimer = {};  // field → debounce timer
let scrUnit    = 'mgdl'; // 'mgdl' | 'umol'
let weightUnit = 'kg';  // 'kg'   | 'lb'
let heightUnit = 'cm';  // 'cm'   | 'inch'

// ════════════════════════════════════════════
//  BMI CLASSIFICATION (WHO Global)
// ════════════════════════════════════════════
function getBmiClass(bmi) {
    // WHO Asia-Pacific cutoffs
    if (bmi < 18.5) return { label: t('bmi_underweight'), color:'#d97706', bg:'#fef3c7', barPct: 20 };
    if (bmi < 23)   return { label: t('bmi_normal'),      color:'#16a34a', bg:'#dcfce7', barPct: 40 };
    if (bmi < 25)   return { label: t('bmi_overweight'),  color:'#f97316', bg:'#fff7ed', barPct: 58 };
    if (bmi < 30)   return { label: t('bmi_obese1'),      color:'#f87171', bg:'#fee2e2', barPct: 70 };
    if (bmi < 35)   return { label: t('bmi_obese2'),      color:'#ef4444', bg:'#fee2e2', barPct: 84 };
    return               { label: t('bmi_obese3'),      color:'#dc2626', bg:'#fee2e2', barPct:100 };
}

// ════════════════════════════════════════════
//  FDC REVERSE CALCULATOR
// ════════════════════════════════════════════
// FDC mutual exclusivity — กรอก Rifafour แล้ว lock Rifinah และกลับกัน
window.lockFdc = function(active) {
    const rfr   = document.getElementById('rifafourTabs');
    const rf150 = document.getElementById('rifinah150Tabs');
    const rf300 = document.getElementById('rifinah300Tabs');
    const lockStyle = 'background:#f1f5f9;opacity:0.5;cursor:not-allowed';
    const clearStyle = '';

    // ถ้าช่องที่ active ถูกล้างออก → unlock ทั้งหมด
    const val = { rifafour: rfr.value, rifinah150: rf150.value, rifinah300: rf300.value };
    if (!val[active] || parseFloat(val[active]) === 0) {
        // ล้างค่าช่องนี้แล้ว unlock ทั้งหมด
        [rfr, rf150, rf300].forEach(el => { el.disabled = false; el.style.cssText = clearStyle; });
        return;
    }

    if (active === 'rifafour') {
        rf150.value = ''; rf150.disabled = true; rf150.style.cssText = lockStyle;
        rf300.value = ''; rf300.disabled = true; rf300.style.cssText = lockStyle;
    } else {
        rfr.value = ''; rfr.disabled = true; rfr.style.cssText = lockStyle;
        // Rifinah-150 และ 300 ใช้ร่วมกันได้ (ผู้ป่วยบางรายอาจได้รับทั้งสอง)
    }
};

function calcFdcReverse() {
    const rfr   = parseFloat(document.getElementById('rifafourTabs').value)   || 0;
    const rf150 = parseFloat(document.getElementById('rifinah150Tabs').value) || 0;
    const rf300 = parseFloat(document.getElementById('rifinah300Tabs').value) || 0;
    const w     = parseFloat(document.getElementById('weight').value) || 0;
    const res   = document.getElementById('fdcReverseResult');

    if (rfr <= 0 && rf150 <= 0 && rf300 <= 0) { res.classList.add('hidden'); scheduleFdcReverseTracking(0,0,0,0,0,0,0); return; }
    res.classList.remove('hidden');

    // คำนวณ mg รวม
    const rMg = rfr*150 + rf150*150 + rf300*300;
    const hMg = rfr*75  + rf150*100 + rf300*150;
    const zMg = rfr*400;
    const eMg = rfr*275;

    scheduleFdcReverseTracking(rfr, rf150, rf300, rMg, hMg, zMg, eMg);
    document.getElementById('fdcR_mg').textContent = `${rMg} mg`;
    document.getElementById('fdcH_mg').textContent = `${hMg} mg`;
    document.getElementById('fdcZ_mg').textContent = zMg > 0 ? `${zMg} mg` : '—';
    document.getElementById('fdcE_mg').textContent = eMg > 0 ? `${eMg} mg` : '—';

    // Helper: สีและ warning label สำหรับแต่ละกล่อง
    function applyBoxStyle(boxId, mgKgId, mgVal, min, max, noData) {
        const box = document.getElementById(boxId);
        const el  = document.getElementById(mgKgId);
        if (noData) {
            el.innerHTML = '<span style="color:#94a3b8">—</span>';
            box.style.borderColor = '#e2e8f0';
            box.style.background = 'white';
            return;
        }
        const mkgVal = (mgVal / w).toFixed(1);
        const v = parseFloat(mkgVal);
        let color, bg, warn;
        if      (v < min * 0.9) { color='#b91c1c'; bg='#fee2e2'; warn='ต่ำมาก ↓'; }
        else if (v < min)       { color='#d97706'; bg='#fef3c7'; warn='ค่อนข้างต่ำ ↓'; }
        else if (v > max * 1.1) { color='#b91c1c'; bg='#fee2e2'; warn='สูงมาก ↑'; }
        else if (v > max)       { color='#f97316'; bg='#fff7ed'; warn='ค่อนข้างสูง ↑'; }
        else                    { color='#059669'; bg='#d1fae5'; warn='ปกติ ✓'; }

        el.innerHTML = `<span style="color:${color};font-weight:700">${mkgVal} mg/kg</span><br><span style="color:${color};font-size:9px">${warn}</span>`;
        box.style.borderColor = color;
        box.style.background  = bg;
    }

    if (w > 0) {
        applyBoxStyle('fdcBoxR','fdcR_kgmg', rMg, 8, 12, false);
        applyBoxStyle('fdcBoxH','fdcH_kgmg', hMg, 4, 6, false);
        applyBoxStyle('fdcBoxZ','fdcZ_kgmg', zMg, 20, 30, zMg === 0);
        applyBoxStyle('fdcBoxE','fdcE_kgmg', eMg, 15, 20, eMg === 0);
    } else {
        ['fdcR_kgmg','fdcH_kgmg','fdcZ_kgmg','fdcE_kgmg'].forEach(id => {
            document.getElementById(id).textContent = 'กรอกน้ำหนัก';
        });
    }
}

// ════════════════════════════════════════════
//  MG/KG ACTUAL — color for dose input column
// ════════════════════════════════════════════
function mgKgColor(val, min, max) {
    if (val < min * 0.85) return { color:'#b91c1c', label:'ต่ำมาก' };
    if (val < min)        return { color:'#d97706', label:'ต่ำเล็กน้อย' };
    if (val > max * 1.15) return { color:'#b91c1c', label:'สูงมาก' };
    if (val > max)        return { color:'#f97316', label:'สูงเล็กน้อย' };
    return                       { color:'#059669', label:'ปกติ' };
}


const LIMITS = {
    weight: { min:20,  max:200, minKey:'err_weight_low',   maxKey:'err_weight_high' },
    height: { min:100, max:230, minKey:'err_height_low',   maxKey:'err_height_high' },
    age:    { min:15,  max:110, minKey:'err_age_low',      maxKey:'err_age_high' },
    scr:    { min:0.1, max:30,  minKey:'err_scr_low_mgdl', maxKey:'err_scr_high_mgdl' }
};

function validateField(id) {
    const el   = document.getElementById(id);
    const val  = parseFloat(el.value);
    const lim  = LIMITS[id];
    const wrap = el.closest('.field-wrap');
    if (wrap) { const old = wrap.querySelector('.tooltip-error'); if (old) old.remove(); }
    if (!el.value || isNaN(val)) {
        el.classList.remove('input-error');
        el.style.borderColor = '';
        el.style.backgroundColor = '';
        if (id === 'age') { const aw = document.getElementById('ageWarnInline'); if (aw) aw.style.visibility = 'hidden'; }
        return true;
    }
    // Age: hard block <15/>110; soft CrCl warning outside 18–92
    if (id === 'age') {
        const ageWarnEl = document.getElementById('ageWarnInline');
        if (val < 15 || val > 110) {
            const msg = val < 15 ? t('err_age_low') : t('err_age_high');
            el.classList.add('input-error');
            el.style.borderColor = ''; el.style.backgroundColor = '';
            if (wrap) { const tip = document.createElement('div'); tip.className='tooltip-error'; tip.textContent=msg; wrap.appendChild(tip); }
            if (ageWarnEl) ageWarnEl.style.visibility = 'hidden';
            if (typeof trackEvent === 'function') {
                clearTimeout(_validationErrorTimer.age);
                _validationErrorTimer.age = setTimeout(() => {
                    if (_validationErrorCache.age !== val) {
                        _validationErrorCache.age = val;
                        trackEvent('validation_error', 'age', val);
                    }
                }, 1500);
            }
            return false;
        }
        delete _validationErrorCache.age;
        el.classList.remove('input-error');
        if (val < 18 || val > 92) {
            el.style.borderColor = '#f97316'; el.style.backgroundColor = '#fff7ed';
            if (ageWarnEl) ageWarnEl.style.visibility = 'visible';
        } else {
            el.style.borderColor = ''; el.style.backgroundColor = '';
            if (ageWarnEl) ageWarnEl.style.visibility = 'hidden';
        }
        return true;
    }
    const msg = val < lim.min ? t(lim.minKey) : val > lim.max ? t(lim.maxKey) : null;
    if (msg) {
        el.classList.add('input-error');
        if (wrap) { const tip = document.createElement('div'); tip.className='tooltip-error'; tip.textContent=msg; wrap.appendChild(tip); }
        if (typeof trackEvent === 'function') {
            clearTimeout(_validationErrorTimer[id]);
            _validationErrorTimer[id] = setTimeout(() => {
                if (_validationErrorCache[id] !== val) {
                    _validationErrorCache[id] = val;
                    trackEvent('validation_error', id, val);
                }
            }, 1500);
        }
        return false;
    }
    delete _validationErrorCache[id];
    el.classList.remove('input-error');
    el.style.borderColor = '';
    el.style.backgroundColor = '';
    return true;
}

function validateWeight(val) {
    const el     = document.getElementById('weight');
    const slider = document.getElementById('weightSlider');
    const lim    = LIMITS.weight;
    const old    = document.getElementById('weightTooltip');
    if (old) old.remove();
    if (!val || isNaN(val)) { el.classList.remove('input-error'); slider.style.opacity='1'; return true; }
    const msg = val < lim.min ? t(lim.minKey) : val > lim.max ? t(lim.maxKey) : null;
    if (msg) {
        el.classList.add('input-error'); slider.style.opacity='0.4';
        const tip = document.createElement('div'); tip.id='weightTooltip'; tip.className='tooltip-error';
        tip.style.cssText='position:absolute;z-index:50;margin-top:2px'; tip.textContent=msg;
        el.parentElement.parentElement.style.position='relative';
        el.parentElement.parentElement.appendChild(tip);
        if (typeof trackEvent === 'function') {
            clearTimeout(_validationErrorTimer.weight);
            _validationErrorTimer.weight = setTimeout(() => {
                if (_validationErrorCache.weight !== val) {
                    _validationErrorCache.weight = val;
                    trackEvent('validation_error', 'weight', val);
                }
            }, 1500);
        }
        return false;
    }
    delete _validationErrorCache.weight;
    el.classList.remove('input-error'); slider.style.opacity='1';
    return true;
}

// BUG FIX: init lockFdc state on page load (in case browser autofill)
window.addEventListener('load', () => {
    const rfr = document.getElementById('rifafourTabs');
    if (rfr && parseFloat(rfr.value) > 0) lockFdc('rifafour');
});

// ════════════════════════════════════════════
//  WEIGHT UNIT TOGGLE
// ════════════════════════════════════════════
function toggleWeightUnit() {
    const input  = document.getElementById('weight');
    const slider = document.getElementById('weightSlider');
    const btn    = document.getElementById('weightUnitBtn');
    const val    = parseFloat(input.value);
    if (weightUnit === 'kg') {
        weightUnit = 'lb';
        if (!isNaN(val)) input.value = Math.round(val * 2.20462);
        input.min = '44'; input.max = '441'; input.step = '1';
        btn.textContent = 'lb ⇄';
        LIMITS.weight = { min:44, max:441, minKey:'err_weight_low_lb', maxKey:'err_weight_high_lb' };
    } else {
        weightUnit = 'kg';
        if (!isNaN(val)) input.value = Math.round(val / 2.20462);
        input.min = '20'; input.max = '200'; input.step = '1';
        btn.textContent = 'kg ⇄';
        LIMITS.weight = { min:20, max:200, minKey:'err_weight_low', maxKey:'err_weight_high' };
    }
    const kg = weightUnit === 'lb' ? parseFloat(input.value) / 2.20462 : parseFloat(input.value);
    if (!isNaN(kg)) slider.value = Math.min(200, Math.max(20, kg));
    calculate();
    trackEvent('unit_toggle', 'weight_' + weightUnit);
}

// ════════════════════════════════════════════
//  HEIGHT UNIT TOGGLE
// ════════════════════════════════════════════
function toggleHeightUnit() {
    const input = document.getElementById('height');
    const btn   = document.getElementById('heightUnitBtn');
    const lbl   = document.getElementById('heightUnitLabel');
    const val   = parseFloat(input.value);
    if (heightUnit === 'cm') {
        heightUnit = 'inch';
        if (!isNaN(val)) input.value = (val / 2.54).toFixed(1);
        input.min = '40'; input.max = '91'; input.step = '0.5';
        input.placeholder = t('ph_height_in');
        btn.textContent = 'in ⇄'; lbl.textContent = 'in';
        LIMITS.height = { min:40, max:91, minKey:'err_height_low_in', maxKey:'err_height_high_in' };
    } else {
        heightUnit = 'cm';
        if (!isNaN(val)) input.value = Math.round(val * 2.54);
        input.min = '100'; input.max = '230'; input.step = '1';
        input.placeholder = t('ph_height');
        btn.textContent = 'cm ⇄'; lbl.textContent = 'cm';
        LIMITS.height = { min:100, max:230, minKey:'err_height_low', maxKey:'err_height_high' };
    }
    calculate();
    trackEvent('unit_toggle', 'height_' + heightUnit);
}

// ════════════════════════════════════════════
//  SCR UNIT TOGGLE
// ════════════════════════════════════════════
function toggleScrUnit() {
    const input = document.getElementById('scr');
    const btn   = document.getElementById('scrUnitBtn');
    const lbl   = document.getElementById('scrUnitLabel');
    const val   = parseFloat(input.value);
    if (scrUnit === 'mgdl') {
        scrUnit = 'umol';
        if (!isNaN(val)) input.value = Math.round(val * 88.4);
        input.step = '1'; input.min = '9'; input.max = '2652';
        input.placeholder = t('ph_scr_umol');
        btn.textContent = 'μmol/L ⇄'; lbl.textContent = 'μmol/L';
        LIMITS.scr = { min:9, max:2652, minKey:'err_scr_low_umol', maxKey:'err_scr_high_umol' };
    } else {
        scrUnit = 'mgdl';
        if (!isNaN(val)) input.value = (val / 88.4).toFixed(2);
        input.step = '0.01'; input.min = '0.1'; input.max = '30';
        input.placeholder = t('ph_scr');
        btn.textContent = 'mg/dL ⇄'; lbl.textContent = 'mg/dL';
        LIMITS.scr = { min:0.1, max:30, minKey:'err_scr_low_mgdl', maxKey:'err_scr_high_mgdl' };
    }
    calculate();
    trackEvent('unit_toggle', 'scr_' + scrUnit);
}

// ════════════════════════════════════════════
//  RESET ALL
// ════════════════════════════════════════════
function resetAll() {
    // inputs
    document.getElementById('weight').value = '50';
    document.getElementById('weightSlider').value = '50';
    document.getElementById('height').value = '';
    document.getElementById('age').value = '';
    document.getElementById('scr').value = '';
    // reset weight unit to kg
    if (weightUnit !== 'kg') {
        weightUnit = 'kg';
        const wi = document.getElementById('weight');
        wi.min = '20'; wi.max = '200'; wi.step = '1';
        document.getElementById('weightUnitBtn').textContent = 'kg ⇄';
        LIMITS.weight = { min:20, max:200, minKey:'err_weight_low', maxKey:'err_weight_high' };
    }
    // reset height unit to cm
    if (heightUnit !== 'cm') {
        heightUnit = 'cm';
        const hi = document.getElementById('height');
        hi.min = '100'; hi.max = '230'; hi.step = '1'; hi.placeholder = t('ph_height');
        document.getElementById('heightUnitBtn').textContent = 'cm ⇄';
        document.getElementById('heightUnitLabel').textContent = 'cm';
        LIMITS.height = { min:100, max:230, minKey:'err_height_low', maxKey:'err_height_high' };
    }
    // reset scr unit to mg/dL
    if (scrUnit !== 'mgdl') {
        scrUnit = 'mgdl';
        const scrInput = document.getElementById('scr');
        scrInput.step = '0.01'; scrInput.min = '0.1'; scrInput.max = '30';
        scrInput.placeholder = t('ph_scr');
        document.getElementById('scrUnitBtn').textContent = 'mg/dL ⇄';
        document.getElementById('scrUnitLabel').textContent = 'mg/dL';
        LIMITS.scr = { min:0.1, max:30, minKey:'err_scr_low_mgdl', maxKey:'err_scr_high_mgdl' };
    }
    document.getElementById('gender').value = '';
    document.getElementById('btnMale').className   = 'flex-1 text-sm font-semibold transition-colors bg-white text-slate-400';
    document.getElementById('btnFemale').className = 'flex-1 text-sm font-semibold transition-colors border-r border-teal-300 bg-white text-slate-400';

    // FDC reverse
    ['rifafourTabs','rifinah150Tabs','rifinah300Tabs'].forEach(id => {
        const el = document.getElementById(id);
        el.value = ''; el.disabled = false; el.style.cssText = '';
    });
    const res = document.getElementById('fdcReverseResult');
    if (res) res.classList.add('hidden');

    // inline warnings
    const genderWarnEl = document.getElementById('genderWarnInline');
    const ageWarnEl    = document.getElementById('ageWarnInline');
    if (genderWarnEl) genderWarnEl.style.visibility = 'hidden';
    if (ageWarnEl)    ageWarnEl.style.visibility = 'hidden';

    // doseCache
    Object.keys(doseCache).forEach(k => delete doseCache[k]);
    trackEvent('reset');

    // remove all validation styles
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.tooltip-error').forEach(el => el.remove());
    document.querySelectorAll('[style]').forEach(el => {
        if (el.style.borderColor) el.style.borderColor = '';
        if (el.style.backgroundColor && el.id !== 'btnMale' && el.id !== 'btnFemale') el.style.backgroundColor = '';
    });

    calculate();
}
function setGender(val) {
    document.getElementById('gender').value = val;
    const male   = document.getElementById('btnMale');
    const female = document.getElementById('btnFemale');
    const activeM   = 'flex-1 text-sm font-semibold transition-colors bg-teal-600 text-white';
    const activeF   = 'flex-1 text-sm font-semibold transition-colors border-r border-teal-300 bg-teal-600 text-white';
    const inactiveM = 'flex-1 text-sm font-semibold transition-colors bg-white text-slate-400';
    const inactiveF = 'flex-1 text-sm font-semibold transition-colors border-r border-teal-300 bg-white text-slate-400';
    male.className   = val === 'male'   ? activeM : inactiveM;
    female.className = val === 'female' ? activeF : inactiveF;
    calculate();
}

function toggleMobileView() {
    const app = document.getElementById('appContainer');
    const btn = document.getElementById('mobileToggleBtn');
    const existing = document.getElementById('mobileForceStyle');
    const isMobile = !!existing;

    if (isMobile) {
        existing.remove();
        app.style.maxWidth = '';
        btn.textContent = '📱 Mobile View';
    } else {
        app.style.maxWidth = '390px';
        const style = document.createElement('style');
        style.id = 'mobileForceStyle';
        style.textContent = `
            #crclBmiWrapper { display: grid !important; grid-template-columns: 1fr 6.5rem; grid-template-rows: auto auto auto auto; gap: 0.4rem; align-items: start; }
            #crclTopBox      { display: contents !important; }
            #crclHeaderBw    { display: contents !important; }
            #crclContentRow  { display: contents !important; }
            #crclTitleRow { grid-column: 1; grid-row: 1; background:#f8fafc; border:1px solid #e2e8f0; border-bottom:none; border-radius:0.5rem 0.5rem 0 0; padding:0.5rem 0.625rem 0.375rem; }
            #bwBoxes { grid-column: 1; grid-row: 2; background:#f8fafc; border:1px solid #e2e8f0; border-top:none; border-radius:0 0 0.5rem 0.5rem; padding:0.25rem 0.625rem 0.5rem; flex-wrap:wrap; display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.3rem; }
            .bw-box { width:auto !important; min-width:0 !important; padding:3px 4px; }
            .bw-box p:first-child { font-size:9px; }
            .bw-box p:last-child { font-size:12px; }
            #bmiBox { grid-column: 2; grid-row: 1 / span 2; width:auto !important; align-self:start; }
            /* BMI box mobile - ลดแค่ subtitle และ class text 30% ไม่แตะคำว่า BMI */
            #bmiBox .text-sm.font-bold span { font-size: 7px !important; }
            #bmiClass { font-size: 7px !important; }
            #bmiBar, #bmiNote { display: none !important; }
            #recCrclBox { grid-column: 1 / -1; grid-row: 3; flex-direction:column !important; align-items:flex-start !important; padding:6px 8px; gap:2px; }
            #crclBottomZone { grid-column: 1 / -1; grid-row: 4; background:#f8fafc; border:1px solid #e2e8f0; border-radius:0.5rem; display:block !important; }
            #crclValueInline { display:none !important; }
            #scrRefWarning { display:none !important; }
            #recCrclText { font-size:11px; }
            #inputWrapper { flex-direction:column !important; gap:0.5rem; }
            #weightSection { width:100% !important; }
            #fieldGrid { grid-template-columns:1fr 1fr !important; gap:0.4rem; }
            #fieldGender { order:1; } #fieldScr { order:2; } #fieldHeight { order:3; } #fieldAge { order:4; }
            #fieldGrid label { font-size:10px !important; height:auto !important; margin-bottom:2px !important; }
            #fieldGrid input { height:2rem !important; font-size:12px !important; padding:0 6px !important; }
            #mainTitle { font-size:1rem !important; }
            table th { padding:4px 5px !important; font-size:11px !important; }
            table td { padding:3px 4px !important; font-size:11px !important; }
            table td input { height:3rem !important; font-size:12px !important; }
            .hidden.md\\:table-cell { display:none !important; }
        `;
        document.head.appendChild(style);
        btn.textContent = '🖥 Desktop View';
    }
}

// ════════════════════════════════════════════
//  SYNC WEIGHT
// ════════════════════════════════════════════
function syncWeight(src) {
    const n = document.getElementById('weight');
    const s = document.getElementById('weightSlider');
    if (src === 'input') {
        const kg = weightUnit === 'lb' ? parseFloat(n.value) / 2.20462 : parseFloat(n.value);
        if (!isNaN(kg)) s.value = Math.min(200, Math.max(20, kg));
    } else {
        n.value = weightUnit === 'lb' ? Math.round(parseFloat(s.value) * 2.20462) : s.value;
    }
    calculate();
}

// ════════════════════════════════════════════
//  MAIN CALCULATE
// ════════════════════════════════════════════
function calculate() {
    const wRaw   = Math.max(0, parseFloat(document.getElementById('weight').value) || 0);
    const w      = weightUnit === 'lb' ? wRaw / 2.20462 : wRaw;
    const h_cmRaw = parseFloat(document.getElementById('height').value);
    const h_cm   = heightUnit === 'inch' ? h_cmRaw * 2.54 : h_cmRaw;
    const age    = parseFloat(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const scrRaw = parseFloat(document.getElementById('scr').value);
    const scr    = scrUnit === 'umol' ? scrRaw / 88.4 : scrRaw;

    // ── Validate all fields ──────────────────
    const wOk = validateWeight(wRaw);
    const hOk = validateField('height');
    const aOk = validateField('age');
    const sOk = validateField('scr');
    const hasError = !wOk || !hOk || !aOk || !sOk;

    // ── Gender warning ───────────────────────
    const crclNeedsGender = Number.isFinite(scr) || Number.isFinite(h_cm) || Number.isFinite(age);
    const genderField  = document.getElementById('fieldGender');
    const genderBtnRow = genderField ? genderField.querySelector('.flex.h-9') : null;
    const genderWarnEl = document.getElementById('genderWarnInline');
    if (!gender && crclNeedsGender) {
        if (genderBtnRow) genderBtnRow.style.borderColor = '#f97316';
        if (genderWarnEl) genderWarnEl.style.visibility = 'visible';
    } else {
        if (genderBtnRow) genderBtnRow.style.borderColor = '';
        if (genderWarnEl) genderWarnEl.style.visibility = 'hidden';
    }

    const ageValid  = Number.isFinite(age);
    const ageOver65 = ageValid && age > 65;

    // ── Age range note color ─────────────────
    const ageRangeNote = document.getElementById('ageRangeNote');
    if (ageRangeNote) {
        const ageOutOfRange = ageValid && (age < 18 || age > 92);
        ageRangeNote.style.color      = ageOutOfRange ? '#f97316' : '';
        ageRangeNote.style.fontWeight = ageOutOfRange ? '700' : '';
    }

    document.getElementById('txtABW').textContent = w > 0 ? w.toFixed(1) : '-';

    // ── BMI ─────────────────────────────────
    const bmiVal  = document.getElementById('bmiValue');
    const bmiCls  = document.getElementById('bmiClass');
    const bmiNote = document.getElementById('bmiNote');
    const bmiBar  = document.getElementById('bmiBarFill');

    if (w > 0 && Number.isFinite(h_cm)) {
        const bmi = w / ((h_cm/100) ** 2);
        const bc  = getBmiClass(bmi);
        bmiVal.innerHTML        = `${bmi.toFixed(1)} <span style="font-size:0.875rem;font-weight:600;color:${bc.color}">kg/m²</span>`;
        bmiVal.style.color      = bc.color;
        bmiCls.textContent      = bc.label;
        bmiCls.style.color      = bc.color;
        bmiBar.style.width      = bc.barPct + '%';
        bmiBar.style.background = bc.color;
    } else {
        bmiVal.innerHTML    = '--.- <span style="font-size:0.875rem;font-weight:600;color:#cbd5e1">kg/m²</span>';
        bmiVal.style.color  = '#cbd5e1';
        bmiCls.textContent  = t('bmi_hint');
        bmiCls.style.color  = '#94a3b8';
        bmiBar.style.width  = '0%';
    }

    // ── Serum Creatinine reference range + eGFR ─────────────
    const scrWarn = document.getElementById('scrRefWarning');
    const crRef = gender === 'male'
        ? { min:0.7, max:1.2, label: t('scr_male_ref') }
        : { min:0.5, max:1.0, label: t('scr_female_ref') };
    const bothRef = t('scr_both_ref');

    // คำนวณ eGFR CKD-EPI 2021
    function calcEGFR(scr, age, sex) {
        if (!Number.isFinite(scr) || !Number.isFinite(age) || !sex) return null;
        const k = sex === 'female' ? 0.7 : 0.9;
        const a = sex === 'female' ? -0.241 : -0.302;
        const ratio = scr / k;
        return 142 * Math.pow(Math.min(ratio,1), a) * Math.pow(Math.max(ratio,1), -1.200) * Math.pow(0.9938, age) * (sex === 'female' ? 1.012 : 1);
    }
    const eGFR = calcEGFR(scr, age, gender);
    const eGFRStr = eGFR !== null
        ? `<span style="font-size:11px;font-weight:600;color:#334155">eGFR (CKD-EPI 2021): ${eGFR.toFixed(1)} mL/min/1.73m²</span>`
        : `<span style="font-size:11px;font-weight:600;color:#64748b">eGFR (CKD-EPI 2021): — <span style="font-weight:400;font-size:10px">(กรุณากรอก เพศ อายุ และ Cr)</span></span>`;

    const line1El = document.getElementById('scrRefLine1');
    const line2El = document.getElementById('scrRefLine2');

    scrWarn.classList.remove('hidden');
    if (Number.isFinite(scr) && scr < crRef.min) {
        scrWarn.className = 'text-[10px] mt-1.5 px-2 py-1 rounded border font-medium text-orange-800 bg-orange-50 border-orange-300';
        if (line1El) line1El.innerHTML = t('scr_low', crRef.label);
    } else if (Number.isFinite(scr) && scr > crRef.max) {
        scrWarn.className = 'text-[10px] mt-1.5 px-2 py-1 rounded border font-medium text-yellow-800 bg-yellow-50 border-yellow-300';
        if (line1El) line1El.innerHTML = t('scr_high', crRef.label);
    } else {
        scrWarn.className = 'text-[10px] mt-1.5 px-2 py-1 rounded border font-medium text-slate-500 bg-slate-100 border-slate-200';
        if (line1El) line1El.innerHTML = t('scr_ref', bothRef);
    }
    // ── Update eGFR box ──────────────────────
    const egfrVal   = document.getElementById('egfrValue');
    const egfrHint  = document.getElementById('egfrHint');
    const egfrStage = document.getElementById('egfrStage');

    function getCKDStage(val) {
        if (val >= 90) return { label:'Stage 1',    color:'#16a34a' };
        if (val >= 60) return { label:'Stage 2',    color:'#65a30d' };
        if (val >= 45) return { label:'Stage 3a',   color:'#d97706' };
        if (val >= 30) return { label:'Stage 3b',   color:'#ea580c' };
        if (val >= 15) return { label:'Stage 4',    color:'#dc2626' };
        return               { label:'Stage 5 (ESRD)', color:'#991b1b' };
    }

    if (egfrVal && egfrHint && egfrStage) {
        const egfrBarEl   = document.getElementById('egfrBar');
        const egfrBarFill = document.getElementById('egfrBarFill');
        if (eGFR !== null) {
            const stage = getCKDStage(eGFR);
            const pct   = Math.min(eGFR / 120 * 100, 100);
            egfrVal.textContent    = eGFR.toFixed(1);
            egfrVal.style.color    = '#94a3b8';
            egfrVal.style.fontSize = '22px';
            egfrStage.innerHTML    = `<span style="color:#64748b;font-weight:500">CKD Stage</span> <span style="font-size:13px;font-weight:800;color:${stage.color}">${stage.label}</span>`;
            egfrHint.textContent   = '';
            if (egfrBarFill) { egfrBarFill.style.width = pct + '%'; egfrBarFill.style.background = stage.color; }
            if (egfrBarEl)   egfrBarEl.style.marginTop = '6px';
        } else {
            egfrVal.textContent    = '—';
            egfrVal.style.color    = '#cbd5e1';
            egfrVal.style.fontSize = '22px';
            egfrStage.innerHTML    = '';
            egfrHint.textContent   = t('egfr_hint');
            if (egfrBarFill) { egfrBarFill.style.width = '0%'; egfrBarFill.style.background = '#cbd5e1'; }
            if (egfrBarEl)   egfrBarEl.style.marginTop = '36px';
        }
    }

    if (line2El) line2El.innerHTML = '';

    // ── Aminoglycoside Dosing Weight (Am, S) ─────────────────
    // ABW < IBW → ABW | ABW ≤ 120% IBW → IBW | ABW > 120% IBW → AdjBW (cap 100 kg)
    function aminoDW(abw, ibw, adjBw, shortStature) {
        if (shortStature || !ibw) return { dw: abw, label: 'Actual BW' };
        if (abw < ibw)            return { dw: abw, label: 'Actual BW' };
        if (abw <= ibw * 1.2)     return { dw: Math.min(ibw, 100), label: 'Ideal BW' };
        return { dw: Math.min(adjBw, 100), label: 'Adjusted BW' };
    }
    let finalCrcl = null;
    const allFilled = w > 0 && Number.isFinite(h_cm) && ageValid && Number.isFinite(scr) && (gender === 'male' || gender === 'female');

    const recBox  = document.getElementById('recCrclBox');
    const recText = document.getElementById('recCrclText');
    const recVal  = document.getElementById('recCrclValue');
    const warnEl  = document.getElementById('renalWarning');
    const icon    = document.getElementById('renalIcon');
    const numSpan = document.getElementById('crclNumber');

    // ── แสดง error state ถ้ากรอกเกินขอบเขต ──
    if (hasError) {
        recBox.className = 'flex-1 min-w-0 bg-red-50 px-3 py-1.5 rounded flex items-center justify-between border border-red-300';
        recText.innerHTML = `<span class="text-red-700 font-semibold">${t('crcl_error')}</span>`;
        numSpan.textContent = '---';
        numSpan.style.color = '#ef4444';
        warnEl.classList.add('hidden');
        icon.classList.add('hidden');
        ['firstLineBody','fdcBody','groupABody','groupCBody'].forEach(id => document.getElementById(id).innerHTML = '');
        document.getElementById('lowWeightBanner').classList.add('hidden');
        document.getElementById('fdcLowBanner').classList.add('hidden');
        document.getElementById('fdcRenalBanner').classList.add('hidden');
        return;
    }

    if (allFilled) {
        const hIn    = h_cm / 2.54;
        const over60 = Math.max(0, hIn - 60);
        const ibw    = gender === 'male' ? 50 + 2.3*over60 : 45.5 + 2.3*over60;
        const adjBw  = ibw + 0.4*(w - ibw);
        // BUG FIX: ส่วนสูง <152 cm → IBW ไม่ valid (อาจหลังค่อม) ใช้ Actual BW ทั้งหมด
        const shortStature = h_cm < 152;

        document.getElementById('txtIBW').textContent   = shortStature ? 'N/A' : ibw.toFixed(1);
        document.getElementById('txtAdjBW').textContent = shortStature ? 'N/A' : adjBw.toFixed(1);

        const cA = calcCrCl(w,    age, scr, gender);
        const cI = shortStature ? null : calcCrCl(ibw,  age, scr, gender);
        const cJ = shortStature ? null : calcCrCl(adjBw,age, scr, gender);

        document.getElementById('crclABW').textContent   = `CrCl ${cA.toFixed(1)}`;
        document.getElementById('crclIBW').textContent   = cI ? `CrCl ${cI.toFixed(1)}` : 'N/A';
        document.getElementById('crclAdjBW').textContent = cJ ? `CrCl ${cJ.toFixed(1)}` : 'N/A';

        const base = 'bw-box px-2 py-1 border border-slate-200 rounded text-center bg-white opacity-60 w-[95px] flex flex-col justify-center';
        const hi   = 'bw-box px-2 py-1 border-2 border-emerald-500 rounded text-center bg-emerald-50 shadow-md w-[95px] flex flex-col justify-center';
        ['boxABW','boxIBW','boxAdjBW'].forEach(id => document.getElementById(id).className = base);

        let label;
        let recBoxColor = 'flex-1 min-w-0 bg-emerald-100 px-3 py-1.5 rounded flex items-center justify-between border border-emerald-300';
        let recTextColor = 'text-emerald-700';

        if (shortStature) {
            finalCrcl = cA;
            document.getElementById('boxABW').className = hi;
            label = t('crcl_short_stature', w.toFixed(1));
            recBoxColor = 'flex-1 min-w-0 bg-orange-50 px-3 py-1.5 rounded flex items-center justify-between border border-orange-300';
            recTextColor = 'text-orange-700';
        } else if (w < ibw) {
            finalCrcl = cA; document.getElementById('boxABW').className = hi;
            label = `${t('bw_underweight')} → <strong>Actual BW (${w.toFixed(1)} kg)</strong><br><span style="font-size:10px;color:#d97706">${t('crcl_underweight_warn')}</span>`;
            recBoxColor = 'flex-1 min-w-0 bg-amber-50 px-3 py-1.5 rounded flex items-center justify-between border border-amber-300';
            recTextColor = 'text-amber-700';
        } else if (w > ibw * 1.2) {
            // สีตาม BMI
            const bmiVal = w / ((h_cm/100)**2);
            let obColor, obBg, obBorder;
            if      (bmiVal < 30) { obColor='#f87171'; obBg='bg-red-50';  obBorder='border-red-300'; }
            else if (bmiVal < 35) { obColor='#ef4444'; obBg='bg-red-50';  obBorder='border-red-400'; }
            else                  { obColor='#dc2626'; obBg='bg-red-50';  obBorder='border-red-500'; }
            finalCrcl = cJ; document.getElementById('boxAdjBW').className = hi;
            label = `${t('bw_obese')} → <strong>Adjusted BW (${adjBw.toFixed(1)} kg)</strong>`;
            recBoxColor = `flex-1 min-w-0 ${obBg} px-3 py-1.5 rounded flex items-center justify-between border ${obBorder}`;
            recTextColor = '';
            recText.innerHTML = `<span style="color:${obColor}">${label}</span>`;
        } else {
            finalCrcl = cI; document.getElementById('boxIBW').className = hi;
            label = `${t('bw_normal')} → <strong>Ideal BW (${ibw.toFixed(1)} kg)</strong>`;
        }

        if (w <= ibw * 1.2) {
            recText.innerHTML = `<span class="${recTextColor}">${label}</span>`;
        }
        recBox.className = recBoxColor;
        numSpan.textContent = finalCrcl.toFixed(1);
        const numSpanM = document.getElementById('crclNumberMobile');
        if (numSpanM) numSpanM.textContent = finalCrcl.toFixed(1);
        icon.classList.remove('hidden');
        warnEl.classList.remove('hidden');

        const mlMin = document.getElementById('crclMlMin');
        const renalIcon2 = document.getElementById('renalIcon');
        if (mlMin) mlMin.style.color = '#94a3b8';
        // สลับ: ซ่อน mL/min แถว 1 แสดง crclRow2 + align left
        const mLSpan = document.querySelector('#recCrclValue > span:last-child');
        const crclRow2 = document.getElementById('crclRow2');
        const crclVI = document.getElementById('crclValueInline');
        if (mLSpan) mLSpan.style.display = 'none';
        if (crclRow2) crclRow2.style.display = 'flex';
        if (crclVI) crclVI.style.alignItems = 'flex-start';

        if (finalCrcl < 30) {
            numSpan.style.color = '#dc2626';
            if (numSpanM) numSpanM.style.color = '#dc2626';
            if (renalIcon2) { renalIcon2.textContent = '🚨'; renalIcon2.classList.remove('hidden'); renalIcon2.style.display = 'inline'; }
            const bz = document.getElementById('crclBottomZone');
            if (bz) { bz.style.background='#fff1f2'; bz.style.borderColor='#fca5a5'; }
            warnEl.innerHTML = t('crcl_renal_low');
            warnEl.className = 'text-[10px] mt-0.5 font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-300 w-fit';
            recBox.className = 'flex-1 min-w-0 bg-red-50 px-3 py-1.5 rounded flex items-center justify-between border border-red-300';
            icon.textContent = '🚨';
        } else {
            numSpan.style.color = '#059669';
            if (numSpanM) numSpanM.style.color = '#059669';
            if (renalIcon2) { renalIcon2.textContent = '🩺'; renalIcon2.classList.remove('hidden'); renalIcon2.style.display = 'inline'; }
            const bz = document.getElementById('crclBottomZone');
            if (bz) { bz.style.background='#f0fdf4'; bz.style.borderColor='#bbf7d0'; }
            warnEl.innerHTML = t('crcl_renal_ok');
            warnEl.className = 'text-[10px] mt-0.5 font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 w-fit';
            recBox.className = 'flex-1 min-w-0 bg-emerald-100 px-3 py-1.5 rounded flex items-center justify-between border border-emerald-300';
            icon.textContent = '🩺';
        }
    } else {
        ['txtIBW','txtAdjBW'].forEach(id => document.getElementById(id).textContent = '-');
        ['crclABW','crclIBW','crclAdjBW'].forEach(id => document.getElementById(id).textContent = '---');
        const base = 'bw-box px-2 py-1 border border-slate-200 rounded text-center bg-white opacity-60 w-[95px] flex flex-col justify-center';
        ['boxABW','boxIBW','boxAdjBW'].forEach(id => document.getElementById(id).className = base);
        recBox.className = 'flex-1 min-w-0 bg-slate-100 px-3 py-1.5 rounded flex items-center justify-between border border-slate-200';
        recText.innerHTML = t('crcl_enter_data');
        numSpan.textContent = '···';
        numSpan.style.color = '#94a3b8';
        // ตอนยังไม่กรอก: แสดง mL/min บรรทัดเดียวกัน ซ่อน crclRow2
        const mLSpanR = document.querySelector('#recCrclValue > span:last-child');
        const crclRow2R = document.getElementById('crclRow2');
        const crclVIR = document.getElementById('crclValueInline');
        if (mLSpanR) mLSpanR.style.display = 'inline';
        if (crclRow2R) crclRow2R.style.display = 'none';
        if (crclVIR) crclVIR.style.alignItems = 'center';
        const numSpanMR = document.getElementById('crclNumberMobile');
        if (numSpanMR) { numSpanMR.textContent = '··········'; numSpanMR.style.color = '#94a3b8'; }
        const iconMR = document.getElementById('renalIconMobile');
        if (iconMR) iconMR.classList.add('hidden');
        const bzR = document.getElementById('crclBottomZone');
        if (bzR) { bzR.style.background='#f8fafc'; bzR.style.borderColor='#e2e8f0'; }
        warnEl.classList.add('hidden');
        icon.classList.add('hidden');
    }

    if (w === 0) {
        ['firstLineBody','fdcBody','groupABody','groupCBody'].forEach(id => document.getElementById(id).innerHTML = '');
        document.getElementById('lowWeightBanner').classList.add('hidden');
        document.getElementById('fdcLowBanner').classList.add('hidden');
        document.getElementById('fdcRenalBanner').classList.add('hidden'); // BUG FIX
        return;
    }

    // ── Low weight banner ────────────────────
    const lwBanner = document.getElementById('lowWeightBanner');
    if (w < 35) {
        lwBanner.innerHTML = `⚠️ น้ำหนัก ${w} kg (&lt;35 kg) — Thai NTP แนะนำคำนวณตามน้ำหนักตัว · ตัวเลขด้านล่างอิงขนาดยาที่มีในรพ. (H100 · R300 · Z500 · E400/500)`;
        lwBanner.classList.remove('hidden');
    } else {
        lwBanner.classList.add('hidden');
    }

    // ── FDC low weight banner ────────────────
    if (w < 30) {
        document.getElementById('fdcLowBanner').classList.remove('hidden');
    } else {
        document.getElementById('fdcLowBanner').classList.add('hidden');
    }

    // ════════════════════════════════════════
    //  BUILD FIRST-LINE DRUG ARRAY
    // ════════════════════════════════════════
    // คำนวณ IBW/AdjBW สำหรับ aminoglycoside dosing
    const hIn_drug   = h_cm / 2.54;
    const over60_drug = Math.max(0, hIn_drug - 60);
    const ibw_drug   = (allFilled && gender) ? (gender === 'male' ? 50 + 2.3*over60_drug : 45.5 + 2.3*over60_drug) : null;
    const adjBw_drug = ibw_drug ? ibw_drug + 0.4*(w - ibw_drug) : null;
    const short_drug  = h_cm < 152;
    const aminoDose  = (ibw_drug && !short_drug) ? aminoDW(w, ibw_drug, adjBw_drug, short_drug) : { dw: w, label: 'Actual BW' };
    const sDW = aminoDose.dw;
    const sDWLabel = aminoDose.label;

    const H = hDose(w);
    const R = rDose(w);
    const Z = zDose(w);
    const E = eDose(w);
    const S = sDose(sDW, ageOver65);

    const firstLineDrugs = [
        {
            name:'Isoniazid (H)', sub:'4–6 mg/kg/day · max 300 mg', icon:'💊', renalAdj:false, maxMg:300,
            mgKgRange:[4,6],
            calcRange:`${Math.round(w*4)} – ${Math.round(w*6)} mg`,
            ageWarn: ageOver65,
            ageWarnMsg: 'เสี่ยง peripheral neuropathy และ hepatotoxicity สูงขึ้น แนะนำให้ Pyridoxine (B6) 25–50 mg/day ร่วมด้วย',
            rec: fmtRec(H, w), renal: fmtRenal(H, false)
        },
        {
            name:'Rifampicin (R)', sub:'8–12 mg/kg/day · max 600 mg', icon:'💊', renalAdj:false, maxMg:600,
            mgKgRange:[8,12],
            calcRange:`${Math.round(w*8)} – ${Math.round(w*12)} mg`,
            ageWarn: ageOver65,
            ageWarnMsg: 'เสี่ยง hyperbilirubinemia ติดตามอาการตัวเหลืองตาเหลือง',
            rec: fmtRec(R, w), renal: fmtRenal(R, false)
        },
        {
            name:'Pyrazinamide (Z)', sub:'20–30 mg/kg/day · max 2,000 mg', icon:'💊', renalAdj:true, maxMg:2000,
            mgKgRange:[20,30],
            calcRange:`${Math.round(w*20)} – ${Math.round(w*30)} mg`,
            ageWarn: ageOver65,
            ageWarnMsg: 'เสี่ยง hepatotoxicity สูงขึ้น ติดตาม LFT อย่างใกล้ชิด',
            rec: fmtRec(Z, w), renal: fmtRenal(Z, true)
        },
        {
            name:'Ethambutol (E)', sub:'15–20 mg/kg/day · max 1,200 mg', icon:'💊', renalAdj:true, maxMg:1200,
            mgKgRange:[15,20],
            calcRange:`${Math.round(w*15)} – ${Math.round(w*20)} mg`,
            ageWarn: ageOver65,
            ageWarnMsg: 'เสี่ยง optic neuropathy สูงขึ้น ตรวจ visual acuity ก่อนและระหว่างการรักษา',
            rec: fmtRec(E, w), renal: fmtRenal(E, true)
        },
        {
            name:'Streptomycin (S)', sub:`12–18 mg/kg/day · max 1,000 mg`, icon:'💉', renalAdj:true, maxMg:1000,
            mgKgRange:[12,18],
            calcRange:`${Math.round(sDW*12)} – ${Math.round(sDW*18)} mg`,
            ageWarn: ageOver65,
            ageWarnMsg: 'เสี่ยง ototoxicity และ nephrotoxicity สูง พิจารณาลด dose ติดตามการได้ยินและไตใกล้ชิด',
            dwNote: allFilled && gender ? `คำนวณจาก ${sDWLabel} (${sDW.toFixed(1)} kg)` : '',
            rec: fmtRec(S, w), renal: fmtRenal(S, true)
        }
    ];

    // ════════════════════════════════════════
    //  MDR-TB GROUP A+B  (Thai NTP 6.3)
    // ════════════════════════════════════════
    const csRec   = w <= 50 ? '500 mg' : (w <= 70 ? '750 mg' : '1,000 mg');
    const etoRec  = w <= 45 ? '500 mg' : (w <= 70 ? '750 mg' : '1,000 mg');

    function mdrRec(txt, color='#134e4a') {
        return `<div class="font-bold leading-tight" style="font-size:16px;color:${color}">${txt}</div>`;
    }
    function mdrRenal(txt, adj) {
        if (!adj) return '<span class="text-slate-400" style="font-size:14px">ไม่ต้องปรับ</span>';
        return `<div class="font-bold text-red-700" style="font-size:16px">${txt}</div><div class="text-[11px] text-red-600 font-bold">3 ครั้ง/สัปดาห์<br>(จ.พ.ศ.)</div>`;
    }

    const groupAB = [
        { name:'Levofloxacin (Lfx)',  sub:'750 mg fixed (Thai NTP 6.3 shorter)',  icon:'💊', renalAdj:true,  mgKgRange:[15,20], maxMg:1000,
          calcRange:`${Math.round(w*15)} – ${Math.round(w*20)} mg`,
          ageWarn: ageOver65,
          ageWarnMsg: 'เสี่ยง QT prolongation และ tendon rupture สูงขึ้น ตรวจ ECG ก่อนใช้ ระวังการหกล้ม',
          rec:mdrRec('750 mg','#065f46'), renal:mdrRenal('750 mg', true) },
        { name:'Moxifloxacin (Mfx)',  sub:'',                                     icon:'💊', renalAdj:false, mgKgRange:null, maxMg:400,
          calcRange:'fixed-400', rec:mdrRec('400 mg','#065f46'), renal:mdrRenal('',false) },
        { name:'Bedaquiline (Bdq)',   sub:'',                                     icon:'💊', renalAdj:false, mgKgRange:null, maxMg:null,
          calcRange:'fixed-bdq',
          rec:'<div class="font-bold leading-tight" style="font-size:16px;color:#065f46">400 mg QD × 14 วัน</div><div class="text-[9px] text-slate-500">จากนั้น 200 mg × 3×/wk × 22 wk</div>',
          renal:mdrRenal('',false) },
        { name:'Linezolid (Lzd)',     sub:'',                                     icon:'💊', renalAdj:false, mgKgRange:null, maxMg:600,
          calcRange:'fixed-600', rec:mdrRec('600 mg','#065f46'), renal:mdrRenal('',false) },
        { name:'Clofazimine (Cfz)',   sub:'',                                     icon:'💊', renalAdj:false, mgKgRange:null, maxMg:100,
          calcRange:'fixed-100', rec:mdrRec('100 mg','#065f46'), renal:mdrRenal('',false) },
        { name:'Cycloserine (Cs)',    sub:'10–15 mg/kg/day',                      icon:'💊', renalAdj:true,  mgKgRange:[10,15], maxMg:1000,
          calcRange:`${Math.round(w*10)} – ${Math.round(w*15)} mg`,
          rec:mdrRec(csRec,'#065f46'),
          renal:'<div class="font-bold text-red-700 text-[10px]">250 mg QD</div><div class="text-[9px] text-red-600 font-bold">หรือ 500 mg 3×/สัปดาห์</div>' },
        { name:'Terizidone (Trd)',    sub:'10–15 mg/kg/day (alt. Cs)',            icon:'💊', renalAdj:true,  mgKgRange:[10,15], maxMg:1000,
          calcRange:`${Math.round(w*10)} – ${Math.round(w*15)} mg`,
          rec:mdrRec(csRec,'#065f46'),
          renal:'<div class="font-bold text-red-700 text-[10px]">250 mg QD</div><div class="text-[9px] text-red-600 font-bold">หรือ 500 mg 3×/สัปดาห์</div>' }
    ];

    // ════════════════════════════════════════
    //  MDR-TB GROUP C
    // ════════════════════════════════════════
    const amkDW    = aminoDose.dw;
    const amkDWLabel = aminoDose.label;
    const amkRec   = amkDW <= 50 ? '750 mg' : '1,000 mg';
    const amkCalc  = `${Math.min(Math.round(amkDW*15),1000)} – ${Math.min(Math.round(amkDW*20),1000)} mg`;
    const pasG     = Math.min(w * 0.15, 12).toFixed(1);
    const pasRec   = w <= 50 ? '8 g' : (w <= 70 ? '10 g' : '12 g');

    const groupC = [
        { name:'Amikacin (Am)',             sub:`15–20 mg/kg/day · max 1,000 mg`,  icon:'💉', renalAdj:true, renalThreshold:50, mgKgRange:[15,20], maxMg:1000,
          calcRange:amkCalc, rec:mdrRec(amkRec,'#164e63'),
          ageWarn: ageOver65,
          ageWarnMsg: 'เสี่ยง ototoxicity และ nephrotoxicity สูงขึ้น ติดตาม TDM (ถ้า รพ. ทำได้)',
          dwNote: allFilled && gender ? `คำนวณจาก ${amkDWLabel} (${amkDW.toFixed(1)} kg)` : '',
          renalMobileHint: '2–3 ครั้ง/สัปดาห์',
          renalFn: (crcl) => {
            if (crcl === null) return '<div class="text-[11px] font-medium leading-tight" style="color:#ef4444">CrCl &lt;50:<br>2–3 ครั้ง/สัปดาห์</div>';
            if (crcl >= 50)   return '<span class="text-slate-400" style="font-size:14px">ไม่ต้องปรับ</span>';
            return '<div class="font-bold text-red-700">15 mg/kg</div><div class="text-[11px] text-red-600 font-bold">2–3 ครั้ง/สัปดาห์</div>';
          }},
        { name:'Ethionamide/Pto',           sub:'15–20 mg/kg/day · Thai NTP 6.3',  icon:'💊', renalAdj:false, mgKgRange:[15,20], maxMg:1000,
          calcRange:`${Math.round(w*15)} – ${Math.round(w*20)} mg`,
          rec:mdrRec(etoRec,'#164e63'), renal:mdrRenal('',false) },
        { name:'Imipenem-cilastatin (Ipm)', sub:'Group C — ร่วมกับ Amox-clav',     icon:'💉', renalAdj:true, renalThreshold:40, mgKgRange:null, maxMg:null,
          calcRange:'-',
          rec:'<div class="font-bold" style="font-size:16px;color:#164e63">1,000 mg BID</div><div class="text-[9px] text-slate-500">IM/IV + Amox-clav 375 mg TID</div>',
          renalMobileHint: 'ลด dose',
          renalFn: (crcl) => {
            if (crcl === null) return '<div class="text-[11px] font-medium leading-tight" style="color:#ef4444">CrCl 20–40: 750 mg q12h<br>CrCl &lt;20: 500 mg q12h<br>CrCl &lt;15: ห้ามใช้</div>';
            if (crcl > 40)    return '<span class="text-slate-400" style="font-size:14px">ไม่ต้องปรับ</span>';
            if (crcl < 15)    return '<div class="font-bold text-red-700 text-[11px]">ห้ามใช้</div><div class="text-[9px] text-red-600">ยกเว้น HD ใน 48 ชม.</div><div class="text-[9px] text-red-500 font-semibold">⚠ เสี่ยง seizure</div>';
            if (crcl < 20)    return '<div class="font-bold text-red-700">500 mg</div><div class="text-[11px] text-red-600 font-bold">q12h</div><div class="text-[9px] text-red-500">⚠ เสี่ยง seizure</div>';
            return '<div class="font-bold text-red-700">750 mg</div><div class="text-[11px] text-red-600 font-bold">q12h</div><div class="text-[9px] text-red-400">(CrCl 20–40)</div>';
          }},
        { name:'Meropenem (Mpm)',            sub:'Group C',                          icon:'💉', renalAdj:true, renalThreshold:50, mgKgRange:null, maxMg:null,
          calcRange:'-',
          rec:'<div class="font-bold" style="font-size:16px;color:#164e63">1,000–2,000 mg TID</div><div class="text-[9px] text-slate-500">IV (20–35 mg/kg/day)</div>',
          renalMobileHint: 'ยืด interval',
          renalFn: (crcl) => {
            if (crcl === null) return '<div class="text-[11px] font-medium leading-tight" style="color:#ef4444">CrCl 26–50: q12h<br>CrCl 10–25: ครึ่ง dose q12h<br>CrCl &lt;10: ครึ่ง dose q24h</div>';
            if (crcl > 50)    return '<span class="text-slate-400" style="font-size:14px">ไม่ต้องปรับ</span>';
            if (crcl < 10)    return '<div class="font-bold text-red-700">500–1,000 mg</div><div class="text-[11px] text-red-600 font-bold">q24h</div>';
            if (crcl < 26)    return '<div class="font-bold text-red-700">500–1,000 mg</div><div class="text-[11px] text-red-600 font-bold">q12h</div>';
            return '<div class="font-bold text-red-700">1,000–2,000 mg</div><div class="text-[11px] text-red-600 font-bold">q12h</div><div class="text-[9px] text-red-400">(CrCl 26–50)</div>';
          }},
        { name:'Aminosalicylic acid (PAS)',     sub:'150 mg/kg/day · max 12 g',        icon:'💊', renalAdj:false, mgKgRange:[140,160], maxMg:12000,
          calcRange:`${pasG} g`, rec:mdrRec(pasRec,'#164e63'), renal:mdrRenal('',false) },
        { name:'Delamanid (Dlm)',            sub:'',                                 icon:'💊', renalAdj:false, mgKgRange:null, maxMg:null,
          calcRange:'fixed-dlm', rec:'<div class="font-bold" style="font-size:16px;color:#164e63">100 mg BID</div><div class="text-[9px] text-slate-500">เช้า–เย็น</div>',
          renal:mdrRenal('',false) }
    ];

    // เก็บค่าโดสทุกตัวให้ analytics.js อ่านได้
    window._lastDoses = {
        w,
        h: H.mg, r: R.mg, z: Z.mg, e: E.mg, s: S.mg,
        lfx: 750, mfx: 400, bdq: 400, lzd: 600, cfz: 100,
        cs:  w <= 50 ? 500 : w <= 70 ? 750 : 1000,
        trd: w <= 50 ? 500 : w <= 70 ? 750 : 1000,
        am:  amkDW <= 50 ? 750 : 1000,
        pto: w <= 45 ? 500 : w <= 70 ? 750 : 1000,
        pas: w <= 50 ? 8000 : w <= 70 ? 10000 : 12000,
        dlm: 200
    };

    // ════════════════════════════════════════
    //  RENDER TABLE
    // ════════════════════════════════════════
    function renderTable(drugs, tbodyId, hoverCls, textCls, borderCls) {
        let html = '';
        drugs.forEach(d => {
            const renalThresh = d.renalThreshold !== undefined ? d.renalThreshold : 30;
            const rb          = finalCrcl !== null && d.renalAdj && finalCrcl < renalThresh;
            const rowBg   = rb ? 'style="background:#fff1f2"' : '';
            const rCls    = rb
                ? 'p-1.5 text-center renal-blink text-red-900'
                : `p-1.5 text-center border-b ${borderCls} bg-white/30`;
            const rStyle  = rb ? '' : 'style="border-left:1px solid rgba(0,0,0,0.08)"';

            // Dose input และ mg/kg อยู่ใน html ด้านล่างแล้ว
            const cached = doseCache[d.name] || '';

            // แยก sub ออกเป็น mg/kg line กับ max line
            const subParts = d.sub.split(' · ');
            const subMgKg  = subParts[0] || d.sub;
            const subMax   = subParts[1] || '';

            // Mobile renal hint ใต้ rec dose
            const renalHintMobile = d.renalAdj
                ? (rb
                    ? `<div class="md:hidden mt-0.5 text-[9px] font-bold text-red-600">🔴 ${d.renalMobileHint || '3 ครั้ง/สัปดาห์ (จ.พ.ศ.)'}</div>`
                    : `<div class="md:hidden mt-0.5 text-[9px] text-red-400">🔴 ต้องปรับ CrCl &lt;${renalThresh}</div>`)
                : '';

            // mg/kg cell
            const doseVal = parseFloat(doseCache[d.name]) || 0;
            let mgKgCell  = `<td class="p-1.5 text-center border-b ${borderCls} text-slate-300 text-[11px]">—</td>`;
            if (doseVal > 0 && w > 0) {
                const mkgVal  = doseVal / w;
                const overMax = d.maxMg && doseVal > d.maxMg;
                if (overMax) {
                    mgKgCell = `<td class="p-1 text-center border-b ${borderCls} bg-red-50">
                        <div style="font-size:10px;font-weight:900;color:#b91c1c;white-space:nowrap">⛔ เกิน Max</div>
                        <div style="font-size:10px;font-weight:700;color:#dc2626">${d.maxMg.toLocaleString()} mg</div>
                        <div style="font-size:9px;color:#dc2626">${mkgVal.toFixed(1)} <span style="font-size:8px">mg/kg</span></div>
                    </td>`;
                } else if (d.mgKgRange) {
                    const c = mgKgColor(mkgVal, d.mgKgRange[0], d.mgKgRange[1]);
                    mgKgCell = `<td class="p-1.5 text-center border-b ${borderCls}">
                        <div style="font-weight:900;font-size:13px;color:${c.color}">${mkgVal.toFixed(2)}</div>
                        <div style="font-size:10px;color:${c.color}">(${d.mgKgRange[0]}–${d.mgKgRange[1]})</div>
                        <div style="font-size:9px;color:${c.color}">${c.label}</div>
                    </td>`;
                } else {
                    mgKgCell = `<td class="p-1.5 text-center border-b ${borderCls}">
                        <div style="font-size:10px;color:#94a3b8;font-style:italic">Fixed</div>
                        <div style="font-size:11px;font-weight:700;color:#64748b">${mkgVal.toFixed(2)}</div>
                    </td>`;
                }
            }

            // Max exceeded warning — แสดงเฉพาะตอนยังไม่กรอกโดสจริง
            const calcHigh = d.calcRange !== '-' ? parseFloat(d.calcRange.replace(/,/g,'').split('–')[1]) : 0;
            const maxNote     = (d.maxMg && calcHigh > d.maxMg && doseVal === 0)
                ? `<div class="md:hidden text-[9px] font-bold text-orange-600 mt-0.5">⚠️ calc range เกิน max (${d.maxMg.toLocaleString()} mg)</div>`
                : '';
            const maxNoteDesktop = (d.maxMg && calcHigh > d.maxMg && doseVal === 0)
                ? `<div class="hidden md:block text-[11px] font-bold text-orange-600 mt-0.5">⚠️ calc range เกิน max (${d.maxMg.toLocaleString()} mg)</div>`
                : '';

            html += `
            <tr class="${hoverCls} transition-colors" data-max="${d.maxMg || 0}" ${rowBg}>
                <td class="p-1.5 font-medium ${textCls} border-b ${borderCls} text-left">
                    <div style="font-size:13px;font-weight:600;word-break:keep-all">${d.icon}&nbsp;${d.name.replace(' (', '\u00A0(')}</div>
                    <div class="text-[10px] opacity-70 mt-0.5">${subMgKg}</div>
                    ${subMax ? `<div class="text-[10px] opacity-70">${subMax}</div>` : ''}
                    ${d.dwNote ? `<div class="hidden md:block text-[10px] font-semibold text-blue-600 mt-0.5 bg-blue-50 border border-blue-200 rounded px-1 py-0.5">⚖️ ${d.dwNote}</div>` : ''}
                    ${d.ageWarn ? `<div class="hidden md:block text-[10px] font-bold text-orange-600 mt-1 bg-orange-50 border border-orange-200 rounded px-1 py-0.5">⚠️ >65 ปี: ${d.ageWarnMsg}</div>` : ''}
                </td>
                <td class="p-1.5 text-center border-b ${borderCls} text-slate-500 hidden md:table-cell" style="font-size:14px">${
                    d.calcRange === '-' ? '<span class="text-slate-400 italic text-xs">Fixed Dose</span>' :
                    d.calcRange === 'fixed-400' ? '<span class="text-slate-500 italic text-xs">Fixed Dose 400 mg</span>' :
                    d.calcRange === 'fixed-600' ? '<span class="text-slate-500 italic text-xs">Fixed Dose 600 mg</span>' :
                    d.calcRange === 'fixed-100' ? '<span class="text-slate-500 italic text-xs">Fixed Dose 100 mg</span>' :
                    d.calcRange === 'fixed-bdq' ? '<span class="text-slate-500 italic text-xs">Fixed Dose (400→200 mg)</span>' :
                    d.calcRange === 'fixed-dlm' ? '<span class="text-slate-500 italic text-xs">Fixed Dose 100 mg BID</span>' :
                    d.calcRange
                }${maxNoteDesktop}</td>
                <td class="p-1.5 text-center border-b ${borderCls}">
                    ${d.rec}
                    <div class="md:hidden text-[10px] font-semibold mt-0.5" style="color:#64748b">${(d.calcRange !== '-' && !d.calcRange.startsWith('fixed')) ? `(${d.calcRange})` : ''}</div>
                    ${maxNote}
                    ${renalHintMobile}
                </td>
                <td class="p-1 border-b ${borderCls}" style="border-left:1px solid rgba(0,0,0,0.08)">
                    <input type="number" step="any" min="0"
                        placeholder="กรอกโดสจริง (mg)"
                        value="${cached}"
                        style="width:100%;height:3rem;padding:0 8px;font-size:14px;border:1px solid #cbd5e1;border-radius:6px;text-align:center;outline:none;background:white"
                        oninput="doseCache['${d.name.replace(/'/g,"\\'")}'] = parseFloat(this.value)||0; updateMgKg(this, ${w}, '${d.name.replace(/'/g,"\\'")}', ${JSON.stringify(d.mgKgRange)})">
                </td>
                ${mgKgCell}
                <td class="${rCls} hidden md:table-cell" ${rStyle}>
                    ${d.renalFn
                        ? d.renalFn(finalCrcl)
                        : rb
                            ? d.renal
                            : d.renalAdj
                                ? `<div class="text-[11px] font-medium leading-tight" style="color:#ef4444">CrCl &lt;${renalThresh}:<br>ปรับเป็น 3 ครั้ง/สัปดาห์<br><span style="color:#fca5a5">(จ.พ.ศ.)</span></div>`
                                : `<div class="text-slate-400" style="font-size:14px">ไม่ต้องปรับ</div>`
                    }
                </td>
            </tr>`;
        });
        document.getElementById(tbodyId).innerHTML = html;
    }

    window.updateMgKg = function(input, weight, drugName, range) {
        doseCache[drugName] = parseFloat(input.value) || 0;
        const dose = parseFloat(input.value);
        const tr   = input.closest('tr');
        if (!tr) return;
        const mgKgTd = tr.cells[4];
        if (!mgKgTd) return;
        if (!dose || dose <= 0 || weight <= 0) {
            mgKgTd.innerHTML = '<span style="color:#cbd5e1;font-size:11px">—</span>';
            return;
        }
        const mkgVal = dose / weight;
        // หา maxMg จาก drug data — ดึงจาก data-max attribute ที่เราจะฝังใน td
        const maxMg = parseFloat(tr.getAttribute('data-max')) || 0;
        if (maxMg && dose > maxMg) {
            mgKgTd.innerHTML = `<div style="font-size:10px;font-weight:900;color:#b91c1c;line-height:1.3">⛔ เกิน Max</div><div style="font-size:10px;font-weight:700;color:#dc2626">${maxMg.toLocaleString()} mg</div><div style="font-size:9px;color:#dc2626">${mkgVal.toFixed(1)} <span style="font-size:8px">mg/kg</span></div>`;
            mgKgTd.style.background = '#fff1f2';
            return;
        }
        mgKgTd.style.background = '';
        if (range) {
            const c = mgKgColor(mkgVal, range[0], range[1]);
            mgKgTd.innerHTML = `<div style="font-weight:900;font-size:13px;color:${c.color}">${mkgVal.toFixed(2)}</div><div style="font-size:10px;color:${c.color}">(${range[0]}–${range[1]})</div><div style="font-size:9px;color:${c.color}">${c.label}</div>`;
        } else {
            mgKgTd.innerHTML = `<div style="font-size:10px;color:#94a3b8;font-style:italic">Fixed</div><div style="font-size:11px;font-weight:700;color:#64748b">${mkgVal.toFixed(2)}</div>`;
        }
    };

    renderTable(firstLineDrugs, 'firstLineBody', 'hover:bg-teal-50',    'text-teal-900',   'border-teal-100');
    renderTable(groupAB,        'groupABody',    'hover:bg-emerald-50', 'text-emerald-900','border-emerald-100');
    renderTable(groupC,         'groupCBody',    'hover:bg-cyan-50',    'text-cyan-900',   'border-cyan-100');

    // ════════════════════════════════════════
    //  FDC TABLE
    // ════════════════════════════════════════
    const renalWarn = finalCrcl !== null && finalCrcl < 30;

    // แสดง/ซ่อน banner CrCl <30
    const fdcRenalBanner = document.getElementById('fdcRenalBanner');
    const rfrHeader = document.getElementById('rfrHeader');
    if (renalWarn && w >= 30) {
        fdcRenalBanner.classList.remove('hidden');
        rfrHeader.className = 'p-1.5 font-semibold border-b-2 border-red-300 bg-red-100 text-red-700 line-through';
    } else {
        fdcRenalBanner.classList.add('hidden');
        rfrHeader.className = 'p-1.5 font-semibold border-b-2 border-teal-200';
    }

    let fdcHTML = '';
    if (w < 30) {
        fdcHTML = `<tr><td colspan="4" class="p-3 text-center text-xs text-red-700 font-semibold bg-red-50">
            ❌ WHO ไม่แนะนำ FDC สำหรับน้ำหนัก &lt;30 kg — ใช้ยาเดี่ยวตามตาราง First-Line ด้านบน
        </td></tr>`;
    } else {
        fdcBands.forEach(b => {
            const cur = w >= b.min && w <= b.max;
            const rowCls = cur
                ? 'bg-teal-200 border-l-4 border-teal-600 text-teal-900 font-bold'
                : 'text-slate-600 hover:bg-teal-50';

            // Rifafour column: grey-out + strikethrough เมื่อ CrCl <30
            const rfrCell = renalWarn
                ? `<td class="p-1.5 border-b border-teal-100 bg-red-50">
                       <span class="line-through text-red-300">${b.rfr}</span><br>
                       <span class="text-[9px] text-red-600 font-bold">❌ ห้ามใช้</span>
                   </td>`
                : `<td class="p-1.5 border-b border-teal-100">${b.rfr}</td>`;

            fdcHTML += `
            <tr class="${rowCls} transition-colors">
                <td class="p-1.5 border-b border-teal-100 text-left pl-2">${b.label}${cur ? ' ◀' : ''}</td>
                ${rfrCell}
                <td class="p-1.5 border-b border-teal-100">${b.rf150}</td>
                <td class="p-1.5 border-b border-teal-100">${b.rf300}</td>
            </tr>`;
        });
    }
    document.getElementById('fdcBody').innerHTML = fdcHTML;

    calcFdcReverse();
    scheduleTrackCalculation();
}
