-- Workflow Executions Migration
-- This migration creates tables for tracking WhatsApp workflow executions

-- Create workflow_executions table
CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_type TEXT NOT NULL,
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending')),
    execution_data JSONB,
    error_message TEXT,
    executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_type ON workflow_executions(workflow_type);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_customer_id ON workflow_executions(customer_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_executed_at ON workflow_executions(executed_at);

-- Enable Row Level Security
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workflow_executions
CREATE POLICY "Admins can view all workflow executions" ON workflow_executions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Users can view their own workflow executions" ON workflow_executions
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "System can manage workflow executions" ON workflow_executions
    FOR ALL USING (true);

-- Create function to get workflow execution statistics
CREATE OR REPLACE FUNCTION get_workflow_execution_stats(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    workflow_type TEXT,
    total_executions BIGINT,
    successful_executions BIGINT,
    failed_executions BIGINT,
    success_rate DECIMAL,
    last_execution TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        we.workflow_type,
        COUNT(*) as total_executions,
        COUNT(*) FILTER (WHERE we.status = 'success') as successful_executions,
        COUNT(*) FILTER (WHERE we.status = 'error') as failed_executions,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                (COUNT(*) FILTER (WHERE we.status = 'success')::DECIMAL / COUNT(*)::DECIMAL) * 100
            ELSE 0 
        END as success_rate,
        MAX(we.executed_at) as last_execution
    FROM workflow_executions we
    WHERE DATE(we.executed_at) BETWEEN start_date AND end_date
    GROUP BY we.workflow_type
    ORDER BY total_executions DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get customer workflow history
CREATE OR REPLACE FUNCTION get_customer_workflow_history(customer_uuid UUID)
RETURNS TABLE (
    workflow_type TEXT,
    status TEXT,
    executed_at TIMESTAMP WITH TIME ZONE,
    execution_data JSONB,
    error_message TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        we.workflow_type,
        we.status,
        we.executed_at,
        we.execution_data,
        we.error_message
    FROM workflow_executions we
    WHERE we.customer_id = customer_uuid
    ORDER BY we.executed_at DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;
