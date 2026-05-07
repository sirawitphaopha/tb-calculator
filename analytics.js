// ════════════════════════════════════════════
//  SUPABASE ANALYTICS
// ════════════════════════════════════════════

const SUPABASE_URL = 'https://ryewggkhunpuipgkgbfv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cSCNAQextpTq9SzUt189uw_lemUK6Ah';

const _db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const SESSION_ID  = Math.random().toString(36).slice(2) + Date.now().toString(36);
const _visitStart = Date.now();
let   _visitId    = null;

let _calcDebounce = null;
let _fdcDebounce  = null;

window.addEventListener('load', trackVisit);
window.addEventListener('beforeunload', trackDuration);

// ─── บันทึกการเข้าชม ──────────────────────
async function trackVisit() {
    try {
        const { data } = await _db.from('visits').insert({
            session_id:  SESSION_ID,
            user_agent:  navigator.userAgent,
            language:    navigator.language,
            timezone:    Intl.DateTimeFormat().resolvedOptions().timeZone,
            device_type: window.innerWidth < 768 ? 'mobile' : 'desktop'
        }).select('id').single();
        _visitId = data?.id ?? null;
        updateStats();
    } catch(e) {}
}

// ─── บันทึกเวลาที่อยู่บนเว็บ ──────────────
function trackDuration() {
    if (!_visitId) return;
    const seconds = Math.round((Date.now() - _visitStart) / 1000);
    fetch(`${SUPABASE_URL}/rest/v1/visits?id=eq.${_visitId}`, {
        method:    'PATCH',
        keepalive: true,
        headers: {
            'Content-Type':  'application/json',
            'apikey':        SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify({ duration_seconds: seconds })
    });
}

// ─── debounce 2 วิ แล้วบันทึกการคำนวณ ────
function scheduleTrackCalculation() {
    clearTimeout(_calcDebounce);
    _calcDebounce = setTimeout(doTrackCalculation, 2000);
}

async function doTrackCalculation() {
    try {
        const wRaw   = parseFloat(document.getElementById('weight').value) || 0;
        const w      = weightUnit === 'lb' ? wRaw / 2.20462 : wRaw;
        const hRaw   = parseFloat(document.getElementById('height').value);
        const h_cm   = heightUnit === 'inch' ? hRaw * 2.54 : hRaw;
        const age    = parseFloat(document.getElementById('age').value);
        const sex    = document.getElementById('gender').value;
        const scrRaw = parseFloat(document.getElementById('scr').value);
        const scr    = scrUnit === 'umol' ? scrRaw / 88.4 : scrRaw;

        if (!w || !h_cm || !age || !sex || !scr) return;

        const crcl  = parseFloat(document.getElementById('crclNumber')?.textContent) || null;
        const egfr  = parseFloat(document.getElementById('egfrValue')?.textContent)  || null;
        const bmi   = parseFloat(document.getElementById('bmiValue')?.textContent)   || null;

        const ibwTx = document.getElementById('txtIBW')?.textContent   || '';
        const adjTx = document.getElementById('txtAdjBW')?.textContent || '';
        const ibw   = ['N/A','-',''].includes(ibwTx) ? null : parseFloat(ibwTx) || null;
        const adjBw = ['N/A','-',''].includes(adjTx) ? null : parseFloat(adjTx) || null;

        const recTx = document.getElementById('recCrclText')?.textContent || '';
        let dosingType = null;
        if      (recTx.includes('Actual'))   dosingType = 'actual';
        else if (recTx.includes('Ideal'))    dosingType = 'ideal';
        else if (recTx.includes('Adjusted')) dosingType = 'adjusted';

        const renalEl      = document.getElementById('renalWarning');
        const renalAdjusted = renalEl ? !renalEl.classList.contains('hidden') : false;

        // โดสยาทุกตัวจาก window._lastDoses
        const d = window._lastDoses || {};
        const mgkg = (mg) => (w > 0 && mg != null) ? parseFloat((mg / w).toFixed(2)) : null;

        await _db.from('calculations').insert({
            session_id:         SESSION_ID,
            weight:             w,
            weight_unit:        weightUnit || 'kg',
            height:             h_cm,
            height_unit:        heightUnit || 'cm',
            age:                parseInt(age),
            sex,
            serum_cr:           scr,
            cr_unit:            scrUnit || 'mgdl',
            crcl,
            egfr,
            bmi,
            ibw,
            adj_bw:             adjBw,
            dosing_weight_type: dosingType,
            renal_adjusted:     renalAdjusted,
            short_stature:      h_cm < 152,
            // First-line
            h_mg:               d.h   ?? null, h_mg_per_kg: mgkg(d.h),
            r_mg:               d.r   ?? null, r_mg_per_kg: mgkg(d.r),
            z_mg:               d.z   ?? null, z_mg_per_kg: mgkg(d.z),
            e_mg:               d.e   ?? null, e_mg_per_kg: mgkg(d.e),
            s_mg:               d.s   ?? null, s_mg_per_kg: mgkg(d.s),
            // Group A+B
            lfx_mg:             d.lfx ?? null, lfx_mg_per_kg: mgkg(d.lfx),
            mfx_mg:             d.mfx ?? null, mfx_mg_per_kg: mgkg(d.mfx),
            bdq_mg:             d.bdq ?? null,
            lzd_mg:             d.lzd ?? null, lzd_mg_per_kg: mgkg(d.lzd),
            cfz_mg:             d.cfz ?? null, cfz_mg_per_kg: mgkg(d.cfz),
            cs_mg:              d.cs  ?? null, cs_mg_per_kg:  mgkg(d.cs),
            trd_mg:             d.trd ?? null, trd_mg_per_kg: mgkg(d.trd),
            // Group C
            am_mg:              d.am  ?? null, am_mg_per_kg:  mgkg(d.am),
            pto_mg:             d.pto ?? null, pto_mg_per_kg: mgkg(d.pto),
            pas_mg:             d.pas ?? null, pas_mg_per_kg: mgkg(d.pas),
            dlm_mg:             d.dlm ?? null, dlm_mg_per_kg: mgkg(d.dlm)
        });
    } catch(e) {}
}

// ─── FDC reverse debounce 2 วิ ────────────
function scheduleFdcReverseTracking(rfr, rf150, rf300, rMg, hMg, zMg, eMg) {
    clearTimeout(_fdcDebounce);
    if (rfr <= 0 && rf150 <= 0 && rf300 <= 0) return;
    _fdcDebounce = setTimeout(() => doTrackFdcReverse(rfr, rf150, rf300, rMg, hMg, zMg, eMg), 2000);
}

async function doTrackFdcReverse(rfr, rf150, rf300, rMg, hMg, zMg, eMg) {
    try {
        const wRaw = parseFloat(document.getElementById('weight').value) || 0;
        const w    = weightUnit === 'lb' ? wRaw / 2.20462 : wRaw;
        await _db.from('fdc_reverse').insert({
            session_id:      SESSION_ID,
            weight:          w,
            rifafour_tabs:   rfr   || null,
            rifinah150_tabs: rf150 || null,
            rifinah300_tabs: rf300 || null,
            r_mg:            rMg   || null,
            h_mg:            hMg   || null,
            z_mg:            zMg   || null,
            e_mg:            eMg   || null
        });
    } catch(e) {}
}

// ─── บันทึก event (reset, unit toggle, link) ─
async function trackEvent(eventType, eventDetail = null, eventValue = null) {
    try {
        await _db.from('events').insert({
            session_id:   SESSION_ID,
            event_type:   eventType,
            event_detail: eventDetail,
            event_value:  eventValue
        });
    } catch(e) {}
}

// ─── อัปเดตกล่องสถิติ ─────────────────────
async function updateStats() {
    try {
        const today = new Date().toISOString().split('T')[0];

        const { count: total } = await _db
            .from('visits')
            .select('*', { count: 'exact', head: true });

        const { count: todayCount } = await _db
            .from('visits')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today + 'T00:00:00.000Z');

        const num = (n) => (n || 0).toLocaleString('th-TH');
        const totalEl = document.getElementById('statsTotal');
        const todayEl = document.getElementById('statsToday');
        if (totalEl) totalEl.textContent = num(total);
        if (todayEl) todayEl.textContent = num(todayCount);
        const fTotalEl = document.getElementById('footerStatsTotal');
        const fTodayEl = document.getElementById('footerStatsToday');
        if (fTotalEl) fTotalEl.textContent = num(total);
        if (fTodayEl) fTodayEl.textContent = num(todayCount);
    } catch(e) {}
}
