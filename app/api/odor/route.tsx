import { z } from 'zod';
import { dbAddOnDemandOrder, dbGetAllOnDemandOrders } from '@/app/_services/odor-service';

export async function GET() {
  try {
    const recurringOrderList = await dbGetAllOnDemandOrders();

    return new Response(JSON.stringify(recurringOrderList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const newOnDemandOrder = await request.json();

    const onDemandOrderSchema = z.object({
      requisitionId: z.string(),
      itemOrders: z.array(
        z.object({
          itemId: z.string(),
          orderQty: z.number(),
          pendingQty: z.number(),
          servedQty: z.number(),
        })
      ),
      newItemOrders: z.array(
        z.object({
          itemName: z.string(),
          itemDescription: z.string(),
          productCode: z.string(),
          purchaseQty: z.number(),
          unitPrice: z.number(),
          itemSubtotal: z.number(),
          disposalPlan: z.string(),
          purposeForPurchase: z.string(),
        })
      ),
      orderTotal: z.number(),
      recipientName: z.string(),
      recipientLocation: z.string(),
      remarks: z.string(),
    });

    const validatedOnDemandOrder = onDemandOrderSchema.parse(newOnDemandOrder);

    await dbAddOnDemandOrder(validatedOnDemandOrder);

    return new Response(JSON.stringify(validatedOnDemandOrder), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }
}
