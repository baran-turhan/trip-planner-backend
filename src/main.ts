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
  logger.log(`📝 Kullanıcı seçimleri ve MCP yanıtları logs/ klasöründe kaydediliyor`, 'Bootstrap');
}
bootstrap();
