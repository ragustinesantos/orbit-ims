import { z } from 'zod';
import { dbAddRorTemplate, dbGetAllRorTemplates } from '@/app/_services/ror-template-service';

export async function GET() {
  try {
    const rorTemplateList = await dbGetAllRorTemplates();

    return new Response(JSON.stringify(rorTemplateList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const newRorTemplate = await request.json();

    const rorTemplateSchema = z.object({
      templateName: z.string(),
      date: z.string(),
      employeeId: z.string(),
      itemList: z.array(z.string()),
      approvalE2: z.string(),
      approvalE3: z.string(),
      isTemplateApprovedE2: z.boolean().nullable(),
      isTemplateApprovedE3: z.boolean().nullable(),
    });

    const validatedRorTemplate = rorTemplateSchema.parse(newRorTemplate);

    await dbAddRorTemplate(validatedRorTemplate);

    return new Response(JSON.stringify(validatedRorTemplate), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }
}
