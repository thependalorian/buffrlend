import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get all partner companies with active status
    const { data: companies, error } = await supabase
      .from('partner_companies')
      .select(`
        id,
        company_name,
        company_registration_number,
        industry_sector,
        total_employees,
        primary_contact_name,
        primary_contact_email,
        partnership_status,
        status
      `)
      .eq('status', 'active')
      .order('company_name', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch partner companies' }, { status: 500 });
    }

    // Transform data to match component interface
    const transformedCompanies = (companies || []).map(company => ({
      id: company.id,
      name: company.company_name,
      registrationNumber: company.company_registration_number,
      employeeCount: company.total_employees,
      salaryDeductionActive: company.partnership_status === 'active',
      description: `${company.industry_sector} - ${company.primary_contact_name}`
    }));

    return NextResponse.json(transformedCompanies);
  } catch (error) {
    console.error('Partner companies API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
