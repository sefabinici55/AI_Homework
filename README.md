<img src="assets/Valeo_Logo.svg.png" alt="VALEO" width="160">

# S6 — Enerji & Sürdürülebilirlik Panosu

VALEO Tesis Yönetimi için Google Apps Script tabanlı, Google Sheets verisini
**canlı** okuyan tek sayfalık (no-scroll) KPI panosu. Çalışma, bir **yönetişim
katmanı** (kalıcı talimat + üretim standardı + tasarım sistemi) esas alınarak
üretilmiş; ayrıca **donatımsız (Tur A)** ve **donatımlı (Tur B)** iki tur olarak
karşılaştırmalı belgelenmiştir.

## 📁 Repo Yapısı

```
README.md                      Bu dosya
dogrulama.md                   6 senaryoluk doğrulama raporu (ekran görüntülü)

assets/
  Valeo_Logo.svg.png           Kurumsal logo

standartlar/                   Yönetişim katmanı (yeniden kullanılabilir "bilgi")
  kalici-talimat.md            Kurallar (TR format, hard-code yasağı, dosya ayrımı, state)
  uretim-standardi.md          No-scroll anatomi + E1–E4 ekranlar
  skill-dashboard-architecture.md
  hook-deployment.md           Paketleme & deployment kuralı
  renk.md                      Renk paleti + tipografi (tasarım sistemi)

veri/
  Veri.csv                     S6 örnek veri seti (228 kayıt)

tur-A-donatimsiz/              ÇIKTI-A  (repo OKUNMADAN, tek serbest prompt)
  Code.gs, Index.html

tur-B-donatimli/              ÇIKTI-B  (repo OKUNARAK, tam yönetişim)
  Code.gs                      Backend: getKpiSummary + getSheetData
  Index.html                   İskelet (Stylesheet & JavaScript include eder)
  Stylesheet.html              renk.md paletiyle tüm CSS
  JavaScript.html              Chart.js + TR format + sekme/sıralama
  DEPLOYMENT.md                Tek seferde yükleme + clasp adımları

transcripts/
  tur-A.md, tur-B.md           Tur kayıtları

dogrulama/                     Doğrulama ekran görüntüleri

arsiv/                         Önceki kök Code.gs/Index.html (korundu)
```

## 🔁 Tur A vs Tur B

| | Tur A — Donatımsız | Tur B — Donatımlı |
| :-- | :-- | :-- |
| Bağlam | Standart yok | `standartlar/` okundu |
| Marka / Palet | Yok / jenerik | VALEO logo / `renk.md` |
| Ekran | Tek ekran | 4 ekran (E1–E4) |
| Grafik | Sütun + çizgi | Halka + sütun + çizgi + **Pareto** + tablo |
| Mimari | Tek dosya | Modüler (CSS/JS ayrı) |

| Tur A | Tur B (E1) |
| :--: | :--: |
| ![A](dogrulama/turA-cikti.png) | ![B](dogrulama/turB-E1-ozet-kpi.png) |

## 📊 Tur B Ekranları (S6)

- **E1 — Özet & KPI:** Toplam Tüketim, CO₂, Birim Başına kWh, Hedef Sapma %, Üretim + enerji dağılımı (halka) + hat özeti (yatay sütun)
- **E2 — Tüketim Trendi:** günlük çoklu çizgi (enerji tipine göre)
- **E3 — Hat Bazlı Kırılım:** Pareto (sütun + kümülatif %)
- **E4 — Detay Tablosu:** sıralanabilir / aranabilir, TR sayı formatı

## ✅ Doğrulama

6/6 senaryo geçti (tekrarlanabilirlik, boş/bozuk veri, kural ihlali, standart
uygulanışı, canlı veri, context bütçesi). Tam rapor: **[`dogrulama.md`](dogrulama.md)**.

## 🚀 Kurulum

Tur B'yi yayınlamak için adım adım rehber: **[`tur-B-donatimli/DEPLOYMENT.md`](tur-B-donatimli/DEPLOYMENT.md)**.
Kurmadan önce `Code.gs` içinde `SHEET_NAME` değerini kendi sekme adınızla
(örn. `Sayfa1` / `Sheet1`) eşleştirin.

---
<sub>Veriler Google Sheets'ten canlı çekilir; koda asla gömülmez (`kalici-talimat.md` md.2).</sub>
