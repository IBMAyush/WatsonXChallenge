/**
 * Opportunity Scoring Service
 * Evaluates and scores business opportunities based on multiple factors
 * 
 * @author IBM Bobathon Team
 * @version 1.0.0
 */

const logger = require('../utils/logger');

/**
 * Scoring weights for different factors
 * Total should equal 1.0 (100%)
 */
const SCORING_WEIGHTS = {
  clientRelevance: 0.25,      // How relevant is this to the specific client
  businessImpact: 0.20,        // Potential business impact/value
  ibmSolutionFit: 0.20,        // How well IBM solutions match the need
  urgency: 0.15,               // Time sensitivity of the opportunity
  dealPotential: 0.10,         // Estimated deal size/potential
  executiveVisibility: 0.05,   // C-level involvement/visibility
  competitiveRisk: 0.03,       // Risk of competitors winning
  relationshipImpact: 0.02     // Impact on client relationship
};

/**
 * Opportunity priority thresholds
 */
const PRIORITY_THRESHOLDS = {
  CRITICAL: 90,
  URGENT: 80,
  HIGH: 70,
  MEDIUM: 50,
  LOW: 30
};

class OpportunityScorer {
  constructor() {
    this.weights = SCORING_WEIGHTS;
    this.thresholds = PRIORITY_THRESHOLDS;
  }

  /**
   * Calculate overall opportunity score
   * @param {Object} opportunity - Opportunity data
   * @returns {Object} Scoring result with breakdown
   */
  scoreOpportunity(opportunity) {
    try {
      logger.info(`Scoring opportunity: ${opportunity.title || 'Untitled'}`);

      const scores = {
        clientRelevance: this.scoreClientRelevance(opportunity),
        businessImpact: this.scoreBusinessImpact(opportunity),
        ibmSolutionFit: this.scoreIBMSolutionFit(opportunity),
        urgency: this.scoreUrgency(opportunity),
        dealPotential: this.scoreDealPotential(opportunity),
        executiveVisibility: this.scoreExecutiveVisibility(opportunity),
        competitiveRisk: this.scoreCompetitiveRisk(opportunity),
        relationshipImpact: this.scoreRelationshipImpact(opportunity)
      };

      // Calculate weighted total score
      const totalScore = Object.keys(scores).reduce((total, key) => {
        return total + (scores[key] * this.weights[key]);
      }, 0);

      const priority = this.determinePriority(totalScore);
      const recommendation = this.generateRecommendation(totalScore, scores, opportunity);

      const result = {
        totalScore: Math.round(totalScore * 100) / 100,
        priority,
        scores,
        weights: this.weights,
        recommendation,
        timestamp: new Date().toISOString()
      };

      logger.info(`Opportunity scored: ${result.totalScore} (${priority})`);
      return result;

    } catch (error) {
      logger.error('Error scoring opportunity:', error);
      throw error;
    }
  }

  /**
   * Score client relevance (0-100)
   * Based on how well the opportunity matches client's strategic priorities
   */
  scoreClientRelevance(opportunity) {
    let score = 50; // Base score

    const { client, keywords = [], businessSegment, geography } = opportunity;

    // Check if it matches client's strategic priorities
    if (opportunity.matchesStrategicPriority) {
      score += 30;
    }

    // Check if it's in a priority business segment
    if (businessSegment && ['upstream', 'downstream', 'low-carbon'].includes(businessSegment.toLowerCase())) {
      score += 10;
    }

    // Check if it's in a key geography
    if (geography && opportunity.isPriorityGeography) {
      score += 10;
    }

    // Keyword relevance boost
    const relevantKeywords = ['digital transformation', 'AI', 'cloud', 'cybersecurity', 'sustainability'];
    const matchedKeywords = keywords.filter(k => 
      relevantKeywords.some(rk => k.toLowerCase().includes(rk.toLowerCase()))
    );
    score += Math.min(matchedKeywords.length * 5, 20);

    return Math.min(score, 100);
  }

  /**
   * Score business impact (0-100)
   * Based on potential revenue, strategic value, and market impact
   */
  scoreBusinessImpact(opportunity) {
    let score = 40; // Base score

    const { estimatedValue, impactType, marketSignificance } = opportunity;

    // Estimated deal value impact
    if (estimatedValue) {
      if (estimatedValue >= 10000000) score += 40; // $10M+
      else if (estimatedValue >= 5000000) score += 30; // $5M+
      else if (estimatedValue >= 1000000) score += 20; // $1M+
      else if (estimatedValue >= 500000) score += 10; // $500K+
    }

    // Impact type
    if (impactType === 'strategic') score += 15;
    else if (impactType === 'transformational') score += 20;

    // Market significance
    if (marketSignificance === 'high') score += 15;
    else if (marketSignificance === 'medium') score += 10;

    return Math.min(score, 100);
  }

  /**
   * Score IBM solution fit (0-100)
   * How well IBM's offerings match the opportunity
   */
  scoreIBMSolutionFit(opportunity) {
    let score = 30; // Base score

    const { requiredCapabilities = [], ibmProducts = [], existingRelationship } = opportunity;

    // IBM product alignment
    const strongFitProducts = ['watsonx', 'maximo', 'consulting', 'hybrid-cloud', 'security'];
    const matchedProducts = ibmProducts.filter(p => 
      strongFitProducts.some(sfp => p.toLowerCase().includes(sfp))
    );
    score += Math.min(matchedProducts.length * 15, 45);

    // Existing relationship bonus
    if (existingRelationship) {
      score += 15;
    }

    // Capability match
    if (requiredCapabilities.length > 0) {
      score += Math.min(requiredCapabilities.length * 5, 20);
    }

    return Math.min(score, 100);
  }

  /**
   * Score urgency (0-100)
   * Time sensitivity and deadline pressure
   */
  scoreUrgency(opportunity) {
    let score = 20; // Base score

    const { deadline, urgencyLevel, competitiveThreat } = opportunity;

    // Deadline-based scoring
    if (deadline) {
      const daysUntilDeadline = this.calculateDaysUntil(deadline);
      if (daysUntilDeadline <= 7) score += 50;
      else if (daysUntilDeadline <= 30) score += 35;
      else if (daysUntilDeadline <= 90) score += 20;
      else score += 10;
    }

    // Explicit urgency level
    if (urgencyLevel === 'critical') score += 30;
    else if (urgencyLevel === 'high') score += 20;
    else if (urgencyLevel === 'medium') score += 10;

    // Competitive threat
    if (competitiveThreat) score += 15;

    return Math.min(score, 100);
  }

  /**
   * Score deal potential (0-100)
   * Likelihood of closing and expansion potential
   */
  scoreDealPotential(opportunity) {
    let score = 40; // Base score

    const { 
      closeProbability, 
      expansionPotential, 
      clientBudgetConfirmed,
      decisionMakerEngaged 
    } = opportunity;

    // Close probability
    if (closeProbability >= 0.7) score += 30;
    else if (closeProbability >= 0.5) score += 20;
    else if (closeProbability >= 0.3) score += 10;

    // Expansion potential
    if (expansionPotential === 'high') score += 20;
    else if (expansionPotential === 'medium') score += 10;

    // Budget and decision maker
    if (clientBudgetConfirmed) score += 10;
    if (decisionMakerEngaged) score += 15;

    return Math.min(score, 100);
  }

  /**
   * Score executive visibility (0-100)
   * C-level involvement and strategic importance
   */
  scoreExecutiveVisibility(opportunity) {
    let score = 20; // Base score

    const { executiveInvolvement, boardLevel, pressRelease } = opportunity;

    if (executiveInvolvement) {
      if (executiveInvolvement.includes('CEO')) score += 40;
      else if (executiveInvolvement.includes('CIO') || executiveInvolvement.includes('CTO')) score += 30;
      else if (executiveInvolvement.includes('VP')) score += 20;
    }

    if (boardLevel) score += 25;
    if (pressRelease) score += 15;

    return Math.min(score, 100);
  }

  /**
   * Score competitive risk (0-100)
   * Risk of losing to competitors
   */
  scoreCompetitiveRisk(opportunity) {
    let score = 30; // Base score (lower is better, inverted later)

    const { competitorsInvolved = [], incumbentAdvantage, clientPreference } = opportunity;

    // More competitors = higher risk
    score += Math.min(competitorsInvolved.length * 15, 45);

    // Incumbent advantage
    if (incumbentAdvantage === 'strong') score += 25;
    else if (incumbentAdvantage === 'moderate') score += 15;

    // Client preference
    if (clientPreference === 'competitor') score += 20;
    else if (clientPreference === 'ibm') score -= 20;

    // Invert score (high risk = low score)
    return Math.max(0, 100 - Math.min(score, 100));
  }

  /**
   * Score relationship impact (0-100)
   * Impact on overall client relationship
   */
  scoreRelationshipImpact(opportunity) {
    let score = 40; // Base score

    const { 
      relationshipStrength, 
      referencePotential, 
      strategicAccount,
      riskToRelationship 
    } = opportunity;

    if (relationshipStrength === 'strong') score += 20;
    else if (relationshipStrength === 'moderate') score += 10;

    if (referencePotential) score += 15;
    if (strategicAccount) score += 20;
    if (riskToRelationship) score -= 30;

    return Math.max(0, Math.min(score, 100));
  }

  /**
   * Determine priority level based on total score
   */
  determinePriority(score) {
    if (score >= this.thresholds.CRITICAL) return 'CRITICAL';
    if (score >= this.thresholds.URGENT) return 'URGENT';
    if (score >= this.thresholds.HIGH) return 'HIGH';
    if (score >= this.thresholds.MEDIUM) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Generate recommendation based on score and factors
   */
  generateRecommendation(totalScore, scores, opportunity) {
    const recommendations = [];

    // High-priority actions
    if (totalScore >= this.thresholds.URGENT) {
      recommendations.push('🚨 IMMEDIATE ACTION REQUIRED');
      recommendations.push('Notify account team immediately');
      recommendations.push('Schedule executive briefing within 24 hours');
    }

    // Specific recommendations based on weak areas
    if (scores.urgency > 70) {
      recommendations.push('⏰ Time-sensitive: Fast response critical');
    }

    if (scores.ibmSolutionFit < 60) {
      recommendations.push('🔧 Solution fit needs strengthening - engage technical specialists');
    }

    if (scores.competitiveRisk < 50) {
      recommendations.push('⚠️ High competitive risk - develop differentiation strategy');
    }

    if (scores.executiveVisibility > 70) {
      recommendations.push('👔 High executive visibility - prepare executive-level materials');
    }

    if (scores.dealPotential > 70) {
      recommendations.push('💰 Strong deal potential - prioritize resource allocation');
    }

    // General recommendations
    if (totalScore >= this.thresholds.HIGH) {
      recommendations.push('📋 Create detailed action plan');
      recommendations.push('🤝 Engage account team and specialists');
    }

    return recommendations.length > 0 ? recommendations : ['Monitor and reassess periodically'];
  }

  /**
   * Calculate days until a deadline
   */
  calculateDaysUntil(deadline) {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Batch score multiple opportunities
   */
  scoreMultipleOpportunities(opportunities) {
    return opportunities.map(opp => ({
      opportunity: opp,
      scoring: this.scoreOpportunity(opp)
    })).sort((a, b) => b.scoring.totalScore - a.scoring.totalScore);
  }

  /**
   * Get scoring explanation for transparency
   */
  explainScore(scoringResult) {
    const { totalScore, scores, weights, priority } = scoringResult;

    const explanation = {
      summary: `Overall Score: ${totalScore}/100 (${priority} Priority)`,
      breakdown: Object.keys(scores).map(key => ({
        factor: key,
        score: scores[key],
        weight: weights[key],
        contribution: Math.round(scores[key] * weights[key] * 100) / 100,
        percentage: `${Math.round(weights[key] * 100)}%`
      })),
      topFactors: this.getTopFactors(scores, weights),
      improvementAreas: this.getImprovementAreas(scores)
    };

    return explanation;
  }

  /**
   * Get top contributing factors
   */
  getTopFactors(scores, weights) {
    return Object.keys(scores)
      .map(key => ({
        factor: key,
        contribution: scores[key] * weights[key]
      }))
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 3)
      .map(item => item.factor);
  }

  /**
   * Get areas needing improvement
   */
  getImprovementAreas(scores) {
    return Object.keys(scores)
      .filter(key => scores[key] < 60)
      .map(key => ({
        factor: key,
        score: scores[key],
        gap: 60 - scores[key]
      }))
      .sort((a, b) => b.gap - a.gap);
  }
}

module.exports = OpportunityScorer;

// Made with Bob
