/**
 * Partner Email Automation Dashboard Component
 * 
 * Dashboard for managing partner email automation in BuffrLend
 * Founder: George Nekwaya (george@buffr.ai +12065308433)
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePartnerEmailAutomation } from '@/lib/hooks/usePartnerEmailAutomation';

interface PartnerCompany {
  id: string;
  company_name: string;
  primary_contact_name: string;
  primary_contact_email: string;
  partnership_status: string;
  total_employees: number;
}

export default function PartnerEmailAutomationDashboard() {
  const {
    loading,
    error,
    partnerSummary,
    sendMonthlyPartnerSummary,
    sendEmployeeLoanConfirmation,
    sendSalaryDeductionAuthorization,
    sendPaymentReminderToPartner,
    scheduleMonthlyPartnerSummaries,
    getPartnerSummary,
    getAutomationStatus
  } = usePartnerEmailAutomation();

  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [partnerCompanies, setPartnerCompanies] = useState<PartnerCompany[]>([]);
  const [automationStatus, setAutomationStatus] = useState<any>(null);

  const loadPartnerCompanies = useCallback(async () => {
    try {
      const response = await fetch('/api/companies/partners');
      const data = await response.json();
      if (data.success) {
        setPartnerCompanies(data.data);
      }
    } catch (_error) {
      console.error('Failed to load partner companies:', _error);
    }
  }, []);

  const loadAutomationStatus = useCallback(async () => {
    try {
      const status = await getAutomationStatus();
      setAutomationStatus(status);
    } catch (_error) {
      console.error('Failed to load automation status:', _error);
    }
  }, [getAutomationStatus]);

  // Load partner companies and automation status on component mount
  useEffect(() => {
    loadPartnerCompanies();
    loadAutomationStatus();
  }, [loadPartnerCompanies, loadAutomationStatus]);

  const handleSendMonthlySummary = async () => {
    if (!selectedPartner) {
      alert('Please select a partner company');
      return;
    }

    try {
      const month = selectedMonth ? new Date(selectedMonth) : undefined;
      await sendMonthlyPartnerSummary(selectedPartner, month);
      alert('Monthly partner summary sent successfully!');
    } catch (_error) {
      alert('Failed to send monthly partner summary');
    }
  };

  const handleScheduleAllSummaries = async () => {
    try {
      await scheduleMonthlyPartnerSummaries();
      alert('Monthly partner summaries scheduled for all active partners!');
    } catch (_error) {
      alert('Failed to schedule monthly partner summaries');
    }
  };

  const handleViewSummary = async () => {
    if (!selectedPartner) {
      alert('Please select a partner company');
      return;
    }

    try {
      const month = selectedMonth ? new Date(selectedMonth) : undefined;
      await getPartnerSummary(selectedPartner, month);
    } catch (_error) {
      alert('Failed to load partner summary');
    }
  };

  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7); // YYYY-MM format
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      months.push({ value, label });
    }
    
    return months;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Partner Email Automation Dashboard
        </h1>
        <p className="text-gray-600">
          Manage automated email communications with partner companies and their employees
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Automation Status */}
      {automationStatus && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Automation Status</h3>
              <div className="mt-2 text-sm text-green-700">
                Status: {automationStatus.status} | Last Run: {new Date(automationStatus.lastRun).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Partner Selection and Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Partner Email Actions
          </h2>

          <div className="space-y-4">
            {/* Partner Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Partner Company
              </label>
              <select
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a partner company...</option>
                {partnerCompanies.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.company_name} ({partner.partnership_status})
                  </option>
                ))}
              </select>
            </div>

            {/* Month Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Month (Optional)
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Current Month</option>
                {generateMonthOptions().map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleViewSummary}
                disabled={loading || !selectedPartner}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'View Partner Summary'}
              </button>

              <button
                onClick={handleSendMonthlySummary}
                disabled={loading || !selectedPartner}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Monthly Summary'}
              </button>

              <button
                onClick={handleScheduleAllSummaries}
                disabled={loading}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Scheduling...' : 'Schedule All Monthly Summaries'}
              </button>
            </div>
          </div>
        </div>

        {/* Partner Summary Display */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Partner Summary
          </h2>

          {partnerSummary ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">
                  {partnerSummary.partnerCompany.company_name}
                </h3>
                <p className="text-sm text-gray-600">
                  {partnerSummary.period.month} {partnerSummary.period.year}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-blue-600">
                    {partnerSummary.summary.totalActiveLoans}
                  </div>
                  <div className="text-sm text-blue-800">Active Loans</div>
                </div>

                <div className="bg-green-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-green-600">
                    N${partnerSummary.summary.totalLoanAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-800">Total Loan Amount</div>
                </div>

                <div className="bg-orange-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-orange-600">
                    N${partnerSummary.summary.totalMonthlyPayments.toLocaleString()}
                  </div>
                  <div className="text-sm text-orange-800">Monthly Payments</div>
                </div>

                <div className="bg-purple-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-purple-600">
                    {partnerSummary.summary.newLoansThisMonth}
                  </div>
                  <div className="text-sm text-purple-800">New Loans This Month</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Completed Loans:</span>
                    <span className="font-medium">{partnerSummary.summary.completedLoansThisMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Default Rate:</span>
                    <span className="font-medium">{partnerSummary.summary.defaultRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Loan Amount:</span>
                    <span className="font-medium">N${partnerSummary.summary.averageLoanAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a partner company and click "View Partner Summary" to see details
            </div>
          )}
        </div>
      </div>

      {/* Employee Loans Table */}
      {partnerSummary && partnerSummary.employeeLoans.length > 0 && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Employee Loans ({partnerSummary.employeeLoans.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partnerSummary.employeeLoans.map((employee) => (
                  <tr key={employee.employeeId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.employeeName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.employeeEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      N${employee.loanAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      N${employee.monthlyPayment.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.loanStatus === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {employee.loanStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        Send Reminder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
