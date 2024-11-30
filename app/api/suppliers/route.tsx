import { z } from 'zod';

import { dbAddSupplier, dbGetAllSuppliers } from '@/app/_services/suppliers-service';

export async function GET() {
  try {
    const itemList = await dbGetAllSuppliers();
    return new Response(JSON.stringify(itemList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const newSupplier = await request.json();

    const supplierSchema = z.object({
      supplierName: z.string(),
      contactNumber: z.string(),
      email: z.string(),
      address: z.string(),
    });

    const validatedSupplier = supplierSchema.parse(newSupplier);

    await dbAddSupplier(validatedSupplier);

    return new Response(JSON.stringify(validatedSupplier), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }
}
