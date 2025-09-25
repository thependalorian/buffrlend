/**
 * CRM Integration Layer
 * 
 * This module handles the integration between the existing loan application system
 * and the new CRM tables. It ensures real-time synchronization of data.
 */

import { createClient } from '@/lib/supabase/client';

export class CRMIntegration {
  private getSupabaseClient = async () => await createClient();

  /**
   * Sync loan application status changes to CRM tables
   */
  async syncLoanApplicationStatus(
    applicationId: string,
    userId: string,
    oldStatus: string,
    newStatus: string,
    additionalData?: unknown
  ) {
    try {
      // Update customer journey
      await this.updateCustomerJourney(userId, newStatus, additionalData);
      
      // Update customer relationship
      await this.updateCustomerRelationship(userId, newStatus);
      
      // Create communication record
      await this.createStatusChangeCommunication(userId, oldStatus, newStatus);
      
      // Update lead status if applicable
      await this.updateLeadStatus(userId, newStatus);
      
      console.log(`CRM sync completed for application ${applicationId}`);
    } catch (error) {
      console.error('Error syncing loan application status:', error);
      throw error;
    }
  }

  /**
   * Update customer journey when application status changes
   */
  private async updateCustomerJourney(
    userId: string,
    newStatus: string,
    additionalData?: unknown
  ) {
    const supabase = await this.getSupabaseClient();
    
    const stageMapping = {
      'draft': 'interest',
      'submitted': 'application',
      'under_review': 'kyc',
      'approved': 'approval',
      'funded': 'disbursement',
      'active': 'active_loan',
      'completed': 'completion',
      'rejected': 'completion'
    };

    const stage = stageMapping[newStatus as keyof typeof stageMapping];
    if (!stage) return;

    // Check if customer is already in this stage
    const { data: existingJourney } = await supabase
      .from('customer_journey')
      .select('*')
      .eq('customer_id', userId)
      .eq('stage', stage)
      .is('stage_exit_date', null)
      .single();

    if (existingJourney) return; // Already in this stage

    // Exit current stage
    await supabase
      .from('customer_journey')
      .update({ 
        stage_exit_date: new Date().toISOString(),
        time_in_stage_hours: this.calculateTimeInStage(existingJourney?.stage_entry_date)
      })
      .eq('customer_id', userId)
      .is('stage_exit_date', null);

    // Enter new stage
    await supabase
      .from('customer_journey')
      .insert({
        customer_id: userId,
        stage: stage,
        stage_entry_date: new Date().toISOString(),
        stage_metrics: additionalData || {}
      });
  }

  /**
   * Update customer relationship based on application status
   */
  private async updateCustomerRelationship(
    userId: string,
    newStatus: string
  ) {
    const relationshipStageMapping = {
      'draft': 'prospect',
      'submitted': 'applicant',
      'under_review': 'applicant',
      'approved': 'customer',
      'funded': 'customer',
      'active': 'customer',
      'completed': 'customer',
      'rejected': 'prospect'
    };

    const relationshipStage = relationshipStageMapping[newStatus as keyof typeof relationshipStageMapping];
    if (!relationshipStage) return;

    // Check if relationship record exists
    const supabase = await this.getSupabaseClient();
    const { data: existingRelationship } = await supabase
      .from('customer_relationships')
      .select('*')
      .eq('customer_id', userId)
      .single();

    if (existingRelationship) {
      // Update existing relationship
      await supabase
        .from('customer_relationships')
        .update({
          relationship_stage: relationshipStage,
          updated_at: new Date().toISOString()
        })
        .eq('customer_id', userId);
    } else {
      // Create new relationship record
      await supabase
        .from('customer_relationships')
        .insert({
          customer_id: userId,
          relationship_stage: relationshipStage,
          relationship_score: this.calculateInitialRelationshipScore(newStatus),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }
  }

  /**
   * Create communication record for status changes
   */
  private async createStatusChangeCommunication(
    userId: string,
    oldStatus: string,
    newStatus: string
  ) {
    const messageTemplates = {
      'submitted': {
        type: 'application_update',
        subject: 'Application Received',
        content: 'Thank you for submitting your loan application. We are now reviewing your documents.'
      },
      'under_review': {
        type: 'application_update',
        subject: 'Application Under Review',
        content: 'Your application is now under review. We will notify you of the decision soon.'
      },
      'approved': {
        type: 'application_update',
        subject: 'Application Approved!',
        content: 'Congratulations! Your loan application has been approved. Funds will be disbursed shortly.'
      },
      'rejected': {
        type: 'application_update',
        subject: 'Application Update',
        content: 'We have reviewed your application. Unfortunately, we cannot approve it at this time.'
      },
      'funded': {
        type: 'application_update',
        subject: 'Funds Disbursed',
        content: 'Your loan has been disbursed successfully. Check your account for the funds.'
      }
    };

    const template = messageTemplates[newStatus as keyof typeof messageTemplates];
    if (!template) return;

    const supabase = await this.getSupabaseClient();
      await supabase
      .from('communications')
      .insert({
        customer_id: userId,
        channel: 'dashboard',
        direction: 'outbound',
        message_type: template.type,
        subject: template.subject,
        message_content: template.content,
        status: 'sent',
        created_at: new Date().toISOString()
      });
  }

  /**
   * Update lead status based on application progress
   */
  private async updateLeadStatus(userId: string, newStatus: string) {
    const leadStatusMapping = {
      'submitted': 'qualified',
      'approved': 'converted',
      'rejected': 'unqualified'
    };

    const leadStatus = leadStatusMapping[newStatus as keyof typeof leadStatusMapping];
    if (!leadStatus) return;

    const supabase = await this.getSupabaseClient();
      await supabase
      .from('leads')
      .update({
        status: leadStatus,
        updated_at: new Date().toISOString()
      })
      .eq('customer_id', userId);
  }

  /**
   * Calculate time spent in a stage
   */
  private calculateTimeInStage(entryDate?: string): number | null {
    if (!entryDate) return null;
    
    const entry = new Date(entryDate);
    const now = new Date();
    const diffMs = now.getTime() - entry.getTime();
    return Math.round(diffMs / (1000 * 60 * 60)); // Convert to hours
  }

  /**
   * Calculate initial relationship score based on status
   */
  private calculateInitialRelationshipScore(status: string): number {
    const scoreMapping = {
      'draft': 20,
      'submitted': 40,
      'under_review': 50,
      'approved': 80,
      'funded': 90,
      'active': 85,
      'completed': 95,
      'rejected': 10
    };

    return scoreMapping[status as keyof typeof scoreMapping] || 0;
  }

  /**
   * Sync new customer data to CRM
   */
  async syncNewCustomer(userId: string) {
    try {
      const supabase = await this.getSupabaseClient();
      
      // Create customer relationship record
      await supabase
        .from('customer_relationships')
        .insert({
          customer_id: userId,
          relationship_stage: 'prospect',
          relationship_score: 10,
          communication_preferences: {
            email: true,
            whatsapp: true,
            sms: false
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      // Create initial journey stage
      await supabase
        .from('customer_journey')
        .insert({
          customer_id: userId,
          stage: 'awareness',
          stage_entry_date: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      // Create welcome communication
      await supabase
        .from('communications')
        .insert({
          customer_id: userId,
          channel: 'email',
          direction: 'outbound',
          message_type: 'welcome',
          subject: 'Welcome to Buffr Lend!',
          message_content: 'Thank you for joining Buffr Lend. We are here to help with your financial needs.',
          status: 'sent',
          created_at: new Date().toISOString()
        });

      console.log(`New customer synced to CRM: ${userId}`);
    } catch (error) {
      console.error('Error syncing new customer:', error);
      throw error;
    }
  }

  /**
   * Update customer health score
   */
  async updateCustomerHealthScore(userId: string) {
    try {
      const supabase = await this.getSupabaseClient();
      
      // Use the database function we created
      const { data: healthScore, error } = await supabase
        .rpc('calculate_customer_health_score', { customer_uuid: userId });

      if (error) throw error;

      // Update customer relationship with new health score
      await supabase
        .from('customer_relationships')
        .update({
          relationship_score: healthScore,
          updated_at: new Date().toISOString()
        })
        .eq('customer_id', userId);

      // Store health score history
      await supabase
        .from('customer_health_scores')
        .insert({
          customer_id: userId,
          health_score: healthScore,
          score_components: {
            payment_history: 0, // This would be calculated
            engagement: 0,
            relationship: 0
          },
          calculated_at: new Date().toISOString()
        });

      return healthScore;
    } catch (error) {
      console.error('Error updating customer health score:', error);
      throw error;
    }
  }

  /**
   * Sync partner performance metrics
   */
  async syncPartnerPerformance(partnerId: string, startDate: Date, endDate: Date) {
    try {
      const supabase = await this.getSupabaseClient();
      
      // Use the database function we created
      const { data: performanceData, error } = await supabase
        .rpc('calculate_partner_performance', {
          partner_uuid: partnerId,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        });

      if (error) throw error;

      // Store performance metrics
      await supabase
        .from('partner_performance_metrics')
        .insert({
          partner_id: partnerId,
          metric_period_start: startDate.toISOString().split('T')[0],
          metric_period_end: endDate.toISOString().split('T')[0],
          total_employees: performanceData.total_employees,
          active_borrowers: performanceData.active_borrowers,
          utilization_rate: performanceData.utilization_rate,
          application_volume: performanceData.total_applications,
          approval_rate: performanceData.approval_rate,
          default_rate: performanceData.default_rate,
          total_loan_volume: performanceData.total_loan_volume,
          average_loan_amount: performanceData.average_loan_amount,
          created_at: new Date().toISOString()
        });

      return performanceData;
    } catch (error) {
      console.error('Error syncing partner performance:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const crmIntegration = new CRMIntegration();
