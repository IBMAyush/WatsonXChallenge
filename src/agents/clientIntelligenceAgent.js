/**
 * Client Intelligence Agent
 * Maintains account profiles and tracks client-specific developments
 * 
 * @author IBM Bobathon Team
 * @version 1.0.0
 */

const logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');

class ClientIntelligenceAgent {
  constructor() {
    this.profiles = new Map();
    this.profilesDirectory = path.join(__dirname, '../../data/profiles');
    this.clientUpdates = new Map();
  }

  /**
   * Initialize agent and load profiles
   */
  async initialize() {
    try {
      logger.info('Initializing Client Intelligence Agent...');
      await this.loadAllProfiles();
      logger.info(`Loaded ${this.profiles.size} client profiles`);
    } catch (error) {
      logger.error('Error initializing Client Intelligence Agent:', error);
      throw error;
    }
  }

  /**
   * Load all client profiles from directory
   */
  async loadAllProfiles() {
    try {
      const files = await fs.readdir(this.profilesDirectory);
      const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'template.json');

      for (const file of jsonFiles) {
        try {
          const profile = await this.loadProfile(file);
          if (profile && profile.company_name) {
            this.profiles.set(profile.company_name.toLowerCase(), profile);
            logger.debug(`Loaded profile: ${profile.company_name}`);
          }
        } catch (error) {
          logger.error(`Error loading profile ${file}:`, error);
        }
      }
    } catch (error) {
      logger.warn('Profiles directory not accessible, starting with empty profiles');
    }
  }

  /**
   * Load a single profile
   */
  async loadProfile(filename) {
    const filePath = path.join(this.profilesDirectory, filename);
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  }

  /**
   * Get profile for a company
   */
  getProfile(companyName) {
    const key = companyName.toLowerCase();
    
    // Try exact match first
    if (this.profiles.has(key)) {
      return this.profiles.get(key);
    }

    // Try partial match with aliases
    for (const [name, profile] of this.profiles.entries()) {
      if (name.includes(key) || key.includes(name)) {
        return profile;
      }
      
      // Check aliases
      if (profile.aliases) {
        const aliasMatch = profile.aliases.some(alias => 
          alias.toLowerCase().includes(key) || key.includes(alias.toLowerCase())
        );
        if (aliasMatch) return profile;
      }
    }

    return null;
  }

  /**
   * Filter news by client profile
   */
  filterNewsByProfile(companyName, newsArticles) {
    const profile = this.getProfile(companyName);
    
    if (!profile) {
      logger.warn(`No profile found for ${companyName}`);
      return {
        company: companyName,
        profileFound: false,
        articles: newsArticles,
        filtered: false
      };
    }

    // Filter based on profile preferences
    const filtered = newsArticles.filter(article => {
      // Check if article matches watchlist topics
      if (profile.watchlist_topics) {
        const matchesWatchlist = profile.watchlist_topics.some(topic => {
          return topic.keywords.some(keyword =>
            article.title.toLowerCase().includes(keyword.toLowerCase()) ||
            article.summary.toLowerCase().includes(keyword.toLowerCase())
          );
        });
        
        if (!matchesWatchlist) return false;
      }

      // Check custom filters
      if (profile.custom_filters) {
        // Exclude topics
        if (profile.custom_filters.exclude_topics) {
          const isExcluded = profile.custom_filters.exclude_topics.some(topic =>
            article.title.toLowerCase().includes(topic.toLowerCase())
          );
          if (isExcluded) return false;
        }

        // Minimum relevance score
        if (profile.custom_filters.minimum_news_relevance_score) {
          if (article.ibmRelevance < profile.custom_filters.minimum_news_relevance_score) {
            return false;
          }
        }

        // Preferred sources
        if (profile.custom_filters.preferred_news_sources) {
          if (!profile.custom_filters.preferred_news_sources.includes(article.source)) {
            return false;
          }
        }
      }

      return true;
    });

    // Prioritize based on profile
    const prioritized = this.prioritizeArticles(filtered, profile);

    return {
      company: companyName,
      profileFound: true,
      profile: {
        name: profile.company_name,
        strategicPriorities: profile.strategic_priorities,
        ibmOfferings: profile.relevant_ibm_offerings?.map(o => o.product)
      },
      totalArticles: newsArticles.length,
      filteredArticles: prioritized.length,
      articles: prioritized,
      filtered: true
    };
  }

  /**
   * Prioritize articles based on profile
   */
  prioritizeArticles(articles, profile) {
    return articles.map(article => {
      let priorityScore = 0;

      // Check strategic priorities
      if (profile.strategic_priorities) {
        const matchesPriority = profile.strategic_priorities.some(priority =>
          article.title.toLowerCase().includes(priority.toLowerCase()) ||
          article.summary.toLowerCase().includes(priority.toLowerCase())
        );
        if (matchesPriority) priorityScore += 30;
      }

      // Check business segments
      if (profile.business_segments) {
        const matchesSegment = profile.business_segments.some(segment =>
          article.title.toLowerCase().includes(segment.name.toLowerCase())
        );
        if (matchesSegment) priorityScore += 20;
      }

      // Check IBM offerings relevance
      if (profile.relevant_ibm_offerings) {
        const matchesOffering = profile.relevant_ibm_offerings.some(offering =>
          article.keywords.some(keyword =>
            offering.use_cases.some(useCase =>
              useCase.toLowerCase().includes(keyword.toLowerCase())
            )
          )
        );
        if (matchesOffering) priorityScore += 25;
      }

      return {
        ...article,
        priorityScore,
        profileMatch: priorityScore > 0
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }

  /**
   * Check if article triggers alert thresholds
   */
  checkAlertThresholds(article, profile) {
    if (!profile || !profile.alert_thresholds) {
      return { shouldAlert: false };
    }

    const alerts = [];
    const thresholds = profile.alert_thresholds;

    // Check for capex announcements
    if (thresholds.capex_announcement_usd) {
      const capexMatch = article.summary.match(/\$(\d+(?:\.\d+)?)\s*(billion|million)/i);
      if (capexMatch) {
        const amount = parseFloat(capexMatch[1]);
        const multiplier = capexMatch[2].toLowerCase() === 'billion' ? 1000000000 : 1000000;
        const totalAmount = amount * multiplier;
        
        if (totalAmount >= thresholds.capex_announcement_usd) {
          alerts.push({
            type: 'capex_announcement',
            value: totalAmount,
            threshold: thresholds.capex_announcement_usd,
            message: `Major capital investment: $${(totalAmount / 1000000).toFixed(0)}M`
          });
        }
      }
    }

    // Check for cybersecurity incidents
    if (thresholds.cybersecurity_incident === 'any') {
      const cyberKeywords = ['cyber attack', 'ransomware', 'data breach', 'hack', 'security incident'];
      const hasCyberIncident = cyberKeywords.some(keyword =>
        article.title.toLowerCase().includes(keyword) ||
        article.summary.toLowerCase().includes(keyword)
      );
      
      if (hasCyberIncident) {
        alerts.push({
          type: 'cybersecurity_incident',
          message: 'Cybersecurity incident detected',
          urgency: 'critical'
        });
      }
    }

    // Check for executive changes
    if (thresholds.executive_change) {
      const execKeywords = ['CEO', 'CIO', 'CTO', 'CFO', 'COO'];
      const changeKeywords = ['appoint', 'resign', 'retire', 'join', 'leave'];
      
      const hasExecChange = execKeywords.some(exec =>
        article.title.toLowerCase().includes(exec.toLowerCase())
      ) && changeKeywords.some(change =>
        article.title.toLowerCase().includes(change)
      );
      
      if (hasExecChange) {
        alerts.push({
          type: 'executive_change',
          message: 'Executive leadership change detected',
          urgency: 'high'
        });
      }
    }

    return {
      shouldAlert: alerts.length > 0,
      alerts,
      urgency: alerts.some(a => a.urgency === 'critical') ? 'critical' : 'high'
    };
  }

  /**
   * Generate client intelligence report
   */
  generateClientReport(companyName, newsArticles, marketData = null) {
    const profile = this.getProfile(companyName);
    
    if (!profile) {
      return {
        error: 'Profile not found',
        company: companyName,
        suggestion: 'Create a profile for this company to enable intelligence tracking'
      };
    }

    const filteredNews = this.filterNewsByProfile(companyName, newsArticles);
    
    // Analyze trends
    const trends = this.analyzeTrends(filteredNews.articles);
    
    // Identify opportunities
    const opportunities = this.identifyOpportunities(profile, filteredNews.articles, marketData);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(profile, trends, opportunities);

    return {
      company: profile.company_name,
      profile: {
        strategicPriorities: profile.strategic_priorities,
        businessSegments: profile.business_segments?.map(s => s.name),
        keyGeographies: profile.key_geographies?.map(g => g.region),
        ibmRelationship: profile.ibm_relationship?.relationship_status
      },
      intelligence: {
        newsCount: filteredNews.filteredArticles,
        trends,
        opportunities,
        recommendations
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Analyze trends from articles
   */
  analyzeTrends(articles) {
    const trends = {
      topics: {},
      sentiment: { positive: 0, neutral: 0, negative: 0 },
      categories: {}
    };

    articles.forEach(article => {
      // Count topics
      article.keywords.forEach(keyword => {
        trends.topics[keyword] = (trends.topics[keyword] || 0) + 1;
      });

      // Count sentiment
      trends.sentiment[article.sentiment]++;

      // Count categories
      trends.categories[article.category] = (trends.categories[article.category] || 0) + 1;
    });

    // Get top topics
    const topTopics = Object.entries(trends.topics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    return {
      topTopics,
      sentiment: trends.sentiment,
      categories: trends.categories
    };
  }

  /**
   * Identify opportunities from intelligence
   */
  identifyOpportunities(profile, articles, marketData) {
    const opportunities = [];

    // Check for digital transformation mentions
    const digitalArticles = articles.filter(a =>
      a.keywords.some(k => ['digital', 'AI', 'cloud', 'automation'].includes(k))
    );
    
    if (digitalArticles.length > 0) {
      opportunities.push({
        type: 'digital_transformation',
        confidence: 'high',
        articles: digitalArticles.length,
        ibmSolutions: ['watsonx', 'Hybrid Cloud', 'IBM Consulting'],
        description: 'Client showing interest in digital transformation initiatives'
      });
    }

    // Check for sustainability focus
    const sustainabilityArticles = articles.filter(a =>
      a.keywords.some(k => ['carbon', 'emissions', 'sustainability'].includes(k))
    );
    
    if (sustainabilityArticles.length > 0) {
      opportunities.push({
        type: 'sustainability',
        confidence: 'medium',
        articles: sustainabilityArticles.length,
        ibmSolutions: ['IBM Consulting', 'Maximo', 'Environmental Intelligence Suite'],
        description: 'Client focused on emissions reduction and sustainability'
      });
    }

    return opportunities;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(profile, trends, opportunities) {
    const recommendations = [];

    // Based on opportunities
    opportunities.forEach(opp => {
      recommendations.push({
        priority: 'high',
        action: `Engage on ${opp.type}`,
        rationale: opp.description,
        suggestedSolutions: opp.ibmSolutions,
        nextSteps: [
          'Schedule discovery call',
          'Prepare solution brief',
          'Identify key stakeholders'
        ]
      });
    });

    // Based on trends
    if (trends.sentiment.negative > trends.sentiment.positive) {
      recommendations.push({
        priority: 'medium',
        action: 'Monitor client challenges',
        rationale: 'Recent news sentiment is negative, indicating potential challenges',
        nextSteps: ['Reach out to account team', 'Offer support']
      });
    }

    return recommendations;
  }

  /**
   * Get all tracked companies
   */
  getTrackedCompanies() {
    return Array.from(this.profiles.values()).map(profile => ({
      name: profile.company_name,
      aliases: profile.aliases,
      relationship: profile.ibm_relationship?.relationship_status,
      strategicPriorities: profile.strategic_priorities?.slice(0, 3)
    }));
  }

  /**
   * Get agent status
   */
  getStatus() {
    return {
      profilesLoaded: this.profiles.size,
      companies: Array.from(this.profiles.keys()),
      lastUpdate: new Date().toISOString()
    };
  }
}

module.exports = ClientIntelligenceAgent;

// Made with Bob
