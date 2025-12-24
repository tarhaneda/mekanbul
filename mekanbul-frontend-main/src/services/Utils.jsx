// Tarih formatlama fonksiyonu - Tarihi Türkçe formatta gösterir
// Örnek: "15 Ocak 2024" formatında döndürür
export function formatDate(date) {
  // Gelen tarihi Date objesine çevir
  var date = new Date(date);

  // Türkçe ay isimleri dizisi
  var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

  // Gün bilgisini al (1-31 arası)
  var dateInfo = date.getDate();

  // Ay bilgisini al ve Türkçe ay ismine çevir
  // getMonth() 0-11 arası döndürür, bu yüzden months dizisinden doğru ayı alırız
  var monthInfo = months[date.getMonth()];

  // Yıl bilgisini al (örn: 2024)
  var yearInfo = date.getFullYear();

  // Tarihi birleştir: "15 Ocak 2024" formatında
  var result = dateInfo + ' ' + monthInfo + ' ' + yearInfo;

  return result;
}

// Mesafe formatlama fonksiyonu - Mesafeyi km veya m cinsinden gösterir
// Gelen değer metre cinsindendir. 1000m'den büyükse km, değilse m gösterir.
export function formatDistance(distance) {
  var newDistance, unit;

  // Eğer mesafe tanımlı değilse veya geçersizse
  if (!distance && distance !== 0) {
    return "";
  }

  if (distance > 1000) {
    // 1000 metre üzerindeyse km'ye çevir -> 1200m = 1.2km
    newDistance = (distance / 1000).toFixed(1);
    unit = " km";
  } else {
    // 1000 metreden azsa direkt metre göster -> 500m
    newDistance = parseInt(distance, 10);
    unit = " m";
  }

  return newDistance + unit;
};