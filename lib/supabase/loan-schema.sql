-- BuffrLend Loan System Database Schema
-- Run this in your Supabase SQL editor after the main schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create loan-related enums
CREATE TYPE loan_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'active', 'completed', 'defaulted', 'cancelled');
CREATE TYPE loan_purpose AS ENUM ('emergency_expenses', 'medical_bills', 'education', 'home_improvement', 'vehicle_maintenance', 'business_investment', 'other');
CREATE TYPE employment_type AS ENUM ('permanent', 'contract', 'temporary');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'late', 'defaulted', 'cancelled');
CREATE TYPE payment_method AS ENUM ('salary_deduction', 'bank_transfer', 'mobile_money', 'cash_deposit');
CREATE TYPE document_status AS ENUM ('pending', 'uploaded', 'processing', 'verified', 'rejected');
CREATE TYPE document_type AS ENUM ('id_document', 'payslip', 'bank_statement', 'employment_letter', 'other');

-- Create partner_companies table
CREATE TABLE partner_companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    salary_deduction_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loan_applications table
CREATE TABLE loan_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    partner_company_id UUID REFERENCES partner_companies(id) ON DELETE RESTRICT,
    
    -- Loan details
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 500 AND amount <= 10000),
    term_months INTEGER NOT NULL CHECK (term_months >= 1 AND term_months <= 5),
    purpose loan_purpose NOT NULL,
    interest_rate DECIMAL(5,2) DEFAULT 2.5,
    monthly_payment DECIMAL(10,2),
    
    -- Employment information
    employer_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    monthly_salary DECIMAL(10,2) NOT NULL CHECK (monthly_salary >= 1000),
    employment_start_date DATE NOT NULL,
    employment_type employment_type DEFAULT 'permanent',
    
    -- Application status
    status loan_status DEFAULT 'pending',
    application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    review_date TIMESTAMP WITH TIME ZONE,
    approval_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- AI processing
    ai_confidence_score DECIMAL(3,2),
    ai_recommendation TEXT,
    manual_review_required BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loans table (approved applications)
CREATE TABLE loans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    application_id UUID REFERENCES loan_applications(id) ON DELETE RESTRICT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Loan terms
    amount DECIMAL(10,2) NOT NULL,
    term_months INTEGER NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    monthly_payment DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status and dates
    status loan_status DEFAULT 'active',
    disbursement_date TIMESTAMP WITH TIME ZONE,
    maturity_date TIMESTAMP WITH TIME ZONE,
    next_payment_date DATE,
    
    -- Financial tracking
    principal_balance DECIMAL(10,2) NOT NULL,
    interest_balance DECIMAL(10,2) DEFAULT 0,
    total_paid DECIMAL(10,2) DEFAULT 0,
    remaining_balance DECIMAL(10,2) NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Payment details
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date TIMESTAMP WITH TIME ZONE,
    status payment_status DEFAULT 'pending',
    payment_method payment_method,
    
    -- Payment breakdown
    principal_amount DECIMAL(10,2) DEFAULT 0,
    interest_amount DECIMAL(10,2) DEFAULT 0,
    late_fee DECIMAL(10,2) DEFAULT 0,
    
    -- Reference and metadata
    reference_number TEXT,
    transaction_id TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create kyc_documents table
CREATE TABLE kyc_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    application_id UUID REFERENCES loan_applications(id) ON DELETE CASCADE,
    
    -- Document details
    type document_type NOT NULL,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    
    -- Processing status
    status document_status DEFAULT 'pending',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    
    -- AI analysis
    ai_confidence_score DECIMAL(3,2),
    ai_analysis JSONB,
    rejection_reason TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_loan_applications_user_id ON loan_applications(user_id);
CREATE INDEX idx_loan_applications_status ON loan_applications(status);
CREATE INDEX idx_loan_applications_partner_company ON loan_applications(partner_company_id);
CREATE INDEX idx_loan_applications_application_date ON loan_applications(application_date);

CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_next_payment_date ON loans(next_payment_date);

CREATE INDEX idx_payments_loan_id ON payments(loan_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);

CREATE INDEX idx_kyc_documents_user_id ON kyc_documents(user_id);
CREATE INDEX idx_kyc_documents_application_id ON kyc_documents(application_id);
CREATE INDEX idx_kyc_documents_status ON kyc_documents(status);

-- Enable Row Level Security (RLS)
ALTER TABLE partner_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for partner_companies
CREATE POLICY "Anyone can view active partner companies" ON partner_companies
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage partner companies" ON partner_companies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create RLS policies for loan_applications
CREATE POLICY "Users can view own applications" ON loan_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications" ON loan_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending applications" ON loan_applications
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all applications" ON loan_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update applications" ON loan_applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create RLS policies for loans
CREATE POLICY "Users can view own loans" ON loans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all loans" ON loans
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can manage loans" ON loans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create RLS policies for payments
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can manage payments" ON payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create RLS policies for kyc_documents
CREATE POLICY "Users can view own documents" ON kyc_documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload documents" ON kyc_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON kyc_documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents" ON kyc_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can manage documents" ON kyc_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create functions for loan calculations
CREATE OR REPLACE FUNCTION calculate_monthly_payment(
    loan_amount DECIMAL,
    interest_rate DECIMAL,
    term_months INTEGER
) RETURNS DECIMAL AS $$
BEGIN
    RETURN (loan_amount * (1 + (interest_rate / 100) * term_months)) / term_months;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_total_amount(
    loan_amount DECIMAL,
    interest_rate DECIMAL,
    term_months INTEGER
) RETURNS DECIMAL AS $$
BEGIN
    RETURN loan_amount * (1 + (interest_rate / 100) * term_months);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate loan amounts
CREATE OR REPLACE FUNCTION update_loan_calculations()
RETURNS TRIGGER AS $$
BEGIN
    NEW.monthly_payment = calculate_monthly_payment(NEW.amount, NEW.interest_rate, NEW.term_months);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_loan_calculations
    BEFORE INSERT OR UPDATE ON loan_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_loan_calculations();

-- Create trigger to update loan balances
CREATE OR REPLACE FUNCTION update_loan_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Update remaining balance when payment is made
    IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
        UPDATE loans 
        SET 
            total_paid = total_paid + NEW.amount,
            remaining_balance = remaining_balance - NEW.amount,
            updated_at = NOW()
        WHERE id = NEW.loan_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_loan_balance
    AFTER UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_loan_balance();

-- Insert sample partner companies
INSERT INTO partner_companies (name, code, contact_person, email, phone, is_active) VALUES
('Namibia Breweries Limited', 'NBL', 'HR Manager', 'hr@nbl.com.na', '+264 61 123 4567', TRUE),
('Bank Windhoek', 'BW', 'HR Manager', 'hr@bankwindhoek.com.na', '+264 61 234 5678', TRUE),
('NamPower', 'NP', 'HR Manager', 'hr@nampower.com.na', '+264 61 345 6789', TRUE),
('NamWater', 'NW', 'HR Manager', 'hr@namwater.com.na', '+264 61 456 7890', TRUE),
('NamPost', 'NP', 'HR Manager', 'hr@nampost.com.na', '+264 61 567 8901', TRUE),
('Ministry of Health', 'MOH', 'HR Manager', 'hr@health.gov.na', '+264 61 678 9012', TRUE),
('Ministry of Education', 'MOE', 'HR Manager', 'hr@education.gov.na', '+264 61 789 0123', TRUE);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON partner_companies TO authenticated;
GRANT ALL ON loan_applications TO authenticated;
GRANT ALL ON loans TO authenticated;
GRANT ALL ON payments TO authenticated;
GRANT ALL ON kyc_documents TO authenticated;
GRANT USAGE ON SEQUENCE partner_companies_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE loan_applications_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE loans_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE payments_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE kyc_documents_id_seq TO authenticated;
