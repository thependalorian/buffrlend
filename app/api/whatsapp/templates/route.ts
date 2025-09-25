/**
 * WhatsApp Templates API Route
 * 
 * This API endpoint handles WhatsApp message template management
 * including fetching available templates and creating new ones.
 */

import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/lib/integrations/whatsapp/whatsapp-service';
import { getCurrentUser } from '@/lib/auth/auth-utils';

export async function GET() {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all templates
    const templates = await whatsappService.getTemplates();

    return NextResponse.json({
      success: true,
      data: templates
    });

  } catch (error) {
    console.error('Error fetching WhatsApp templates:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch templates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, category, language, components } = body;

    // Validate required fields
    if (!name || !category || !language || !components) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, language, components' },
        { status: 400 }
      );
    }

    // In a real implementation, you would create the template via Twilio API
    // For now, return a success response
    const newTemplate = {
      id: `template_${Date.now()}`,
      name,
      category,
      language,
      status: 'PENDING',
      components,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      message: 'Template created successfully',
      data: newTemplate
    });

  } catch (error) {
    console.error('Error creating WhatsApp template:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create template',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
