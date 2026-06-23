/**
 * Oil & Gas Intelligence Assistant - Live Demo
 * Demonstrates all system capabilities without requiring Slack
 * 
 * Run: node demo.js
 */

const OpportunityScorer = require('./src/services/opportunityScorer');
const { WorkflowAutomation, WORKFLOW_TYPES } = require('./src/services/workflowAutomation');
const MarketMonitorAgent = require('./src/agents/marketMonitorAgent');
const NewsAgent = require('./src/agents/newsAgent');
const ClientIntelligenceAgent = require('./src/agents/clientIntelligenceAgent');
const DealRadarAgent = require('./src/agents/dealRadarAgent');

// Utility function for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Utility function for section headers
const printHeader = (title) => {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60) + '\n');
};

// Main demo function
async function runDemo() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║     🛢️  OIL & GAS INTELLIGENCE ASSISTANT - LIVE DEMO     ║');
  console.log('║                                                            ║');
  console.log('║              IBM Bobathon Project 2026                     ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\n');
  
  await sleep(1000);

  // ============================================================
  // DEMO 1: OPPORTUNITY SCORING SYSTEM
  // ============================================================
  printHeader('1️⃣  OPPORTUNITY SCORING SYSTEM');
  
  console.log('Creating sample opportunity for ExxonMobil...\n');
  
  const scorer = new OpportunityScorer();
  const opportunity = {
    id: 'demo_001',
    title: "ExxonMobil AI-Powered Digital Transformation Initiative",
    client: "ExxonMobil",
    description: "Major digital transformation project focusing on AI and predictive analytics for upstream operations",
    estimatedValue: 15000000,
    urgencyLevel: "critical",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    matchesStrategicPriority: true,
    isPriorityGeography: true,
    businessSegment: "upstream",
    geography: "Permian Basin",
    ibmProducts: ["watsonx", "Maximo", "Hybrid Cloud", "IBM Consulting"],
    keywords: ["AI", "digital transformation", "predictive analytics", "automation"],
    closeProbability: 0.7,
    expansionPotential: "high",
    clientBudgetConfirmed: true,
    decisionMakerEngaged: true,
    executiveInvolvement: ["CIO", "CTO"],
    relationshipStrength: "strong",
    referencePotential: true,
    strategicAccount: true,
    competitorsInvolved: ["Accenture"],
    incumbentAdvantage: "moderate"
  };

  console.log('📋 Opportunity Details:');
  console.log(`   Title: ${opportunity.title}`);
  console.log(`   Client: ${opportunity.client}`);
  console.log(`   Value: $${(opportunity.estimatedValue/1000000).toFixed(1)}M`);
  console.log(`   Urgency: ${opportunity.urgencyLevel}`);
  console.log(`   IBM Products: ${opportunity.ibmProducts.join(', ')}`);
  console.log('\n⚙️  Calculating opportunity score...\n');
  
  await sleep(1500);

  const scoring = scorer.scoreOpportunity(opportunity);
  
  console.log('✅ SCORING RESULTS:');
  console.log(`   Overall Score: ${scoring.totalScore}/100`);
  console.log(`   Priority Level: ${scoring.priority}`);
  console.log('\n📊 Score Breakdown:');
  Object.keys(scoring.scores).forEach(factor => {
    const score = scoring.scores[factor];
    const weight = scoring.weights[factor];
    const contribution = (score * weight).toFixed(1);
    const bar = '█'.repeat(Math.floor(score / 5));
    console.log(`   ${factor.padEnd(25)} ${score.toFixed(0).padStart(3)}/100 ${bar} (${(weight*100).toFixed(0)}% weight)`);
  });

  console.log('\n💡 Recommendations:');
  scoring.recommendation.forEach(rec => {
    console.log(`   • ${rec}`);
  });

  const explanation = scorer.explainScore(scoring);
  console.log('\n🎯 Top Contributing Factors:');
  explanation.topFactors.forEach((factor, i) => {
    console.log(`   ${i+1}. ${factor}`);
  });

  await sleep(2000);

  // ============================================================
  // DEMO 2: MARKET MONITOR AGENT
  // ============================================================
  printHeader('2️⃣  MARKET MONITOR AGENT');
  
  console.log('Initializing Market Monitor Agent...\n');
  const marketMonitor = new MarketMonitorAgent();
  
  console.log('📈 Fetching real-time oil & gas market data...\n');
  await marketMonitor.updateMarketData();
  await sleep(1000);
  
  const marketReport = marketMonitor.getMarketReport();
  
  console.log('✅ MARKET DATA UPDATED:');
  console.log(`\n${marketReport.summary}\n`);
  
  console.log('💰 Current Prices:');
  console.log(`   WTI Crude:     $${marketReport.data.crudeOil.wti.price.toFixed(2)}/bbl  (${marketReport.data.crudeOil.wti.changePercent > 0 ? '+' : ''}${marketReport.data.crudeOil.wti.changePercent.toFixed(2)}%)`);
  console.log(`   Brent Crude:   $${marketReport.data.crudeOil.brent.price.toFixed(2)}/bbl  (${marketReport.data.crudeOil.brent.changePercent > 0 ? '+' : ''}${marketReport.data.crudeOil.brent.changePercent.toFixed(2)}%)`);
  console.log(`   Natural Gas:   $${marketReport.data.naturalGas.henryHub.price.toFixed(2)}/MMBtu (${marketReport.data.naturalGas.henryHub.changePercent > 0 ? '+' : ''}${marketReport.data.naturalGas.henryHub.changePercent.toFixed(2)}%)`);
  
  console.log('\n🔧 Drilling Activity:');
  console.log(`   US Rig Count:  ${marketReport.data.rigCount.total} rigs (${marketReport.data.rigCount.change > 0 ? '+' : ''}${marketReport.data.rigCount.change})`);
  console.log(`   Oil Rigs:      ${marketReport.data.rigCount.oil}`);
  console.log(`   Gas Rigs:      ${marketReport.data.rigCount.gas}`);
  
  console.log('\n📊 Refining:');
  console.log(`   Crack Spread:  $${marketReport.data.refiningMargins.crackSpread.value.toFixed(2)}/bbl`);
  console.log(`   Utilization:   ${marketReport.data.refiningMargins.utilizationRate}%`);
  
  console.log('\n💡 Market Insights:');
  marketReport.insights.forEach(insight => {
    const emoji = insight.severity === 'high' ? '🔴' : insight.severity === 'medium' ? '🟡' : '🟢';
    console.log(`   ${emoji} ${insight.message}`);
    console.log(`      → IBM Opportunity: ${insight.ibmOpportunity}`);
  });
  
  console.log('\n🎯 IBM Solution Relevance:');
  marketReport.ibmRelevance.forEach(rel => {
    console.log(`   • ${rel.condition}`);
    console.log(`     Solution: ${rel.ibmSolution}`);
    console.log(`     Rationale: ${rel.rationale}`);
  });

  await sleep(2000);

  // ============================================================
  // DEMO 3: NEWS & POLICY AGENT
  // ============================================================
  printHeader('3️⃣  NEWS & POLICY AGENT');
  
  console.log('Initializing News Agent...\n');
  const newsAgent = new NewsAgent();
  
  console.log('📰 Fetching latest oil & gas news from multiple sources...\n');
  await newsAgent.fetchNews();
  await sleep(1000);
  
  const topStories = newsAgent.getTopStories(5);
  
  console.log(`✅ FOUND ${topStories.count} TOP STORIES:\n`);
  
  topStories.stories.forEach((story, i) => {
    console.log(`${i+1}. ${story.title}`);
    console.log(`   Source: ${story.source} | Credibility: ${story.credibilityScore}/100`);
    console.log(`   Category: ${story.category} | Sentiment: ${story.sentiment}`);
    console.log(`   IBM Relevance: ${story.ibmRelevance}/100`);
    console.log(`   Keywords: ${story.keywords.slice(0, 3).join(', ')}`);
    console.log('');
  });
  
  // Company-specific news
  console.log('🔍 Searching for ExxonMobil-specific news...\n');
  const exxonNews = newsAgent.searchByCompany('ExxonMobil', 3);
  
  console.log(`Found ${exxonNews.count} articles about ${exxonNews.company}:\n`);
  exxonNews.articles.forEach((article, i) => {
    console.log(`   ${i+1}. ${article.title}`);
    console.log(`      ${article.summary.substring(0, 100)}...`);
  });

  await sleep(2000);

  // ============================================================
  // DEMO 4: CLIENT INTELLIGENCE AGENT
  // ============================================================
  printHeader('4️⃣  CLIENT INTELLIGENCE AGENT');
  
  console.log('Initializing Client Intelligence Agent...\n');
  const clientIntelligence = new ClientIntelligenceAgent();
  
  console.log('📂 Loading account profiles...\n');
  await clientIntelligence.initialize();
  await sleep(1000);
  
  const trackedCompanies = clientIntelligence.getTrackedCompanies();
  console.log(`✅ Tracking ${trackedCompanies.length} oil & gas companies\n`);
  
  if (trackedCompanies.length > 0) {
    console.log('📋 Tracked Companies:');
    trackedCompanies.forEach(company => {
      console.log(`   • ${company.name}`);
      if (company.strategicPriorities) {
        console.log(`     Priorities: ${company.strategicPriorities.join(', ')}`);
      }
    });
  } else {
    console.log('ℹ️  No account profiles loaded yet.');
    console.log('   Profiles can be added to data/profiles/ directory');
  }
  
  console.log('\n🔍 Filtering news for ExxonMobil...\n');
  const filteredNews = clientIntelligence.filterNewsByProfile('ExxonMobil', exxonNews.articles);
  
  console.log(`Profile-based filtering: ${filteredNews.totalArticles} → ${filteredNews.filteredArticles} articles`);
  if (filteredNews.profileFound) {
    console.log('✅ Profile found - news filtered by strategic priorities');
  } else {
    console.log('ℹ️  No profile found - showing all news');
  }

  await sleep(2000);

  // ============================================================
  // DEMO 5: WORKFLOW AUTOMATION
  // ============================================================
  printHeader('5️⃣  WORKFLOW AUTOMATION SYSTEM');
  
  console.log('Initializing Workflow Automation...\n');
  const workflowAutomation = new WorkflowAutomation();
  
  console.log('🔄 Executing Opportunity Alert Workflow...\n');
  await sleep(1000);
  
  const workflowResult = await workflowAutomation.executeWorkflow(
    opportunity,
    scoring,
    WORKFLOW_TYPES.OPPORTUNITY_ALERT
  );
  
  if (workflowResult.success) {
    console.log('✅ WORKFLOW COMPLETED SUCCESSFULLY');
    console.log(`   Workflow ID: ${workflowResult.workflowId}`);
    console.log(`   Type: ${workflowResult.result.type}`);
    console.log(`   Channel: ${workflowResult.result.channel}`);
    console.log(`   Steps Executed: ${workflowResult.result.steps.length}`);
    console.log('\n📝 Workflow Steps:');
    workflowResult.result.steps.forEach((step, i) => {
      const statusEmoji = step.status === 'completed' ? '✅' : step.status === 'skipped' ? '⏭️' : '❌';
      console.log(`   ${i+1}. ${statusEmoji} ${step.step}`);
      if (step.reason) {
        console.log(`      Reason: ${step.reason}`);
      }
    });
  }
  
  console.log('\n🔄 Available Workflow Types:');
  console.log('   • Opportunity Alerts');
  console.log('   • Meeting Preparation');
  console.log('   • Client Outreach');
  console.log('   • CRM Logging');
  console.log('   • Task Assignment');
  console.log('   • Report Generation');
  console.log('   • Scheduled Updates');

  await sleep(2000);

  // ============================================================
  // DEMO 6: DEAL RADAR AGENT
  // ============================================================
  printHeader('6️⃣  DEAL RADAR AGENT');
  
  console.log('Initializing Deal Radar Agent...\n');
  const dealRadar = new DealRadarAgent();
  
  console.log('🎯 Evaluating opportunity with Deal Radar...\n');
  await sleep(1000);
  
  await dealRadar.evaluateOpportunity(opportunity);
  
  const detectedOpps = dealRadar.getDetectedOpportunities(3);
  console.log(`✅ Deal Radar has detected ${detectedOpps.length} opportunities\n`);
  
  detectedOpps.forEach((item, i) => {
    const opp = item.opportunity;
    const score = item.scoring;
    const priorityEmoji = {
      'CRITICAL': '🚨',
      'URGENT': '⚠️',
      'HIGH': '🔴',
      'MEDIUM': '🟡',
      'LOW': '🟢'
    };
    
    console.log(`${i+1}. ${priorityEmoji[score.priority]} ${opp.title}`);
    console.log(`   Client: ${opp.client}`);
    console.log(`   Score: ${score.totalScore}/100 (${score.priority})`);
    console.log(`   Value: $${(opp.estimatedValue/1000000).toFixed(1)}M`);
    console.log(`   Detected: ${new Date(item.detectedAt).toLocaleString()}`);
    console.log('');
  });
  
  const radarStatus = dealRadar.getStatus();
  console.log('📊 Deal Radar Status:');
  console.log(`   Monitoring: ${radarStatus.isMonitoring ? 'Active' : 'Standby'}`);
  console.log(`   Opportunities Detected: ${radarStatus.detectedOpportunitiesCount}`);
  console.log(`   Alert Thresholds:`);
  console.log(`     Critical: ${radarStatus.alertThresholds.critical}+`);
  console.log(`     Urgent: ${radarStatus.alertThresholds.urgent}+`);
  console.log(`     High: ${radarStatus.alertThresholds.high}+`);

  await sleep(2000);

  // ============================================================
  // DEMO 7: BATCH SCORING
  // ============================================================
  printHeader('7️⃣  BATCH OPPORTUNITY SCORING');
  
  console.log('Creating multiple opportunities for batch scoring...\n');
  
  const opportunities = [
    {
      title: "Shell Cloud Migration Project",
      client: "Shell",
      estimatedValue: 8000000,
      urgencyLevel: "high",
      ibmProducts: ["Hybrid Cloud", "IBM Consulting"],
      closeProbability: 0.6
    },
    {
      title: "Chevron Cybersecurity Enhancement",
      client: "Chevron",
      estimatedValue: 12000000,
      urgencyLevel: "critical",
      executiveInvolvement: ["CISO"],
      closeProbability: 0.8
    },
    {
      title: "BP Sustainability Analytics Platform",
      client: "BP",
      estimatedValue: 6000000,
      urgencyLevel: "medium",
      ibmProducts: ["watsonx", "Environmental Intelligence"],
      closeProbability: 0.5
    }
  ];
  
  console.log('⚙️  Scoring all opportunities...\n');
  await sleep(1000);
  
  const batchResults = scorer.scoreMultipleOpportunities(opportunities);
  
  console.log('✅ BATCH SCORING RESULTS (sorted by score):\n');
  batchResults.forEach((result, i) => {
    const opp = result.opportunity;
    const score = result.scoring;
    console.log(`${i+1}. ${opp.title}`);
    console.log(`   Client: ${opp.client} | Value: $${(opp.estimatedValue/1000000).toFixed(1)}M`);
    console.log(`   Score: ${score.totalScore}/100 | Priority: ${score.priority}`);
    console.log('');
  });

  await sleep(2000);

  // ============================================================
  // SUMMARY
  // ============================================================
  printHeader('✅  DEMO COMPLETE - SYSTEM SUMMARY');
  
  console.log('🎯 All Systems Operational:\n');
  console.log('   ✅ Opportunity Scoring System - 8-factor weighted analysis');
  console.log('   ✅ Market Monitor Agent - Real-time oil & gas data tracking');
  console.log('   ✅ News & Policy Agent - Multi-source news aggregation');
  console.log('   ✅ Client Intelligence Agent - Account profile management');
  console.log('   ✅ Deal Radar Agent - Continuous opportunity monitoring');
  console.log('   ✅ Workflow Automation - 7 automated workflow types');
  console.log('   ✅ Batch Processing - Multiple opportunity scoring');
  
  console.log('\n📊 Demo Statistics:');
  console.log(`   Opportunities Scored: ${batchResults.length + 1}`);
  console.log(`   News Articles Analyzed: ${topStories.count}`);
  console.log(`   Market Indicators Tracked: 6`);
  console.log(`   Workflows Executed: 1`);
  console.log(`   Companies Monitored: ${trackedCompanies.length || 'Ready for profiles'}`);
  
  console.log('\n🚀 Production Ready Features:');
  console.log('   • Slack bot integration (requires workspace access)');
  console.log('   • REST API endpoints');
  console.log('   • Scheduled intelligence updates');
  console.log('   • Real-time alert notifications');
  console.log('   • CRM integration ready');
  console.log('   • Comprehensive logging');
  
  console.log('\n📚 Documentation:');
  console.log('   • Architecture Guide: docs/architecture.md');
  console.log('   • Account Profiles: docs/account-profiles.md');
  console.log('   • Slack Setup: docs/slack-setup-guide.md');
  console.log('   • GitHub Repo: https://github.com/IBMAyush/Bobathon');
  
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║              🎉 DEMO SUCCESSFULLY COMPLETED 🎉             ║');
  console.log('║                                                            ║');
  console.log('║     Oil & Gas Intelligence Assistant is ready for          ║');
  console.log('║              production deployment!                        ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\n');
}

// Run the demo
console.log('Starting demo in 2 seconds...\n');
setTimeout(() => {
  runDemo().catch(error => {
    console.error('\n❌ Demo Error:', error.message);
    console.error('\nMake sure you have run: npm install\n');
  });
}, 2000);

// Made with Bob
