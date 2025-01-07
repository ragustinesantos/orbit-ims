/* eslint-disable no-console */
import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chatCompletion(content: OpenAI.Chat.ChatCompletionCreateParams) {
  try {
    // await api call
    const response = await client.chat.completions.create(content);

    // treat response as a ChatCompletion object
    const chatCompletion = response as ChatCompletion;

    // Return the message response from the api call
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.log(error);
  }
}
