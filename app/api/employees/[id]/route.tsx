import { z } from 'zod';
import {
  dbDeleteEmployee,
  dbGetEmployee,
  dbUpdateEmployee,
} from '@/app/_services/employees-service';

export async function GET(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    const employee = await dbGetEmployee(id);

    return new Response(JSON.stringify(employee), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedEmployee = await request.json();

    const employeeSchema = z.object({
      employeeWorkId: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      phone: z.string(),
      position: z.string(),
      department: z.string(),
      password: z.string(),
      employeeLevel: z.string(),
    });

    const validatedEmployee = employeeSchema.parse(updatedEmployee);

    await dbUpdateEmployee(id, validatedEmployee);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function PATCH(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedEmployee = await request.json();

    const employeeSchema = z
      .object({
        employeeWorkId: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(), // Optional email
        phone: z.string().optional(), // Optional phone number
        position: z.string().optional(),
        department: z.string().optional(), // Optional department
        password: z.string().optional(),
        employeeLevel: z.string().optional(), // Optional employee level
      })
      .strict();

    const validatedEmployee = employeeSchema.parse(updatedEmployee);

    await dbUpdateEmployee(id, validatedEmployee);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function DELETE({ params }: { params: any }) {
  try {
    const { id } = await params;

    await dbDeleteEmployee(id);

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}
