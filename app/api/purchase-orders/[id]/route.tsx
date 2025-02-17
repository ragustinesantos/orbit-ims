/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import {
  dbDeletePurchaseOrder,
  dbGetPurchaseOrder,
  dbUpdatePurchaseOrder,
} from '@/app/_services/po-service';

export async function GET(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    const purchaseOrder = await dbGetPurchaseOrder(id);

    return new Response(JSON.stringify(purchaseOrder), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedPurchaseOrder = await request.json();

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
      isApproved: z.boolean(),
      isDelivered: z.boolean(),
      isActive: z.boolean(),
    });

    const validatedPurchaseOrder = purchaseOrderSchema.parse(updatedPurchaseOrder);

    await dbUpdatePurchaseOrder(id, validatedPurchaseOrder);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function PATCH(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedPurchaseOrder = await request.json();

    const purchaseOrderSchema = z
      .object({
        requisitionId: z.string().optional(),
        orderList: z.array(z.object({ itemId: z.string(), quantity: z.number() })).optional(),
        recipientCompanyName: z.string().optional(),
        recipientCompanyAddress: z.string().optional(),
        purchaseOrderDate: z.string().optional(),
        purchaseOrderDeliveryDate: z.string().optional(),
        subTotal: z.number().optional(),
        taxRate: z.number().optional(),
        tax: z.number().optional(),
        totalOrderCost: z.number().optional(),
        approvalP2: z.string().optional(),
        isApproved: z.boolean().optional(),
        isDelivered: z.boolean().optional(),
        isActive: z.boolean().optional(),
      })
      .strict();

    const validatedPurchaseOrder = purchaseOrderSchema.parse(updatedPurchaseOrder);

    await dbUpdatePurchaseOrder(id, validatedPurchaseOrder);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    await dbDeletePurchaseOrder(id);

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}
