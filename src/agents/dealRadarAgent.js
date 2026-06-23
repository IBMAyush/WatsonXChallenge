/**
 * Deal Radar Agent
 * Continuously monitors for high-value opportunities and triggers alerts
 * 
 * @author IBM Bobathon Team
 * @version 1.0.0
 */

const logger = require('../utils/logger');
const OpportunityScorer = require('../services/opportunityScorer');
const { WorkflowAutomation, WORKFLOW_TYPES } = require('../services/workflowAutomation');

class DealRadarAgent {
  constructor(slackClient = null, crmClient = null) {
    this.scorer = new OpportunityScorer();
    this.workflowAutomation = new WorkflowAutomation(slackClient, crmClient);
    this.isMonitoring = false;
    this.monitoringInterval = null;
    this.detectedOpportunities = new Map();
    this.alertThresholds = {
      critical: 90,
      urgent: 80,
      high: 70
    };
  }

  /**
   * Start continuous monitoring
   * @param {Number} intervalMinutes - Check interval in minutes
   */
  startMonitoring(intervalMinutes = 5) {
    if (this.isMonitoring) {
      logger.warn('Deal Radar is already monitoring');
      return;
    }

    logger.info(`Starting Deal Radar monitoring (interval: ${intervalMinutes} minutes)`);
    this.isMonitoring = true;

    // Run initial scan
    this.scanForOpportunities();

    // Set up periodic scanning
    this.monitoringInterval = setInterval(() => {
      this.scanForOpportunities();
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) {
      logger.warn('Deal Radar is not currently monitoring');
      return;
    }

    logger.info('Stopping Deal Radar monitoring');
    this.isMonitoring = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Scan for new opportunities
   */
  async scanForOpportunities() {
    try {
      logger.info('Deal Radar: Scanning for opportunities...');

      // Gather potential opportunities from various sources
      const potentialOpportunities = await this.gatherPotentialOpportunities();

      logger.info(`Found ${potentialOpportunities.length} potential opportunities`);

      // Score and evaluate each opportunity
      for (const opportunity of potentialOpportunities) {
        await this.evaluateOpportunity(opportunity);
      }

      logger.info('Deal Radar: Scan complete');

    } catch (error) {
      logger.error('Error during opportunity scan:', error);
    }
  }

  /**
   * Evaluate a single opportunity
   */
  async evaluateOpportunity(opportunity) {
    try {
      // Check if already processed
      if (this.detectedOpportunities.has(opportunity.id)) {
        logger.debug(`Opportunity ${opportunity.id} already processed`);
        return;
      }

      // Score the opportunity
      const scoring = this.scorer.scoreOpportunity(opportunity);

      logger.info(`Opportunity "${opportunity.title}" scored: ${scoring.totalScore} (${scoring.priority})`);

      // Store in detected opportunities
      this.detectedOpportunities.set(opportunity.id, {
        opportunity,
        scoring,
        detectedAt: new Date().toISOString()
      });

      // Trigger alerts based on score
      await this.handleOpportunityAlert(opportunity, scoring);

      // Execute automated workflows
      await this.executeAutomatedWorkflows(opportunity, scoring);

    } catch (error) {
      logger.error(`Error evaluating opportunity ${opportunity.id}:`, error);
    }
  }

  /**
   * Handle opportunity alerts based on priority
   */
  async handleOpportunityAlert(opportunity, scoring) {
    const { totalScore, priority } = scoring;

    // Determine if alert should be triggered
    let shouldAlert = false;
    let alertLevel = 'info';

    if (totalScore >= this.alertThresholds.critical) {
      shouldAlert = true;
      alertLevel = 'critical';
    } else if (totalScore >= this.alertThresholds.urgent) {
      shouldAlert = true;
      alertLevel = 'urgent';
    } else if (totalScore >= this.alertThresholds.high) {
      shouldAlert = true;
      alertLevel = 'high';
    }

    if (shouldAlert) {
      logger.info(`Triggering ${alertLevel} alert for opportunity: ${opportunity.title}`);

      // Execute opportunity alert workflow
      await this.workflowAutomation.executeWorkflow(
        opportunity,
        scoring,
        WORKFLOW_TYPES.OPPORTUNITY_ALERT
      );

      // Log alert
      this.logAlert({
        opportunityId: opportunity.id,
        title: opportunity.title,
        score: totalScore,
        priority,
        alertLevel,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Execute automated workflows based on opportunity characteristics
   */
  async executeAutomatedWorkflows(opportunity, scoring) {
    const workflows = [];

    // High-priority opportunities get full workflow treatment
    if (scoring.priority === 'CRITICAL' || scoring.priority === 'URGENT') {
      workflows.push(WORKFLOW_TYPES.TASK_ASSIGNMENT);
      workflows.push(WORKFLOW_TYPES.CRM_LOG);
      
      if (opportunity.requiresMeetingPrep) {
        workflows.push(WORKFLOW_TYPES.MEETING_PREP);
      }
    }

    // Medium priority gets selective workflows
    if (scoring.priority === 'HIGH' || scoring.priority === 'MEDIUM') {
      workflows.push(WORKFLOW_TYPES.CRM_LOG);
    }

    // Execute workflows
    for (const workflowType of workflows) {
      try {
        await this.workflowAutomation.executeWorkflow(
          opportunity,
          scoring,
          workflowType
        );
      } catch (error) {
        logger.error(`Failed to execute workflow ${workflowType}:`, error);
      }
    }
  }

  /**
   * Gather potential opportunities from various sources
   * This is a placeholder - would integrate with real data sources
   */
  async gatherPotentialOpportunities() {
    // In production, this would:
    // 1. Query news APIs for relevant articles
    // 2. Check market data for significant events
    // 3. Monitor client announcements
    // 4. Scan social media and press releases
    // 5. Check internal IBM systems for leads

    // For now, return empty array (to be implemented with real integrations)
    return [];
  }

  /**
   * Analyze news article for opportunity signals
   */
  analyzeNewsForOpportunity(article) {
    const opportunity = {
      id: `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: 'news',
      title: article.title,
      description: article.summary,
      client: this.extractClientName(article),
      keywords: this.extractKeywords(article),
      estimatedValue: this.estimateValue(article),
      urgencyLevel: this.determineUrgency(article),
      businessSegment: this.identifyBusinessSegment(article),
      ibmProducts: this.identifyRelevantIBMProducts(article),
      detectedAt: new Date().toISOString()
    };

    return opportunity;
  }

  /**
   * Extract client name from article
   */
  extractClientName(article) {
    // Placeholder - would use NLP to extract company names
    const knownClients = ['ExxonMobil', 'Chevron', 'Shell', 'BP', 'SLB', 'Halliburton'];
    const text = `${article.title} ${article.summary}`.toLowerCase();
    
    for (const client of knownClients) {
      if (text.includes(client.toLowerCase())) {
        return client;
      }
    }
    
    return 'Unknown';
  }

  /**
   * Extract relevant keywords
   */
  extractKeywords(article) {
    const opportunityKeywords = [
      'digital transformation',
      'AI',
      'artificial intelligence',
      'cloud',
      'cybersecurity',
      'modernization',
      'automation',
      'data analytics',
      'sustainability',
      'carbon capture',
      'emissions reduction'
    ];

    const text = `${article.title} ${article.summary}`.toLowerCase();
    return opportunityKeywords.filter(keyword => text.includes(keyword.toLowerCase()));
  }

  /**
   * Estimate opportunity value
   */
  estimateValue(article) {
    // Placeholder - would use ML to estimate deal size
    const text = `${article.title} ${article.summary}`.toLowerCase();
    
    if (text.includes('billion')) return 50000000; // $50M for billion-dollar projects
    if (text.includes('million')) return 5000000;  // $5M for million-dollar projects
    if (text.includes('investment')) return 2000000; // $2M for general investments
    
    return 1000000; // Default $1M
  }

  /**
   * Determine urgency level
   */
  determineUrgency(article) {
    const text = `${article.title} ${article.summary}`.toLowerCase();
    
    if (text.includes('urgent') || text.includes('immediate') || text.includes('crisis')) {
      return 'critical';
    }
    if (text.includes('soon') || text.includes('quickly') || text.includes('deadline')) {
      return 'high';
    }
    
    return 'medium';
  }

  /**
   * Identify business segment
   */
  identifyBusinessSegment(article) {
    const text = `${article.title} ${article.summary}`.toLowerCase();
    
    if (text.includes('upstream') || text.includes('exploration') || text.includes('production')) {
      return 'upstream';
    }
    if (text.includes('downstream') || text.includes('refining') || text.includes('refinery')) {
      return 'downstream';
    }
    if (text.includes('carbon') || text.includes('renewable') || text.includes('hydrogen')) {
      return 'low-carbon';
    }
    
    return 'general';
  }

  /**
   * Identify relevant IBM products
   */
  identifyRelevantIBMProducts(article) {
    const text = `${article.title} ${article.summary}`.toLowerCase();
    const products = [];
    
    if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning')) {
      products.push('watsonx');
    }
    if (text.includes('asset') || text.includes('maintenance') || text.includes('equipment')) {
      products.push('Maximo');
    }
    if (text.includes('cloud') || text.includes('infrastructure')) {
      products.push('Hybrid Cloud');
    }
    if (text.includes('security') || text.includes('cyber')) {
      products.push('IBM Security');
    }
    if (text.includes('consulting') || text.includes('transformation')) {
      products.push('IBM Consulting');
    }
    
    return products.length > 0 ? products : ['IBM Consulting'];
  }

  /**
   * Log alert for tracking
   */
  logAlert(alert) {
    logger.info('Alert logged:', alert);
    // In production, would store in database
  }

  /**
   * Get monitoring status
   */
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      detectedOpportunitiesCount: this.detectedOpportunities.size,
      alertThresholds: this.alertThresholds,
      lastScan: new Date().toISOString()
    };
  }

  /**
   * Get detected opportunities
   */
  getDetectedOpportunities(limit = 10) {
    const opportunities = Array.from(this.detectedOpportunities.values())
      .sort((a, b) => b.scoring.totalScore - a.scoring.totalScore)
      .slice(0, limit);
    
    return opportunities;
  }

  /**
   * Clear detected opportunities (for testing/reset)
   */
  clearDetectedOpportunities() {
    this.detectedOpportunities.clear();
    logger.info('Cleared detected opportunities');
  }

  /**
   * Update alert thresholds
   */
  updateAlertThresholds(thresholds) {
    this.alertThresholds = { ...this.alertThresholds, ...thresholds };
    logger.info('Alert thresholds updated:', this.alertThresholds);
  }
}

module.exports = DealRadarAgent;

// Made with Bob
