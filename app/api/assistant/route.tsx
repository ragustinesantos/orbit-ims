
import OpenAI from 'openai';
import { z } from 'zod';
import { chatCompletion } from '@/app/_services/assistant-service';

export async function POST(request: Request) {
  try {
    const newChat = await request.json();
    

    const chatSchema = z.object({
      messages: z.array(
        z.object({
          role: z.enum(['user', 'assistant', 'system']),
          content: z.string(),
        })
      ),
      model: z.string(),
      temperature: z.number().min(0).max(1),
    });

    const validatedChatSchema = chatSchema.parse(newChat);

    const payload: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: validatedChatSchema.messages,
      model: validatedChatSchema.model,
      temperature: validatedChatSchema.temperature,
    };

    const response = await chatCompletion(payload);

    return new Response(JSON.stringify(response), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }
}
