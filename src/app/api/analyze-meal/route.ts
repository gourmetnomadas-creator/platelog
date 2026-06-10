import { NextRequest, NextResponse } from 'next/server';
import { analyzeMealSchema } from '@/lib/validations';

let _openai: any = null;
async function getOpenAI() {
  if (!_openai) {
    const { default: OpenAI } = await import('openai');
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }
  return _openai;
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
    const openai = await getOpenAI();

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

    let imageContent: any = undefined;
    if (body.imageBase64) {
      imageContent = {
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${body.imageBase64}`,
        },
      };
    } else if (body.imageUrl) {
      imageContent = {
        type: 'image_url',
        image_url: {
          url: body.imageUrl,
        },
      };
    }

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
    ];

    if (imageContent) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: userMessage },
          imageContent,
        ],
      });
    } else {
      messages.push({ role: 'user', content: userMessage });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) {
      return NextResponse.json(
        { error: 'AI returned empty response' },
        { status: 500 }
      );
    }

    const result = JSON.parse(text);

    return NextResponse.json({
      ...result,
      warnings: [
        ...(result.warnings || []),
        'This is an estimate. Please review the grams before saving.',
      ],
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
