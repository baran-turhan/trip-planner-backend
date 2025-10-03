import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'trip-planner-backend' },
      transports: [
        // Konsol çıktısı
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        // Genel log dosyası
        new winston.transports.File({
          filename: path.join('logs', 'application.log'),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        // Kullanıcı hareketleri için özel log dosyası
        new winston.transports.File({
          filename: path.join('logs', 'user-actions.log'),
          maxsize: 5242880, // 5MB
          maxFiles: 10,
          level: 'info',
        }),
        // Hata logları için ayrı dosya
        new winston.transports.File({
          filename: path.join('logs', 'error.log'),
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Kullanıcı seçimlerini ve MCP yanıtlarını loglamak için özel metod
  logUserAction(action: string, userId?: string, details?: any) {
    const logData = {
      action,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
      details,
      ip: details?.ip || 'unknown',
    };

    // Sadece kullanıcı seçimleri ve MCP yanıtlarını logla
    if (action === 'USER_SELECTION' || action === 'MCP_RESPONSE' || action === 'MCP_ERROR') {
      this.logger.info('User Action', logData);
    }
  }
}
