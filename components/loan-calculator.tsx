/**
 * Loan Calculator Component - BuffrLend
 * 
 * Purpose: Apple-inspired, Bain-consulted loan calculator with strategic clarity
 * Location: /components/loan-calculator.tsx
 * 
 * Design Principles:
 * - Apple: Simplicity, beauty, intuitive UX
 * - Bain: Strategic clarity, data-driven insights, professional presentation
 * 
 * @example
 * <LoanCalculator />
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LoanCalculation {
  loan_amount: number;
  loan_term_months: number;
  buffr_fee_rate: number;
  buffr_fee_amount: number;
  user_total_fees: number;
  total_payable: number;
  monthly_payment: number;
}

const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(5000);
  const [loanTerm, setLoanTerm] = useState<number>(3);
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null);

  // Calculate loan with strategic insights
  const calculateLoan = useCallback(() => {
    const principal = loanAmount;
    const months = loanTerm;
    
    // BuffrLend fee structure (15% once-off)
    const buffrFeeRate = 0.15;
    const buffrFeeAmount = principal * buffrFeeRate;
    
    // User fees (regulatory and processing)
    const namfisaLevy = principal * 0.004;
    const stampDuty = 15.00;
    const disbursementFee = 57.50;
    const bankProcessingFee = 25.00;
    
    const totalUserFees = namfisaLevy + stampDuty + disbursementFee + bankProcessingFee;
    
    // Payment calculations
    const totalPayable = principal + buffrFeeAmount + totalUserFees;
    const monthlyPayment = totalPayable / months;
    
    setCalculation({
      loan_amount: principal,
      loan_term_months: months,
      buffr_fee_rate: buffrFeeRate,
      buffr_fee_amount: buffrFeeAmount,
      user_total_fees: totalUserFees,
      total_payable: totalPayable,
      monthly_payment: monthlyPayment
    });
  }, [loanAmount, loanTerm]);

  useEffect(() => {
    calculateLoan();
  }, [calculateLoan]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSliderBackground = (value: number, min: number, max: number) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Calculator className="h-4 w-4" />
          Loan Calculator
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Calculate Your Loan
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Transparent pricing with instant calculations. See exactly what you&apos;ll pay.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Controls - Apple-inspired simplicity */}
        <Card className="border border-gray-200 shadow-lg bg-white">
          <CardContent className="p-8">
            {/* Loan Amount */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-semibold text-gray-900">
                  Loan Amount
                </label>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(loanAmount)}
                </span>
              </div>
              
              <div className="relative mb-2">
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: getSliderBackground(loanAmount, 500, 10000)
                  }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>N$ 500</span>
                <span>N$ 10,000</span>
              </div>
            </div>

            {/* Loan Term */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-semibold text-gray-900">
                  Repayment Period
                </label>
                <span className="text-2xl font-bold text-gray-900">
                  {loanTerm} Month{loanTerm > 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="relative mb-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: getSliderBackground(loanTerm, 1, 5)
                  }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>1 Month</span>
                <span>5 Months</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Quick Amounts</p>
              <div className="grid grid-cols-3 gap-2">
                {[2000, 5000, 8000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setLoanAmount(amount)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                      loanAmount === amount
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary/50 hover:bg-gray-50'
                    }`}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Results - Bain-inspired strategic clarity */}
        <div className="space-y-6">
          {calculation && (
            <>
              {/* Key Metrics - Strategic Focus */}
              <Card className="border border-gray-200 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {formatCurrency(calculation.monthly_payment)}
                      </div>
                      <div className="text-sm text-gray-600">Monthly Payment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {formatCurrency(calculation.total_payable)}
                      </div>
                      <div className="text-sm text-gray-600">Total Cost</div>
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Transparent Breakdown */}
              <Card className="border border-gray-200 shadow-lg bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                  
                  <div className="space-y-4">
                    {/* Loan Amount */}
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Loan Amount</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(calculation.loan_amount)}</span>
                    </div>
                    
                    {/* BuffrLend Fee */}
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <div>
                        <span className="text-gray-600">BuffrLend Fee (15%)</span>
                        <p className="text-xs text-gray-500">Once-off fee</p>
                      </div>
                      <span className="font-semibold text-primary">{formatCurrency(calculation.buffr_fee_amount)}</span>
                    </div>
                    
                    {/* Regulatory Fees */}
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <div>
                        <span className="text-gray-600">Regulatory & Processing</span>
                        <p className="text-xs text-gray-500">NAMFISA levy, stamp duty, processing</p>
                      </div>
                      <span className="font-semibold text-secondary">{formatCurrency(calculation.user_total_fees)}</span>
                    </div>
                    
                    {/* Total */}
                    <div className="flex justify-between items-center py-3 bg-gray-100 rounded-lg px-4">
                      <span className="font-semibold text-gray-900">Total Payable</span>
                      <span className="text-xl font-bold text-gray-900">{formatCurrency(calculation.total_payable)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Simple CTA */}
              <Card className="border border-gray-200 shadow-lg bg-white">
                <CardContent className="p-6 text-center">
                  <Button 
                    size="lg"
                    className="bg-primary text-white hover:bg-primary/90 font-semibold px-8 py-3 w-full"
                    onClick={() => document.getElementById('loan-application')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Apply Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          transition: all 0.2s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
};

export default LoanCalculator;