// buffrlend-starter/lib/services/buffr-host.service.ts

interface EmployeeLoanApplication {
  employee_id: string;
  property_id: string;
  requested_amount: number;
  loan_purpose: string;
  employment_start_date: string;
  salary: number;
  contact_email: string;
  contact_phone?: string;
}

export class BuffrHostService {
  private buffrHostApiUrl: string;
  private buffrHostApiKey: string;
  private backendApiUrl: string; // For fallback
  private backendApiKey: string; // For fallback

  constructor() {
    // Using process.env directly as per user's instruction not to change .env files
    this.buffrHostApiUrl = process.env.BUFFRHOST_API_URL || "https://host.buffr.ai";
    this.buffrHostApiKey = process.env.BUFFRHOST_API_KEY || "YOUR_BUFFRHOST_API_KEY";
    this.backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
    this.backendApiKey = process.env.BACKEND_API_KEY || "your_backend_api_key";
  }

  async submitEmployeeLoanApplication(applicationData: EmployeeLoanApplication) {
    try {
      // Primary: Direct API call to BuffrHost
      const response = await fetch(`${this.buffrHostApiUrl}/employee-loan-applications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.buffrHostApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) {
        throw new Error(`BuffrHost API failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling BuffrHost API for employee loan application, attempting fallback:", error);
      // Fallback: Use Python backend (if BuffrLend has a fallback for this)
      // Note: The provided fallback_service.py in GEMINI.md does not have a specific endpoint for this.
      // A generic fallback for 'create_employee_loan_application' would need to be added to BuffrLend's fallback service.
      return await this.fallbackToPython('create_employee_loan_application', applicationData);
    }
  }

  private async fallbackToPython(operation: string, data: any) {
    // This fallback would be to BuffrLend's own Python backend, not BuffrHost's.
    // The BuffrLend backend would need to have a corresponding fallback endpoint.
    const response = await fetch(`${this.backendApiUrl}/fallback/api/${operation}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.backendApiKey}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Python backend fallback failed: ${response.statusText}`);
    }

    return await response.json();
  }
}
