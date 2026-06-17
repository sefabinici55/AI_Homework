/**
 * =====================================================================
 *  S6 - ENERJİ & SÜRDÜRÜLEBİLİRLİK PANOSU  |  Backend (Code.gs)
 *  VALEO Tesis Yönetimi
 * ---------------------------------------------------------------------
 *  Mimari Kurallar (kalici-talimat.md):
 *   - Veri ASLA koda gömülmez. Tümü SpreadsheetApp ile dinamik okunur.
 *   - Sayı biçimi (1.250,50) ve TR etiketler frontend'de uygulanır.
 *   - getKpiSummary() ve getSheetData() ana veri fonksiyonlarıdır.
 * =====================================================================
 */

// --- Yapılandırma -----------------------------------------------------
var SPREADSHEET_ID = '1lLsEJnADKTqzRl9tektA714iyePA73zzlmdcPkQ3Sd4';
var SHEET_NAME = 'Sayfa1'; // Sekme adınız farklıysa değiştirin (İng: 'Sheet1').

// Tablo başlıklarının kanonik karşılıkları (S6 standardı).
var COLS = {
  tarih:     'Tarih',
  vardiya:   'Vardiya',
  hat:       'Hat',
  enerjiTipi:'Enerji Tipi',
  tuketim:   'Tüketim',          // "Tüketim (kWh)"
  uretim:    'Üretim',           // "Üretim Adedi"
  hedef:     'Hedef',            // "Hedef kWh/birim"
  co2Faktor: 'CO2 Faktörü'       // "CO2 Faktörü (kg CO2/kWh)"
};

// --- Web App giriş noktası -------------------------------------------
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Enerji & Sürdürülebilirlik Panosu')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Index.html içinden Stylesheet.html ve JavaScript.html dosyalarını
 * dahil etmek için kullanılır:  <?!= include('Stylesheet') ?>
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// --- Yardımcılar ------------------------------------------------------
function _getSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  if (!sheet) throw new Error('Çalışma sayfası bulunamadı.');
  return sheet;
}

// Başlık tam eşleşmese de "içeren" sütunu yakalar (örn "Tüketim (kWh)").
function _idx_(headers, key) {
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).toLowerCase().indexOf(key.toLowerCase()) !== -1) return i;
  }
  return -1;
}

function _num_(v) {
  if (typeof v === 'number') return v;
  if (v == null || v === '') return 0;
  var s = String(v).replace(/\./g, '').replace(',', '.').replace(/[^\d.\-]/g, '');
  var n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function _dateStr_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(v || '').trim();
}

/**
 * getSheetData()
 * Ham veriyi yapılandırılmış satır nesneleri olarak döndürür.
 * E4 Detay Tablosu ve istemci tarafı doğrulama için kullanılır.
 *
 * @return {Object} { rows: [...], count: n }
 */
function getSheetData() {
  var sheet = _getSheet_();
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return { rows: [], count: 0 };

  var headers = values[0];
  var ix = {
    tarih:     _idx_(headers, COLS.tarih),
    vardiya:   _idx_(headers, COLS.vardiya),
    hat:       _idx_(headers, COLS.hat),
    enerjiTipi:_idx_(headers, COLS.enerjiTipi),
    tuketim:   _idx_(headers, COLS.tuketim),
    uretim:    _idx_(headers, COLS.uretim),
    hedef:     _idx_(headers, COLS.hedef),
    co2Faktor: _idx_(headers, COLS.co2Faktor)
  };

  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    if (ix.hat === -1 || String(r[ix.hat]).trim() === '') continue; // boş satır atla

    var tuketim   = _num_(r[ix.tuketim]);
    var uretim    = _num_(r[ix.uretim]);
    var hedefBirim= _num_(r[ix.hedef]);
    var co2Faktor = _num_(r[ix.co2Faktor]);

    rows.push({
      tarih:       _dateStr_(r[ix.tarih]),
      vardiya:     String(r[ix.vardiya] || '').trim(),
      hat:         String(r[ix.hat] || '').trim(),
      enerjiTipi:  String(r[ix.enerjiTipi] || '').trim(),
      tuketim:     tuketim,
      uretim:      uretim,
      hedefBirim:  hedefBirim,
      co2Faktor:   co2Faktor,
      // Türetilmiş alanlar
      co2:         Math.round(tuketim * co2Faktor * 100) / 100,
      birimBasina: uretim ? Math.round((tuketim / uretim) * 1000) / 1000 : 0
    });
  }
  return { rows: rows, count: rows.length };
}

/**
 * getKpiSummary()
 * Özet KPI'ları ve grafik serilerini sunucu tarafında hesaplar.
 *  - kpis:      E1 kartları (toplam tüketim, CO2, birim/kWh, hedef sapma %)
 *  - trend:     E2 zaman serisi (enerji tipine göre)
 *  - pareto:    E3 hat bazlı kırılım (azalan + kümülatif %)
 *  - energyMix: E1 enerji tipi dağılımı (halka grafik)
 *
 * @return {Object}
 */
function getKpiSummary() {
  var data = getSheetData().rows;

  var totalTuketim = 0, totalUretim = 0, totalCo2 = 0, totalHedef = 0;
  var byDateType = {};   // { tarih: { tip: kWh } }
  var byLine = {};       // { hat: kWh }
  var byType = {};       // { tip: kWh }
  var dateSet = {}, typeSet = {};

  data.forEach(function (r) {
    totalTuketim += r.tuketim;
    totalUretim  += r.uretim;
    totalCo2     += r.co2;
    totalHedef   += r.uretim * r.hedefBirim; // hedef toplam tüketim

    // Trend (tarih x enerji tipi)
    dateSet[r.tarih] = true;
    typeSet[r.enerjiTipi] = true;
    byDateType[r.tarih] = byDateType[r.tarih] || {};
    byDateType[r.tarih][r.enerjiTipi] = (byDateType[r.tarih][r.enerjiTipi] || 0) + r.tuketim;

    // Hat bazlı
    byLine[r.hat] = (byLine[r.hat] || 0) + r.tuketim;

    // Enerji tipi dağılımı
    byType[r.enerjiTipi] = (byType[r.enerjiTipi] || 0) + r.tuketim;
  });

  // --- KPI'lar ---
  var birimBasina = totalUretim ? totalTuketim / totalUretim : 0;
  var hedefSapma  = totalHedef ? ((totalTuketim - totalHedef) / totalHedef) * 100 : 0;

  var kpis = {
    toplamTuketim: round2(totalTuketim),
    toplamCo2:     round2(totalCo2),
    birimBasina:   round3(birimBasina),
    hedefSapma:    round2(hedefSapma),       // + ise hedef aşıldı (kötü)
    toplamUretim:  Math.round(totalUretim),
    hatSayisi:     Object.keys(byLine).length
  };

  // --- Trend (E2) ---
  var dates = Object.keys(dateSet).sort();
  var types = Object.keys(typeSet).sort();
  var trend = { labels: dates, types: types, series: {} };
  types.forEach(function (t) {
    trend.series[t] = dates.map(function (d) {
      return round2((byDateType[d] && byDateType[d][t]) || 0);
    });
  });

  // --- Pareto (E3): hat bazlı azalan + kümülatif % ---
  var lineArr = Object.keys(byLine).map(function (h) {
    return { hat: h, kWh: byLine[h] };
  }).sort(function (a, b) { return b.kWh - a.kWh; });

  var cum = 0;
  var pareto = { labels: [], values: [], cumulative: [] };
  lineArr.forEach(function (o) {
    cum += o.kWh;
    pareto.labels.push(o.hat);
    pareto.values.push(round2(o.kWh));
    pareto.cumulative.push(totalTuketim ? round2((cum / totalTuketim) * 100) : 0);
  });

  // --- Enerji tipi dağılımı (E1 halka) ---
  var energyMix = {
    labels: Object.keys(byType),
    values: Object.keys(byType).map(function (t) { return round2(byType[t]); })
  };

  return {
    kpis: kpis,
    trend: trend,
    pareto: pareto,
    energyMix: energyMix,
    generatedAt: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm')
  };
}

function round2(n) { return Math.round(n * 100) / 100; }
function round3(n) { return Math.round(n * 1000) / 1000; }
