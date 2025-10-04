import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLoggerService } from './logger/logger.service';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Logger servisini global olarak kullan
  const logger = app.get(CustomLoggerService);
  app.useLogger(logger);
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  logger.log(`🚀 Uygulama ${port} portunda çalışıyor`, 'Bootstrap');
  logger.log(`📝 Event-bazlı loglar logs/user-journey.log dosyasında`, 'Bootstrap');
  logger.log(`⚠️  Uyarılar logs/warnings.log dosyasında`, 'Bootstrap');
  logger.log(`❌ Hatalar logs/error.log dosyasında`, 'Bootstrap');
  logger.log(`🔍 Her istek için benzersiz sessionId üretiliyor`, 'Bootstrap');
}
bootstrap();
