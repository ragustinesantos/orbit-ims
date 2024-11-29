import { z } from 'zod';
import { dbDeleteItem, dbGetItem, dbUpdateItem } from '@/app/_services/items-service';

export async function GET(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const item = await dbGetItem(id);
    return new Response(JSON.stringify(item), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedItem = await request.json();

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
    });

    const validatedItem = itemSchema.parse(updatedItem);

    await dbUpdateItem(id, validatedItem);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function PATCH(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedItem = await request.json();

    const itemSchema = z
      .object({
        supplierId: z.string().optional(),
        inventoryId: z.string().optional(),
        itemName: z.string().optional(),
        currentStockInStoreRoom: z.number().optional(),
        packageUnit: z.string().optional(),
        supplyUnit: z.string().optional(),
        category: z.string().optional(),
        isCritical: z.boolean().optional(),
        isCriticalThreshold: z.number().optional(),
        minPurchaseQty: z.number().optional(),
      })
      .strict();

    const validatedItem = itemSchema.parse(updatedItem);

    await dbUpdateItem(id, validatedItem);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    await dbDeleteItem(id);

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}
