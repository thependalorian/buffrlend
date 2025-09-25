// Generated TypeScript types from Supabase database schema
// Auto-generated on: January 30, 2025
// Comprehensive CRM and Lending Platform Types with WhatsApp AI Agent Integration

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string | null
          created_by: string | null
          department: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          last_login_at: string | null
          last_name: string
          permissions: Json | null
          phone_number: string | null
          role: Database["public"]["Enums"]["admin_role_enum"]
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          email: string
          first_name: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name: string
          permissions?: Json | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["admin_role_enum"]
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string
          permissions?: Json | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["admin_role_enum"]
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_profiles_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_applications: {
        Row: {
          admin_notes: string | null
          affordability_score: number | null
          application_id: string
          approved_at: string | null
          assigned_to: string | null
          bond_payment_amount: number | null
          collection_fee: number | null
          company_id: string
          competitive_rate: number | null
          completed_at: string | null
          coupon_payment_amount: number | null
          created_at: string | null
          currency: string | null
          disbursement_fee: number | null
          dti_ratio: number | null
          employee_verification_id: string
          employment_info: Json | null
          fee_breakdown: Json | null
          funded_at: string | null
          id: string
          interest_rate: number | null
          kyc_verification_id: string | null
          loan_amount: number
          loan_purpose: string | null
          loan_term: number
          loan_term_months: number | null
          max_loan_amount: number | null
          max_loan_term: number | null
          min_loan_amount: number | null
          monthly_expenses: number | null
          monthly_income: number | null
          monthly_payment: number | null
          namfisa_compliant: boolean | null
          namfisa_levy: number | null
          net_income: number | null
          net_income_from_payslip: number | null
          payroll_deduction_amount: number | null
          payroll_deduction_start_date: string | null
          payslip_verification_date: string | null
          payslip_verification_notes: string | null
          payslip_verified: boolean | null
          remaining_balance: number | null
          risk_category: string | null
          serial_number: string | null
          stamp_duty: number | null
          status: string | null
          total_fees: number | null
          total_interest: number | null
          total_payable: number | null
          total_repayment: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          affordability_score?: number | null
          application_id: string
          approved_at?: string | null
          assigned_to?: string | null
          bond_payment_amount?: number | null
          collection_fee?: number | null
          company_id: string
          competitive_rate?: number | null
          completed_at?: string | null
          coupon_payment_amount?: number | null
          created_at?: string | null
          currency?: string | null
          disbursement_fee?: number | null
          dti_ratio?: number | null
          employee_verification_id: string
          employment_info?: Json | null
          fee_breakdown?: Json | null
          funded_at?: string | null
          id?: string
          interest_rate?: number | null
          kyc_verification_id?: string | null
          loan_amount: number
          loan_purpose?: string | null
          loan_term?: number
          loan_term_months?: number | null
          max_loan_amount?: number | null
          max_loan_term?: number | null
          min_loan_amount?: number | null
          monthly_expenses?: number | null
          monthly_income?: number | null
          monthly_payment?: number | null
          namfisa_compliant?: boolean | null
          namfisa_levy?: number | null
          net_income?: number | null
          net_income_from_payslip?: number | null
          payroll_deduction_amount?: number | null
          payroll_deduction_start_date?: string | null
          payslip_verification_date?: string | null
          payslip_verification_notes?: string | null
          payslip_verified?: boolean | null
          remaining_balance?: number | null
          risk_category?: string | null
          serial_number?: string | null
          stamp_duty?: number | null
          status?: string | null
          total_fees?: number | null
          total_interest?: number | null
          total_payable?: number | null
          total_repayment?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          affordability_score?: number | null
          application_id?: string
          approved_at?: string | null
          assigned_to?: string | null
          bond_payment_amount?: number | null
          collection_fee?: number | null
          company_id?: string
          competitive_rate?: number | null
          completed_at?: string | null
          coupon_payment_amount?: number | null
          created_at?: string | null
          currency?: string | null
          disbursement_fee?: number | null
          dti_ratio?: number | null
          employee_verification_id?: string
          employment_info?: Json | null
          fee_breakdown?: Json | null
          funded_at?: string | null
          id?: string
          interest_rate?: number | null
          kyc_verification_id?: string | null
          loan_amount?: number
          loan_purpose?: string | null
          loan_term?: number
          loan_term_months?: number | null
          max_loan_amount?: number | null
          max_loan_term?: number | null
          min_loan_amount?: number | null
          monthly_expenses?: number | null
          monthly_income?: number | null
          monthly_payment?: number | null
          namfisa_compliant?: boolean | null
          namfisa_levy?: number | null
          net_income?: number | null
          net_income_from_payslip?: number | null
          payroll_deduction_amount?: number | null
          payroll_deduction_start_date?: string | null
          payslip_verification_date?: string | null
          payslip_verification_notes?: string | null
          payslip_verified?: boolean | null
          remaining_balance?: number | null
          risk_category?: string | null
          serial_number?: string | null
          stamp_duty?: number | null
          status?: string | null
          total_fees?: number | null
          total_interest?: number | null
          total_payable?: number | null
          total_repayment?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "partner_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_applications_employee_verification_id_fkey"
            columns: ["employee_verification_id"]
            isOneToOne: false
            referencedRelation: "employee_verifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_applications_kyc_verification_id_fkey"
            columns: ["kyc_verification_id"]
            isOneToOne: false
            referencedRelation: "kyc_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_agreements: {
        Row: {
          agreement_data: Json
          agreement_date: string
          agreement_number: string
          borrower_ip_address: unknown | null
          borrower_signature_data: Json | null
          borrower_signature_date: string | null
          borrower_signature_image: string | null
          borrower_signature_name: string | null
          borrower_user_agent: string | null
          created_at: string | null
          google_drive_file_id: string | null
          id: string
          loan_application_id: string
          pdf_file_path: string | null
          pdf_generated: boolean | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agreement_data: Json
          agreement_date?: string
          agreement_number: string
          borrower_ip_address?: unknown | null
          borrower_signature_data?: Json | null
          borrower_signature_date?: string | null
          borrower_signature_image?: string | null
          borrower_signature_name?: string | null
          borrower_user_agent?: string | null
          created_at?: string | null
          google_drive_file_id?: string | null
          id?: string
          loan_application_id: string
          pdf_file_path?: string | null
          pdf_generated?: boolean | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agreement_data?: Json
          agreement_date?: string
          agreement_number?: string
          borrower_ip_address?: unknown | null
          borrower_signature_data?: Json | null
          borrower_signature_date?: string | null
          borrower_signature_image?: string | null
          borrower_signature_name?: string | null
          borrower_user_agent?: string | null
          created_at?: string | null
          google_drive_file_id?: string | null
          id?: string
          loan_application_id?: string
          pdf_file_path?: string | null
          pdf_generated?: boolean | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_loan_agreements_loan_application"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          id: string
          application_id: string
          user_id: string
          amount: number
          term_months: number
          interest_rate: number
          monthly_payment: number
          total_amount: number
          status: string
          disbursement_date: string | null
          maturity_date: string | null
          next_payment_date: string | null
          principal_balance: number
          interest_balance: number | null
          total_paid: number | null
          remaining_balance: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          application_id: string
          user_id: string
          amount: number
          term_months: number
          interest_rate: number
          monthly_payment: number
          total_amount: number
          status?: string
          disbursement_date?: string | null
          maturity_date?: string | null
          next_payment_date?: string | null
          principal_balance: number
          interest_balance?: number | null
          total_paid?: number | null
          remaining_balance: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          application_id?: string
          user_id?: string
          amount?: number
          term_months?: number
          interest_rate?: number
          monthly_payment?: number
          total_amount?: number
          status?: string
          disbursement_date?: string | null
          maturity_date?: string | null
          next_payment_date?: string | null
          principal_balance?: number
          interest_balance?: number | null
          total_paid?: number | null
          remaining_balance?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loans_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_companies: {
        Row: {
          active_borrowers: number | null
          admin_notes: string | null
          agreement_document_path: string | null
          agreement_expiry_date: string | null
          agreement_signed_date: string | null
          category: string | null
          city: string
          commission_rate: number | null
          company_name: string
          company_registration_number: string | null
          company_size: string | null
          compliance_status: string | null
          country: string | null
          created_at: string | null
          credit_limit: number | null
          current_exposure: number | null
          default_rate: number | null
          description: string | null
          eligible_departments: Json | null
          excluded_job_titles: Json | null
          featured: boolean | null
          id: string
          industry_sector: string | null
          interest_rate_override: number | null
          last_audit_date: string | null
          linkedin_url: string | null
          logo_url: string | null
          max_loan_amount: number | null
          max_loan_term_months: number | null
          minimum_monthly_salary: number | null
          minimum_tenure_months: number | null
          namfisa_approved: boolean | null
          next_audit_date: string | null
          next_payroll_date: string | null
          partnership_status: string | null
          partnership_tier: string | null
          payroll_frequency: string | null
          payroll_system: string | null
          postal_code: string
          primary_contact_email: string
          primary_contact_name: string
          primary_contact_phone: string | null
          secondary_contact_email: string | null
          secondary_contact_name: string | null
          state_province: string
          status: string | null
          street_address: string
          tax_identification_number: string | null
          total_employees: number | null
          total_loans_disbursed: number | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          active_borrowers?: number | null
          admin_notes?: string | null
          agreement_document_path?: string | null
          agreement_expiry_date?: string | null
          agreement_signed_date?: string | null
          category?: string | null
          city: string
          commission_rate?: number | null
          company_name: string
          company_registration_number?: string | null
          company_size?: string | null
          compliance_status?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          current_exposure?: number | null
          default_rate?: number | null
          description?: string | null
          eligible_departments?: Json | null
          excluded_job_titles?: Json | null
          featured?: boolean | null
          id?: string
          industry_sector?: string | null
          interest_rate_override?: number | null
          last_audit_date?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          max_loan_amount?: number | null
          max_loan_term_months?: number | null
          minimum_monthly_salary?: number | null
          minimum_tenure_months?: number | null
          namfisa_approved?: boolean | null
          next_audit_date?: string | null
          next_payroll_date?: string | null
          partnership_status?: string | null
          partnership_tier?: string | null
          payroll_frequency?: string | null
          payroll_system?: string | null
          postal_code: string
          primary_contact_email: string
          primary_contact_name: string
          primary_contact_phone?: string | null
          secondary_contact_email?: string | null
          secondary_contact_name?: string | null
          state_province: string
          status?: string | null
          street_address: string
          tax_identification_number?: string | null
          total_employees?: number | null
          total_loans_disbursed?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          active_borrowers?: number | null
          admin_notes?: string | null
          agreement_document_path?: string | null
          agreement_expiry_date?: string | null
          agreement_signed_date?: string | null
          category?: string | null
          city?: string
          commission_rate?: number | null
          company_name?: string
          company_registration_number?: string | null
          company_size?: string | null
          compliance_status?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          current_exposure?: number | null
          default_rate?: number | null
          description?: string | null
          eligible_departments?: Json | null
          excluded_job_titles?: Json | null
          featured?: boolean | null
          id?: string
          industry_sector?: string | null
          interest_rate_override?: number | null
          last_audit_date?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          max_loan_amount?: number | null
          max_loan_term_months?: number | null
          minimum_monthly_salary?: number | null
          minimum_tenure_months?: number | null
          namfisa_approved?: boolean | null
          next_audit_date?: string | null
          next_payroll_date?: string | null
          partnership_status?: string | null
          partnership_tier?: string | null
          payroll_frequency?: string | null
          payroll_system?: string | null
          postal_code?: string
          primary_contact_email?: string
          primary_contact_name?: string
          primary_contact_phone?: string | null
          secondary_contact_email?: string | null
          secondary_contact_name?: string | null
          state_province?: string
          status?: string | null
          street_address?: string
          tax_identification_number?: string | null
          total_employees?: number | null
          total_loans_disbursed?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string
          payment_method: string | null
          reference_number: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date: string
          payment_method?: string | null
          reference_number?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          reference_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          ai_insights: Json | null
          avatar_url: string | null
          behavioral_score: number | null
          can_access_admin_panel: boolean | null
          can_manage_compliance: boolean | null
          can_manage_loans: boolean | null
          can_manage_settings: boolean | null
          can_manage_super_admins: boolean | null
          can_manage_users: boolean | null
          can_view_analytics: boolean | null
          can_view_dashboard: boolean | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          email_notifications: boolean | null
          employment_status: string | null
          first_name: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          is_admin: boolean | null
          is_verified: boolean | null
          language: string | null
          last_login_at: string | null
          last_name: string | null
          middle_name_1: string | null
          middle_name_2: string | null
          middle_name_3: string | null
          middle_name_4: string | null
          monthly_income: number | null
          national_id: string | null
          phone: string | null
          preferred_name: string | null
          profile_embedding: string | null
          risk_profile_embedding: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          sms_notifications: boolean | null
          theme: string | null
          timezone: string | null
          two_factor_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          ai_insights?: Json | null
          avatar_url?: string | null
          behavioral_score?: number | null
          can_access_admin_panel?: boolean | null
          can_manage_compliance?: boolean | null
          can_manage_loans?: boolean | null
          can_manage_settings?: boolean | null
          can_manage_super_admins?: boolean | null
          can_manage_users?: boolean | null
          can_view_analytics?: boolean | null
          can_view_dashboard?: boolean | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          email_notifications?: boolean | null
          employment_status?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          is_admin?: boolean | null
          is_verified?: boolean | null
          language?: string | null
          last_login_at?: string | null
          last_name?: string | null
          middle_name_1?: string | null
          middle_name_2?: string | null
          middle_name_3?: string | null
          middle_name_4?: string | null
          monthly_income?: number | null
          national_id?: string | null
          phone?: string | null
          preferred_name?: string | null
          profile_embedding?: string | null
          risk_profile_embedding?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          sms_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          ai_insights?: Json | null
          avatar_url?: string | null
          behavioral_score?: number | null
          can_access_admin_panel?: boolean | null
          can_manage_compliance?: boolean | null
          can_manage_loans?: boolean | null
          can_manage_settings?: boolean | null
          can_manage_super_admins?: boolean | null
          can_manage_users?: boolean | null
          can_view_analytics?: boolean | null
          can_view_dashboard?: boolean | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          email_notifications?: boolean | null
          employment_status?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_admin?: boolean | null
          is_verified?: boolean | null
          language?: string | null
          last_login_at?: string | null
          last_name?: string | null
          middle_name_1?: string | null
          middle_name_2?: string | null
          middle_name_3?: string | null
          middle_name_4?: string | null
          monthly_income?: number | null
          national_id?: string | null
          phone?: string | null
          preferred_name?: string | null
          profile_embedding?: string | null
          risk_profile_embedding?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          sms_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_communications: {
        Row: {
          campaign_id: string | null
          content: string
          created_at: string
          customer_id: string | null
          delivered_at: string | null
          id: string
          loan_id: string | null
          message_type: string
          phone_number: string
          read_at: string | null
          sent_at: string
          status: string
          template_name: string | null
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          content: string
          created_at?: string
          customer_id?: string | null
          delivered_at?: string | null
          id?: string
          loan_id?: string | null
          message_type: string
          phone_number: string
          read_at?: string | null
          sent_at?: string
          status: string
          template_name?: string | null
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          content?: string
          created_at?: string
          customer_id?: string | null
          delivered_at?: string | null
          id?: string
          loan_id?: string | null
          message_type?: string
          phone_number?: string
          read_at?: string | null
          sent_at?: string
          status?: string
          template_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_analytics: {
        Row: {
          created_at: string
          date: string
          delivered_messages: number
          delivery_rate: number
          failed_messages: number
          failure_rate: number
          id: string
          read_messages: number
          read_rate: number
          sent_messages: number
          total_messages: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          delivered_messages?: number
          delivery_rate?: number
          failed_messages?: number
          failure_rate?: number
          id?: string
          read_messages?: number
          read_rate?: number
          sent_messages?: number
          total_messages?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          delivered_messages?: number
          delivery_rate?: number
          failed_messages?: number
          failure_rate?: number
          id?: string
          read_messages?: number
          read_rate?: number
          sent_messages?: number
          total_messages?: number
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_templates: {
        Row: {
          category: string
          components: Json
          created_at: string
          id: string
          language: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          category: string
          components: Json
          created_at?: string
          id?: string
          language: string
          name: string
          status: string
          updated_at?: string
        }
        Update: {
          category?: string
          components?: Json
          created_at?: string
          id?: string
          language?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      workflow_executions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          execution_data: Json | null
          id: string
          last_error: string | null
          max_retries: number | null
          next_retry_at: string | null
          retry_count: number | null
          started_at: string | null
          status: string
          updated_at: string | null
          workflow_name: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          execution_data?: Json | null
          id?: string
          last_error?: string | null
          max_retries?: number | null
          next_retry_at?: string | null
          retry_count?: number | null
          started_at?: string | null
          status: string
          updated_at?: string | null
          workflow_name: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          execution_data?: Json | null
          id?: string
          last_error?: string | null
          max_retries?: number | null
          next_retry_at?: string | null
          retry_count?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          workflow_name?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          address: Json | null
          assigned_to: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_contact_date: string | null
          last_name: string | null
          mobile: string | null
          next_follow_up: string | null
          notes: string | null
          phone: string | null
          position: string | null
          relationship_stage: string | null
          tags: string[] | null
          type: string
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          assigned_to?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_contact_date?: string | null
          last_name?: string | null
          mobile?: string | null
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          position?: string | null
          relationship_stage?: string | null
          tags?: string[] | null
          type: string
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          assigned_to?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_contact_date?: string | null
          last_name?: string | null
          mobile?: string | null
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          position?: string | null
          relationship_stage?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sales_pipelines: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          stages: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          stages: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          stages?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          actual_close_date: string | null
          assigned_to: string | null
          contact_id: string | null
          created_at: string | null
          expected_close_date: string | null
          id: string
          loss_reason: string | null
          name: string
          notes: string | null
          pipeline_id: string | null
          probability: number | null
          stage: string
          tags: string[] | null
          updated_at: string | null
          value: number | null
        }
        Insert: {
          actual_close_date?: string | null
          assigned_to?: string | null
          contact_id?: string | null
          created_at?: string | null
          expected_close_date?: string | null
          id?: string
          loss_reason?: string | null
          name: string
          notes?: string | null
          pipeline_id?: string | null
          probability?: number | null
          stage: string
          tags?: string[] | null
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          actual_close_date?: string | null
          assigned_to?: string | null
          contact_id?: string | null
          created_at?: string | null
          expected_close_date?: string | null
          id?: string
          loss_reason?: string | null
          name?: string
          notes?: string | null
          pipeline_id?: string | null
          probability?: number | null
          stage?: string
          tags?: string[] | null
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "sales_pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_relationships: {
        Row: {
          average_loan_amount: number | null
          churn_probability: number | null
          communication_preferences: Json | null
          created_at: string | null
          customer_id: string
          customer_lifetime_value: number | null
          id: string
          last_loan_date: string | null
          next_loan_probability: number | null
          notes: string | null
          preferred_contact_time: string | null
          relationship_score: number | null
          relationship_stage: string
          satisfaction_score: number | null
          total_amount_borrowed: number | null
          total_amount_repaid: number | null
          total_loans: number | null
          updated_at: string | null
        }
        Insert: {
          average_loan_amount?: number | null
          churn_probability?: number | null
          communication_preferences?: Json | null
          created_at?: string | null
          customer_id: string
          customer_lifetime_value?: number | null
          id?: string
          last_loan_date?: string | null
          next_loan_probability?: number | null
          notes?: string | null
          preferred_contact_time?: string | null
          relationship_score?: number | null
          relationship_stage: string
          satisfaction_score?: number | null
          total_amount_borrowed?: number | null
          total_amount_repaid?: number | null
          total_loans?: number | null
          updated_at?: string | null
        }
        Update: {
          average_loan_amount?: number | null
          churn_probability?: number | null
          communication_preferences?: Json | null
          created_at?: string | null
          customer_id?: string
          customer_lifetime_value?: number | null
          id?: string
          last_loan_date?: string | null
          next_loan_probability?: number | null
          notes?: string | null
          preferred_contact_time?: string | null
          relationship_score?: number | null
          relationship_stage?: string
          satisfaction_score?: number | null
          total_amount_borrowed?: number | null
          total_amount_repaid?: number | null
          total_loans?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_to: string | null
          conversion_probability: number | null
          created_at: string | null
          first_contact_date: string | null
          id: string
          last_activity_date: string | null
          lead_score: number | null
          lead_source: string
          next_follow_up_date: string | null
          notes: string | null
          qualification_data: Json | null
          referral_source: string | null
          source_details: Json | null
          status: string
          updated_at: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          assigned_to?: string | null
          conversion_probability?: number | null
          created_at?: string | null
          first_contact_date?: string | null
          id?: string
          last_activity_date?: string | null
          lead_score?: number | null
          lead_source: string
          next_follow_up_date?: string | null
          notes?: string | null
          qualification_data?: Json | null
          referral_source?: string | null
          source_details?: Json | null
          status: string
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          assigned_to?: string | null
          conversion_probability?: number | null
          created_at?: string | null
          first_contact_date?: string | null
          id?: string
          last_activity_date?: string | null
          lead_score?: number | null
          lead_source?: string
          next_follow_up_date?: string | null
          notes?: string | null
          qualification_data?: Json | null
          referral_source?: string | null
          source_details?: Json | null
          status?: string
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          id: string
          user_id: string
          application_id: string | null
          type: string
          name: string
          file_path: string
          file_size: number | null
          mime_type: string | null
          status: string
          uploaded_at: string | null
          processed_at: string | null
          ai_confidence_score: number | null
          ai_analysis: Json | null
          rejection_reason: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          application_id?: string | null
          type: string
          name: string
          file_path: string
          file_size?: number | null
          mime_type?: string | null
          status?: string
          uploaded_at?: string | null
          processed_at?: string | null
          ai_confidence_score?: number | null
          ai_analysis?: Json | null
          rejection_reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          application_id?: string | null
          type?: string
          name?: string
          file_path?: string
          file_size?: number | null
          mime_type?: string | null
          status?: string
          uploaded_at?: string | null
          processed_at?: string | null
          ai_confidence_score?: number | null
          ai_analysis?: Json | null
          rejection_reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_dashboard_stats: {
        Row: {
          approved_loans: number | null
          last_application_date: string | null
          pending_loans: number | null
          rejected_loans: number | null
          total_approved_amount: number | null
          user_id: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          is_admin: boolean | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_crm_dashboard_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      calculate_partner_health_score: {
        Args: { p_partner_id: string }
        Returns: number
      }
      send_whatsapp_template: {
        Args: {
          template_name: string
          phone_number: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      admin_role_enum: "super_admin" | "admin" | "analyst" | "support"
      document_type_enum: "passport" | "drivers_license" | "national_id" | "utility_bill" | "bank_statement" | "pay_stub" | "tax_return" | "employment_letter" | "other"
      task_status: "todo" | "doing" | "review" | "done"
      user_role: "user" | "admin" | "super_admin"
      verification_status_enum: "pending" | "in_progress" | "verified" | "rejected" | "requires_review"
      verification_type_enum: "identity" | "address" | "income" | "employment" | "banking" | "credit_check" | "kyc_aml"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role_enum: ["super_admin", "admin", "analyst", "support"],
      document_type_enum: [
        "passport",
        "drivers_license",
        "national_id",
        "utility_bill",
        "bank_statement",
        "pay_stub",
        "tax_return",
        "employment_letter",
        "other",
      ],
      task_status: ["todo", "doing", "review", "done"],
      user_role: ["user", "admin", "super_admin"],
      verification_status_enum: [
        "pending",
        "in_progress",
        "verified",
        "rejected",
        "requires_review",
      ],
      verification_type_enum: [
        "identity",
        "address",
        "income",
        "employment",
        "banking",
        "credit_check",
        "kyc_aml",
      ],
    },
  },
} as const

// Type aliases for easier usage (using the generated types above)

// Specific type exports for common tables
export type PartnerCompany = Tables<'partner_companies'>
export type PartnerCompanyInsert = TablesInsert<'partner_companies'>
export type PartnerCompanyUpdate = TablesUpdate<'partner_companies'>

export type LoanApplication = Tables<'loan_applications'>
export type LoanApplicationInsert = TablesInsert<'loan_applications'>
export type LoanApplicationUpdate = TablesUpdate<'loan_applications'>

export type LoanAgreement = Tables<'loan_agreements'>
export type LoanAgreementInsert = TablesInsert<'loan_agreements'>
export type LoanAgreementUpdate = TablesUpdate<'loan_agreements'>

export type Loan = Tables<'loans'>
export type LoanInsert = TablesInsert<'loans'>
export type LoanUpdate = TablesUpdate<'loans'>

export type Payment = Tables<'payments'>
export type PaymentInsert = TablesInsert<'payments'>
export type PaymentUpdate = TablesUpdate<'payments'>

export type Profile = Tables<'profiles'>
export type ProfileInsert = TablesInsert<'profiles'>
export type ProfileUpdate = TablesUpdate<'profiles'>

export type AdminProfile = Tables<'admin_profiles'>
export type AdminProfileInsert = TablesInsert<'admin_profiles'>
export type AdminProfileUpdate = TablesUpdate<'admin_profiles'>

export type CustomerCommunication = Tables<'customer_communications'>
export type CustomerCommunicationInsert = TablesInsert<'customer_communications'>
export type CustomerCommunicationUpdate = TablesUpdate<'customer_communications'>

export type WhatsAppAnalytics = Tables<'whatsapp_analytics'>
export type WhatsAppAnalyticsInsert = TablesInsert<'whatsapp_analytics'>
export type WhatsAppAnalyticsUpdate = TablesUpdate<'whatsapp_analytics'>

export type WhatsAppTemplate = Tables<'whatsapp_templates'>
export type WhatsAppTemplateInsert = TablesInsert<'whatsapp_templates'>
export type WhatsAppTemplateUpdate = TablesUpdate<'whatsapp_templates'>

export type WorkflowExecution = Tables<'workflow_executions'>
export type WorkflowExecutionInsert = TablesInsert<'workflow_executions'>
export type WorkflowExecutionUpdate = TablesUpdate<'workflow_executions'>

export type Contact = Tables<'contacts'>
export type ContactInsert = TablesInsert<'contacts'>
export type ContactUpdate = TablesUpdate<'contacts'>

export type SalesPipeline = Tables<'sales_pipelines'>
export type SalesPipelineInsert = TablesInsert<'sales_pipelines'>
export type SalesPipelineUpdate = TablesUpdate<'sales_pipelines'>

export type Deal = Tables<'deals'>
export type DealInsert = TablesInsert<'deals'>
export type DealUpdate = TablesUpdate<'deals'>

export type CustomerRelationship = Tables<'customer_relationships'>
export type CustomerRelationshipInsert = TablesInsert<'customer_relationships'>
export type CustomerRelationshipUpdate = TablesUpdate<'customer_relationships'>

export type Lead = Tables<'leads'>
export type LeadInsert = TablesInsert<'leads'>
export type LeadUpdate = TablesUpdate<'leads'>

export type KycDocument = Tables<'kyc_documents'>
export type KycDocumentInsert = TablesInsert<'kyc_documents'>
export type KycDocumentUpdate = TablesUpdate<'kyc_documents'>

// Dashboard Stats Type
export type DashboardStats = {
  totalLoans: number
  activeLoans: number
  totalBorrowed: number
  totalRepaid: number
  outstandingBalance: number
  nextPaymentDue?: {
    amount: number
    dueDate: string
  }
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp: Date
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

// Re-export unified types
export * from './types/unified'