/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import {
  dbDeleteOnDemandOrder,
  dbGetOnDemandOrder,
  dbUpdateOnDemandOrder,
} from '@/app/_services/odor-service';

export async function GET(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    const onDemandOrder = await dbGetOnDemandOrder(id);

    return new Response(JSON.stringify(onDemandOrder), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedOnDemandOrder = await request.json();

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
        })
      ),
      orderTotal: z.number(),
      recipientName: z.string(),
      recipientLocation: z.string(),
      disposalPlan: z.string(),
      purposeForPurchase: z.string(),
      remarks: z.string(),
    });

    const validatedOnDemandOrder = onDemandOrderSchema.parse(updatedOnDemandOrder);

    await dbUpdateOnDemandOrder(id, validatedOnDemandOrder);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function PATCH(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedOnDemandOrder = await request.json();

    const onDemandOrderSchema = z
      .object({
        requisitionId: z.string().optional(),
        itemOrders: z
          .array(
            z.object({
              itemId: z.string(),
              orderQty: z.number(),
              pendingQty: z.number(),
              servedQty: z.number(),
            })
          )
          .optional(),
        newItemOrders: z
          .array(
            z.object({
              itemName: z.string(),
              itemDescription: z.string(),
              productCode: z.string(),
              purchaseQty: z.number(),
              unitPrice: z.number(),
              itemSubtotal: z.number(),
            })
          )
          .optional(),
        orderTotal: z.number().optional(),
        recipientName: z.string().optional(),
        recipientLocation: z.string().optional(),
        disposalPlan: z.string().optional(),
        purposeForPurchase: z.string().optional(),
        remarks: z.string().optional(),
      })
      .strict();

    const validatedOnDemandOrder = onDemandOrderSchema.parse(updatedOnDemandOrder);

    await dbUpdateOnDemandOrder(id, validatedOnDemandOrder);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    await dbDeleteOnDemandOrder(id);

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}
