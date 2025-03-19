import { z } from 'zod';
import { dbGetAllStockInOrders, dbStockInGenerate } from '@/app/_services/stockin-service';

export async function GET() {
  try {
    const stockInOrderList = await dbGetAllStockInOrders();

    return new Response(JSON.stringify(stockInOrderList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const newStockInOrder = await request.json();
    newStockInOrder.currentStockInStoreRoom = Number(newStockInOrder.currentStockInStoreRoom);
    newStockInOrder.isCritical = Boolean(newStockInOrder.isCritical);
    newStockInOrder.isCriticalThreshold = Number(newStockInOrder.isCriticalThreshold);
    newStockInOrder.minPurchaseQty = Number(newStockInOrder.minPurchaseQty);

    const stockInSchema = z.object({
      stockInId: z.string(),
      itemId: z.string(),
      purchaseOrderId: z.string(),
      stockInQuantity: z.number(),
      stockInDate: z.string(),
      receivedBy: z.string(),
    });

    const validatedStockIn = stockInSchema.parse(newStockInOrder);

    await dbStockInGenerate(validatedStockIn);

    return new Response(JSON.stringify(validatedStockIn), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }
}
