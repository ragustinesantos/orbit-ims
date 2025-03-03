import { z } from 'zod';
import { dbAddPurchaseOrder, dbGetAllPurchaseOrders } from '@/app/_services/po-service';

export async function GET() {
  try {
    const purchaseOrderList = await dbGetAllPurchaseOrders();

    return new Response(JSON.stringify(purchaseOrderList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const newPurchaseOrder = await request.json();

    const purchaseOrderSchema = z.object({
      requisitionId: z.string(),
      orderList: z.array(z.object({ itemId: z.string(), quantity: z.number() })),
      recipientCompanyName: z.string(),
      recipientCompanyAddress: z.string(),
      purchaseOrderDate: z.string(),
      purchaseOrderDeliveryDate: z.string(),
      subTotal: z.number(),
      taxRate: z.number(),
      tax: z.number(),
      totalOrderCost: z.number(),
      approvalP2: z.string(),
      isApproved: z.boolean().nullable(),
      isDelivered: z.boolean(),
      isActive: z.boolean(),
    });

    const validatedPurchaseOrder = purchaseOrderSchema.parse(newPurchaseOrder);

    const docId = await dbAddPurchaseOrder(validatedPurchaseOrder);

    return new Response(JSON.stringify(docId), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }
}
