-- WhatsApp Communications Migration
-- This migration creates tables for WhatsApp Business API integration

-- Create customer_communications table
CREATE TABLE IF NOT EXISTS customer_communications (
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

-- Create whatsapp_templates table
CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('AUTHENTICATION', 'MARKETING', 'UTILITY')),
    language TEXT NOT NULL DEFAULT 'en',
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    components JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create whatsapp_analytics table
CREATE TABLE IF NOT EXISTS whatsapp_analytics (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_communications_customer_id ON customer_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_communications_phone_number ON customer_communications(phone_number);
CREATE INDEX IF NOT EXISTS idx_customer_communications_status ON customer_communications(status);
CREATE INDEX IF NOT EXISTS idx_customer_communications_sent_at ON customer_communications(sent_at);
CREATE INDEX IF NOT EXISTS idx_customer_communications_loan_id ON customer_communications(loan_id);

CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_name ON whatsapp_templates(name);
CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_status ON whatsapp_templates(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_category ON whatsapp_templates(category);

CREATE INDEX IF NOT EXISTS idx_whatsapp_analytics_date ON whatsapp_analytics(date);

-- Enable Row Level Security
ALTER TABLE customer_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for customer_communications
CREATE POLICY "Users can view their own communications" ON customer_communications
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all communications" ON customer_communications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "System can insert communications" ON customer_communications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update communications" ON customer_communications
    FOR UPDATE USING (true);

-- Create RLS policies for whatsapp_templates
CREATE POLICY "Admins can manage templates" ON whatsapp_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Users can view approved templates" ON whatsapp_templates
    FOR SELECT USING (status = 'APPROVED');

-- Create RLS policies for whatsapp_analytics
CREATE POLICY "Admins can view analytics" ON whatsapp_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "System can manage analytics" ON whatsapp_analytics
    FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customer_communications_updated_at 
    BEFORE UPDATE ON customer_communications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_templates_updated_at 
    BEFORE UPDATE ON whatsapp_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_analytics_updated_at 
    BEFORE UPDATE ON whatsapp_analytics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default WhatsApp templates
INSERT INTO whatsapp_templates (id, name, category, language, status, components) VALUES
(
    'welcome_template',
    'welcome_template',
    'UTILITY',
    'en',
    'APPROVED',
    '[
        {
            "type": "HEADER",
            "text": "Welcome to BuffrLend!"
        },
        {
            "type": "BODY",
            "text": "Hello {{1}}, welcome to BuffrLend! Your loan application {{2}} has been received and is being processed. We will notify you once it''s approved."
        },
        {
            "type": "FOOTER",
            "text": "Thank you for choosing BuffrLend"
        }
    ]'::jsonb
),
(
    'loan_approved',
    'loan_approved',
    'UTILITY',
    'en',
    'APPROVED',
    '[
        {
            "type": "HEADER",
            "text": "Loan Approved!"
        },
        {
            "type": "BODY",
            "text": "Congratulations {{1}}! Your loan application has been approved. Amount: N${{2}}, Term: {{3}} months. Funds will be disbursed within 24 hours."
        },
        {
            "type": "FOOTER",
            "text": "BuffrLend - Your trusted financial partner"
        }
    ]'::jsonb
),
(
    'payment_reminder',
    'payment_reminder',
    'UTILITY',
    'en',
    'APPROVED',
    '[
        {
            "type": "HEADER",
            "text": "Payment Reminder"
        },
        {
            "type": "BODY",
            "text": "Hello {{1}}, this is a friendly reminder that your loan payment of N${{2}} is due on {{3}}. Please ensure sufficient funds in your account."
        },
        {
            "type": "FOOTER",
            "text": "BuffrLend"
        }
    ]'::jsonb
),
(
    'kyc_verification',
    'kyc_verification',
    'UTILITY',
    'en',
    'APPROVED',
    '[
        {
            "type": "HEADER",
            "text": "KYC Verification Required"
        },
        {
            "type": "BODY",
            "text": "Hello {{1}}, your KYC verification is required to process your loan application. Please upload the required documents through our app or website."
        },
        {
            "type": "FOOTER",
            "text": "BuffrLend"
        }
    ]'::jsonb
),
(
    'loan_disbursed',
    'loan_disbursed',
    'UTILITY',
    'en',
    'APPROVED',
    '[
        {
            "type": "HEADER",
            "text": "Loan Disbursed"
        },
        {
            "type": "BODY",
            "text": "Hello {{1}}, your loan of N${{2}} has been successfully disbursed to your account. Your first payment of N${{3}} is due on {{4}}."
        },
        {
            "type": "FOOTER",
            "text": "BuffrLend"
        }
    ]'::jsonb
);

-- Create function to calculate daily analytics
CREATE OR REPLACE FUNCTION calculate_daily_whatsapp_analytics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
BEGIN
    INSERT INTO whatsapp_analytics (
        date,
        total_messages,
        sent_messages,
        delivered_messages,
        read_messages,
        failed_messages,
        delivery_rate,
        read_rate,
        failure_rate
    )
    SELECT
        target_date,
        COUNT(*) as total_messages,
        COUNT(*) FILTER (WHERE status = 'sent') as sent_messages,
        COUNT(*) FILTER (WHERE status = 'delivered') as delivered_messages,
        COUNT(*) FILTER (WHERE status = 'read') as read_messages,
        COUNT(*) FILTER (WHERE status = 'failed') as failed_messages,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                (COUNT(*) FILTER (WHERE status = 'delivered')::DECIMAL / COUNT(*)::DECIMAL) * 100
            ELSE 0 
        END as delivery_rate,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                (COUNT(*) FILTER (WHERE status = 'read')::DECIMAL / COUNT(*)::DECIMAL) * 100
            ELSE 0 
        END as read_rate,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                (COUNT(*) FILTER (WHERE status = 'failed')::DECIMAL / COUNT(*)::DECIMAL) * 100
            ELSE 0 
        END as failure_rate
    FROM customer_communications
    WHERE DATE(sent_at) = target_date
    ON CONFLICT (date) DO UPDATE SET
        total_messages = EXCLUDED.total_messages,
        sent_messages = EXCLUDED.sent_messages,
        delivered_messages = EXCLUDED.delivered_messages,
        read_messages = EXCLUDED.read_messages,
        failed_messages = EXCLUDED.failed_messages,
        delivery_rate = EXCLUDED.delivery_rate,
        read_rate = EXCLUDED.read_rate,
        failure_rate = EXCLUDED.failure_rate,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to get WhatsApp analytics for date range
CREATE OR REPLACE FUNCTION get_whatsapp_analytics(start_date DATE, end_date DATE)
RETURNS TABLE (
    total_messages BIGINT,
    sent_messages BIGINT,
    delivered_messages BIGINT,
    read_messages BIGINT,
    failed_messages BIGINT,
    delivery_rate DECIMAL,
    read_rate DECIMAL,
    failure_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(wa.total_messages), 0) as total_messages,
        COALESCE(SUM(wa.sent_messages), 0) as sent_messages,
        COALESCE(SUM(wa.delivered_messages), 0) as delivered_messages,
        COALESCE(SUM(wa.read_messages), 0) as read_messages,
        COALESCE(SUM(wa.failed_messages), 0) as failed_messages,
        CASE 
            WHEN SUM(wa.total_messages) > 0 THEN 
                (SUM(wa.delivered_messages)::DECIMAL / SUM(wa.total_messages)::DECIMAL) * 100
            ELSE 0 
        END as delivery_rate,
        CASE 
            WHEN SUM(wa.total_messages) > 0 THEN 
                (SUM(wa.read_messages)::DECIMAL / SUM(wa.total_messages)::DECIMAL) * 100
            ELSE 0 
        END as read_rate,
        CASE 
            WHEN SUM(wa.total_messages) > 0 THEN 
                (SUM(wa.failed_messages)::DECIMAL / SUM(wa.total_messages)::DECIMAL) * 100
            ELSE 0 
        END as failure_rate
    FROM whatsapp_analytics wa
    WHERE wa.date BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;
