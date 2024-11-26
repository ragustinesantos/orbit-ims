import { z } from 'zod';
import { dbGetAllItems } from '@/app/_services/items-service';

export async function GET() {
  try {
    const itemList = await dbGetAllItems();
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

    return new Response(JSON.stringify(validatedSupplier), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }
}
