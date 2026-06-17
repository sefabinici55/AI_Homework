/**
 * Tesis Müdürü Enerji Tüketimi Dashboard'u - Sunucu Tarafı (Backend)
 * --------------------------------------------------------------------
 * Bu dosya verileri Google Sheets'ten okur, özet KPI'ları hesaplar ve
 * Index.html arayüzüne JSON olarak gönderir.
 *
 * NOT: Veri koda GÖMÜLMEMİŞTİR. Tüm veriler aşağıdaki Spreadsheet'ten
 * canlı olarak çekilir.
 */

// Google Sheets dosyanızın ID'si (URL'deki /d/ ile /edit arasındaki bölüm)
var SPREADSHEET_ID = '1lLsEJnADKTqzRl9tektA714iyePA73zzlmdcPkQ3Sd4';

// Verinin bulunduğu sayfa (sekme) adı. Gerekirse değiştirin.
var SHEET_NAME = 'Sayfa1'; // İngilizce arayüzde genelde 'Sheet1'

/**
 * Web uygulaması açıldığında çalışır ve Index.html arayüzünü döndürür.
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Tesis Enerji Tüketimi Paneli')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * HTML içinde başka HTML/CSS/JS parçalarını dahil etmek için yardımcı fonksiyon.
 * Tek dosya kullandığımız için şu an zorunlu değil, ama ileride işinize yarar.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Google Sheets'ten ham veriyi okur.
 *
 * Beklenen tablo yapısı (ilk satır başlık):
 *   | Tarih | Hat | Tüketim (kWh) | Üretim (adet) | ... |
 *
 * @return {Object[]} Her satırı bir nesne olarak içeren dizi.
 */
function getRawData() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error('Sayfa bulunamadı: "' + SHEET_NAME + '". Sekme adını kontrol edin.');
  }

  // getDataRange: dolu olan tüm hücreleri otomatik seçer.
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return []; // Sadece başlık var ya da boş.
  }

  var headers = values[0].map(function (h) {
    return String(h).trim();
  });

  // Her satırı başlık -> değer eşlemesiyle nesneye dönüştür.
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = values[i][j];
    }
    rows.push(row);
  }
  return rows;
}

/**
 * Arayüzün (Index.html) çağırdığı ANA fonksiyon.
 * KPI'ları ve grafik verilerini hazırlayıp tek bir nesne olarak döndürür.
 *
 * google.script.run.getDashboardData() ile çağrılır.
 */
function getDashboardData() {
  var data = getRawData();

  // ---- Sütun adlarını burada kendi tablonuza göre eşleştirin ----
  var COL_HAT = 'Hat';            // Üretim hattı adı
  var COL_TUKETIM = 'Tüketim';    // Enerji tüketimi (kWh) - başlığın bir kısmı yeterli
  var COL_TARIH = 'Tarih';        // Tarih (opsiyonel, trend için)

  // Esnek başlık bulucu: tam eşleşme yoksa "içeren" başlığı yakalar.
  function pick(row, key) {
    if (row.hasOwnProperty(key)) return row[key];
    for (var k in row) {
      if (k.toLowerCase().indexOf(key.toLowerCase()) !== -1) return row[k];
    }
    return null;
  }

  function toNumber(v) {
    if (typeof v === 'number') return v;
    if (v == null || v === '') return 0;
    // "1.234,56" gibi TR formatlarını da temizlemeye çalış.
    var s = String(v).replace(/\./g, '').replace(',', '.').replace(/[^\d.\-]/g, '');
    var n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }

  // ---- Hat bazlı toplam tüketim ----
  var perLine = {}; // { "Hat 1": 1234, ... }
  var totalConsumption = 0;

  data.forEach(function (row) {
    var hat = pick(row, COL_HAT);
    var tuketim = toNumber(pick(row, COL_TUKETIM));
    if (hat == null || hat === '') return;

    hat = String(hat).trim();
    perLine[hat] = (perLine[hat] || 0) + tuketim;
    totalConsumption += tuketim;
  });

  // Grafik için dizilere çevir.
  var lineLabels = Object.keys(perLine);
  var lineValues = lineLabels.map(function (l) {
    return Math.round(perLine[l] * 100) / 100;
  });

  // ---- Özet KPI'lar ----
  var lineCount = lineLabels.length;
  var avgPerLine = lineCount ? totalConsumption / lineCount : 0;

  // En çok tüketen hat.
  var topLine = '-';
  var topValue = 0;
  lineLabels.forEach(function (l) {
    if (perLine[l] > topValue) {
      topValue = perLine[l];
      topLine = l;
    }
  });

  // ---- Zaman bazlı trend (opsiyonel) ----
  // Tarih sütunu varsa günlük toplam tüketimi de hazırlayalım.
  var trend = {};
  data.forEach(function (row) {
    var tarih = pick(row, COL_TARIH);
    if (tarih == null || tarih === '') return;
    var label = (tarih instanceof Date)
      ? Utilities.formatDate(tarih, Session.getScriptTimeZone(), 'dd.MM.yyyy')
      : String(tarih);
    trend[label] = (trend[label] || 0) + toNumber(pick(row, COL_TUKETIM));
  });

  return {
    kpis: {
      totalConsumption: Math.round(totalConsumption * 100) / 100,
      lineCount: lineCount,
      avgPerLine: Math.round(avgPerLine * 100) / 100,
      topLine: topLine,
      topValue: Math.round(topValue * 100) / 100,
      recordCount: data.length
    },
    lineChart: {
      labels: lineLabels,
      values: lineValues
    },
    trendChart: {
      labels: Object.keys(trend),
      values: Object.keys(trend).map(function (k) {
        return Math.round(trend[k] * 100) / 100;
      })
    },
    generatedAt: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm')
  };
}
