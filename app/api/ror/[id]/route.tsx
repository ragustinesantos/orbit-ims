/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import {
  dbDeleteRecurringOrder,
  dbGetRecurringOrder,
  dbUpdateRecurringOrder,
} from '@/app/_services/ror-service';

export async function GET(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    const recurringOrder = await dbGetRecurringOrder(id);

    return new Response(JSON.stringify(recurringOrder), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedRecurringOrder = await request.json();

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

    const validatedRecurringOrder = recurringOrderSchema.parse(updatedRecurringOrder);

    await dbUpdateRecurringOrder(id, validatedRecurringOrder);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function PATCH(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedRecurringOrder = await request.json();

    const recurringOrderSchema = z
      .object({
        rorId: z.string().optional(),
        rorTemplateId: z.string().optional(),
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
        orderTotal: z.number().optional(),
      })
      .strict();

    const validatedRecurringOrder = recurringOrderSchema.parse(updatedRecurringOrder);

    await dbUpdateRecurringOrder(id, validatedRecurringOrder);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    await dbDeleteRecurringOrder(id);

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}
