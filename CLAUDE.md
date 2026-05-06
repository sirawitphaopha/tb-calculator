# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## โปรเจกต์นี้คืออะไร

เครื่องคำนวณขนาดยาวัณโรคสำหรับผู้ใหญ่ (อายุ >15 ปี) อ้างอิง Thai NTP 2021 และ WHO 2025 เป็น Static Single-Page App ไม่มี build system ไม่มี dependencies ไม่มี backend — มีเพียงสามไฟล์ เปิดใช้งานได้โดยตรงจาก filesystem หรือ static host ใดก็ได้

- `index.html` — markup ทั้งหมด; โหลด Tailwind CSS จาก CDN, Google Fonts (Prompt), `style.css`, และ `script.js`
- `script.js` — logic ทั้งหมดของแอป (~1,000 บรรทัด vanilla JavaScript)
- `style.css` — style เพิ่มเติม: validation state ของ input, mobile grid layout, animation `renal-blink`

## การรันแอป

เปิด `index.html` ในเบราว์เซอร์ได้โดยตรง ไม่ต้องติดตั้งหรือ build อะไรทั้งสิ้น

หากต้องการจำลอง static server ในเครื่อง:
```
python3 -m http.server 8080
```
แล้วเปิด `http://localhost:8080`

## สถาปัตยกรรมของ `script.js`

### การไหลของข้อมูล

ทุกครั้งที่ input เปลี่ยน (น้ำหนัก, ส่วนสูง, อายุ, เพศ, Serum Cr) จะเรียก `calculate()` ซึ่งจะ re-render ตารางยาทั้งสามตารางใหม่ทั้งหมด โดสจริงที่ผู้ใช้กรอกไว้จะถูกเก็บใน object ระดับ module ชื่อ `doseCache` (key คือชื่อยา) เพื่อให้ไม่หายเมื่อ re-render

### ฟังก์ชันสำคัญ

**Drug dose helpers** (`hDose`, `rDose`, `zDose`, `eDose`, `sDose`) — รับน้ำหนัก (และอายุสำหรับ Streptomycin) คืนค่า `{mg, tab, warn, warnMsg?}` โดย field `tab` เป็น string ภาษาไทย เช่น `"R300 × 1 แคป"` ซึ่ง encode ขนาดเม็ด/แคปที่มีจริงในโรงพยาบาลไทย

**`calculate()`** — engine หลัก เรียกทุกครั้งที่มี input event:
1. Validate input ทั้งหมดผ่าน `validateField()` / `validateWeight()`; หยุดทำงานพร้อมแสดง error state ถ้าข้อมูลไม่ถูกต้อง
2. คำนวณ BMI และ eGFR (CKD-EPI 2021)
3. คำนวณ CrCl (Cockcroft-Gault) สำหรับ Actual BW, Ideal BW, และ Adjusted BW
4. เลือก BW ที่ใช้คำนวณ CrCl: ส่วนสูง <152 cm → Actual; น้ำหนักน้อย (ABW < IBW) → Actual; อ้วน (ABW > 1.2× IBW) → Adjusted; กรณีอื่น → Ideal
5. สร้าง array ยา first-line และ MDR-TB แล้วเรียก `renderTable()` สำหรับแต่ละกลุ่ม
6. Render ตาราง FDC weight-band

**`renderTable(drugs, tbodyId, hoverCls, textCls, borderCls)`** — สร้าง HTML string แล้วกำหนดให้ `innerHTML` โดยตรง แต่ละแถวมี `<input>` สำหรับกรอกโดสจริง; `oninput` handler เรียก `updateMgKg()` และเขียนค่าลง `doseCache`

**`window.updateMgKg(input, weight, drugName, range)`** — อัปเดต cell mg/kg ใน `<tr>` เดียวกันทันทีโดยไม่ re-render ทั้งตาราง ต้องอยู่บน `window` เพราะถูกเรียกจาก inline `oninput` attribute ใน HTML ที่ถูกสร้างขึ้น

**`calcFdcReverse()` / `lockFdc(active)`** — เครื่องคำนวณย้อนกลับ FDC: Rifafour จะ lock input Rifinah ทั้งสองออก; Rifinah-150 และ Rifinah-300 ใช้ร่วมกันได้ lock state ต้องถูก initialize ใหม่เมื่อโหลดหน้า (กรณี browser autofill)

**`aminoDW(abw, ibw, adjBw, shortStature)`** — เลือก dosing weight สำหรับ aminoglycosides (Streptomycin, Amikacin): cap ที่ 100 kg; ส่วนสูง <152 cm ใช้ Actual BW เสมอ

### Invariant ที่สำคัญ

- **`doseCache`** — `calculate()` จะไม่ล้างค่านี้เด็ดขาด; ล้างได้เฉพาะใน `resetAll()` เท่านั้น เพื่อให้โดสจริงที่ผู้ใช้กรอกอยู่รอดข้าม re-render
- **CrCl < 30 mL/min** — trigger animation `renal-blink` บน row ยาที่ต้องปรับ และแสดง/ซ่อน banner `fdcRenalBanner` (ห้ามใช้ Rifafour/HRZE)
- **Short stature flag** (`h_cm < 152`) — ปิดใช้งาน IBW และ AdjBW ทั้งหมด ทั้งสำหรับการเลือก BW ใน CrCl และ aminoglycoside dosing weight
- **ช่วงอายุที่ validate ได้ใน Cockcroft-Gault** — 18–92 ปีเท่านั้น อายุนอกช่วงนี้จะแสดง warning สีส้มแต่ไม่ block การคำนวณ (ต่างจากส่วนสูง/น้ำหนัก/Cr ที่ block พร้อม error สีแดง)
- **ข้อจำกัดแคป R** — แคป Rifampicin หักไม่ได้ ดังนั้น `rDose()` ใช้ขนาดเต็มแคป (R300 หรือ R450) ซึ่งอาจทำให้ผู้ป่วยน้ำหนัก <25 kg ได้รับ mg/kg เกิน range นี่เป็น trade-off ทางคลินิกที่ตั้งใจไว้และ document ไว้ใน source code

## Layout บน Mobile

Mobile breakpoint คือ `≤767px` โดย layout ใช้ `display: contents` บน wrapper element (`#crclTopBox`, `#crclHeaderBw`, `#crclContentRow`) เพื่อให้ child element เข้าร่วม outer CSS grid ได้โดยตรง วิธีนี้เป็นวิธีเดียวที่ทำให้ layout รูปตัว L ของ CrCl+BMI ทำงานได้บน mobile โดยไม่ต้องเพิ่ม HTML ซ้ำซ้อน

ปุ่ม "📱 Mobile View" บน desktop จะ inject `<style id="mobileForceStyle">` tag เพื่อ override responsive class ของ Tailwind โดย cap ความกว้างที่ 390 px สำหรับการ screenshot และทดสอบ

## ข้อมูลอ้างอิงยา

| ส่วน | แหล่งอ้างอิง | หมายเหตุ |
|---|---|---|
| First-line (H, R, Z, E) | Thai NTP 2021 ตาราง 5.1 | ขนาดเม็ด: H100, R300/450 แคป, Z500, E400/500 |
| FDC weight bands | WHO Adult Bands | Rifafour e-275, Rifinah-150, Rifinah-300 |
| MDR-TB Group A+B | Thai NTP 2021 ตาราง 6.3 | Shorter regimen |
| MDR-TB Group C | Thai NTP 2021 | Amikacin ใช้ aminoglycoside dosing weight |
| CrCl | Cockcroft-Gault | เกณฑ์ปรับขนาดยา: CrCl < 30 mL/min → ให้ 3 ครั้ง/สัปดาห์ |
| eGFR | CKD-EPI 2021 | แสดงผลเท่านั้น ไม่ได้ใช้ปรับขนาดยา |
| BMI | WHO Asia-Pacific cutoffs | 23 = น้ำหนักเกิน, 25 = อ้วนระดับ 1 |
