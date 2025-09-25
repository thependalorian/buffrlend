-- Unification Cleanup for buffrlend-starter
-- This script removes tables and types that are now handled by the shared unified schema.

-- Drop tables from 17_notification_system.sql
DROP TABLE IF EXISTS notification_queue CASCADE;
DROP TABLE IF EXISTS notification_templates CASCADE;
DROP TYPE IF EXISTS notification_status;
DROP TYPE IF EXISTS notification_type;

-- Drop tables from 15_rate_limiting.sql
DROP TABLE IF EXISTS rate_limiting_violations CASCADE;
DROP TABLE IF EXISTS rate_limiting_counters CASCADE;
DROP TABLE IF EXISTS rate_limiting_rules CASCADE;

-- Drop tables from 08_audit_logging_tables.sql
DROP TABLE IF EXISTS audit_log_entries CASCADE;
DROP TYPE IF EXISTS audit_event_type;

-- Drop tables from 03_kyc_verification_tables.sql
DROP TABLE IF EXISTS kyc_verifications CASCADE;
DROP TABLE IF EXISTS kyc_documents CASCADE;
DROP TABLE IF EXISTS kyc_templates CASCADE;
DROP TYPE IF EXISTS kyc_status;
DROP TYPE IF EXISTS document_type;

-- Drop tables from 02_core_tables.sql
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS subscription_plans;
DROP TYPE IF EXISTS user_roles;
