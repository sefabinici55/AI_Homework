# Tasarım Sistemi Renk ve Stil Rehberi (renk.md)

Görselde yer alan kullanıcı arayüzü (UI) tasarım öğeleri, renk paletleri, tipografi kuralları ve bileşen standartları referans alınarak hazırlanan teknik dokümantasyon aşağıdadır.

---

## 🎨 1. Renk Paleti (Color Palette)

Tasarım sisteminin temelini oluşturan renk kodları ve kullanım amaçları:

| Kategori | HEX Kodu | Açıklama / Kullanım Alanı |
| :--- | :--- | :--- |
| **Primary (Ana Renk)** | `#82E600` | Canlı fıstık yeşili. Marka vurguları, birincil buton arka planları, aktif durumlar ve dikkat çekmesi gereken etiketler için kullanılır. |
| **Secondary (İkincil Renk)** | `#1D2433` | Koyu antrasit / gece mavisi. Koyu arka planlar, ana metinler, başlıklar ve ters yüz edilmiş (inverted) UI elemanları için temel renktir. |
| **Tertiary (Üçüncül Renk)** | `#16445F` | Mat deniz mavisi / petrol mavisi. Yardımcı grafikler, durum çubukları, kenar çizgileri ve alternatif görsel gruplamalar için tercih edilir. |
| **Neutral (Nötr Renk)** | `#F1F3F9` | Açık gri-mavi tonu. Kart arka planları, genel sayfa fonu, pasif alanlar ve arama çubuğu iç dolgusu için temiz bir matris sunar. |

---

## font 2. Tipografi Standartları (Typography)

Arayüz hiyerarşisini oluşturan yazı tipleri ve karakter setleri:

* **Headline (Başlıklar):** * **Yazı Tipi:** `Montserrat`
  * **Kullanım:** Büyük başlıklar, ekran adları ve hiyerarşik olarak en üstte yer alan dikkat çekici metinler.
* **Body (Gövde Metni):** * **Yazı Tipi:** `Inter`
  * **Kullanım:** Okunabilirliğin kritik olduğu uzun metinler, açıklamalar ve paragraf yapıları.
* **Label (Etiketler & Butonlar):** * **Yazı Tipi:** `Inter`
  * **Kullanım:** Buton içi yazılar, form girdi başlıkları, veri etiketleri ve küçük bilgilendirme alanları.

---

## 🎛️ 3. UI Bileşenleri ve Elemanları (UI Components)

### 🔹 Buton Çeşitleri
* **Primary Button:** Koyu zeytin yeşili arka plan üzerine beyaz metin veya canlı yeşil (`#82E600`) üzerine ikon/metin yerleşimi.
* **Secondary Button:** Açık nötr gri arka plan üzerine koyu metin yerleşimi.
* **Inverted Button:** Tamamen koyu antrasit (`#1D2433`) arka plan üzerine beyaz metin yerleşimi.
* **Outlined Button:** İnce kenarlık çizgisine sahip, içi şeffaf buton yapısı.

### 🔍 Giriş ve Navigasyon Elemanları
* **Arama Çubuğu (Search Bar):** `#F1F3F9` nötr dolgu rengine sahip, sol tarafında arama ikonu (`magnifying glass`) barındıran minimal arayüz.
* **Alt Navigasyon Çubuğu (Bottom Navigation):** Aktif sekmeyi (`Home`) koyu yeşil bir kare kutu içerisine alan; arama ve profil ikonlarını yan yana dizen sade mobil menü yapısı.
* **İndikatörler & Grafikler:** İlerleme çubukları (Progress Bars) ve veri çizgileri, ana paletteki yeşil, antrasit ve petrol mavisi tonlarının hiyerarşik dizilimiyle oluşturulmuştur.

### 🔴 Aksiyon ve Durum İkonları
Sistem içinde işlevlerine göre renk kodlu kare butonlar tanımlanmıştır:
* **Düzenleme (Edit):** Açık mavi arka plan.
* **Sihirli Değnek / Efekt:** Koyu yeşil.
* **Geometri / Bileşen:** Gri.
* **Etiketleme (Tag):** Petrol mavisi.
* **Silme / Çöp Kutusu (Delete):** Uyarı/Tehlike durumu için canlı kırmızı arka plan.
