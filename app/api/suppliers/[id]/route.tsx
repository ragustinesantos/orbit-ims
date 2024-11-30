/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import {
  dbDeleteSupplier,
  dbGetSupplier,
  dbUpdateSupplier,
} from '@/app/_services/suppliers-service';

export async function GET(request: Request ,{ params }: { params: any }) {
  try {
    const { id } = await params;
    const supplier = await dbGetSupplier(id);
    return new Response(JSON.stringify(supplier), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedSupplier = await request.json();

    const supplierSchema = z.object({
      supplierName: z.string(),
      contactNumber: z.string(),
      email: z.string(),
      address: z.string(),
    });

    const validatedItem = supplierSchema.parse(updatedSupplier);

    await dbUpdateSupplier(id, validatedItem);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function PATCH(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedSupplier = await request.json();

    const supplierSchema = z
      .object({
        supplierName: z.string().optional(),
        contactNumber: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
      })
      .strict();

    const validatedSupplier = supplierSchema.parse(updatedSupplier);

    await dbUpdateSupplier(id, validatedSupplier);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    await dbDeleteSupplier(id);
    
    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}
