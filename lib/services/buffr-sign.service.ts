// buffrlend-starter/lib/services/buffr-sign.service.ts

export interface LoanData {
  borrowerName: string;
  borrowerEmail: string;
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  collateral?: string;
  [key: string]: any;
}

export class BuffrSignService {
  async createLoanAgreement(loanData: LoanData) {
    try {
      // Primary: Direct API call
      const response = await fetch(`${process.env.BUFFRSIGN_API_URL}/api/loan-agreements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.BUFFRSIGN_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loanData)
      })
      
      if (!response.ok) {
        throw new Error(`BuffrSign API failed: ${response.statusText}`)
      }
      
      return await response.json()
    } catch {
      // Fallback: Use Python backend
      return await this.fallbackToPython('create_loan_agreement', loanData)
    }
  }
  
  private async fallbackToPython(operation: string, data: any) {
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/${operation}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`
      },
      body: JSON.stringify(data)
    })
    
    return await response.json()
  }
}