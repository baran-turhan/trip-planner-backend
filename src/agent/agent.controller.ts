import { Controller, Post, Body, Req } from '@nestjs/common';
import { AgentService } from './agent.service';
import { CustomLoggerService } from '../logger/logger.service';
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
    const clientIp = request.ip || request.connection.remoteAddress;

    // Kullanıcının seçimini logla
    this.logger.logUserAction(
      'USER_SELECTION',
      undefined, // userId - authentication eklendikten sonra buraya eklenebilir
      {
        userChoice: prompt,
        ip: clientIp,
        timestamp: new Date().toISOString(),
      },
    );

    try {
      const result = await this.agentService.agentMCP(prompt);
      const responseTime = Date.now() - startTime;

      // MCP'den gelen yanıtı logla
      this.logger.logUserAction('MCP_RESPONSE', undefined, {
        mcpResponse: result,
        responseTime: `${responseTime}ms`,
        ip: clientIp,
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;

      // MCP hatasını logla
      this.logger.logUserAction('MCP_ERROR', undefined, {
        userChoice: prompt,
        error: error.message,
        responseTime: `${responseTime}ms`,
        ip: clientIp,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }
}
