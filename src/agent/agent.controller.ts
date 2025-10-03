import { Controller, Post, Body } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('mcp')
  async runAgentMCP(@Body('prompt') prompt: string) {
    return await this.agentService.agentMCP(prompt);
  }
}
