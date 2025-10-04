import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';
import { EventType, LogLevel, EventLog } from './event-types';

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
        // Konsol çıktısı - renkli ve okunabilir
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, event, sessionId }) => {
              const sessionIdStr = typeof sessionId === 'string' ? sessionId : '';
              return `${timestamp} [${level}] ${event || message} ${sessionIdStr ? `[Session: ${sessionIdStr.substring(0, 8)}...]` : ''}`;
            }),
          ),
        }),
        // Event-bazlı kullanıcı yolculuğu logları
        new winston.transports.File({
          filename: path.join('logs', 'user-journey.log'),
          maxsize: 10485760, // 10MB
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
        // Uyarı logları
        new winston.transports.File({
          filename: path.join('logs', 'warnings.log'),
          level: 'warn',
          maxsize: 5242880, // 5MB
          maxFiles: 3,
        }),
      ],
    });
  }

  /**
   * Event-bazlı log kaydetme - Ana metod
   */
  logEvent(
    event: EventType,
    sessionId: string,
    details: Record<string, any>,
    level: LogLevel = LogLevel.INFO,
    responseTime?: number,
    userId?: string,
    ip?: string,
  ) {
    const eventLog: EventLog = {
      timestamp: new Date().toISOString(),
      level,
      event,
      sessionId,
      details,
      ...(responseTime && { responseTime }),
      ...(userId && { userId }),
      ...(ip && { ip }),
    };

    // Log seviyesine göre kaydet
    switch (level) {
      case LogLevel.ERROR:
        this.logger.error(event, eventLog);
        break;
      case LogLevel.WARN:
        this.logger.warn(event, eventLog);
        break;
      case LogLevel.INFO:
      default:
        this.logger.info(event, eventLog);
        break;
    }
  }

  // NestJS LoggerService interface metodları
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
}
