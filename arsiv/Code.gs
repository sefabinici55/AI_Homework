/**
 * VALEO – Enerji & Sürdürülebilirlik Panosu
 * Tesis Müdürü için tek sayfalık özet KPI panosu (iskelet).
 *
 * MİMARİ KURALI: Veri ASLA koda gömülmez. Tüm veri Google Sheets'ten
 * SpreadsheetApp.openById() ile dinamik olarak çekilir.
 */

// ---------------------------------------------------------------------------
// Yapılandırma
// ---------------------------------------------------------------------------
var SPREADSHEET_ID = '1lLsEJnADKTqzRl9tektA714iyePA73zzlmdcPkQ3Sd4';
var SHEET_NAME = 'Sayfa1'; // Veri sekmenizin adı (gerekirse değiştirin)

// Sütun başlıkları (1. satır). Sıralama değişse bile başlık adıyla eşleştiririz.
var COL = {
  TARIH: 'Tarih',
  VARDIYA: 'Vardiya',
  HAT: 'Hat',
  ENERJI_TIPI: 'Enerji Tipi',
  TUKETIM: 'Tüketim (kWh)',
  URETIM: 'Üretim Adedi',
  HEDEF: 'Hedef kWh/birim',
  CO2_FAKTOR: 'CO2 Faktörü (kg CO2/kWh)'
};

// ---------------------------------------------------------------------------
// Web App giriş noktası
// ---------------------------------------------------------------------------
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('VALEO | Enerji & Sürdürülebilirlik Panosu')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ---------------------------------------------------------------------------
// VERİ ÇEKME — google.script.run ile istemciden çağrılır
// ---------------------------------------------------------------------------
/**
 * Sheet'ten ham veriyi okur, KPI'ları ve grafik serilerini hesaplar.
 * Dönen nesne istemciye (Index.html) gönderilir.
 */
function getDashboardData() {
  try {
    // 1) Tablodan ham veriyi al
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
    if (!sheet) {
      return { ok: false, error: 'Sayfa bulunamadı: ' + SHEET_NAME };
    }

    var values = sheet.getDataRange().getValues();
    if (!values || values.length < 2) {
      return { ok: true, isEmpty: true }; // "Veri bulunamadı" durumu
    }

    // 2) Başlık satırını indeks haritasına çevir (gömülü sıraya bağımlı değiliz)
    var headers = values[0];
    var idx = {};
    headers.forEach(function (h, i) { idx[String(h).trim()] = i; });

    // 3) Satırları okunabilir nesnelere dönüştür
    var rows = [];
    for (var r = 1; r < values.length; r++) {
      var row = values[r];
      if (!row[idx[COL.HAT]]) continue; // boş satırları atla

      rows.push({
        tarih: formatDate_(row[idx[COL.TARIH]]),
        vardiya: row[idx[COL.VARDIYA]],
        hat: row[idx[COL.HAT]],
        enerjiTipi: row[idx[COL.ENERJI_TIPI]],
        tuketim: num_(row[idx[COL.TUKETIM]]),
        uretim: num_(row[idx[COL.URETIM]]),
        hedef: num_(row[idx[COL.HEDEF]]),
        co2Faktor: num_(row[idx[COL.CO2_FAKTOR]])
      });
    }

    // 4) KPI'ları ve grafik serilerini hesapla
    return {
      ok: true,
      isEmpty: false,
      guncelleme: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm'),
      kpi: hesaplaKpi_(rows),
      hatBazli: hatBazliTuketim_(rows),   // Sütun grafiği için
      trend: gunlukTrend_(rows)           // Çizgi grafiği için (hat bazlı)
    };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ---------------------------------------------------------------------------
// Hesaplama yardımcıları
// ---------------------------------------------------------------------------
function hesaplaKpi_(rows) {
  var toplamTuketim = 0, toplamUretim = 0, toplamCo2 = 0, hedefSapmaTuketim = 0;

  rows.forEach(function (x) {
    toplamTuketim += x.tuketim;
    toplamUretim += x.uretim;
    toplamCo2 += x.tuketim * x.co2Faktor;          // kg CO2
    hedefSapmaTuketim += x.uretim * x.hedef;         // hedeflenen toplam kWh
  });

  var birimBasi = toplamUretim > 0 ? toplamTuketim / toplamUretim : 0;
  // Hedefe göre verimlilik: gerçek tüketim / hedeflenen tüketim (1'in altı = iyi)
  var verimlilik = hedefSapmaTuketim > 0 ? (toplamTuketim / hedefSapmaTuketim) : 0;

  return {
    toplamTuketim: toplamTuketim,        // kWh
    toplamCo2: toplamCo2 / 1000,         // ton CO2
    toplamUretim: toplamUretim,          // adet
    birimBasiTuketim: birimBasi,         // kWh/birim
    verimlilikOrani: verimlilik          // oran (1.00 = hedef)
  };
}

/** Sütun grafiği: her hat için toplam tüketim. */
function hatBazliTuketim_(rows) {
  var map = {};
  rows.forEach(function (x) {
    map[x.hat] = (map[x.hat] || 0) + x.tuketim;
  });
  return Object.keys(map).map(function (hat) {
    return { hat: hat, tuketim: map[hat] };
  }).sort(function (a, b) { return b.tuketim - a.tuketim; }); // Pareto: büyükten küçüğe
}

/** Çizgi grafiği: tarih bazında, her hat ayrı seri olacak şekilde. */
function gunlukTrend_(rows) {
  var hatlar = {};
  var gunler = {};

  rows.forEach(function (x) {
    hatlar[x.hat] = true;
    gunler[x.tarih] = gunler[x.tarih] || {};
    gunler[x.tarih][x.hat] = (gunler[x.tarih][x.hat] || 0) + x.tuketim;
  });

  var hatListe = Object.keys(hatlar);
  var tarihler = Object.keys(gunler).sort();

  // [['Tarih', 'Hat A', 'Hat B', ...], ['01.06', 100, 200, ...], ...]
  var tablo = [['Tarih'].concat(hatListe)];
  tarihler.forEach(function (t) {
    var satir = [t];
    hatListe.forEach(function (h) { satir.push(gunler[t][h] || 0); });
    tablo.push(satir);
  });
  return tablo;
}

// ---------------------------------------------------------------------------
// Küçük yardımcılar
// ---------------------------------------------------------------------------
function num_(v) {
  if (v === '' || v === null || v === undefined) return 0;
  var n = parseFloat(String(v).replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

function formatDate_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'dd.MM.yyyy');
  }
  return String(v);
}
