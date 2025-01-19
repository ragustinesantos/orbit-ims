import { z } from 'zod';
import { dbAddEmployee, dbGetAllEmployees } from '@/app/_services/employees-service';

export async function GET() {
  try {
    const employeeList = await dbGetAllEmployees();

    return new Response(JSON.stringify(employeeList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const newEmployee = await request.json();

    const employeeSchema = z.object({
      employeeWorkId: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      phone: z.string(),
      position: z.string(),
      department: z.string(),
      employeeLevel: z.array(z.string()),
      isActive: z.boolean(),
    });

    const validatedEmployee = employeeSchema.parse(newEmployee);

    //TODO: Add code that would create the authentication



    await dbAddEmployee(validatedEmployee);

    return new Response(JSON.stringify(validatedEmployee), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }
}
