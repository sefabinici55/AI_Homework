# S6 Enerji & Sürdürülebilirlik Panosu — Kurulum & Deployment

Bu paket, Google Apps Script'e **tek seferde** yüklenebilecek 4 dosyadan oluşur.

## 📦 Dosya Paketi

| Dosya | Apps Script'teki Türü | Görevi |
| :--- | :--- | :--- |
| `Code.gs` | Script (.gs) | Backend. `doGet`, `include`, `getKpiSummary`, `getSheetData` |
| `Index.html` | HTML | Ana iskelet. Stylesheet & JavaScript dosyalarını `include` eder |
| `Stylesheet.html` | HTML | Tüm CSS (renk.md paleti) |
| `JavaScript.html` | HTML | Tüm frontend mantığı (Chart.js, TR formatı) |

> **Mimari kural (kalici-talimat.md):** `Index.html` içinde `<style>`/`<script>` bloğu YOKTUR; CSS ve JS ayrı dosyalardan `HtmlService` ile dahil edilir.

---

## 🚀 Yöntem A — Web Arayüzü (clasp gerektirmez)

1. [script.google.com](https://script.google.com) → **Yeni proje**.
2. Varsayılan `Code.gs` içeriğini sil, bu paketteki **`Code.gs`** içeriğini yapıştır.
3. Sol menüde **➕ → HTML** ile 3 dosya ekle. Dosya adları **tam** olarak şu şekilde olmalı (uzantısız):
   - `Index`
   - `Stylesheet`
   - `JavaScript`
   - Her birinin içeriğini ilgili `.html` dosyasından yapıştır.
4. `Code.gs` içindeki ayarları kontrol et:
   - `SPREADSHEET_ID` → `1lLsEJnADKTqzRl9tektA714iyePA73zzlmdcPkQ3Sd4`
   - `SHEET_NAME` → veri sekmesinin adı (örn. `Sayfa1` / `Sheet1`).
5. **Dağıt → Yeni dağıtım → Tür: Web uygulaması**.
   - Yürüten: *Ben*
   - Erişim: ihtiyacınıza göre (*Yalnızca ben* / *Kurum içi* / *Herkes*).
6. İlk açılışta **yetkilendirme** istenir → Sheets erişimine izin ver.
7. Verilen Web App URL'sini aç. Pano 4 sekmeyle (E1–E4) açılır.

---

## 🛠️ Yöntem B — clasp (CLI ile)

```bash
# 1. clasp kurulumu ve giriş
npm install -g @google/clasp
clasp login

# 2. Bu klasörde yeni proje oluştur (webapp tipi)
cd enerji-panosu
clasp create --type webapp --title "S6 Enerji Panosu"

# 3. Dosyaları yükle (Code.gs + *.html otomatik push edilir)
clasp push

# 4. Web uygulaması olarak dağıt
clasp deploy --description "S6 Enerji Panosu v1"

# 5. Tarayıcıda projeyi aç ve URL'i al
clasp open
```

> Not: `clasp create` bir `.clasp.json` ve `appsscript.json` üretir. `appsscript.json`
> içinde zaman dilimini `Europe/Istanbul` yapmanız TR tarih/saat biçimi için önerilir.

---

## ✅ Doğrulama Kontrol Listesi
- [ ] Pano açıldığında "Yükleniyor…" durumu görünüyor.
- [ ] KPI kartları doluyor (Toplam Tüketim, CO₂, Birim/kWh, Hedef Sapma, Üretim).
- [ ] Sayılar TR formatında (1.250,50).
- [ ] E1 halka + özet sütun, E2 trend, E3 Pareto, E4 tablo çiziliyor.
- [ ] Tablo başlığına tıklayınca sıralama, arama kutusu filtreleme çalışıyor.
- [ ] Boş tabloda "Veri bulunamadı" mesajı görünüyor.
