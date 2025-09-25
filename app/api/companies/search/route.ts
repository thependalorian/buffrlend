import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Search companies in the partner_companies table
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
      .or(`company_name.ilike.%${query}%,industry_sector.ilike.%${query}%,primary_contact_name.ilike.%${query}%`)
      .eq('status', 'active')
      .limit(20);

    if (error) {
      console.error('Database search error:', error);
      return NextResponse.json({ error: 'Failed to search companies' }, { status: 500 });
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
    console.error('Company search API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
