/**
 * Company Lookup Component - BuffrLend Starter
 * 
 * Purpose: Employer verification and account creation for partner companies
 * Location: /components/company-lookup.tsx
 * 
 * Features:
 * - Dropdown list of verified partner companies
 * - Account creation restricted to partner company employees
 * - Search functionality for all companies
 * - Partnership status display
 * - Direct signup with selected employer
 * 
 * @example
 * <CompanyLookup />
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Building, CheckCircle, Clock, AlertCircle, Users, ChevronDown, UserPlus } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  registrationNumber?: string;
  employeeCount?: number;
  partnershipStatus: 'verified' | 'pending' | 'not_partnered';
  salaryDeductionActive: boolean;
  description?: string;
}

// Mock data removed - using actual API calls

const CompanyLookup: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partnerCompanies, setPartnerCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingPartners, setIsLoadingPartners] = useState(false);

  // Load partner companies on component mount
  useEffect(() => {
    const loadPartnerCompanies = async () => {
      setIsLoadingPartners(true);
      try {
        const response = await fetch('/api/companies/partners');
        if (response.ok) {
          const partners = await response.json();
          setPartnerCompanies(partners);
        }
      } catch (error) {
        console.error('Failed to load partner companies:', error);
      } finally {
        setIsLoadingPartners(false);
      }
    };

    loadPartnerCompanies();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      // Call actual company lookup API
      const response = await fetch(`/api/companies/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to search companies');
      }
      const results = await response.json();

      setSearchResults(results);
    } catch (error) {
      console.error('Company search error:', error);
      setSearchResults([]);
      setError('Failed to search companies. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setShowDropdown(false);
    setSearchTerm(company.name);
  };

  const handleCreateAccount = () => {
    if (selectedCompany) {
      // Redirect to signup with selected company
      window.location.href = `/auth/signup?company=${encodeURIComponent(selectedCompany.id)}`;
    }
  };

  const getStatusInfo = (status: Company['partnershipStatus'], salaryDeduction: boolean) => {
    switch (status) {
      case 'verified':
        return {
          label: salaryDeduction ? 'Verified Partner' : 'Partner',
          color: salaryDeduction ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800',
          icon: salaryDeduction ? <CheckCircle className="h-3 w-3" /> : <Building className="h-3 w-3" />,
          description: salaryDeduction 
            ? 'Ready for instant loan processing with salary deduction'
            : 'Partnership active, setting up salary deduction'
        };
      case 'pending':
        return {
          label: 'Under Review',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-3 w-3" />,
          description: 'Partnership application being processed'
        };
      case 'not_partnered':
        return {
          label: 'Not Partnered',
          color: 'bg-gray-100 text-gray-800',
          icon: <AlertCircle className="h-3 w-3" />,
          description: 'Contact us to add this employer as a partner'
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          icon: <AlertCircle className="h-3 w-3" />,
          description: 'Status unknown'
        };
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-chart-2" />
          Employer Lookup
        </CardTitle>
        <CardDescription>
          Check if your employer is a verified BuffrLend partner for streamlined loan processing
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Partner Company Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Select Your Employer</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            To create an account, your employer must be a BuffrLend partner. Select from the list below:
          </p>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex items-center justify-between p-3 border border-input rounded-md bg-background hover:bg-muted/50 transition-colors"
            >
              <span className={selectedCompany ? "text-foreground" : "text-muted-foreground"}>
                {selectedCompany ? selectedCompany.name : "Choose your employer..."}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {isLoadingPartners ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
                    Loading partner companies...
                  </div>
                ) : partnerCompanies.length > 0 ? (
                  partnerCompanies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleCompanySelect(company)}
                      className="w-full text-left p-3 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-primary" />
                        <div>
                          <div className="font-medium">{company.name}</div>
                          {company.employeeCount && (
                            <div className="text-xs text-muted-foreground">
                              {company.employeeCount.toLocaleString()} employees
                            </div>
                          )}
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No partner companies found
                  </div>
                )}
              </div>
            )}
          </div>
          
          {selectedCompany && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {selectedCompany.name} is a verified BuffrLend partner
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                You can now create an account and apply for loans with automated salary deduction
              </p>
            </div>
          )}
        </div>

        {/* Create Account Button */}
        {selectedCompany && (
          <div className="space-y-3">
            <Button 
              onClick={handleCreateAccount}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create Account with {selectedCompany.name}
            </Button>
          </div>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or Search</span>
          </div>
        </div>

        {/* Search Section */}
        <div className="space-y-3">
          <h3 className="font-medium">Search All Companies</h3>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter company name to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-chart-2"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchTerm.trim()}
              className="bg-chart-2 hover:bg-chart-2/90"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-3">
            {searchResults.length > 0 ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults.map((company) => {
                    const statusInfo = getStatusInfo(company.partnershipStatus, company.salaryDeductionActive);
                    return (
                      <div
                        key={company.id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium text-foreground">{company.name}</h4>
                              <Badge className={statusInfo.color}>
                                {statusInfo.icon}
                                <span className="ml-1">{statusInfo.label}</span>
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">
                              {statusInfo.description}
                            </p>
                            
                            {company.description && (
                              <p className="text-sm text-muted-foreground italic">
                                {company.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {company.registrationNumber && (
                                <span>Reg: {company.registrationNumber}</span>
                              )}
                              {company.employeeCount && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {company.employeeCount.toLocaleString()} employees
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8 space-y-3">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">No companies found</h4>
                  <p className="text-sm text-muted-foreground">
                    We couldn&apos;t find any companies matching &quot;{searchTerm}&quot;
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="border-t border-border pt-4 space-y-3">
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Don&apos;t see your employer?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Only employees of BuffrLend partner companies can create accounts. 
              Contact us to request your employer become a partner.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Request Employer Partnership
            </Button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Why Partner Companies Only?</h4>
            <p className="text-sm text-blue-800">
              BuffrLend works with partner employers to provide automated salary deduction, 
              ensuring secure and stress-free loan repayments. This partnership model protects 
              both employees and the lending process.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyLookup;