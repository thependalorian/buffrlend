// buffrlend-starter/lib/services/buffr-payment.service.ts

interface DisbursementRequest {
  loan_id: string;
  amount: number;
  client_id: string;
  currency_code?: string;
  notes?: string;
}

interface RepaymentRequest {
  loan_id: string;
  amount: number;
  client_id: string;
  currency_code?: string;
  payment_type?: string;
  notes?: string;
}

export class BuffrPaymentService {
  private fineractServiceApiUrl: string;
  private fineractServiceApiKey: string;
  private backendApiUrl: string; // For fallback
  private backendApiKey: string; // For fallback

  constructor() {
    this.fineractServiceApiUrl = process.env.BUFFR_PAYMENT_COMPANION_API_URL || "https://payment.buffr.ai/fineract-service";
    this.fineractServiceApiKey = process.env.BUFFR_PAYMENT_COMPANION_API_KEY || "YOUR_PAYMENT_COMPANION_API_KEY";
    this.backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
    this.backendApiKey = process.env.BACKEND_API_KEY || "your_backend_api_key";
  }

  async disburseLoan(request: DisbursementRequest) {
    try {
      const response = await fetch(`${this.fineractServiceApiUrl}/payments/disburse-loan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.fineractServiceApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Fineract Service API failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling Fineract Service API for loan disbursement, attempting fallback:", error);
      // Fallback to BuffrLend's own Python backend
      return await this.fallbackToPython('disburse_loan', request);
    }
  }

  async receiveRepayment(request: RepaymentRequest) {
    try {
      const response = await fetch(`${this.fineractServiceApiUrl}/payments/receive-repayment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.fineractServiceApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Fineract Service API failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling Fineract Service API for repayment, attempting fallback:", error);
      // Fallback to BuffrLend's own Python backend
      return await this.fallbackToPython('receive_repayment', request);
    }
  }

  async getPaymentStatus(transactionId: string) {
    try {
      const response = await fetch(`${this.fineractServiceApiUrl}/payments/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.fineractServiceApiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Fineract Service API failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling Fineract Service API for payment status, attempting fallback:", error);
      // Fallback to BuffrLend's own Python backend
      return await this.fallbackToPython('get_payment_status', { transaction_id: transactionId });
    }
  }

  private async fallbackToPython(operation: string, data: any) {
    // This fallback would be to BuffrLend's own Python backend
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
