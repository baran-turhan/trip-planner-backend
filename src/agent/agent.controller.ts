import { Controller, Post, Body, Req } from '@nestjs/common';
import { AgentService } from './agent.service';
import { CustomLoggerService } from '../logger/logger.service';
import { EventType, LogLevel } from '../logger/event-types';
import { Request } from 'express';

@Controller('agent')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly logger: CustomLoggerService,
  ) {}

  @Post('mcp')
  async runAgentMCP(@Body('prompt') prompt: string, @Req() request: Request) {
    const startTime = Date.now();
    const sessionId = request.sessionId || 'unknown-session';
    const clientIp = request.ip || request.connection.remoteAddress;

    // Event: Trip arama başladı
    this.logger.logEvent(
      EventType.TRIP_SEARCH_STARTED,
      sessionId,
      {
        prompt: prompt,
        promptLength: prompt.length,
      },
      LogLevel.INFO,
      undefined,
      undefined,
      clientIp,
    );

    try {
      // MCP isteği gönderildi
      this.logger.logEvent(
        EventType.MCP_REQUEST_SENT,
        sessionId,
        {
          prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
        },
        LogLevel.INFO,
        undefined,
        undefined,
        clientIp,
      );

      const result = await this.agentService.agentMCP(prompt, sessionId, clientIp);
      const responseTime = Date.now() - startTime;

      // MCP yanıtı alındı
      this.logger.logEvent(
        EventType.MCP_RESPONSE_RECEIVED,
        sessionId,
        {
          hasFlights: result.departure_flights?.length > 0,
          flightCount: {
            departure: result.departure_flights?.length || 0,
            return: result.return_flights?.length || 0,
          },
          hasAccommodations: result.accommodations?.length > 0,
          accommodationCount: result.accommodations?.length || 0,
          hasActivities: result.activities?.length > 0,
          activityCount: result.activities?.length || 0,
          hasAttractions: result.attractions?.length > 0,
          attractionCount: result.attractions?.length || 0,
          hasItinerary: result.itinerary?.length > 0,
          itineraryDays: result.itinerary?.length || 0,
        },
        LogLevel.INFO,
        responseTime,
        undefined,
        clientIp,
      );

      // Trip arama başarıyla tamamlandı
      this.logger.logEvent(
        EventType.TRIP_SEARCH_COMPLETED,
        sessionId,
        {
          totalResults: {
            flights: (result.departure_flights?.length || 0) + (result.return_flights?.length || 0),
            accommodations: result.accommodations?.length || 0,
            activities: result.activities?.length || 0,
            attractions: result.attractions?.length || 0,
          },
        },
        LogLevel.INFO,
        responseTime,
        undefined,
        clientIp,
      );

      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;

      // MCP hatası
      this.logger.logEvent(
        EventType.MCP_ERROR,
        sessionId,
        {
          errorMessage: error.message,
          errorStack: error.stack,
          prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
        },
        LogLevel.ERROR,
        responseTime,
        undefined,
        clientIp,
      );

      // Trip arama başarısız
      this.logger.logEvent(
        EventType.TRIP_SEARCH_FAILED,
        sessionId,
        {
          reason: error.message,
        },
        LogLevel.ERROR,
        responseTime,
        undefined,
        clientIp,
      );

      throw error;
    }
  }
}
