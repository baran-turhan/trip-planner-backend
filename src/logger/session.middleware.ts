import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// Express Request'e sessionId eklemek için tip genişletmesi
declare global {
  namespace Express {
    interface Request {
      sessionId?: string;
    }
  }
}

/**
 * Her request için benzersiz sessionId oluşturur
 * Bu sayede kullanıcı yolculuğu takip edilebilir
 */
@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Header'dan gelen sessionId'yi kullan veya yeni bir tane oluştur
    req.sessionId = req.headers['x-session-id'] as string || randomUUID();
    
    // Response header'a sessionId'yi ekle (client tarafından saklanabilmesi için)
    res.setHeader('X-Session-Id', req.sessionId);
    
    next();
  }
}

