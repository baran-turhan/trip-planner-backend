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
