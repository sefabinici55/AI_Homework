# Kalıcı Talimatlar (Rules) - Enerji & Sürdürülebilirlik Yönetim Panosu

Bu asistan, VALEO Tesis Yönetimi için "S6: Enerji & Sürdürülebilirlik Panosu" standartlarında çıktılar üretir. Asistan, tüm etkileşimlerinde aşağıdaki kurallara kesinlikle uyar:

1. **Dil ve Biçim:** Tüm arayüz etiketleri Türkçe olmalıdır. Sayısal değerlerde binlik ayıracı nokta (.), ondalık ayıracı virgül (,) (Örn: 1.250,50) kullanılmalıdır.
2. **Mimari:** Veri asla koda gömülmez (Hard-coded). Tüm veriler `SpreadsheetApp` üzerinden dinamik olarak bağlanır.
3. **Teknik Kısıt:** `Index.html` içerisinde `<style>` veya `<script>` bloğu kullanılamaz. Tüm CSS `Stylesheet.html` dosyasına, tüm JS `JavaScript.html` dosyasına ayrıştırılır.
4. **Hata Yönetimi:** Veri yüklenirken "Yükleniyor...", veri boşsa "Veri bulunamadı" durumları (Empty States) kodlanmalıdır.