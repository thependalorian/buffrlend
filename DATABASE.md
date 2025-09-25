# BuffrLend Database Documentation

## Overview

This document provides comprehensive documentation of the BuffrLend database schema, including all tables, relationships, functions, triggers, and security policies.

## Database Architecture

- **Database**: PostgreSQL (via Supabase)
- **Schema**: `public`
- **Authentication**: Supabase Auth
- **Row Level Security**: Enabled on all tables
- **Real-time**: Enabled for relevant tables
- **AI Integration**: Document intelligence, workflow orchestration, and analytics services

## Core Tables

### 1. Authentication & User Management

#### `profiles`
User profile information linked to Supabase Auth users.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(255),
  id_number VARCHAR(255),
  company_name VARCHAR(255),
  position VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `admin_profiles`
Administrative user profiles with enhanced permissions.

```sql
CREATE TABLE admin_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  role admin_role_enum DEFAULT 'admin',
  permissions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Core Lending System

#### `loan_applications`
Main loan application records with comprehensive financial data.

```sql
CREATE TABLE loan_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id),
  company_id UUID REFERENCES partner_companies(id),
  loan_amount DECIMAL(15,2) NOT NULL,
  loan_term INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  interest_rate DECIMAL(5,2),
  monthly_payment DECIMAL(15,2),
  total_repayment DECIMAL(15,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `partner_companies`
Employer/partner company information for B2B2C model.

```sql
CREATE TABLE partner_companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  company_registration_number VARCHAR(255),
  industry_sector VARCHAR(255),
  total_employees INTEGER,
  primary_contact_name VARCHAR(255) NOT NULL,
  primary_contact_email VARCHAR(255) NOT NULL,
  partnership_status VARCHAR(50) DEFAULT 'pending',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `loan_agreements`
Digital loan agreement management with signature tracking and PDF generation.

```sql
CREATE TABLE loan_agreements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_application_id UUID NOT NULL REFERENCES loan_applications(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  agreement_number VARCHAR(255) NOT NULL,
  agreement_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  agreement_data JSONB NOT NULL,
  borrower_signature_image TEXT,
  borrower_signature_name VARCHAR(255),
  borrower_signature_date TIMESTAMPTZ,
  borrower_signature_data JSONB,
  borrower_ip_address INET,
  borrower_user_agent TEXT,
  pdf_file_path TEXT,
  pdf_generated BOOLEAN DEFAULT FALSE,
  google_drive_file_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. CRM System

#### `contacts`
Comprehensive contact management for individuals, employers, partners, and referrals.

```sql
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('individual', 'employer', 'partner', 'referral')),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  company_name VARCHAR(255),
  position VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(255),
  mobile VARCHAR(255),
  address JSONB,
  notes TEXT,
  tags TEXT[],
  relationship_stage VARCHAR(50),
  last_contact_date TIMESTAMPTZ,
  next_follow_up TIMESTAMPTZ,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `contact_interactions`
Track all interactions with contacts.

```sql
CREATE TABLE contact_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id),
  interaction_type VARCHAR(50) NOT NULL,
  subject VARCHAR(255),
  description TEXT,
  outcome TEXT,
  priority VARCHAR(20),
  status VARCHAR(20),
  scheduled_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `sales_pipelines`
Sales pipeline configurations with customizable stages.

```sql
CREATE TABLE sales_pipelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  stages JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `deals`
Sales opportunities and deals within pipelines.

```sql
CREATE TABLE deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_id UUID REFERENCES contacts(id),
  pipeline_id UUID REFERENCES sales_pipelines(id),
  stage VARCHAR(255) NOT NULL,
  value DECIMAL(15,2),
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  expected_close_date TIMESTAMPTZ,
  actual_close_date TIMESTAMPTZ,
  loss_reason TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Team & Project Management

#### `teams`
Team definitions for collaboration.

```sql
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  manager_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `team_members`
Team membership with roles and permissions.

```sql
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES auth.users(id),
  role VARCHAR(50),
  permissions JSONB,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  UNIQUE(team_id, user_id)
);
```

#### `projects`
Project management with budgets and timelines.

```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'planned',
  priority VARCHAR(20),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  actual_end_date TIMESTAMPTZ,
  budget DECIMAL(15,2),
  actual_cost DECIMAL(15,2),
  team_id UUID REFERENCES teams(id),
  parent_project_id UUID REFERENCES projects(id),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `tasks`
Task management with dependencies and time tracking.

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'todo',
  priority VARCHAR(20),
  assignee_id UUID REFERENCES auth.users(id),
  reporter_id UUID REFERENCES auth.users(id),
  project_id UUID REFERENCES projects(id),
  due_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  dependencies JSONB,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. Financial Management

#### `invoices`
Invoice management with comprehensive billing.

```sql
CREATE TABLE invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number VARCHAR(255) NOT NULL UNIQUE,
  contact_id UUID REFERENCES contacts(id),
  issue_date TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  items JSONB NOT NULL,
  subtotal DECIMAL(15,2),
  tax_amount DECIMAL(15,2),
  total_amount DECIMAL(15,2),
  currency VARCHAR(3) DEFAULT 'NAD',
  notes TEXT,
  payment_terms TEXT,
  paid_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `payments`
Payment tracking and reconciliation.

```sql
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id),
  amount DECIMAL(15,2) NOT NULL,
  payment_date TIMESTAMPTZ NOT NULL,
  payment_method VARCHAR(50),
  reference_number VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. Security & Compliance

#### `audit_logs`
Comprehensive audit trail for all system activities.

```sql
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  admin_id UUID REFERENCES auth.users(id),
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(255) NOT NULL,
  resource_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `data_access_logs`
Track data access for compliance and security.

```sql
CREATE TABLE data_access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  resource_type VARCHAR(255) NOT NULL,
  resource_id UUID,
  action VARCHAR(255) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7. WhatsApp Communications

#### `customer_communications`
WhatsApp message tracking and status management.

```sql
CREATE TABLE customer_communications (
  id TEXT PRIMARY KEY,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('template', 'text', 'media')),
  template_name TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'read', 'failed', 'received')),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  loan_id UUID,
  campaign_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### `whatsapp_templates`
Message templates for automated WhatsApp communications.

```sql
CREATE TABLE whatsapp_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('AUTHENTICATION', 'MARKETING', 'UTILITY')),
  language TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  components JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### `whatsapp_analytics`
Daily analytics for WhatsApp communications.

```sql
CREATE TABLE whatsapp_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  total_messages INTEGER NOT NULL DEFAULT 0,
  sent_messages INTEGER NOT NULL DEFAULT 0,
  delivered_messages INTEGER NOT NULL DEFAULT 0,
  read_messages INTEGER NOT NULL DEFAULT 0,
  failed_messages INTEGER NOT NULL DEFAULT 0,
  delivery_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  read_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  failure_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(date)
);
```

#### `workflow_executions`
Automated workflow execution tracking and management.

```sql
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_name TEXT NOT NULL,
  entity_id UUID, -- e.g., customer_id, loan_id
  entity_type TEXT, -- e.g., 'customer', 'loan', 'application'
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  execution_data JSONB DEFAULT '{}'::jsonb,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### 8. Integration Management

#### `integrations`
Third-party service integrations.

```sql
CREATE TABLE integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'inactive',
  config JSONB NOT NULL,
  last_sync TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Database Functions

### CRM Analytics Functions

#### `get_crm_dashboard_metrics()`
Returns comprehensive CRM dashboard statistics.

```sql
CREATE OR REPLACE FUNCTION get_crm_dashboard_metrics()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_customers', (SELECT COUNT(*) FROM customer_relationships),
    'active_leads', (SELECT COUNT(*) FROM leads WHERE status = 'active'),
    'pending_applications', (SELECT COUNT(*) FROM loan_applications WHERE status = 'pending'),
    'active_customers', (SELECT COUNT(*) FROM customer_relationships WHERE relationship_stage = 'customer'),
    'total_partners', (SELECT COUNT(*) FROM partner_companies),
    'active_partners', (SELECT COUNT(*) FROM partner_companies WHERE status = 'active'),
    'total_communications', (SELECT COUNT(*) FROM communications),
    'whatsapp_messages_sent', (SELECT COUNT(*) FROM customer_communications WHERE message_type = 'template'),
    'whatsapp_messages_received', (SELECT COUNT(*) FROM customer_communications WHERE message_type = 'text'),
    'active_workflows', (SELECT COUNT(*) FROM workflow_executions WHERE status = 'in_progress'),
    'completed_workflows', (SELECT COUNT(*) FROM workflow_executions WHERE status = 'completed')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

#### `calculate_customer_health_score(customer_id UUID)`
Calculates customer health score based on multiple factors.

```sql
CREATE OR REPLACE FUNCTION calculate_customer_health_score(customer_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  loan_count INTEGER;
  payment_history DECIMAL;
  communication_frequency INTEGER;
  last_interaction_days INTEGER;
BEGIN
  -- Calculate loan count score (0-30 points)
  SELECT COUNT(*) INTO loan_count FROM loan_applications WHERE user_id = customer_id;
  score := score + LEAST(loan_count * 5, 30);
  
  -- Calculate payment history score (0-40 points)
  -- Implementation depends on payment tracking system
  
  -- Calculate communication frequency score (0-20 points)
  SELECT COUNT(*) INTO communication_frequency 
  FROM communications 
  WHERE customer_id = customer_id 
  AND created_at > NOW() - INTERVAL '30 days';
  score := score + LEAST(communication_frequency * 2, 20);
  
  -- Calculate recency score (0-10 points)
  SELECT EXTRACT(DAYS FROM NOW() - MAX(created_at)) INTO last_interaction_days
  FROM communications 
  WHERE customer_id = customer_id;
  
  IF last_interaction_days IS NULL OR last_interaction_days > 30 THEN
    score := score + 0;
  ELSIF last_interaction_days <= 7 THEN
    score := score + 10;
  ELSIF last_interaction_days <= 14 THEN
    score := score + 7;
  ELSE
    score := score + 3;
  END IF;
  
  RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql;
```

#### `send_whatsapp_template(template_name VARCHAR, phone_number VARCHAR, variables JSONB)`
Sends WhatsApp messages using templates.

```sql
CREATE OR REPLACE FUNCTION send_whatsapp_template(
  template_name VARCHAR,
  phone_number VARCHAR,
  variables JSONB DEFAULT '{}'::jsonb
)
RETURNS JSON AS $$
DECLARE
  template_record RECORD;
  message_content TEXT;
  result JSON;
BEGIN
  -- Get template
  SELECT * INTO template_record 
  FROM whatsapp_templates 
  WHERE name = template_name AND status = 'APPROVED';
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Template not found');
  END IF;
  
  -- Replace variables in template
  message_content := template_record.components->>'content';
  -- Implementation for variable replacement
  
  -- Log message
  INSERT INTO customer_communications (
    id,
    phone_number,
    message_type,
    template_name,
    content,
    status,
    sent_at
  ) VALUES (
    gen_random_uuid()::text,
    phone_number,
    'template',
    template_name,
    message_content,
    'sent',
    NOW()
  );
  
  RETURN json_build_object(
    'success', true,
    'message_id', currval('customer_communications_id_seq'),
    'content', message_content
  );
END;
$$ LANGUAGE plpgsql;
```

## Database Triggers

### Audit Triggers

#### `trg_audit_loan_applications`
Automatically logs changes to loan applications.

```sql
CREATE OR REPLACE FUNCTION audit_loan_applications()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    changes,
    created_at
  ) VALUES (
    COALESCE(NEW.assigned_to, auth.uid()),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'created'
      WHEN TG_OP = 'UPDATE' THEN 'updated'
      WHEN TG_OP = 'DELETE' THEN 'deleted'
    END,
    'loan_application',
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'UPDATE' THEN json_build_object(
        'old', row_to_json(OLD),
        'new', row_to_json(NEW)
      )
      ELSE row_to_json(COALESCE(NEW, OLD))
    END,
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_loan_applications
  AFTER INSERT OR UPDATE OR DELETE ON loan_applications
  FOR EACH ROW EXECUTE FUNCTION audit_loan_applications();
```

### Data Synchronization Triggers

#### `trg_sync_loan_application_to_crm`
Syncs loan applications to CRM system.

```sql
CREATE OR REPLACE FUNCTION sync_loan_application_to_crm()
RETURNS TRIGGER AS $$
BEGIN
  -- Create or update customer relationship
  INSERT INTO customer_relationships (
    customer_id,
    relationship_type,
    relationship_stage,
    relationship_score,
    last_interaction_date,
    created_at
  ) VALUES (
    NEW.user_id,
    'loan_applicant',
    CASE 
      WHEN NEW.status = 'approved' THEN 'customer'
      WHEN NEW.status = 'pending' THEN 'applicant'
      ELSE 'prospect'
    END,
    calculate_customer_health_score(NEW.user_id),
    NOW(),
    NOW()
  )
  ON CONFLICT (customer_id) 
  DO UPDATE SET
    relationship_stage = CASE 
      WHEN NEW.status = 'approved' THEN 'customer'
      WHEN NEW.status = 'pending' THEN 'applicant'
      ELSE 'prospect'
    END,
    relationship_score = calculate_customer_health_score(NEW.user_id),
    last_interaction_date = NOW(),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_loan_application_to_crm
  AFTER INSERT OR UPDATE ON loan_applications
  FOR EACH ROW EXECUTE FUNCTION sync_loan_application_to_crm();
```

## Row Level Security (RLS)

### Authentication Policies

All tables have RLS enabled with appropriate policies:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
-- ... (all other tables)

-- Example policy for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin policies
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
```

## Indexes

### Performance Optimization

```sql
-- Loan applications indexes
CREATE INDEX idx_loan_applications_user_id ON loan_applications(user_id);
CREATE INDEX idx_loan_applications_status ON loan_applications(status);
CREATE INDEX idx_loan_applications_created_at ON loan_applications(created_at);

-- CRM indexes
CREATE INDEX idx_contacts_type ON contacts(type);
CREATE INDEX idx_contacts_assigned_to ON contacts(assigned_to);
CREATE INDEX idx_contact_interactions_contact_id ON contact_interactions(contact_id);
CREATE INDEX idx_deals_pipeline_id ON deals(pipeline_id);
CREATE INDEX idx_deals_stage ON deals(stage);

-- Audit indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
```

## Data Types & Enums

### Custom Enums

```sql
-- Admin roles
CREATE TYPE admin_role_enum AS ENUM (
  'super_admin',
  'admin', 
  'analyst',
  'support'
);

-- Task status
CREATE TYPE task_status AS ENUM (
  'todo',
  'doing',
  'review',
  'done'
);

-- User roles
CREATE TYPE user_role AS ENUM (
  'user',
  'admin',
  'super_admin'
);

-- Verification status
CREATE TYPE verification_status_enum AS ENUM (
  'pending',
  'in_progress',
  'verified',
  'rejected',
  'requires_review'
);

-- Verification types
CREATE TYPE verification_type_enum AS ENUM (
  'identity',
  'address',
  'income',
  'employment',
  'banking',
  'credit_check',
  'kyc_aml'
);

-- Document types
CREATE TYPE document_type_enum AS ENUM (
  'passport',
  'drivers_license',
  'national_id',
  'utility_bill',
  'bank_statement',
  'pay_stub',
  'tax_return',
  'employment_letter',
  'other'
);
```

## API Integration

### Supabase Client Configuration

The database is accessed through Supabase client libraries:

```typescript
// Client-side
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-side
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

## AI Services Integration

### Document Intelligence
The database integrates with the Document Intelligence Service for:
- Document metadata storage and retrieval
- Analysis results caching
- Compliance tracking and reporting
- Entity extraction results storage

### Workflow Orchestration
Database tables support workflow orchestration through:
- Workflow state persistence
- Step execution tracking
- Error logging and retry management
- Performance metrics collection

### Data Science Analytics
Analytics services leverage database tables for:
- Customer segmentation data
- Risk assessment results
- Predictive model training data
- Business metrics calculation

### Validation Integration
Database operations use validation schemas for:
- Type-safe data insertion
- Runtime validation
- Error handling and reporting
- Schema evolution support

## Security Considerations

1. **Row Level Security**: All tables have RLS enabled
2. **API Keys**: Service role key only used server-side
3. **Audit Logging**: All changes tracked in audit_logs
4. **Data Encryption**: Sensitive data encrypted at rest
5. **Access Control**: Role-based permissions system
6. **Rate Limiting**: API rate limits implemented
7. **Input Validation**: All inputs validated and sanitized
8. **AI Data Privacy**: Additional privacy measures for AI services

## Backup & Recovery

- **Automated Backups**: Daily automated backups via Supabase
- **Point-in-time Recovery**: Available for last 7 days
- **Data Export**: Full database export capabilities
- **Migration Scripts**: Version-controlled schema changes

## Monitoring & Performance

- **Query Performance**: Slow query monitoring enabled
- **Connection Pooling**: Automatic connection management
- **Real-time Metrics**: Database performance dashboards
- **Error Tracking**: Comprehensive error logging

## Maintenance

- **Regular Updates**: Database and extensions updated regularly
- **Index Optimization**: Regular index analysis and optimization
- **Statistics Updates**: Automatic statistics collection
- **Vacuum Operations**: Automatic maintenance operations

---

*Last Updated: January 30, 2025*
*Version: 1.0*
*Database: PostgreSQL 15+ via Supabase*
