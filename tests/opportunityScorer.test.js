/**
 * Tests for Opportunity Scorer
 */

const OpportunityScorer = require('../src/services/opportunityScorer');

describe('OpportunityScorer', () => {
  let scorer;

  beforeEach(() => {
    scorer = new OpportunityScorer();
  });

  describe('scoreOpportunity', () => {
    test('should score a high-priority opportunity correctly', () => {
      const opportunity = {
        title: 'ExxonMobil AI Initiative',
        client: 'ExxonMobil',
        estimatedValue: 10000000,
        urgencyLevel: 'critical',
        matchesStrategicPriority: true,
        businessSegment: 'upstream',
        ibmProducts: ['watsonx', 'Maximo'],
        closeProbability: 0.7,
        executiveInvolvement: ['CIO'],
        relationshipStrength: 'strong',
        keywords: ['AI', 'digital transformation']
      };

      const result = scorer.scoreOpportunity(opportunity);

      expect(result).toHaveProperty('totalScore');
      expect(result).toHaveProperty('priority');
      expect(result).toHaveProperty('scores');
      expect(result).toHaveProperty('recommendation');
      expect(result.totalScore).toBeGreaterThan(70);
      expect(['HIGH', 'URGENT', 'CRITICAL']).toContain(result.priority);
    });

    test('should score a low-priority opportunity correctly', () => {
      const opportunity = {
        title: 'Minor Update',
        client: 'Unknown Client',
        estimatedValue: 100000,
        urgencyLevel: 'low',
        matchesStrategicPriority: false,
        closeProbability: 0.2,
        relationshipStrength: 'weak'
      };

      const result = scorer.scoreOpportunity(opportunity);

      expect(result.totalScore).toBeLessThan(60);
      expect(['LOW', 'MEDIUM']).toContain(result.priority);
    });
  });

  describe('scoreClientRelevance', () => {
    test('should give high score for strategic priority match', () => {
      const opportunity = {
        matchesStrategicPriority: true,
        businessSegment: 'upstream',
        keywords: ['digital transformation', 'AI']
      };

      const score = scorer.scoreClientRelevance(opportunity);

      expect(score).toBeGreaterThan(70);
    });
  });

  describe('scoreBusinessImpact', () => {
    test('should score high-value deals appropriately', () => {
      const opportunity = {
        estimatedValue: 15000000,
        impactType: 'transformational',
        marketSignificance: 'high'
      };

      const score = scorer.scoreBusinessImpact(opportunity);

      expect(score).toBeGreaterThan(80);
    });
  });

  describe('determinePriority', () => {
    test('should classify scores correctly', () => {
      expect(scorer.determinePriority(95)).toBe('CRITICAL');
      expect(scorer.determinePriority(85)).toBe('URGENT');
      expect(scorer.determinePriority(75)).toBe('HIGH');
      expect(scorer.determinePriority(55)).toBe('MEDIUM');
      expect(scorer.determinePriority(25)).toBe('LOW');
    });
  });

  describe('scoreMultipleOpportunities', () => {
    test('should sort opportunities by score', () => {
      const opportunities = [
        { title: 'Low', estimatedValue: 100000, urgencyLevel: 'low' },
        { title: 'High', estimatedValue: 10000000, urgencyLevel: 'critical', matchesStrategicPriority: true },
        { title: 'Medium', estimatedValue: 1000000, urgencyLevel: 'medium' }
      ];

      const results = scorer.scoreMultipleOpportunities(opportunities);

      expect(results[0].opportunity.title).toBe('High');
      expect(results[0].scoring.totalScore).toBeGreaterThan(results[1].scoring.totalScore);
      expect(results[1].scoring.totalScore).toBeGreaterThan(results[2].scoring.totalScore);
    });
  });

  describe('explainScore', () => {
    test('should provide detailed explanation', () => {
      const opportunity = {
        title: 'Test Opportunity',
        estimatedValue: 5000000,
        urgencyLevel: 'high'
      };

      const scoring = scorer.scoreOpportunity(opportunity);
      const explanation = scorer.explainScore(scoring);

      expect(explanation).toHaveProperty('summary');
      expect(explanation).toHaveProperty('breakdown');
      expect(explanation).toHaveProperty('topFactors');
      expect(explanation).toHaveProperty('improvementAreas');
      expect(explanation.breakdown.length).toBeGreaterThan(0);
    });
  });
});

// Made with Bob
