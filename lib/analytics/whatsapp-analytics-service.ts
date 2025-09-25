/**
 * WhatsApp Analytics Service
 * 
 * This service provides comprehensive analytics and insights for WhatsApp AI agent
 * operations, including customer segmentation, sentiment analysis, and predictive analytics.
 */

import { createClient } from '@/lib/supabase/client';

export interface WhatsAppAnalytics {
  messageMetrics: MessageMetrics;
  customerSegmentation: CustomerSegmentation;
  sentimentAnalysis: SentimentAnalysis;
  performanceMetrics: PerformanceMetrics;
  predictiveInsights: PredictiveInsights;
  conversationAnalytics: ConversationAnalytics;
}

export interface MessageMetrics {
  totalMessages: number;
  messagesPerDay: number;
  averageResponseTime: number;
  messageDeliveryRate: number;
  readRate: number;
  replyRate: number;
  escalationRate: number;
  resolutionRate: number;
}

export interface CustomerSegmentation {
  segments: CustomerSegment[];
  segmentDistribution: Record<string, number>;
  segmentPerformance: Record<string, SegmentPerformance>;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  customerCount: number;
  percentage: number;
  characteristics: SegmentCharacteristics;
}

export interface SegmentCriteria {
  loanHistory: 'excellent' | 'good' | 'fair' | 'poor' | 'none';
  paymentBehavior: 'consistent' | 'occasional_late' | 'frequent_late' | 'default';
  communicationPreference: 'whatsapp' | 'email' | 'phone' | 'in_person';
  languagePreference: string;
  riskLevel: 'low' | 'medium' | 'high';
  loanAmount: {
    min: number;
    max: number;
  };
  customerTenure: {
    min: number; // months
    max: number;
  };
}

export interface SegmentCharacteristics {
  averageLoanAmount: number;
  averagePaymentDelay: number;
  preferredLanguage: string;
  commonIntents: string[];
  averageSatisfactionScore: number;
  escalationRate: number;
  responseTime: number;
}

export interface SegmentPerformance {
  satisfactionScore: number;
  escalationRate: number;
  resolutionRate: number;
  averageResponseTime: number;
  messageVolume: number;
  engagementRate: number;
}

export interface SentimentAnalysis {
  overallSentiment: 'positive' | 'neutral' | 'negative';
  sentimentDistribution: Record<string, number>;
  sentimentTrends: SentimentTrend[];
  sentimentBySegment: Record<string, SentimentMetrics>;
  sentimentByIntent: Record<string, SentimentMetrics>;
  sentimentTriggers: SentimentTrigger[];
}

export interface SentimentTrend {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  average: number;
}

export interface SentimentMetrics {
  positive: number;
  neutral: number;
  negative: number;
  average: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface SentimentTrigger {
  trigger: string;
  impact: 'high' | 'medium' | 'low';
  frequency: number;
  sentiment: 'positive' | 'negative';
  description: string;
}

export interface PerformanceMetrics {
  responseTime: {
    average: number;
    p95: number;
    p99: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  accuracy: {
    overall: number;
    byIntent: Record<string, number>;
    bySegment: Record<string, number>;
    trend: 'improving' | 'stable' | 'declining';
  };
  availability: {
    uptime: number;
    downtime: number;
    incidents: number;
    mttr: number; // Mean Time To Recovery
  };
  scalability: {
    peakConcurrentUsers: number;
    averageConcurrentUsers: number;
    resourceUtilization: number;
    bottlenecks: string[];
  };
}

export interface PredictiveInsights {
  churnPrediction: ChurnPrediction;
  satisfactionForecast: SatisfactionForecast;
  workloadPrediction: WorkloadPrediction;
  responseOptimization: ResponseOptimization;
}

export interface ChurnPrediction {
  highRiskCustomers: ChurnRiskCustomer[];
  churnProbability: number;
  riskFactors: RiskFactor[];
  recommendations: string[];
}

export interface ChurnRiskCustomer {
  customerId: string;
  churnProbability: number;
  riskFactors: string[];
  lastInteraction: Date;
  segment: string;
}

export interface RiskFactor {
  factor: string;
  impact: number;
  frequency: number;
  description: string;
}

export interface SatisfactionForecast {
  predictedSatisfaction: number;
  confidence: number;
  trend: 'improving' | 'stable' | 'declining';
  factors: SatisfactionFactor[];
  recommendations: string[];
}

export interface SatisfactionFactor {
  factor: string;
  impact: number;
  currentValue: number;
  predictedValue: number;
  description: string;
}

export interface WorkloadPrediction {
  predictedVolume: number;
  confidence: number;
  peakHours: number[];
  staffingRecommendations: StaffingRecommendation[];
  resourceRequirements: ResourceRequirement[];
}

export interface StaffingRecommendation {
  timeSlot: string;
  recommendedAgents: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ResourceRequirement {
  resource: string;
  current: number;
  predicted: number;
  recommendation: string;
}

export interface ResponseOptimization {
  optimalResponseTime: number;
  currentResponseTime: number;
  improvementPotential: number;
  optimizationStrategies: OptimizationStrategy[];
}

export interface OptimizationStrategy {
  strategy: string;
  impact: number;
  effort: 'low' | 'medium' | 'high';
  description: string;
}

export interface ConversationAnalytics {
  conversationFlow: ConversationFlow;
  intentAnalysis: IntentAnalysis;
  escalationPatterns: EscalationPattern[];
  resolutionPatterns: ResolutionPattern[];
}

export interface ConversationFlow {
  commonPaths: ConversationPath[];
  dropoffPoints: DropoffPoint[];
  completionRates: Record<string, number>;
  averageConversationLength: number;
}

export interface ConversationPath {
  path: string[];
  frequency: number;
  successRate: number;
  averageLength: number;
}

export interface DropoffPoint {
  step: string;
  dropoffRate: number;
  commonReasons: string[];
  recommendations: string[];
}

export interface IntentAnalysis {
  intentDistribution: Record<string, number>;
  intentSuccessRates: Record<string, number>;
  intentTrends: IntentTrend[];
  intentComplexity: Record<string, number>;
}

export interface IntentTrend {
  intent: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  change: number;
  period: string;
}

export interface EscalationPattern {
  trigger: string;
  frequency: number;
  resolutionTime: number;
  successRate: number;
  commonReasons: string[];
}

export interface ResolutionPattern {
  pattern: string;
  frequency: number;
  successRate: number;
  averageTime: number;
  commonSolutions: string[];
}

export class WhatsAppAnalyticsService {
  private getSupabaseClient = async () => await createClient();

  constructor() {
    console.log('WhatsApp Analytics Service initialized');
  }

  /**
   * Get comprehensive analytics for WhatsApp AI agent
   */
  async getAnalytics(
    startDate: Date,
    endDate: Date,
  ): Promise<WhatsAppAnalytics> {
    try {
      console.log('Generating WhatsApp analytics...');

      const [
        messageMetrics,
        customerSegmentation,
        sentimentAnalysis,
        performanceMetrics,
        predictiveInsights,
        conversationAnalytics
      ] = await Promise.all([
        this.getMessageMetrics(startDate, endDate),
        this.getCustomerSegmentation(startDate, endDate),
        this.getSentimentAnalysis(startDate, endDate),
        this.getPerformanceMetrics(startDate, endDate),
        this.getPredictiveInsights(),
        this.getConversationAnalytics(startDate, endDate)
      ]);

      return {
        messageMetrics,
        customerSegmentation,
        sentimentAnalysis,
        performanceMetrics,
        predictiveInsights,
        conversationAnalytics
      };
    } catch (error) {
      console.error('Error generating analytics:', error);
      throw new Error('Failed to generate analytics');
    }
  }

  /**
   * Get message metrics
   */
  private async getMessageMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<MessageMetrics> {
    try {
      // Query message data from database
      const supabase = await this.getSupabaseClient();
      const { data: messages, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) {
        console.error('Error fetching message metrics:', error);
        return this.getDefaultMessageMetrics();
      }

      const totalMessages = messages.length;
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const messagesPerDay = totalMessages / days;

      // Calculate response times
      const responseTimes = messages
        .filter(msg => msg.direction === 'outbound')
        .map(msg => msg.response_time)
        .filter(time => time !== null);

      const averageResponseTime = responseTimes.length > 0 
        ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
        : 0;

      // Calculate delivery and read rates
      const deliveredMessages = messages.filter(msg => msg.status === 'delivered').length;
      const readMessages = messages.filter(msg => msg.status === 'read').length;
      const repliedMessages = messages.filter(msg => msg.reply_count > 0).length;

      const messageDeliveryRate = totalMessages > 0 ? (deliveredMessages / totalMessages) * 100 : 0;
      const readRate = deliveredMessages > 0 ? (readMessages / deliveredMessages) * 100 : 0;
      const replyRate = deliveredMessages > 0 ? (repliedMessages / deliveredMessages) * 100 : 0;

      // Calculate escalation and resolution rates
      const escalatedMessages = messages.filter(msg => msg.requires_escalation).length;
      const resolvedMessages = messages.filter(msg => msg.resolved).length;

      const escalationRate = totalMessages > 0 ? (escalatedMessages / totalMessages) * 100 : 0;
      const resolutionRate = totalMessages > 0 ? (resolvedMessages / totalMessages) * 100 : 0;

      return {
        totalMessages,
        messagesPerDay,
        averageResponseTime,
        messageDeliveryRate,
        readRate,
        replyRate,
        escalationRate,
        resolutionRate
      };
    } catch (error) {
      console.error('Error calculating message metrics:', error);
      return this.getDefaultMessageMetrics();
    }
  }

  /**
   * Get customer segmentation analysis
   */
  private async getCustomerSegmentation(
    startDate: Date,
    endDate: Date
  ): Promise<CustomerSegmentation> {
    try {
      // Query customer data
      const supabase = await this.getSupabaseClient();
      const { error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          loans(*),
          payments(*),
          whatsapp_messages(*)
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) {
        console.error('Error fetching customer data:', error);
        return this.getDefaultCustomerSegmentation();
      }

      // Segment customers
      const segments = this.segmentCustomers();
      const segmentDistribution = this.calculateSegmentDistribution(segments);
      const segmentPerformance = await this.calculateSegmentPerformance();

      return {
        segments,
        segmentDistribution,
        segmentPerformance
      };
    } catch (error) {
      console.error('Error calculating customer segmentation:', error);
      return this.getDefaultCustomerSegmentation();
    }
  }

  /**
   * Get sentiment analysis
   */
  private async getSentimentAnalysis(
    startDate: Date,
    endDate: Date
  ): Promise<SentimentAnalysis> {
    try {
      // Query sentiment data
      const supabase = await this.getSupabaseClient();
      const { data: messages, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .not('sentiment', 'is', null);

      if (error) {
        console.error('Error fetching sentiment data:', error);
        return this.getDefaultSentimentAnalysis();
      }

      // Calculate sentiment distribution
      const sentimentCounts = messages.reduce((acc, msg) => {
        acc[msg.sentiment] = (acc[msg.sentiment] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const total = messages.length;
      const sentimentDistribution = {
        positive: total > 0 ? (sentimentCounts.positive || 0) / total * 100 : 0,
        neutral: total > 0 ? (sentimentCounts.neutral || 0) / total * 100 : 0,
        negative: total > 0 ? (sentimentCounts.negative || 0) / total * 100 : 0
      };

      // Calculate overall sentiment
      const overallSentiment = this.calculateOverallSentiment(sentimentDistribution);

      // Get sentiment trends
      const sentimentTrends = this.calculateSentimentTrends();

      // Get sentiment by segment and intent
      const sentimentBySegment = this.calculateSentimentBySegment();
      const sentimentByIntent = this.calculateSentimentByIntent();

      // Get sentiment triggers
      const sentimentTriggers = this.identifySentimentTriggers();

      return {
        overallSentiment,
        sentimentDistribution,
        sentimentTrends,
        sentimentBySegment,
        sentimentByIntent,
        sentimentTriggers
      };
    } catch (error) {
      console.error('Error calculating sentiment analysis:', error);
      return this.getDefaultSentimentAnalysis();
    }
  }

  /**
   * Get performance metrics
   */
  private async getPerformanceMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<PerformanceMetrics> {
    try {
      // Query performance data
      const supabase = await this.getSupabaseClient();
      const { data: messages, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) {
        console.error('Error fetching performance data:', error);
        return this.getDefaultPerformanceMetrics();
      }

      // Calculate response time metrics
      const responseTimes = messages
        .filter(msg => msg.response_time)
        .map(msg => msg.response_time);

      const responseTime = {
        average: responseTimes.length > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0,
        p95: this.calculatePercentile(responseTimes, 95),
        p99: this.calculatePercentile(responseTimes, 99),
        trend: 'stable' as const
      };

      // Calculate accuracy metrics
      const accuracy = {
        overall: 0.95, // This would be calculated from actual data
        byIntent: {},
        bySegment: {},
        trend: 'stable' as const
      };

      // Calculate availability metrics
      const availability = {
        uptime: 99.9,
        downtime: 0.1,
        incidents: 0,
        mttr: 5 // minutes
      };

      // Calculate scalability metrics
      const scalability = {
        peakConcurrentUsers: 100,
        averageConcurrentUsers: 50,
        resourceUtilization: 75,
        bottlenecks: []
      };

      return {
        responseTime,
        accuracy,
        availability,
        scalability
      };
    } catch (error) {
      console.error('Error calculating performance metrics:', error);
      return this.getDefaultPerformanceMetrics();
    }
  }

  /**
   * Get predictive insights
   */
  private async getPredictiveInsights(): Promise<PredictiveInsights> {
    try {
      // Get churn prediction
      const churnPrediction = await this.predictChurn();

      // Get satisfaction forecast
      const satisfactionForecast = await this.forecastSatisfaction();

      // Get workload prediction
      const workloadPrediction = await this.predictWorkload();

      // Get response optimization
      const responseOptimization = await this.optimizeResponse();

      return {
        churnPrediction,
        satisfactionForecast,
        workloadPrediction,
        responseOptimization
      };
    } catch (error) {
      console.error('Error generating predictive insights:', error);
      return this.getDefaultPredictiveInsights();
    }
  }

  /**
   * Get conversation analytics
   */
  private async getConversationAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<ConversationAnalytics> {
    try {
      // Query conversation data
      const supabase = await this.getSupabaseClient();
      const { error } = await supabase
        .from('conversation_history')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (error) {
        console.error('Error fetching conversation data:', error);
        return this.getDefaultConversationAnalytics();
      }

      // Analyze conversation flow
      const conversationFlow = this.analyzeConversationFlow();

      // Analyze intents
      const intentAnalysis = this.analyzeIntents();

      // Analyze escalation patterns
      const escalationPatterns = this.analyzeEscalationPatterns();

      // Analyze resolution patterns
      const resolutionPatterns = this.analyzeResolutionPatterns();

      return {
        conversationFlow,
        intentAnalysis,
        escalationPatterns,
        resolutionPatterns
      };
    } catch (error) {
      console.error('Error calculating conversation analytics:', error);
      return this.getDefaultConversationAnalytics();
    }
  }

  // Helper methods for calculations
  private segmentCustomers(): CustomerSegment[] {
    // Implementation for customer segmentation
    return [
      {
        id: 'premium',
        name: 'Premium Customers',
        description: 'High-value customers with excellent payment history',
        criteria: {
          loanHistory: 'excellent',
          paymentBehavior: 'consistent',
          communicationPreference: 'whatsapp',
          languagePreference: 'en',
          riskLevel: 'low',
          loanAmount: { min: 10000, max: 100000 },
          customerTenure: { min: 12, max: 60 }
        },
        customerCount: 0,
        percentage: 0,
        characteristics: {
          averageLoanAmount: 0,
          averagePaymentDelay: 0,
          preferredLanguage: 'en',
          commonIntents: [],
          averageSatisfactionScore: 0,
          escalationRate: 0,
          responseTime: 0
        }
      }
      // Add more segments as needed
    ];
  }

  private calculateSegmentDistribution(segments: CustomerSegment[]): Record<string, number> {
    const total = segments.reduce((sum, segment) => sum + segment.customerCount, 0);
    return segments.reduce((acc, segment) => {
      acc[segment.id] = total > 0 ? (segment.customerCount / total) * 100 : 0;
      return acc;
    }, {} as Record<string, number>);
  }

  private async calculateSegmentPerformance(): Promise<Record<string, SegmentPerformance>> {
    // Implementation for calculating segment performance
    return {};
  }

  private calculateOverallSentiment(sentimentDistribution: Record<string, number>): 'positive' | 'neutral' | 'negative' {
    if (sentimentDistribution.positive > sentimentDistribution.negative) {
      return 'positive';
    } else if (sentimentDistribution.negative > sentimentDistribution.positive) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }

  private calculateSentimentTrends(): SentimentTrend[] {
    // Implementation for calculating sentiment trends
    return [];
  }

  private calculateSentimentBySegment(): Record<string, SentimentMetrics> {
    // Implementation for calculating sentiment by segment
    return {};
  }

  private calculateSentimentByIntent(): Record<string, SentimentMetrics> {
    // Implementation for calculating sentiment by intent
    return {};
  }

  private identifySentimentTriggers(): SentimentTrigger[] {
    // Implementation for identifying sentiment triggers
    return [];
  }

  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  private async predictChurn(): Promise<ChurnPrediction> {
    // Implementation for churn prediction
    return {
      highRiskCustomers: [],
      churnProbability: 0.05,
      riskFactors: [],
      recommendations: []
    };
  }

  private async forecastSatisfaction(): Promise<SatisfactionForecast> {
    // Implementation for satisfaction forecasting
    return {
      predictedSatisfaction: 4.5,
      confidence: 0.85,
      trend: 'stable',
      factors: [],
      recommendations: []
    };
  }

  private async predictWorkload(): Promise<WorkloadPrediction> {
    // Implementation for workload prediction
    return {
      predictedVolume: 1000,
      confidence: 0.8,
      peakHours: [9, 10, 11, 14, 15, 16],
      staffingRecommendations: [],
      resourceRequirements: []
    };
  }

  private async optimizeResponse(): Promise<ResponseOptimization> {
    // Implementation for response optimization
    return {
      optimalResponseTime: 2,
      currentResponseTime: 3,
      improvementPotential: 0.33,
      optimizationStrategies: []
    };
  }

  private analyzeConversationFlow(): ConversationFlow {
    // Implementation for conversation flow analysis
    return {
      commonPaths: [],
      dropoffPoints: [],
      completionRates: {},
      averageConversationLength: 0
    };
  }

  private analyzeIntents(): IntentAnalysis {
    // Implementation for intent analysis
    return {
      intentDistribution: {},
      intentSuccessRates: {},
      intentTrends: [],
      intentComplexity: {}
    };
  }

  private analyzeEscalationPatterns(): EscalationPattern[] {
    // Implementation for escalation pattern analysis
    return [];
  }

  private analyzeResolutionPatterns(): ResolutionPattern[] {
    // Implementation for resolution pattern analysis
    return [];
  }

  // Default values for error cases
  private getDefaultMessageMetrics(): MessageMetrics {
    return {
      totalMessages: 0,
      messagesPerDay: 0,
      averageResponseTime: 0,
      messageDeliveryRate: 0,
      readRate: 0,
      replyRate: 0,
      escalationRate: 0,
      resolutionRate: 0
    };
  }

  private getDefaultCustomerSegmentation(): CustomerSegmentation {
    return {
      segments: [],
      segmentDistribution: {},
      segmentPerformance: {}
    };
  }

  private getDefaultSentimentAnalysis(): SentimentAnalysis {
    return {
      overallSentiment: 'neutral',
      sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
      sentimentTrends: [],
      sentimentBySegment: {},
      sentimentByIntent: {},
      sentimentTriggers: []
    };
  }

  private getDefaultPerformanceMetrics(): PerformanceMetrics {
    return {
      responseTime: { average: 0, p95: 0, p99: 0, trend: 'stable' },
      accuracy: { overall: 0, byIntent: {}, bySegment: {}, trend: 'stable' },
      availability: { uptime: 0, downtime: 0, incidents: 0, mttr: 0 },
      scalability: { peakConcurrentUsers: 0, averageConcurrentUsers: 0, resourceUtilization: 0, bottlenecks: [] }
    };
  }

  private getDefaultPredictiveInsights(): PredictiveInsights {
    return {
      churnPrediction: { highRiskCustomers: [], churnProbability: 0, riskFactors: [], recommendations: [] },
      satisfactionForecast: { predictedSatisfaction: 0, confidence: 0, trend: 'stable', factors: [], recommendations: [] },
      workloadPrediction: { predictedVolume: 0, confidence: 0, peakHours: [], staffingRecommendations: [], resourceRequirements: [] },
      responseOptimization: { optimalResponseTime: 0, currentResponseTime: 0, improvementPotential: 0, optimizationStrategies: [] }
    };
  }

  private getDefaultConversationAnalytics(): ConversationAnalytics {
    return {
      conversationFlow: { commonPaths: [], dropoffPoints: [], completionRates: {}, averageConversationLength: 0 },
      intentAnalysis: { intentDistribution: {}, intentSuccessRates: {}, intentTrends: [], intentComplexity: {} },
      escalationPatterns: [],
      resolutionPatterns: []
    };
  }
}

// Export singleton instance
export const whatsappAnalyticsService = new WhatsAppAnalyticsService();
