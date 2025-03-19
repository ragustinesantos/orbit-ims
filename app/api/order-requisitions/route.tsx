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
      requisitionType: z.string(),
      requisitionTypeId: z.string(),
      purchaseOrderId: z.string(),
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

    const validatedOrderRequisition = orderRequisitionSchema.parse(newOrderRequisition);

    const docId = await dbAddOrderRequisition(validatedOrderRequisition);

    return new Response(JSON.stringify(docId), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }
}
