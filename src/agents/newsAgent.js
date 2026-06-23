/**
 * News & Policy Agent
 * Monitors oil & gas industry news, policy changes, and emissions developments
 * 
 * @author IBM Bobathon Team
 * @version 1.0.0
 */

const logger = require('../utils/logger');
const axios = require('axios');

class NewsAgent {
  constructor() {
    this.newsCache = [];
    this.policyUpdates = [];
    this.emissionsNews = [];
    this.lastUpdate = null;
    this.isMonitoring = false;
    this.updateInterval = null;
    
    // News source credibility ratings
    this.sourceCredibility = {
      'Reuters': 95,
      'Bloomberg': 95,
      'Oil & Gas Journal': 90,
      'Upstream Online': 85,
      'Rigzone': 80,
      'Energy Intelligence': 90,
      'Platts': 90,
      'Wall Street Journal': 95,
      'Financial Times': 95
    };
  }

  /**
   * Start continuous news monitoring
   * @param {Number} intervalMinutes - Check interval in minutes
   */
  startMonitoring(intervalMinutes = 30) {
    if (this.isMonitoring) {
      logger.warn('News Agent is already monitoring');
      return;
    }

    logger.info(`Starting News Agent monitoring (interval: ${intervalMinutes} minutes)`);
    this.isMonitoring = true;

    // Initial fetch
    this.fetchNews();

    // Set up periodic fetching
    this.updateInterval = setInterval(() => {
      this.fetchNews();
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Stop news monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) {
      logger.warn('News Agent is not currently monitoring');
      return;
    }

    logger.info('Stopping News Agent monitoring');
    this.isMonitoring = false;

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Fetch latest news from multiple sources
   */
  async fetchNews() {
    try {
      logger.info('Fetching latest oil & gas news...');

      // In production, would call real news APIs
      // For now, generating sample news
      const generalNews = await this.fetchGeneralNews();
      const policyNews = await this.fetchPolicyNews();
      const emissionsNews = await this.fetchEmissionsNews();

      // Process and deduplicate
      this.newsCache = this.deduplicateNews([...generalNews, ...policyNews, ...emissionsNews]);
      this.policyUpdates = policyNews;
      this.emissionsNews = emissionsNews;
      this.lastUpdate = new Date().toISOString();

      logger.info(`Fetched ${this.newsCache.length} news articles`);

    } catch (error) {
      logger.error('Error fetching news:', error);
    }
  }

  /**
   * Fetch general oil & gas news
   */
  async fetchGeneralNews() {
    // In production, would call Reuters, Bloomberg APIs
    // Simulating news for demonstration
    return this.generateSampleNews('general', 10);
  }

  /**
   * Fetch policy and regulatory news
   */
  async fetchPolicyNews() {
    // In production, would monitor EPA, DOE, regulatory sites
    return this.generateSampleNews('policy', 5);
  }

  /**
   * Fetch emissions and sustainability news
   */
  async fetchEmissionsNews() {
    // In production, would monitor ESG news sources
    return this.generateSampleNews('emissions', 5);
  }

  /**
   * Generate sample news (placeholder for real API integration)
   */
  generateSampleNews(category, count) {
    const companies = ['ExxonMobil', 'Chevron', 'Shell', 'BP', 'SLB', 'Halliburton', 'ConocoPhillips'];
    const topics = {
      general: [
        'announces Q4 earnings beat expectations',
        'invests in digital transformation initiative',
        'expands operations in Permian Basin',
        'signs major LNG supply agreement',
        'launches new AI-powered drilling technology'
      ],
      policy: [
        'faces new EPA emissions regulations',
        'responds to updated methane rules',
        'comments on proposed carbon tax legislation',
        'receives offshore drilling permit approval',
        'challenges new environmental policy in court'
      ],
      emissions: [
        'commits to net-zero by 2050',
        'invests $500M in carbon capture project',
        'reports 15% reduction in methane emissions',
        'partners with tech company on emissions monitoring',
        'launches renewable energy division'
      ]
    };

    const sources = Object.keys(this.sourceCredibility);
    const news = [];

    for (let i = 0; i < count; i++) {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const topic = topics[category][Math.floor(Math.random() * topics[category].length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      
      news.push({
        id: `news_${Date.now()}_${i}`,
        title: `${company} ${topic}`,
        summary: `${company} has made significant moves in the ${category} space. This development could have major implications for the oil and gas industry and presents potential opportunities for IBM solutions.`,
        source: source,
        credibilityScore: this.sourceCredibility[source],
        category: category,
        company: company,
        publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        url: `https://example.com/news/${Date.now()}_${i}`,
        keywords: this.extractKeywords(category, topic),
        ibmRelevance: this.calculateIBMRelevance(topic),
        sentiment: this.analyzeSentiment(topic)
      });
    }

    return news;
  }

  /**
   * Search news by company
   * @param {String} companyName - Company to search for
   * @param {Number} limit - Maximum number of results
   */
  searchByCompany(companyName, limit = 10) {
    const results = this.newsCache
      .filter(article => 
        article.company.toLowerCase().includes(companyName.toLowerCase()) ||
        article.title.toLowerCase().includes(companyName.toLowerCase())
      )
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, limit);

    return {
      company: companyName,
      count: results.length,
      articles: results,
      summary: this.generateCompanySummary(results),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Search news by keywords
   */
  searchByKeywords(keywords, limit = 10) {
    const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
    
    const results = this.newsCache
      .filter(article => 
        keywordArray.some(keyword =>
          article.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase())) ||
          article.title.toLowerCase().includes(keyword.toLowerCase())
        )
      )
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, limit);

    return {
      keywords: keywordArray,
      count: results.length,
      articles: results,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get policy updates
   */
  getPolicyUpdates(limit = 10) {
    return {
      count: this.policyUpdates.length,
      updates: this.policyUpdates.slice(0, limit),
      summary: this.generatePolicySummary(this.policyUpdates),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get emissions and sustainability news
   */
  getEmissionsNews(limit = 10) {
    return {
      count: this.emissionsNews.length,
      news: this.emissionsNews.slice(0, limit),
      summary: this.generateEmissionsSummary(this.emissionsNews),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get top news stories
   */
  getTopStories(limit = 5) {
    const topStories = this.newsCache
      .sort((a, b) => {
        // Sort by credibility score and IBM relevance
        const scoreA = a.credibilityScore * 0.5 + a.ibmRelevance * 0.5;
        const scoreB = b.credibilityScore * 0.5 + b.ibmRelevance * 0.5;
        return scoreB - scoreA;
      })
      .slice(0, limit);

    return {
      count: topStories.length,
      stories: topStories,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Deduplicate news articles
   */
  deduplicateNews(articles) {
    const seen = new Map();
    const deduplicated = [];

    for (const article of articles) {
      // Create a simple hash based on title similarity
      const titleWords = article.title.toLowerCase().split(' ').slice(0, 5).join(' ');
      
      if (!seen.has(titleWords)) {
        seen.set(titleWords, true);
        deduplicated.push(article);
      } else {
        logger.debug(`Duplicate article filtered: ${article.title}`);
      }
    }

    return deduplicated;
  }

  /**
   * Check source credibility
   */
  checkCredibility(source) {
    const score = this.sourceCredibility[source] || 50;
    
    return {
      source,
      score,
      rating: this.getCredibilityRating(score),
      trusted: score >= 80
    };
  }

  /**
   * Get credibility rating
   */
  getCredibilityRating(score) {
    if (score >= 90) return 'Highly Trusted';
    if (score >= 80) return 'Trusted';
    if (score >= 70) return 'Reliable';
    if (score >= 60) return 'Moderate';
    return 'Unverified';
  }

  /**
   * Extract keywords from text
   */
  extractKeywords(category, text) {
    const keywordMap = {
      general: ['investment', 'expansion', 'technology', 'digital', 'AI'],
      policy: ['regulation', 'EPA', 'compliance', 'permit', 'legislation'],
      emissions: ['carbon', 'emissions', 'sustainability', 'renewable', 'net-zero']
    };

    const baseKeywords = keywordMap[category] || [];
    const textKeywords = text.toLowerCase().match(/\b(ai|digital|cloud|cyber|carbon|emissions)\b/g) || [];
    
    return [...new Set([...baseKeywords, ...textKeywords])];
  }

  /**
   * Calculate IBM relevance score
   */
  calculateIBMRelevance(text) {
    const relevantTerms = [
      'digital', 'AI', 'artificial intelligence', 'cloud', 'cybersecurity',
      'automation', 'analytics', 'transformation', 'modernization', 'technology'
    ];

    const textLower = text.toLowerCase();
    const matches = relevantTerms.filter(term => textLower.includes(term.toLowerCase()));
    
    return Math.min(matches.length * 15, 100);
  }

  /**
   * Analyze sentiment
   */
  analyzeSentiment(text) {
    const positiveWords = ['growth', 'expansion', 'success', 'innovation', 'investment'];
    const negativeWords = ['decline', 'loss', 'challenge', 'risk', 'concern'];
    
    const textLower = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Generate company summary
   */
  generateCompanySummary(articles) {
    if (articles.length === 0) return 'No recent news found';

    const categories = {};
    articles.forEach(article => {
      categories[article.category] = (categories[article.category] || 0) + 1;
    });

    const topCategory = Object.keys(categories).reduce((a, b) => 
      categories[a] > categories[b] ? a : b
    );

    return `${articles.length} recent articles found, primarily focused on ${topCategory}`;
  }

  /**
   * Generate policy summary
   */
  generatePolicySummary(updates) {
    if (updates.length === 0) return 'No recent policy updates';
    
    return `${updates.length} policy updates tracked, including regulatory changes and compliance requirements`;
  }

  /**
   * Generate emissions summary
   */
  generateEmissionsSummary(news) {
    if (news.length === 0) return 'No recent emissions news';
    
    return `${news.length} sustainability and emissions-related developments tracked`;
  }

  /**
   * Get monitoring status
   */
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      lastUpdate: this.lastUpdate,
      cachedArticles: this.newsCache.length,
      policyUpdates: this.policyUpdates.length,
      emissionsNews: this.emissionsNews.length
    };
  }

  /**
   * Force immediate news fetch
   */
  async forceUpdate() {
    logger.info('Forcing news update...');
    await this.fetchNews();
    return {
      success: true,
      articlesCount: this.newsCache.length,
      timestamp: this.lastUpdate
    };
  }

  /**
   * Clear news cache
   */
  clearCache() {
    this.newsCache = [];
    this.policyUpdates = [];
    this.emissionsNews = [];
    this.lastUpdate = null;
    logger.info('News cache cleared');
  }
}

module.exports = NewsAgent;

// Made with Bob
