import { z } from 'zod';
import {
  dbAddOrderRequisition,
  dbGetAllOrderRequisitions,
} from '@/app/_services/order-requisition-service';

export async function GET() {
  try {
    const orderRequisitionList = await dbGetAllOrderRequisitions();

    return new Response(JSON.stringify(orderRequisitionList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const newOrderRequisition = await request.json();

    const orderRequisitionSchema = z.object({
      requisitionId: z.string(),
      requisitionType: z.string(),
      requisitionDate: z.date(),
      employeeId: z.string(),
      approvalE2: z.string(),
      approvalE3: z.string(),
      approvalP1: z.string(),
      isApprovedE2: z.boolean(),
      isApprovedE3: z.boolean(),
      isApprovedP1: z.boolean(),
      recipientName: z.string(),
      disposalPlan: z.string(),
      remarks: z.string(),
    });

    const validatedOrderRequisition = orderRequisitionSchema.parse(newOrderRequisition);

    await dbAddOrderRequisition(validatedOrderRequisition);

    return new Response(JSON.stringify(validatedOrderRequisition), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }
}
