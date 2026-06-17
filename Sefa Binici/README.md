<img src="assets/Valeo_Logo.svg.png" alt="VALEO" width="160">

# S6 — Enerji & Sürdürülebilirlik Panosu (Ödev Teslim Klasörü)

VALEO Tesis Yönetimi için Google Apps Script tabanlı, Google Sheets verisini
**canlı** okuyan tek sayfalık (no-scroll) KPI panosu. Çalışma; kalıcı talimat +
üretim standardı + tasarım sistemi içeren bir **yönetişim katmanı** üzerine
kurulmuş, **donatımsız (Tur A)** ve **donatımlı (Tur B)** iki tur olarak
karşılaştırmalı belgelenmiştir.

> Bu klasör, çalışmanın **ödev şablonundaki bölümlere göre düzenlenmiş**
> halidir. Numaralı klasörler şablonun istediği teslim parçalarına birebir
> karşılık gelir. (Önceki `arsiv/` klasörü, istendiği gibi dahil edilmemiştir.)

## 📁 Klasör Yapısı

```
README.md                         Bu dosya (genel bakış + eşleme)
assets/Valeo_Logo.svg.png         Kurumsal logo

1-kurallar-ve-standart/           Yönetişim katmanı ("bilgi" dosyaları)
  kalici-kurallar.md              Kalıcı talimat (TR format, hard-code yasağı, dosya ayrımı, state)
  uretim-standardi.md             No-scroll anatomi + E1–E4 ekran tanımları
  renk.md                         Renk paleti + tipografi (tasarım sistemi)
  skill-dashboard-architecture.md Mimari skill
  hook-deployment.md              Paketleme & deployment kuralı

2-konusma-kayitlari/              Tur kayıtları + doğrulama raporu
  tur-A.md                        Donatımsız tur dökümü
  tur-B.md                        Donatımlı tur dökümü
  dogrulama.md                    6 senaryoluk doğrulama raporu (ekran görüntülü)

3-ekran-goruntuleri/              Kırpılmamış ekran görüntüleri (.png)

4-veri/
  veri.csv                        S6 örnek (yapay) veri seti — 228 kayıt

5-cikti-kodlari-ve-rapor/         Üretilen panolar + rapor
  tur-A-donatimsiz/               ÇIKTI-A (tek serbest prompt)
  tur-B-donatimli/                ÇIKTI-B (tam yönetişim; CSS/JS ayrı)
  rapor/S6-Enerji-Panosu-Raporu.docx
```

## 🔗 Ödev Şablonu ↔ Bu Klasör Eşlemesi

| Ödev şablonu ister | Bu klasördeki karşılığı |
| :-- | :-- |
| `kalici-kurallar.txt` (kalıcı kurallar) | `1-kurallar-ve-standart/kalici-kurallar.md` |
| `uretim-standardi.txt` (üretim standardı) | `1-kurallar-ve-standart/uretim-standardi.md` |
| `tur-A.txt` (donatımsız tur) | `2-konusma-kayitlari/tur-A.md` |
| `tur-B.txt` (donatımlı tur) | `2-konusma-kayitlari/tur-B.md` |
| `dogrulama.txt` (6 doğrulama denemesi) | `2-konusma-kayitlari/dogrulama.md` |
| `veri.csv` / `veri.json` (yapay veri) | `4-veri/veri.csv` |
| Ekran görüntüleri (kırpılmamış) | `3-ekran-goruntuleri/` |

> Not: Dosyalar `.txt` yerine `.md` uzantılı tutulmuştur; içerik düz metindir ama
> ekran görüntüleri ve tablolar bu sayede GitHub/önizlemede doğru render olur.

## 🔁 Tur A vs Tur B

| | Tur A — Donatımsız | Tur B — Donatımlı |
| :-- | :-- | :-- |
| Bağlam | Standart yok | `1-kurallar-ve-standart/` okundu |
| Marka / Palet | Yok / jenerik | VALEO logo / `renk.md` |
| Ekran | Tek ekran | 4 ekran (E1–E4) |
| Grafik | Sütun + çizgi | Halka + sütun + çizgi + **Pareto** + tablo |
| Mimari | Tek dosya | Modüler (CSS/JS ayrı) |

| Tur A | Tur B (E1) |
| :--: | :--: |
| ![A](3-ekran-goruntuleri/turA-cikti.png) | ![B](3-ekran-goruntuleri/turB-E1-ozet-kpi.png) |

## 📊 Tur B Ekranları (S6)

- **E1 — Özet & KPI:** Toplam Tüketim, CO₂, Birim Başına kWh, Hedef Sapma %, Üretim + enerji dağılımı (halka) + hat özeti (yatay sütun)
- **E2 — Tüketim Trendi:** günlük çoklu çizgi (enerji tipine göre)
- **E3 — Hat Bazlı Kırılım:** Pareto (sütun + kümülatif %)
- **E4 — Detay Tablosu:** sıralanabilir / aranabilir, TR sayı formatı

## ✅ Doğrulama

6/6 senaryo geçti (tekrarlanabilirlik, boş/bozuk veri, kural ihlali, standart
uygulanışı, canlı veri, context bütçesi). Tam rapor:
**[`2-konusma-kayitlari/dogrulama.md`](2-konusma-kayitlari/dogrulama.md)**.

## 🚀 Kurulum

Tur B'yi yayınlamak için:
**[`5-cikti-kodlari-ve-rapor/tur-B-donatimli/DEPLOYMENT.md`](5-cikti-kodlari-ve-rapor/tur-B-donatimli/DEPLOYMENT.md)**.
Kurmadan önce `Code.gs` içinde `SHEET_NAME` değerini kendi sekme adınızla eşleştirin.

---
<sub>Veriler Google Sheets'ten canlı çekilir; koda asla gömülmez (`kalici-kurallar.md` md.2).</sub>
