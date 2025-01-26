/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import {
  dbDeleteOrderRequisition,
  dbGetOrderRequisition,
  dbUpdateOrderRequisition,
} from '@/app/_services/order-requisition-service';

export async function GET(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    const orderRequisition = await dbGetOrderRequisition(id);

    return new Response(JSON.stringify(orderRequisition), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedOrderRequisition = await request.json();

    const orderRequisitionSchema = z.object({
      requisitionId: z.string(),
      requisitionType: z.string(),
      requisitionTypeId: z.string(),
      requisitionDate: z.string(),
      employeeId: z.string(),
      approvalE2: z.string(),
      approvalE3: z.string(),
      approvalP1: z.string(),
      isApprovedE2: z.boolean().nullable(),
      isApprovedE3: z.boolean().nullable(),
      isApprovedP1: z.boolean().nullable(),
      isActive: z.boolean(),
      isComplete: z.boolean(),
      remarks: z.string(),
    });

    const validatedOrderRequisition = orderRequisitionSchema.parse(updatedOrderRequisition);

    await dbUpdateOrderRequisition(id, validatedOrderRequisition);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function PATCH(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedOrderRequisition = await request.json();

    const orderRequisitionSchema = z
      .object({
        requisitionId: z.string().optional(),
        requisitionType: z.string().optional(),
        requisitionTypeId: z.string().optional(),
        requisitionDate: z.string().optional(),
        employeeId: z.string().optional(),
        approvalE2: z.string().optional(),
        approvalE3: z.string().optional(),
        approvalP1: z.string().optional(),
        isApprovedE2: z.boolean().nullable().optional(),
        isApprovedE3: z.boolean().nullable().optional(),
        isApprovedP1: z.boolean().nullable().optional(),
        isActive: z.boolean().optional(),
        isComplete: z.boolean().optional(),
        remarks: z.string().optional(),
      })
      .strict();

    const validatedOrderRequisition = orderRequisitionSchema.parse(updatedOrderRequisition);

    await dbUpdateOrderRequisition(id, validatedOrderRequisition);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    await dbDeleteOrderRequisition(id);

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}
