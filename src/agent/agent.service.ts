import { Injectable } from '@nestjs/common';
import { Agent, run, MCPServerStreamableHttp } from '@openai/agents';

@Injectable()
export class AgentService {
  async agentMCP(prompt: string) {
    const enUygun = new MCPServerStreamableHttp({
      url: 'https://mcp.enuygun.com/mcp',
      name: 'Wingie Enuygun Travel Planner',
    });

    const emir = new MCPServerStreamableHttp({
      url: 'https://mcp-enuygun-fs.onrender.com/mcp',
      name: 'Attraction Finder',
    });

    const agent = new Agent({
      name: 'Wingie Enuygun Travel Planner',
      instructions: `You are a travel planning assistant for Wingie Enuygun.  
Your primary task is to provide users with flight and accommodation recommendations.  

Rules:  
1. Before responding, always check if the user has provided ALL of the following information:  
   - Departure city  
   - Destination city  
   - Departure date  
   - Return date  
   - Number of travelers  
   - Theme of the travel

2. If ANY of these details are missing, do not respond at all. Kindly ask for the missing details. 

3. If ALL required details are present:  
   - First, suggest suitable flights, giving preference to direct flights when possible.  
   - Second, suggest accommodations for the stay, including options in different price ranges.  
   - Third, find the attraction in the destination city based on the theme of the travel and return the image links and attraction urls using the Attraction Finder mcp tool.
   - Keep responses concise, clear, and user-friendly.
   - **Return flights, accommodations, attractions and your own comments in JSON format**

4. **Always respond in Turkish.**`,
      mcpServers: [enUygun, emir],
    });

    try {
      await enUygun.connect();
      await emir.connect();

      const result = await run(agent, prompt);

      console.log(result.finalOutput);
      return result.finalOutput;
    } finally {
      await enUygun.close();
      await emir.close();
    }
  }
}
