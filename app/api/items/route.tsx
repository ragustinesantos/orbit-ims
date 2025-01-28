import { z } from 'zod';
import { dbAddItem, dbGetAllItems } from '@/app/_services/items-service';

export async function GET() {
  try {
    const itemList = await dbGetAllItems();
    return new Response(JSON.stringify(itemList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const newItem = await request.json();
    newItem.currentStockInStoreRoom = Number(newItem.currentStockInStoreRoom);
    newItem.isCritical = Boolean(newItem.isCritical);
    newItem.isCriticalThreshold = Number(newItem.isCriticalThreshold);
    newItem.minPurchaseQty = Number(newItem.minPurchaseQty);

    const itemSchema = z.object({
      supplierId: z.string(),
      inventoryId: z.string(),
      itemName: z.string(),
      currentStockInStoreRoom: z.number(),
      packageUnit: z.string(),
      supplyUnit: z.string(),
      category: z.string(),
      isCritical: z.boolean(),
      isCriticalThreshold: z.number(),
      minPurchaseQty: z.number(),
      price: z.number(),
      isActive: z.boolean()
    });

    const validatedItem = itemSchema.parse(newItem);

    await dbAddItem(validatedItem);

    return new Response(JSON.stringify(validatedItem), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }
}
