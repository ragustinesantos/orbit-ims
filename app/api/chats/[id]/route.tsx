/* eslint-disable @typescript-eslint/no-unused-vars */
import { dbGetAllChats } from "@/app/_services/chat-service";

export async function GET(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    const chats = await dbGetAllChats(id);

    return new Response(JSON.stringify(chats), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}