import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentModule } from './agent/agent.module';
import { LoggerModule } from './logger/logger.module';
import { SessionMiddleware } from './logger/session.middleware';

@Module({
  imports: [AgentModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Tüm route'lara sessionId middleware'i uygula
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
