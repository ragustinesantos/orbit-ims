import { z } from 'zod';
import { dbAddChat } from '@/app/_services/chat-service';

export async function POST(request: Request) {
  try {
    const newChat = await request.json();

    const chatSchema = z.object({
      type: z.string(),
      employeeId: z.string(),
      message: z.string(),
      timestamp: z.string(),
    });

    const validatedChat = chatSchema.parse(newChat);

    await dbAddChat(validatedChat);

    return new Response(JSON.stringify(validatedChat), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }
}
