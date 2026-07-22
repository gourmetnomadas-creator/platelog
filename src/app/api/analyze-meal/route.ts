import { NextRequest, NextResponse } from 'next/server';
import { analyzeMealSchema } from '@/lib/validations';

const AI_PROVIDER = process.env.AI_PROVIDER || 'deepseek';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let _ai: any = null;
async function getAIClient() {
  if (!_ai) {
    const { default: OpenAI } = await import('openai');
    if (AI_PROVIDER === 'openai' && OPENAI_API_KEY) {
      _ai = new OpenAI({ apiKey: OPENAI_API_KEY });
    } else if (AI_PROVIDER === 'gemini' && GEMINI_API_KEY) {
      // Gemini free tier via its OpenAI-compatible endpoint
      _ai = new OpenAI({
        apiKey: GEMINI_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      });
    } else {
      _ai = new OpenAI({
        apiKey: DEEPSEEK_API_KEY || '',
        baseURL: 'https://api.deepseek.com',
      });
    }
  }
  return _ai;
}

function getModel(): string {
  if (AI_PROVIDER === 'openai' && OPENAI_API_KEY) return 'gpt-4o-mini';
  if (AI_PROVIDER === 'gemini' && GEMINI_API_KEY) return 'gemini-flash-latest';
  return 'deepseek-chat';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = analyzeMealSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { description, totalWeightGrams, weightContext } = parsed.data;
    const ai = await getAIClient();
    const isDeepSeek = AI_PROVIDER !== 'openai' || !OPENAI_API_KEY;

    const systemPrompt = `You are a cautious and helpful food analysis assistant.

Analyze the meal description and return a JSON array of detected food items.

Rules:
- Be conservative with estimates.
- If weight context is "whole_plate", the sum of ingredient grams must equal ${totalWeightGrams}g.
- If weight context is "one_ingredient", only the main ingredient gets ${totalWeightGrams}g; estimate others separately.
- If weight context is "separate_ingredients", distribute ${totalWeightGrams}g according to the description proportions.
- Use standard nutrition data per 100g for each food.
- Mark confidence low (0.4-0.6) if unsure, medium (0.6-0.8) if reasonable, high (0.8-1.0) for obvious items.
- Source should always be "estimated".
- If a food cannot be identified, use "unknown ingredient" and allow editing.

Return ONLY valid JSON in this exact format:
{
  "items": [
    {
      "foodName": "string",
      "grams": number,
      "kcalPer100g": number,
      "proteinPer100g": number,
      "carbsPer100g": number,
      "fatPer100g": number,
      "source": "estimated",
      "confidence": number
    }
  ],
  "totalKcal": number,
  "totalProtein": number,
  "totalCarbs": number,
  "totalFat": number,
  "confidence": number,
  "warnings": ["string"]
}`;

    const userMessage = `Description: "${description}"
Total weight: ${totalWeightGrams}g
Weight context: ${weightContext.replace('_', ' ')}`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ];

    const model = getModel();

    const completion = await ai.chat.completions.create({
      model,
      messages,
      temperature: 0.3,
      ...(model !== 'deepseek-chat' ? { response_format: { type: 'json_object' } } : {}),
    });

    let text = completion.choices[0]?.message?.content;
    if (!text) {
      return NextResponse.json(
        { error: 'AI returned empty response' },
        { status: 500 }
      );
    }

    if (model !== 'gpt-4o-mini') {
      const jsonMatch = text.match(/```json\n([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        text = jsonMatch[1] || jsonMatch[0];
      }
    }

    const result = JSON.parse(text);

    return NextResponse.json({
      ...result,
      warnings: [
        ...(result.warnings || []),
        isDeepSeek ? 'Analysis is text-only (photo not analyzed). Please review carefully.' : '',
        'This is an estimate. Please review the grams before saving.',
      ].filter(Boolean),
    });
  } catch (error) {
    console.error('Analyze meal error:', error);
    return NextResponse.json(
      {
        error: 'Could not analyze meal. Please try again or add ingredients manually.',
      },
      { status: 500 }
    );
  }
}
