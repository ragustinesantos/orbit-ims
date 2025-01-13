import { z } from 'zod';
import { dbAddRecurringOrder, dbGetAllRecurringOrders } from '@/app/_services/ror-service';

export async function GET() {
  try {
    const recurringOrderList = await dbGetAllRecurringOrders();

    return new Response(JSON.stringify(recurringOrderList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const newRecurringOrder = await request.json();

    const recurringOrderSchema = z.object({
      rorId: z.string(),
      rorTemplateId: z.string(),
      requisitionId: z.string(),
      itemOrders: z.array(
        z.object({
          itemId: z.string(),
          orderQty: z.number(),
          pendingQty: z.number(),
          servedQty: z.number(),
        })
      ),
      orderTotal: z.number(),
    });

    const validatedRecurringOrder = recurringOrderSchema.parse(newRecurringOrder);

    await dbAddRecurringOrder(validatedRecurringOrder);

    return new Response(JSON.stringify(validatedRecurringOrder), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }
}
