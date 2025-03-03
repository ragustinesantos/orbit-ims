import { z } from 'zod';
import { dbGetAllStockOutOrders, dbStockOutGenerate} from '@/app/_services/stockout-service';

export async function GET() {
  try {
    const stockOutOrderList = await dbGetAllStockOutOrders();

    return new Response(JSON.stringify(stockOutOrderList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const newStockOutOrder = await request.json();
    newStockOutOrder.currentStockInStoreRoom = Number(newStockOutOrder.currentStockInStoreRoom);
    newStockOutOrder.isCritical = Boolean(newStockOutOrder.isCritical);
    newStockOutOrder.isCriticalThreshold = Number(newStockOutOrder.isCriticalThreshold);
    newStockOutOrder.minPurchaseQty = Number(newStockOutOrder.minPurchaseQty);

    const stockOutSchema = z.object({
      stockOutId: z.string(),
      itemId: z.string(),
      requisitionId: z.string(),
      stockOutQuantity: z.number(), 
      stockOutDate: z.string(),
      dispatchedBy: z.string(),
    });

    const validatedStockOut = stockOutSchema.parse(newStockOutOrder);

    await dbStockOutGenerate(validatedStockOut);

    return new Response(JSON.stringify(validatedStockOut), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }
}
