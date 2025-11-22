import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AiService {
  private apiKey: string;
  private model: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('OPENAI_API_KEY') ?? '';
    this.model = this.config.get<string>('OPENAI_MODEL') ?? 'gpt-4.1-mini';
  }

  async generateInsights(promptPayload: unknown): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const systemContent = `
You are an assistant that analyses personal time-series metrics.
You receive JSON with:
- metric: name, unit, category, description
- stats: min, max, avg, latest, changeFromFirst, trendDirection
- datapoints: { value, recordedAt }[]

Return 2–3 short sentences in plain English:
- Describe the trend (going up, down, stable, noisy).
- Mention any noticeable changes.
- Avoid giving medical or financial advice; just describe patterns.
`;

    const userContent = JSON.stringify(promptPayload);

    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: this.model,
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: userContent },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const content = res.data.choices?.[0]?.message?.content?.trim();
    return content || 'No insight generated.';
  }
}
