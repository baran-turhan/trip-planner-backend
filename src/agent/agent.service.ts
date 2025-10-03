import { Injectable } from '@nestjs/common';
import { Agent, run, MCPServerStreamableHttp } from '@openai/agents';

@Injectable()
export class AgentService {
  async agentMCP(prompt: string) {
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
  "activites": [
    {
      "id": "string",
      "name": "string",
      "location": "string",
      "price_per_night": "string",
      "image_url": "string",
      "link_url" "string"
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
  "comments": "string"
}

Rules:
1. Never use web search.
2. If ANY of these are missing: departure city, destination city, departure date, return date, number of travelers, theme of the trip → ask ONLY for the missing details in Turkish (not JSON).  
3. If ALL are present → call all MCP tools in parallel in one turn and return:
   - all departure flight results (prefer direct flights when available)  
   - all return flight results (prefer direct flights when available)  
   - all accommodation results for the stay (include different price ranges)  
   - all activites and attractions and sort for relevant theme and dates 
4. Return the raw results in the JSON schema above, do not filter or summarize.  
5. Always answer in Turkish.  
6. Output MUST be raw JSON, without backticks or markdown.
`,
      mcpServers: [enUygun, attractionsActivites],
      modelSettings: { parallelToolCalls: true },
    });

    try {
      await enUygun.connect();
      await attractionsActivites.connect();

      const result = await run(agent, prompt);

      let parsed: any;
      try {
        parsed = JSON.parse(result.finalOutput);
      } catch (err) {
        console.error('JSON parse hatası:', err);
        throw new Error('Modelden geçerli JSON gelmedi');
      }

      return parsed;
    } finally {
      await enUygun.close();
      await attractionsActivites.close();
    }
  }
}
