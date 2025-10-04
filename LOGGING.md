# Event-Bazlı Loglama Sistemi

## 📋 Genel Bakış

Bu proje, kullanıcı yolculuğunu adım adım takip edebilmek için event-bazlı bir loglama sistemi kullanmaktadır.

## 🎯 Özellikler

### 1. **Event-Bazlı Loglama**
Her önemli kullanıcı aksiyonu ayrı bir event olarak loglanır:
- `trip_search_started` - Kullanıcı arama başlattı
- `trip_search_completed` - Arama başarıyla tamamlandı
- `flight_results_received` - Uçuş sonuçları alındı
- `accommodation_results_received` - Konaklama sonuçları alındı
- `itinerary_generated` - İterasyon planı oluşturuldu
- ve daha fazlası...

### 2. **Session Tracking (SessionId)**
Her request için benzersiz bir `sessionId` üretilir. Bu sayede:
- Aynı kullanıcının tüm aksiyonları takip edilebilir
- Loglar sessionId'ye göre filtrelenebilir
- Kullanıcı yolculuğu baştan sona görülebilir

SessionId:
- Otomatik olarak her request için UUID formatında üretilir
- Response header'ında `X-Session-Id` olarak client'a gönderilir
- Client, bir sonraki request'te `X-Session-Id` header'ı ile aynı session'ı devam ettirebilir

### 3. **Log Seviyeleri**
- **info**: Normal kullanıcı aksiyonları ve event'ler
- **warn**: Beklenmeyen ama kritik olmayan durumlar (örn: eksik bilgi)
- **error**: Hatalar ve exception'lar

### 4. **Standart Log Formatı**
```json
{
  "timestamp": "2025-10-04T12:34:56.789Z",
  "level": "info",
  "event": "trip_search_started",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "details": {
    "prompt": "İstanbul'dan Antalya'ya 20 Ekim'de gitmek istiyorum",
    "promptLength": 50
  },
  "responseTime": 1234,
  "ip": "127.0.0.1"
}
```

## 📁 Log Dosyaları

Loglar `logs/` klasöründe ayrı dosyalara kaydedilir:

- **`user-journey.log`**: Tüm kullanıcı event'leri (info seviyesi)
- **`warnings.log`**: Uyarılar (warn seviyesi)
- **`error.log`**: Hatalar (error seviyesi)

## 🔍 Event Tipleri

### Arama & Başlangıç
- `trip_search_started`: Kullanıcı seyahat araması başlattı
- `trip_search_completed`: Arama başarıyla tamamlandı
- `trip_search_failed`: Arama başarısız oldu

### Uçuş İşlemleri
- `flight_results_received`: Uçuş sonuçları alındı
- `flight_selected`: Kullanıcı uçuş seçti
- `flight_detail_opened`: Uçuş detayı açıldı

### Konaklama İşlemleri
- `accommodation_results_received`: Konaklama sonuçları alındı
- `hotel_selected`: Otel seçildi
- `hotel_detail_opened`: Otel detayı açıldı

### Aktivite & Cazibe Merkezleri
- `activities_results_received`: Aktivite/cazibe merkezi sonuçları alındı
- `activity_selected`: Aktivite seçildi
- `attraction_selected`: Cazibe merkezi seçildi

### İterasyon & Planlama
- `itinerary_generated`: Günlük plan oluşturuldu
- `itinerary_modified`: Plan değiştirildi

### MCP İşlemleri
- `mcp_request_sent`: MCP'ye istek gönderildi
- `mcp_response_received`: MCP'den yanıt alındı
- `mcp_error`: MCP hatası

### Diğer
- `missing_info_requested`: Eksik bilgi istendi (warn seviyesi)

## 💡 Kullanım Örnekleri

### Logger Service'i Inject Etme
```typescript
constructor(private readonly logger: CustomLoggerService) {}
```

### Event Loglama
```typescript
this.logger.logEvent(
  EventType.TRIP_SEARCH_STARTED,
  sessionId,
  {
    origin: 'Istanbul',
    destination: 'Antalya',
    date: '2025-10-20'
  },
  LogLevel.INFO,
  undefined, // responseTime (optional)
  undefined, // userId (optional)
  clientIp
);
```

## 🔎 Log Analizi

### SessionId ile Kullanıcı Yolculuğunu Takip Etme
```bash
# Belirli bir session'ın tüm loglarını görme
grep "a1b2c3d4-e5f6-7890" logs/user-journey.log | jq '.'

# Session'daki event'leri sıralı görme
grep "a1b2c3d4-e5f6-7890" logs/user-journey.log | jq '.event'
```

### Belirli Event'leri Filtreleme
```bash
# Tüm arama başlangıçlarını görme
grep "trip_search_started" logs/user-journey.log | jq '.'

# Hata olan aramalar
grep "trip_search_failed" logs/user-journey.log | jq '.'
```

### İstatistikler
```bash
# En çok kullanılan event'ler
jq -r '.event' logs/user-journey.log | sort | uniq -c | sort -rn

# Ortalama response time
jq -r 'select(.responseTime != null) | .responseTime' logs/user-journey.log | awk '{sum+=$1; count++} END {print sum/count}'
```

## 🚀 Başlangıç

Sistem otomatik olarak çalışır. Herhangi bir yapılandırma gerektirmez.

1. Uygulamayı başlatın:
```bash
npm run start:dev
```

2. Loglar otomatik olarak `logs/` klasörüne kaydedilmeye başlar.

3. Client'tan gelen request'ler için sessionId otomatik üretilir ve response header'ında döner.

## 📊 Konsol Çıktısı

Konsol çıktısı okunabilir ve renkli formatta gösterilir:
```
2025-10-04 12:34:56 [info] trip_search_started [Session: a1b2c3d4...]
2025-10-04 12:34:57 [info] mcp_request_sent [Session: a1b2c3d4...]
2025-10-04 12:35:02 [info] flight_results_received [Session: a1b2c3d4...]
```

## 🔄 Genişletme

Yeni event tipi eklemek için:

1. `src/logger/event-types.ts` dosyasına yeni event ekleyin:
```typescript
export enum EventType {
  // ... mevcut eventler
  NEW_EVENT = 'new_event',
}
```

2. İlgili yerde event'i loglayın:
```typescript
this.logger.logEvent(
  EventType.NEW_EVENT,
  sessionId,
  { /* details */ },
  LogLevel.INFO
);
```

