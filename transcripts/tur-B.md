# Transcript — Tur B (Donatımlı)

**Kurulum:** Tam yönetişim katmanı yüklü. Bölüm 3 = Bağlam + Talimat + Standart +
Canlı veri. Asistan, repodaki standart dosyalarını **okuyarak** üretti.

**Okunan standartlar:** `standartlar/kalici-talimat.md`,
`standartlar/uretim-standardi.md`, `standartlar/skill-dashboard-architecture.md`,
`standartlar/hook-deployment.md`, `standartlar/renk.md`

**Çıktı:** `tur-B-donatimli/` (`Code.gs`, `Index.html`, `Stylesheet.html`,
`JavaScript.html`, `DEPLOYMENT.md`)
**Ekran görüntüleri:** `dogrulama/turB-E1…E4-*.png`

---

### Kullanıcı (prompt)

> Repodaki tüm standart dosyalarını analiz et. Bu standartları esas alarak Google
> Sheets verilerimi kullanan **4 ekranlı** Enerji Pano'sunu tek seferde, dosyalar
> arası geçişleri de kurgulayarak tam kapsamlı üret. Ekran başlıklarını S6 satırına
> uygun yap. Grafikleri en uygun şekilde seç.
> - `Code.gs`: `getKpiSummary` ve `getSheetData` barındıran backend.
> - `Index.html`: Stylesheet.html ve JavaScript.html'i `createTemplateFromFile` ile içeren iskelet.
> - `Stylesheet.html`: `renk.md`'ye uygun tüm CSS.
> - `JavaScript.html`: veriyi `google.script.run` ile çeken, Chart.js ile çizen, sayı formatını düzelten frontend.

### Asistan — standart → uygulama eşlemesi

| Standart | Uygulanan |
| :-- | :-- |
| `kalici-talimat.md` | TR sayı formatı (1.250,50); veri hard-code yok; `Index.html` içinde `<style>/<script>` yok; empty/loading/error state |
| `uretim-standardi.md` | No-scroll; E1 KPI / E2 Trend / E3 Pareto / E4 Detay tablosu |
| `skill-dashboard-architecture.md` | CSS/JS ayrı dosya; `google.script.run`; kurumsal palet |
| `renk.md` | `#82E600` / `#1D2433` / `#16445F` / `#F1F3F9`; Montserrat + Inter |
| `hook-deployment.md` | Tek seferde yüklenebilir paket + `DEPLOYMENT.md` adımları |

### Üretilen yapı

- **`Code.gs`** — `doGet`, `include`, **`getKpiSummary`** (KPI + trend + Pareto +
  enerji dağılımı), **`getSheetData`** (detay satırlar). Başlık eşleme esnek
  (`Tüketim (kWh)` gibi varyasyonları yakalar). Veri yalnızca `SpreadsheetApp` ile.
- **`Index.html`** — Sadece iskelet; `<?!= include('Stylesheet') ?>` /
  `<?!= include('JavaScript') ?>`. VALEO logolu header + E1–E4 sekme geçişi.
- **`Stylesheet.html`** — `renk.md` paletiyle tüm CSS; no-scroll grid.
- **`JavaScript.html`** — Chart.js çizimleri, TR format (`nf()`), sekme geçişi,
  tablo arama + sıralama, durum yönetimi.

### Marka

VALEO logosu (`assets/Valeo_Logo.svg.png`) panonun header'ına yerleştirilerek
çalışmaya kurumsal kimlik kazandırıldı (bkz. `dogrulama/turB-E1-ozet-kpi.png`).

### Doğrulama esnasında bulunan ve düzeltilen hata

Ekran görüntüsü doğrulamasında, E1 yatay sütun grafiğinde kategori ekseninin
(hat adları) sayı formatlayıcısına takılıp `0,1,2,3` gösterdiği tespit edildi.
`JavaScript.html > drawLineSummary` içinde değer/kategori eksenleri ayrıştırılarak
düzeltildi ve yeniden doğrulandı.
