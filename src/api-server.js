/**
 * REST API Server for Oil & Gas Intelligence Assistant
 * Exposes all functionality as API endpoints for watsonx Orchestrate integration
 * 
 * Run: node src/api-server.js
 */

const express = require('express');
const cors = require('cors');
const OpportunityScorer = require('./services/opportunityScorer');
const { WorkflowAutomation, WORKFLOW_TYPES } = require('./services/workflowAutomation');
const MarketMonitorAgent = require('./agents/marketMonitorAgent');
const NewsAgent = require('./agents/newsAgent');
const ClientIntelligenceAgent = require('./agents/clientIntelligenceAgent');
const DealRadarAgent = require('./agents/dealRadarAgent');
const logger = require('./utils/logger');

// Initialize Express
const app = express();
const PORT = process.env.API_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Initialize services and agents
const opportunityScorer = new OpportunityScorer();
const workflowAutomation = new WorkflowAutomation();
const marketMonitor = new MarketMonitorAgent();
const newsAgent = new NewsAgent();
const clientIntelligence = new ClientIntelligenceAgent();
const dealRadar = new DealRadarAgent();

// Initialize agents on startup
(async () => {
  try {
    await clientIntelligence.initialize();
    marketMonitor.startMonitoring(60);
    newsAgent.startMonitoring(30);
    logger.info('All agents initialized successfully');
  } catch (error) {
    logger.error('Error initializing agents:', error);
  }
})();

// ============================================================
// HEALTH CHECK
// ============================================================

/**
 * @api {get} /health Health Check
 * @apiDescription Check if the API server is running
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'oil-gas-intelligence-api',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// OPPORTUNITY SCORING ENDPOINTS
// ============================================================

/**
 * @api {post} /api/score-opportunity Score an Opportunity
 * @apiDescription Score a business opportunity using 8-factor analysis
 * @apiBody {Object} opportunity Opportunity details
 */
app.post('/api/score-opportunity', (req, res) => {
  try {
    const opportunity = req.body;
    const scoring = opportunityScorer.scoreOpportunity(opportunity);
    const explanation = opportunityScorer.explainScore(scoring);
    
    res.json({
      success: true,
      data: {
        scoring,
        explanation
      }
    });
  } catch (error) {
    logger.error('Error scoring opportunity:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @api {post} /api/score-opportunities Batch Score Opportunities
 * @apiDescription Score multiple opportunities at once
 * @apiBody {Array} opportunities Array of opportunity objects
 */
app.post('/api/score-opportunities', (req, res) => {
  try {
    const opportunities = req.body.opportunities || req.body;
    const results = opportunityScorer.scoreMultipleOpportunities(opportunities);
    
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    logger.error('Error batch scoring:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================
// MARKET MONITOR ENDPOINTS
// ============================================================

/**
 * @api {get} /api/market-monitor Get Market Monitor Report
 * @apiDescription Get comprehensive oil & gas market data
 */
app.get('/api/market-monitor', (req, res) => {
  try {
    const report = marketMonitor.getMarketReport();
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('Error getting market report:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @api {get} /api/market-monitor/prices Get Current Prices
 * @apiDescription Get current oil and gas prices
 */
app.get('/api/market-monitor/prices', (req, res) => {
  try {
    const report = marketMonitor.getMarketReport();
    
    res.json({
      success: true,
      data: {
        crudeOil: report.data.crudeOil,
        naturalGas: report.data.naturalGas,
        timestamp: report.data.lastUpdate
      }
    });
  } catch (error) {
    logger.error('Error getting prices:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @api {get} /api/market-monitor/rig-count Get Rig Count
 * @apiDescription Get current US rig count data
 */
app.get('/api/market-monitor/rig-count', (req, res) => {
  try {
    const report = marketMonitor.getMarketReport();
    
    res.json({
      success: true,
      data: report.data.rigCount
    });
  } catch (error) {
    logger.error('Error getting rig count:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @api {post} /api/market-monitor/update Force Market Data Update
 * @apiDescription Trigger immediate market data update
 */
app.post('/api/market-monitor/update', async (req, res) => {
  try {
    const report = await marketMonitor.forceUpdate();
    
    res.json({
      success: true,
      message: 'Market data updated',
      data: report
    });
  } catch (error) {
    logger.error('Error updating market data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================
// NEWS AGENT ENDPOINTS
// ============================================================

/**
 * @api {get} /api/news/top Get Top News Stories
 * @apiDescription Get top oil & gas news stories
 * @apiQuery {Number} limit Number of stories (default: 5)
 */
app.get('/api/news/top', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const stories = newsAgent.getTopStories(limit);
    
    res.json({
      success: true,
      data: stories
    });
  } catch (error) {
    logger.error('Error getting top stories:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @api {get} /api/news/company/:company Search News by Company
 * @apiDescription Get news for a specific company
 * @apiParam {String} company Company name
 * @apiQuery {Number} limit Number of articles (default: 10)
 */
app.get('/api/news/company/:company', (req, res) => {
  try {
    const company = req.params.company;
    const limit = parseInt(req.query.limit) || 10;
    const news = newsAgent.searchByCompany(company, limit);
    
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    logger.error('Error searching company news:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @api {get} /api/news/search Search News by Keywords
 * @apiDescription Search news by keywords
 * @apiQuery {String} keywords Comma-separated keywords
 * @apiQuery {Number} limit Number of articles (default: 10)
 */
app.get('/api/news/search', (req, res) => {
  try {
    const keywords = req.query.keywords ? req.query.keywords.split(',') : [];
    const limit = parseInt(req.query.limit) || 10;
    const news = newsAgent.searchByKeywords(keywords, limit);
    
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    logger.error('Error searching news:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @api {get} /api/news/policy Get Policy Updates
 * @apiDescription Get recent policy and regulatory updates
 * @apiQuery {Number} limit Number of updates (default: 10)
 */
app.get('/api/news/policy', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const updates = newsAgent.getPolicyUpdates(limit);
    
    res.json({
      success: true,
      data: updates
    });
  } catch (error) {
    logger.error('Error getting policy updates:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @api {get} /api/news/emissions Get Emissions News
 * @apiDescription Get emissions and sustainability news
 * @apiQuery {Number} limit Number of articles (default: 10)
 */
app.get('/api/news/emissions', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const news = newsAgent.getEmissionsNews(limit);
    
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    logger.error('Error getting emissions news:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================
// CLIENT INTELLIGENCE ENDPOINTS
// ============================================================

/**
 * @api {get} /api/clients Get Tracked Companies
 * @apiDescription Get list of tracked oil & gas companies
 */
app.get('/api/clients', (req, res) => {
  try {
    const companies = clientIntelligence.getTrackedCompanies();
    
    res.json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    logger.error('Error getting tracked companies:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @api {get} /api/clients/:company/profile Get Company Profile
 * @apiDescription Get detailed profile for a company
 * @apiParam {String} company Company name
 */
app.get('/api/clients/:company/profile', (req, res) => {
  try {
    const company = req.params.company;
    const profile = clientIntelligence.getProfile(company);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    logger.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @api {post} /api/clients/:company/intelligence Generate Client Intelligence Report
 * @apiDescription Generate comprehensive intelligence report for a company
 * @apiParam {String} company Company name
 * @apiBody {Array} newsArticles Recent news articles
 */
app.post('/api/clients/:company/intelligence', (req, res) => {
  try {
    const company = req.params.company;
    const newsArticles = req.body.newsArticles || newsAgent.searchByCompany(company, 20).articles;
    
    const report = clientIntelligence.generateClientReport(company, newsArticles);
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('Error generating intelligence report:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================
// DEAL RADAR ENDPOINTS
// ============================================================

/**
 * @api {get} /api/opportunities Get Detected Opportunities
 * @apiDescription Get opportunities detected by Deal Radar
 * @apiQuery {Number} limit Number of opportunities (default: 10)
 */
app.get('/api/opportunities', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const opportunities = dealRadar.getDetectedOpportunities(limit);
    
    res.json({
      success: true,
      count: opportunities.length,
      data: opportunities
    });
  } catch (error) {
    logger.error('Error getting opportunities:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @api {get} /api/opportunities/status Get Deal Radar Status
 * @apiDescription Get current status of Deal Radar monitoring
 */
app.get('/api/opportunities/status', (req, res) => {
  try {
    const status = dealRadar.getStatus();
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    logger.error('Error getting Deal Radar status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================
// WORKFLOW ENDPOINTS
// ============================================================

/**
 * @api {post} /api/workflow/execute Execute Workflow
 * @apiDescription Execute an automated workflow
 * @apiBody {Object} opportunity Opportunity data
 * @apiBody {Object} scoring Scoring result
 * @apiBody {String} workflowType Type of workflow to execute
 */
app.post('/api/workflow/execute', async (req, res) => {
  try {
    const { opportunity, scoring, workflowType } = req.body;
    
    const result = await workflowAutomation.executeWorkflow(
      opportunity,
      scoring,
      workflowType
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Error executing workflow:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @api {get} /api/workflow/types Get Available Workflow Types
 * @apiDescription Get list of available workflow types
 */
app.get('/api/workflow/types', (req, res) => {
  res.json({
    success: true,
    data: Object.values(WORKFLOW_TYPES)
  });
});

// ============================================================
// COMBINED ENDPOINTS (For watsonx Orchestrate)
// ============================================================

/**
 * @api {post} /api/analyze-opportunity Complete Opportunity Analysis
 * @apiDescription Analyze opportunity with scoring, news, and recommendations
 * @apiBody {Object} opportunity Opportunity details
 */
app.post('/api/analyze-opportunity', async (req, res) => {
  try {
    const opportunity = req.body;
    
    // Score the opportunity
    const scoring = opportunityScorer.scoreOpportunity(opportunity);
    
    // Get related news
    const news = opportunity.client ? 
      newsAgent.searchByCompany(opportunity.client, 5) : 
      { articles: [] };
    
    // Get market context
    const marketReport = marketMonitor.getMarketReport();
    
    res.json({
      success: true,
      data: {
        opportunity,
        scoring,
        relatedNews: news,
        marketContext: {
          summary: marketReport.summary,
          insights: marketReport.insights
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error analyzing opportunity:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @api {get} /api/intelligence-digest Get Intelligence Digest
 * @apiDescription Get comprehensive intelligence digest
 * @apiQuery {String} company Optional company filter
 */
app.get('/api/intelligence-digest', (req, res) => {
  try {
    const company = req.query.company;
    
    const digest = {
      marketMonitor: marketMonitor.getMarketReport(),
      topNews: newsAgent.getTopStories(5),
      opportunities: dealRadar.getDetectedOpportunities(5),
      timestamp: new Date().toISOString()
    };
    
    if (company) {
      digest.companyNews = newsAgent.searchByCompany(company, 5);
      digest.companyIntelligence = clientIntelligence.generateClientReport(
        company,
        digest.companyNews.articles
      );
    }
    
    res.json({
      success: true,
      data: digest
    });
  } catch (error) {
    logger.error('Error generating digest:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║     🛢️  OIL & GAS INTELLIGENCE API SERVER RUNNING        ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: See docs/api-reference.md\n`);
  console.log('Available Endpoints:');
  console.log('  POST /api/score-opportunity');
  console.log('  GET  /api/market-monitor');
  console.log('  GET  /api/news/company/:company');
  console.log('  GET  /api/opportunities');
  console.log('  POST /api/analyze-opportunity');
  console.log('  GET  /api/intelligence-digest');
  console.log('\n✅ Ready for watsonx Orchestrate integration!\n');
});

module.exports = app;

// Made with Bob
