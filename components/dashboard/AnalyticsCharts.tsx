/**
 * Analytics Charts Component
 * 
 * This component provides comprehensive analytics charts for the admin dashboard
 * using Recharts library for data visualization.
 */

'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface ChartData {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface AnalyticsData {
  loanApplications: ChartData[];
  documentVerifications: ChartData[];
  userRegistrations: ChartData[];
  revenueData: ChartData[];
  documentTypes: ChartData[];
  approvalRates: ChartData[];
  riskDistribution: ChartData[];
  monthlyTrends: ChartData[];
}

interface AnalyticsChartsProps {
  data: AnalyticsData;
  className?: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Loan Applications Trend */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Loan Applications Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.loanApplications}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="applications" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Applications"
            />
            <Line 
              type="monotone" 
              dataKey="approved" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Approved"
            />
            <Line 
              type="monotone" 
              dataKey="rejected" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Rejected"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Document Verification Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Document Verification Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.documentVerifications}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="verified" 
              stackId="1" 
              stroke="#10B981" 
              fill="#10B981" 
              name="Verified"
            />
            <Area 
              type="monotone" 
              dataKey="pending" 
              stackId="1" 
              stroke="#F59E0B" 
              fill="#F59E0B" 
              name="Pending"
            />
            <Area 
              type="monotone" 
              dataKey="rejected" 
              stackId="1" 
              stroke="#EF4444" 
              fill="#EF4444" 
              name="Rejected"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* User Registrations */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">User Registrations</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.userRegistrations}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="newUsers" fill="#3B82F6" name="New Users" />
            <Bar dataKey="activeUsers" fill="#10B981" name="Active Users" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Data */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`N$${value}`, 'Revenue']} />
            <Legend />
            <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
            <Bar dataKey="interest" fill="#3B82F6" name="Interest Income" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Document Types Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Document Types Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.documentTypes}
              cx="50%"
              cy="50%"
              labelLine={false}
             label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.documentTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Approval Rates */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Approval Rates by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.approvalRates} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip formatter={(value) => [`${value}%`, 'Approval Rate']} />
            <Bar dataKey="rate" fill="#10B981" name="Approval Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.riskDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.riskDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm border lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Monthly Performance Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="applications" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Applications"
            />
            <Line 
              type="monotone" 
              dataKey="approvals" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Approvals"
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#F59E0B" 
              strokeWidth={2}
              name="Revenue (N$)"
            />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              name="New Users"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Sample data generator for testing
export const generateSampleAnalyticsData = (): AnalyticsData => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return {
    loanApplications: months.map(month => ({
      name: month,
      value: Math.floor(Math.random() * 100) + 50, // Total applications
      applications: Math.floor(Math.random() * 100) + 50,
      approved: Math.floor(Math.random() * 60) + 30,
      rejected: Math.floor(Math.random() * 20) + 10,
    })),
    
    documentVerifications: months.map(month => ({
      name: month,
      value: Math.floor(Math.random() * 200) + 100, // Total verifications
      verified: Math.floor(Math.random() * 200) + 100,
      pending: Math.floor(Math.random() * 50) + 20,
      rejected: Math.floor(Math.random() * 30) + 10,
    })),
    
    userRegistrations: months.map(month => ({
      name: month,
      value: Math.floor(Math.random() * 150) + 50, // New users
      newUsers: Math.floor(Math.random() * 150) + 50,
      activeUsers: Math.floor(Math.random() * 300) + 200,
    })),
    
    revenueData: months.map(month => ({
      name: month,
      value: Math.floor(Math.random() * 100000) + 50000, // Total revenue
      revenue: Math.floor(Math.random() * 100000) + 50000,
      interest: Math.floor(Math.random() * 20000) + 10000,
    })),
    
    documentTypes: [
      { name: 'National ID', value: 45 },
      { name: 'Passport', value: 25 },
      { name: 'Driver License', value: 15 },
      { name: 'Bank Statement', value: 10 },
      { name: 'Payslip', value: 5 },
    ],
    
    approvalRates: [
      { name: 'Personal Loans', value: 85, rate: 85 },
      { name: 'Business Loans', value: 72, rate: 72 },
      { name: 'Emergency Loans', value: 90, rate: 90 },
      { name: 'Education Loans', value: 78, rate: 78 },
    ],
    
    riskDistribution: [
      { name: 'Low Risk', value: 60 },
      { name: 'Medium Risk', value: 25 },
      { name: 'High Risk', value: 10 },
      { name: 'Very High Risk', value: 5 },
    ],
    
    monthlyTrends: months.map(month => ({
      name: month,
      value: Math.floor(Math.random() * 100) + 50,
      applications: Math.floor(Math.random() * 100) + 50,
      approvals: Math.floor(Math.random() * 80) + 40,
      revenue: Math.floor(Math.random() * 100000) + 50000,
      users: Math.floor(Math.random() * 150) + 50,
    })),
  };
};

export default AnalyticsCharts;

