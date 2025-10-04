# Log Örnekleri

## Örnek Kullanıcı Yolculuğu

Aşağıda, bir kullanıcının İstanbul'dan Antalya'ya seyahat araması yaptığı senaryonun event-bazlı logları gösterilmektedir.

### 1. Arama Başlangıcı
```json
{
  "timestamp": "2025-10-04T10:15:23.456Z",
  "level": "info",
  "event": "trip_search_started",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "details": {
    "prompt": "İstanbul'dan Antalya'ya 20 Ekim'de gitmek istiyorum, 3 gün kalacağım",
    "promptLength": 72
  },
  "ip": "127.0.0.1",
  "service": "trip-planner-backend"
}
```

### 2. MCP İsteği Gönderildi
```json
{
  "timestamp": "2025-10-04T10:15:23.501Z",
  "level": "info",
  "event": "mcp_request_sent",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "details": {
    "prompt": "İstanbul'dan Antalya'ya 20 Ekim'de gitmek istiyorum, 3 gün kalacağım"
  },
  "ip": "127.0.0.1",
  "service": "trip-planner-backend"
}
```

### 3. MCP Sunucularına Bağlanma
```json
{
  "timestamp": "2025-10-04T10:15:23.567Z",
  "level": "info",
  "event": "mcp_request_sent",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "details": {
    "action": "Connecting to MCP servers",
    "servers": ["enUygun", "attractionsActivites"]
  },
  "ip": "127.0.0.1",
  "service": "trip-planner-backend"
}
```

### 4. MCP Yanıtı Alındı
```json
{
  "timestamp": "2025-10-04T10:15:28.234Z",
  "level": "info",
  "event": "mcp_response_received",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "details": {
    "action": "Agent completed processing",
    "outputLength": 5432
  },
  "responseTime": 4667,
  "ip": "127.0.0.1",
  "service": "trip-planner-backend"
}
```

### 5. Uçuş Sonuçları Alındı
```json
{
  "timestamp": "2025-10-04T10:15:28.345Z",
  "level": "info",
  "event": "flight_results_received",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "details": {
    "departureFlights": 8,
    "returnFlights": 7,
    "sampleDepartureFlight": {
      "airline": "Turkish Airlines",
      "price": "1250 TL"
    }
  },
  "ip": "127.0.0.1",
  "service": "trip-planner-backend"
}
```

### 6. Konaklama Sonuçları Alındı
```json
{
  "timestamp": "2025-10-04T10:15:28.456Z",
  "level": "info",
  "event": "accommodation_results_received",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "details": {
    "count": 12,
    "locations": ["Konyaaltı", "Lara", "Kaleiçi"],
    "priceRange": {
      "min": 850,
      "max": 4500
    }
  },
  "ip": "127.0.0.1",
  "service": "trip-planner-backend"
}
```

### 7. Aktivite Sonuçları Alındı
```json
{
  "timestamp": "2025-10-04T10:15:28.567Z",
  "level": "info",
  "event": "activities_results_received",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "details": {
    "activityCount": 15,
    "attractionCount": 8,
    "sampleActivity": "Düden Şelalesi Gezisi"
  },
  "ip": "127.0.0.1",
  "service": "trip-planner-backend"
}
```

### 8. İterasyon Planı Oluşturuldu
```json
{
  "timestamp": "2025-10-04T10:15:28.678Z",
  "level": "info",
  "event": "itinerary_generated",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "details": {
    "days": 3,
    "totalScheduledItems": 9,
    "dailyBreakdown": [
      {
        "day": "Day 1",
        "date": "2025-10-20",
        "activities": 3
      },
      {
        "day": "Day 2",
        "date": "2025-10-21",
        "activities": 3
      },
      {
        "day": "Day 3",
        "date": "2025-10-22",
        "activities": 3
      }
    ]
  },
  "ip": "127.0.0.1",
  "service": "trip-planner-backend"
}
```

### 9. MCP Yanıtı Detayları
```json
{
  "timestamp": "2025-10-04T10:15:28.789Z",
  "level": "info",
  "event": "mcp_response_received",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "details": {
    "hasFlights": true,
    "flightCount": {
      "departure": 8,
      "return": 7
    },
    "hasAccommodations": true,
    "accommodationCount": 12,
    "hasActivities": true,
    "activityCount": 15,
    "hasAttractions": true,
    "attractionCount": 8,
    "hasItinerary": true,
    "itineraryDays": 3
  },
  "responseTime": 5333,
  "ip": "127.0.0.1",
  "service": "trip-planner-backend"
}
```

### 10. Arama Tamamlandı
```json
{
  "timestamp": "2025-10-04T10:15:28.890Z",
  "level": "info",
  "event": "trip_search_completed",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "details": {
    "totalResults": {
      "flights": 15,
      "accommodations": 12,
      "activities": 15,
      "attractions": 8
    }
  },
  "responseTime": 5434,
  "ip": "127.0.0.1",
  "service": "trip-planner-backend"
}
```

---

## Hata Senaryosu Örneği

### Eksik Bilgi Uyarısı
```json
{
  "timestamp": "2025-10-04T10:20:15.123Z",
  "level": "warn",
  "event": "missing_info_requested",
  "sessionId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "details": {
    "comment": "Lütfen hangi tarihte seyahat etmek istediğinizi belirtin."
  },
  "ip": "127.0.0.1",
  "service": "trip-planner-backend"
}
```

### MCP Hatası
```json
{
  "timestamp": "2025-10-04T10:25:30.456Z",
  "level": "error",
  "event": "mcp_error",
  "sessionId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "details": {
    "errorMessage": "Connection timeout",
    "errorStack": "Error: Connection timeout\n    at ...",
    "prompt": "İstanbul Ankara uçuş..."
  },
  "responseTime": 30123,
  "ip": "127.0.0.1",
  "service": "trip-planner-backend"
}
```

### Arama Başarısız
```json
{
  "timestamp": "2025-10-04T10:25:30.567Z",
  "level": "error",
  "event": "trip_search_failed",
  "sessionId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "details": {
    "reason": "Connection timeout"
  },
  "responseTime": 30234,
  "ip": "127.0.0.1",
  "service": "trip-planner-backend"
}
```

---

## Konsol Çıktısı Örneği

Yukarıdaki loglar konsol'da şu şekilde görünür:

```
2025-10-04 10:15:23 [info] trip_search_started [Session: a1b2c3d4...]
2025-10-04 10:15:23 [info] mcp_request_sent [Session: a1b2c3d4...]
2025-10-04 10:15:23 [info] mcp_request_sent [Session: a1b2c3d4...]
2025-10-04 10:15:28 [info] mcp_response_received [Session: a1b2c3d4...]
2025-10-04 10:15:28 [info] flight_results_received [Session: a1b2c3d4...]
2025-10-04 10:15:28 [info] accommodation_results_received [Session: a1b2c3d4...]
2025-10-04 10:15:28 [info] activities_results_received [Session: a1b2c3d4...]
2025-10-04 10:15:28 [info] itinerary_generated [Session: a1b2c3d4...]
2025-10-04 10:15:28 [info] mcp_response_received [Session: a1b2c3d4...]
2025-10-04 10:15:28 [info] trip_search_completed [Session: a1b2c3d4...]
```

---

## Log Analizi Komutları

### Belirli bir session'ın tüm event'lerini görme
```bash
grep "a1b2c3d4-e5f6-7890" logs/user-journey.log | jq '.event'
```

Çıktı:
```
"trip_search_started"
"mcp_request_sent"
"mcp_request_sent"
"mcp_response_received"
"flight_results_received"
"accommodation_results_received"
"activities_results_received"
"itinerary_generated"
"mcp_response_received"
"trip_search_completed"
```

### Response time'ları görme
```bash
grep "a1b2c3d4-e5f6-7890" logs/user-journey.log | jq 'select(.responseTime != null) | {event, responseTime}'
```

Çıktı:
```json
{"event":"mcp_response_received","responseTime":4667}
{"event":"mcp_response_received","responseTime":5333}
{"event":"trip_search_completed","responseTime":5434}
```

