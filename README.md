# 🌍 Trip Planner Backend

Wingie Enuygun için geliştirilmiş akıllı seyahat planlama backend API'si. Bu proje, kullanıcıların seyahat planları oluşturabilmesi için uçuş, konaklama, aktivite ve cazibe merkezi önerilerini sunar.

## 🚀 Özellikler

- **Akıllı Seyahat Planlaması**: OpenAI Agents ve MCP (Model Context Protocol) kullanarak otomatik seyahat planı oluşturma
- **Multi-Platform Entegrasyon**: 
  - Wingie Enuygun uçuş ve konaklama servisleri
  - Aktivite ve cazibe merkezi önerileri
- **Kapsamlı Loglama**: Winston ile detaylı kullanıcı aktivite izleme
- **JSON Tabanlı Yanıtlar**: Strukturlu ve öngörülebilir API yanıtları
- **Paralel İşlem**: Tüm servislerden eş zamanlı veri çekme

## 🏗️ Teknoloji Stack

- **Framework**: NestJS (TypeScript)
- **AI/ML**: OpenAI Agents, MCP Servers
- **Loglama**: Winston
- **HTTP Client**: Axios, Node-fetch
- **Test**: Jest
- **Platform**: Node.js

## 📦 Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone <repo-url>
cd trip-planner-backend
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Çevre değişkenlerini ayarlayın:**
```bash
# .env dosyası oluşturun
PORT=3000
# Diğer gerekli API anahtarları
```

4. **Projeyi derleyin:**
```bash
npm run build
```

## 🎯 API Kullanımı

### Seyahat Planı Oluşturma

**Endpoint**: `POST /agent/mcp`

**Request Body:**
```json
{
  "prompt": "İstanbul'dan Paris'e 5 günlük romantik bir seyahat planı hazırla. Çıkış tarihi 15 Kasım, dönüş tarihi 20 Kasım, 2 kişi."
}
```

**Response:**
```json
{
  "departure_flights": [
    {
      "id": "string",
      "airline": "string",
      "departure_time": "string",
      "arrival_time": "string",
      "price": "string"
    }
  ],
  "return_flights": [...],
  "accommodations": [...],
  "activities": [...],
  "attractions": [...],
  "itinerary": [
    {
      "day": "Day 1",
      "title": "string",
      "description": "string",
      "date": "YYYY-MM-DD",
      "schedule": [...]
    }
  ],
  "comments": "string"
}
```

### Gerekli Bilgiler

Sistem aşağıdaki bilgileri talep eder:
- 🛫 **Kalkış şehri**
- 🏙️ **Hedef şehir**  
- 📅 **Gidiş tarihi**
- 📅 **Dönüş tarihi**
- 👥 **Yolcu sayısı**
- 🎨 **Seyahat teması** (romantik, aile, macera, kültür vb.)

## 🔧 Geliştirme

### Geliştirme modunda çalıştırma:
```bash
# Watch mode (otomatik yeniden başlatma)
npm run start:dev

# Debug mode
npm run start:debug
```

### Production modunda çalıştırma:
```bash
npm run start:prod
```

### Test çalıştırma:
```bash
# Unit testler
npm run test

# E2E testler  
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Code Quality:
```bash
# Linting
npm run lint

# Formatting
npm run format
```

## 📊 Loglama

Sistem üç farklı log dosyası kullanır:

- **`logs/application.log`**: Genel uygulama logları
- **`logs/user-actions.log`**: Kullanıcı seçimleri ve MCP yanıtları
- **`logs/error.log`**: Hata logları

### Log Türleri:
- `USER_SELECTION`: Kullanıcının seyahat talebini loglar
- `MCP_RESPONSE`: MCP servislerinden gelen yanıtları loglar  
- `MCP_ERROR`: MCP servisleriyle ilgili hataları loglar

## 🏛️ Proje Yapısı

```
src/
├── agent/              # AI Agent servisleri
│   ├── agent.controller.ts
│   ├── agent.service.ts
│   └── agent.module.ts
├── logger/             # Loglama servisleri
│   ├── logger.service.ts
│   └── logger.module.ts
├── app.controller.ts   # Ana controller
├── app.service.ts      # Ana service
├── app.module.ts       # Ana module
└── main.ts            # Uygulama giriş noktası
```

## 🔗 MCP Sunucuları

Proje iki ana MCP sunucusu kullanır:

1. **Wingie Enuygun Travel Planner** (`https://mcp.enuygun.com/mcp`)
   - Uçuş aramaları
   - Konaklama önerileri

2. **Attraction and Activity Finder** (`https://mcp-enuygun-fs.onrender.com/mcp`)
   - Aktivite önerileri
   - Cazibe merkezi bilgileri

## 🚀 Deployment

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## 🧪 Test Edilmiş Seyahat Senaryoları

- ✅ İç hat uçuşları (İstanbul-Ankara, İstanbul-İzmir)
- ✅ Dış hat uçuşları (İstanbul-Paris, İstanbul-Londra)
- ✅ Romantik seyahat planları
- ✅ Aile seyahatleri
- ✅ Macera tatilleri
- ✅ Kültür turları

## 📝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje UNLICENSED lisansı altındadır.

## 🔧 Sorun Giderme

### Yaygın Sorunlar:

**1. MCP Bağlantı Hatası:**
```
MCP sunucularına bağlanırken hata oluştu
```
- Internet bağlantınızı kontrol edin
- MCP sunucu durumlarını kontrol edin

**2. JSON Parse Hatası:**
```
Modelden geçerli JSON gelmedi
```
- Prompt'unuzun tüm gerekli bilgileri içerdiğinden emin olun
- API yanıtını loglardan kontrol edin

**3. Port Çakışması:**
```
Port 3000 zaten kullanımda
```
- `.env` dosyasında farklı bir port belirleyin
- Veya `PORT=3001 npm run start:dev` şeklinde çalıştırın

## 📞 İletişim

Herhangi bir sorun veya öneriniz için issue açabilirsiniz.

---

**🎯 Not**: Bu README Türkçe dilinde yazılmıştır ve projenin temel özelliklerini açıklamaktadır. Sistem Türkçe kullanıcı etkileşimlerini destekler ve tüm yanıtları Türkçe olarak döner.
