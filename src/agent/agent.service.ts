import { Injectable } from '@nestjs/common';
import { Agent, run, MCPServerStreamableHttp } from '@openai/agents';
import { CustomLoggerService } from '../logger/logger.service';
import { EventType, LogLevel } from '../logger/event-types';

@Injectable()
export class AgentService {
  constructor(private readonly logger: CustomLoggerService) {}

  async agentMCP(prompt: string, sessionId: string, clientIp?: string) {
    const enUygun = new MCPServerStreamableHttp({
      url: 'https://mcp.enuygun.com/mcp',
      name: 'Wingie Enuygun Travel Planner',
    });

    const attractionsActivites = new MCPServerStreamableHttp({
      url: 'https://mcp-enuygun-fs.onrender.com/mcp',
      name: 'Attraction and Activity Finder',
    });

    const agent = new Agent({
      name: 'Wingie Enuygun Travel Planner',
      instructions: `You are a travel planning assistant for Wingie Enuygun.  
Always respond ONLY in valid JSON, without extra commentary.  
Response must follow this schema exactly:  

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
  "return_flights": [
    {
      "id": "string",
      "airline": "string",
      "departure_time": "string",
      "arrival_time": "string",
      "price": "string"
    }
  ],
  "accommodations": [
    {
      "id": "string",
      "name": "string",
      "location": "string",
      "price_per_night": "string",
      "image_url": "string"
    }
  ],
  "activities": [
    {
      "id": "string",
      "name": "string",
      "location": "string",
      "price_per_night": "string",
      "image_url": "string",
      "link_url": "string"
    }
  ],
  "attractions": [
    {
      "id": "string",
      "name": "string",
      "location": "string",
      "price": "string",
      "image_url": "string",
      "link_url": "string"
    }
  ],
  "itinerary": [
    {
      "day": "Day 1",
      "title": "string",
      "description": "string", 
      "date": "YYYY-MM-DD",
      "schedule": [
        {
          "time": "HH:mm",
          "type": "activity | attraction",
          "id": "string",
          "name": "string",
          "location": "string"
        }
      ]
    }
  ],
  "comments": "string"
}


Rules:
1. Never use web search.
2. If ANY of these are missing: departure city, destination city, departure date, return date, number of travelers, theme of the trip → ask ONLY for the missing details in Turkish.  
3. If ALL are present → call all MCP tools in parallel in one turn and return:
   - all departure flight results (prefer direct flights when available)  
   - all return flight results (prefer direct flights when available)  
   - all accommodation results for the stay (include different price ranges)  
   - all activities and attractions and sort for relevant theme and dates  
   - additionally, generate a daily **itinerary plan** for each day between departure and return dates using at least three activities and attractions. Each itinerary day should include morning, afternoon, and evening time slots.  
4. Return the raw results in the JSON schema above, do not filter or summarize.  
5. Always answer in Turkish.  
6. Output MUST be raw JSON, without backticks or markdown.`,
      mcpServers: [enUygun, attractionsActivites],
      modelSettings: { parallelToolCalls: true },
    });

    try {
      // MCP sunucularına bağlanıyoruz
      this.logger.logEvent(
        EventType.MCP_REQUEST_SENT,
        sessionId,
        {
          action: 'Connecting to MCP servers',
          servers: ['enUygun', 'attractionsActivites'],
        },
        LogLevel.INFO,
        undefined,
        undefined,
        clientIp,
      );

      await enUygun.connect();
      await attractionsActivites.connect();

      // Agent'a istek gönderiliyor
      const agentStartTime = Date.now();
      const result = await run(agent, prompt);
      const agentResponseTime = Date.now() - agentStartTime;

      this.logger.logEvent(
        EventType.MCP_RESPONSE_RECEIVED,
        sessionId,
        {
          action: 'Agent completed processing',
          outputLength: result.finalOutput?.length || 0,
        },
        LogLevel.INFO,
        agentResponseTime,
        undefined,
        clientIp,
      );

      // JSON parsing
      let parsed: any;
      try {
        parsed = JSON.parse(result.finalOutput);

        // Sonuçları detaylı logla
        if (parsed.departure_flights && parsed.departure_flights.length > 0) {
          this.logger.logEvent(
            EventType.FLIGHT_RESULTS_RECEIVED,
            sessionId,
            {
              departureFlights: parsed.departure_flights.length,
              returnFlights: parsed.return_flights?.length || 0,
              sampleDepartureFlight: {
                airline: parsed.departure_flights[0]?.airline,
                price: parsed.departure_flights[0]?.price,
              },
            },
            LogLevel.INFO,
            undefined,
            undefined,
            clientIp,
          );
        }

        if (parsed.accommodations && parsed.accommodations.length > 0) {
          this.logger.logEvent(
            EventType.ACCOMMODATION_RESULTS_RECEIVED,
            sessionId,
            {
              count: parsed.accommodations.length,
              locations: [...new Set(parsed.accommodations.map((a: any) => a.location))],
              priceRange: {
                min: Math.min(...parsed.accommodations.map((a: any) => parseFloat(a.price_per_night) || 0)),
                max: Math.max(...parsed.accommodations.map((a: any) => parseFloat(a.price_per_night) || 0)),
              },
            },
            LogLevel.INFO,
            undefined,
            undefined,
            clientIp,
          );
        }

        if (parsed.activities && parsed.activities.length > 0) {
          this.logger.logEvent(
            EventType.ACTIVITIES_RESULTS_RECEIVED,
            sessionId,
            {
              activityCount: parsed.activities.length,
              attractionCount: parsed.attractions?.length || 0,
              sampleActivity: parsed.activities[0]?.name,
            },
            LogLevel.INFO,
            undefined,
            undefined,
            clientIp,
          );
        }

        if (parsed.itinerary && parsed.itinerary.length > 0) {
          this.logger.logEvent(
            EventType.ITINERARY_GENERATED,
            sessionId,
            {
              days: parsed.itinerary.length,
              totalScheduledItems: parsed.itinerary.reduce(
                (acc: number, day: any) => acc + (day.schedule?.length || 0),
                0,
              ),
              dailyBreakdown: parsed.itinerary.map((day: any) => ({
                day: day.day,
                date: day.date,
                activities: day.schedule?.length || 0,
              })),
            },
            LogLevel.INFO,
            undefined,
            undefined,
            clientIp,
          );
        }

        // Eksik bilgi kontrolü
        if (parsed.comments && 
            (parsed.comments.includes('eksik') || 
             parsed.comments.includes('belirt') || 
             parsed.comments.toLowerCase().includes('hangi'))) {
          this.logger.logEvent(
            EventType.MISSING_INFO_REQUESTED,
            sessionId,
            {
              comment: parsed.comments,
            },
            LogLevel.WARN,
            undefined,
            undefined,
            clientIp,
          );
        }

      } catch (err) {
        this.logger.logEvent(
          EventType.MCP_ERROR,
          sessionId,
          {
            error: 'JSON parse error',
            errorMessage: err.message,
            rawOutput: result.finalOutput?.substring(0, 200),
          },
          LogLevel.ERROR,
          undefined,
          undefined,
          clientIp,
        );
        throw new Error('Modelden geçerli JSON gelmedi');
      }

      return parsed;
    } finally {
      await enUygun.close();
      await attractionsActivites.close();

      this.logger.logEvent(
        EventType.MCP_RESPONSE_RECEIVED,
        sessionId,
        {
          action: 'MCP connections closed',
        },
        LogLevel.INFO,
        undefined,
        undefined,
        clientIp,
      );
    }
  }
}
