/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import {
  dbDeleteRorTemplate,
  dbGetRorTemplate,
  dbUpdateRorTemplate,
} from '@/app/_services/ror-template-service';

export async function GET(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    const rorTemplate = await dbGetRorTemplate(id);

    return new Response(JSON.stringify(rorTemplate), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedRorTemplate = await request.json();

    const rorTemplateSchema = z.object({
      rorTemplateId: z.string(),
      templateName: z.string(),
      itemList: z.array(z.string()),
      isTemplateApprovedE2: z.boolean(),
      isTemplateApprovedE3: z.boolean(),
    });

    const validatedRorTemplate = rorTemplateSchema.parse(updatedRorTemplate);

    await dbUpdateRorTemplate(id, validatedRorTemplate);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function PATCH(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const updatedRorTemplate = await request.json();

    const rorTemplateSchema = z.object({
      rorTemplateId: z.string().optional(),
      templateName: z.string().optional(),
      itemList: z.array(z.string()).optional(),
      isTemplateApprovedE2: z.boolean().optional(),
      isTemplateApprovedE3: z.boolean().optional(),
    });

    const validatedRorTemplate = rorTemplateSchema.parse(updatedRorTemplate);

    await dbUpdateRorTemplate(id, validatedRorTemplate);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    await dbDeleteRorTemplate(id);

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
}
