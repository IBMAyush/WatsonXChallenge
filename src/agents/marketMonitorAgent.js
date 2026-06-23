/**
 * Market Monitor Agent
 * Tracks oil & gas market indicators and provides real-time market intelligence
 * 
 * @author IBM Bobathon Team
 * @version 1.0.0
 */

const logger = require('../utils/logger');
const axios = require('axios');

class MarketMonitorAgent {
  constructor() {
    this.marketData = {
      lastUpdate: null,
      crudeOil: null,
      naturalGas: null,
      rigCount: null,
      inventory: null,
      refiningMargins: null,
      opecActivity: null
    };
    this.updateInterval = null;
    this.isMonitoring = false;
  }

  /**
   * Start continuous market monitoring
   * @param {Number} intervalMinutes - Update interval in minutes
   */
  startMonitoring(intervalMinutes = 60) {
    if (this.isMonitoring) {
      logger.warn('Market Monitor is already running');
      return;
    }

    logger.info(`Starting Market Monitor (interval: ${intervalMinutes} minutes)`);
    this.isMonitoring = true;

    // Initial update
    this.updateMarketData();

    // Set up periodic updates
    this.updateInterval = setInterval(() => {
      this.updateMarketData();
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Stop market monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) {
      logger.warn('Market Monitor is not currently running');
      return;
    }

    logger.info('Stopping Market Monitor');
    this.isMonitoring = false;

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Update all market data
   */
  async updateMarketData() {
    try {
      logger.info('Updating market data...');

      await Promise.all([
        this.updateCrudeOilPrices(),
        this.updateNaturalGasPrices(),
        this.updateRigCount(),
        this.updateInventoryLevels(),
        this.updateRefiningMargins(),
        this.updateOPECActivity()
      ]);

      this.marketData.lastUpdate = new Date().toISOString();
      logger.info('Market data updated successfully');

    } catch (error) {
      logger.error('Error updating market data:', error);
    }
  }

  /**
   * Update crude oil prices
   */
  async updateCrudeOilPrices() {
    try {
      // In production, would call EIA API or Bloomberg
      // For now, using simulated data
      const wtiPrice = this.simulatePrice(70, 85);
      const brentPrice = this.simulatePrice(73, 88);

      this.marketData.crudeOil = {
        wti: {
          price: wtiPrice,
          change: this.calculateChange(wtiPrice, 75),
          changePercent: this.calculateChangePercent(wtiPrice, 75),
          unit: 'USD/barrel'
        },
        brent: {
          price: brentPrice,
          change: this.calculateChange(brentPrice, 78),
          changePercent: this.calculateChangePercent(brentPrice, 78),
          unit: 'USD/barrel'
        },
        timestamp: new Date().toISOString()
      };

      logger.debug(`Crude oil updated: WTI $${wtiPrice}, Brent $${brentPrice}`);
    } catch (error) {
      logger.error('Error updating crude oil prices:', error);
    }
  }

  /**
   * Update natural gas prices
   */
  async updateNaturalGasPrices() {
    try {
      const henryHubPrice = this.simulatePrice(2.5, 4.5);

      this.marketData.naturalGas = {
        henryHub: {
          price: henryHubPrice,
          change: this.calculateChange(henryHubPrice, 3.5),
          changePercent: this.calculateChangePercent(henryHubPrice, 3.5),
          unit: 'USD/MMBtu'
        },
        timestamp: new Date().toISOString()
      };

      logger.debug(`Natural gas updated: $${henryHubPrice}/MMBtu`);
    } catch (error) {
      logger.error('Error updating natural gas prices:', error);
    }
  }

  /**
   * Update rig count data
   */
  async updateRigCount() {
    try {
      // In production, would call Baker Hughes API
      const usRigCount = Math.floor(Math.random() * (650 - 550) + 550);
      const oilRigs = Math.floor(usRigCount * 0.75);
      const gasRigs = usRigCount - oilRigs;

      this.marketData.rigCount = {
        total: usRigCount,
        oil: oilRigs,
        gas: gasRigs,
        change: Math.floor(Math.random() * 20 - 10),
        region: 'United States',
        timestamp: new Date().toISOString()
      };

      logger.debug(`Rig count updated: ${usRigCount} total rigs`);
    } catch (error) {
      logger.error('Error updating rig count:', error);
    }
  }

  /**
   * Update inventory levels
   */
  async updateInventoryLevels() {
    try {
      // In production, would call EIA API
      const crudeInventory = Math.floor(Math.random() * (450 - 400) + 400);
      const gasolineInventory = Math.floor(Math.random() * (240 - 210) + 210);

      this.marketData.inventory = {
        crudeOil: {
          level: crudeInventory,
          change: Math.floor(Math.random() * 10 - 5),
          unit: 'million barrels'
        },
        gasoline: {
          level: gasolineInventory,
          change: Math.floor(Math.random() * 6 - 3),
          unit: 'million barrels'
        },
        timestamp: new Date().toISOString()
      };

      logger.debug(`Inventory updated: Crude ${crudeInventory}M bbls`);
    } catch (error) {
      logger.error('Error updating inventory levels:', error);
    }
  }

  /**
   * Update refining margins
   */
  async updateRefiningMargins() {
    try {
      const crackSpread = this.simulatePrice(15, 30);

      this.marketData.refiningMargins = {
        crackSpread: {
          value: crackSpread,
          change: this.calculateChange(crackSpread, 22),
          unit: 'USD/barrel'
        },
        utilizationRate: Math.floor(Math.random() * (95 - 85) + 85),
        timestamp: new Date().toISOString()
      };

      logger.debug(`Refining margins updated: $${crackSpread}/bbl`);
    } catch (error) {
      logger.error('Error updating refining margins:', error);
    }
  }

  /**
   * Update OPEC+ activity
   */
  async updateOPECActivity() {
    try {
      // In production, would scrape OPEC website or news
      const productionTarget = 40.5; // million bpd
      const compliance = Math.floor(Math.random() * (100 - 85) + 85);

      this.marketData.opecActivity = {
        productionTarget: {
          value: productionTarget,
          unit: 'million bpd'
        },
        compliance: {
          rate: compliance,
          unit: 'percent'
        },
        nextMeeting: this.getNextOPECMeeting(),
        recentDecision: 'Production cuts extended through Q2 2026',
        timestamp: new Date().toISOString()
      };

      logger.debug(`OPEC+ updated: ${compliance}% compliance`);
    } catch (error) {
      logger.error('Error updating OPEC activity:', error);
    }
  }

  /**
   * Get comprehensive market report
   */
  getMarketReport() {
    if (!this.marketData.lastUpdate) {
      return {
        error: 'Market data not yet available',
        message: 'Please wait for initial data collection'
      };
    }

    return {
      summary: this.generateMarketSummary(),
      data: this.marketData,
      insights: this.generateMarketInsights(),
      ibmRelevance: this.analyzeIBMRelevance(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate market summary
   */
  generateMarketSummary() {
    const { crudeOil, naturalGas, rigCount } = this.marketData;

    if (!crudeOil || !naturalGas || !rigCount) {
      return 'Market data loading...';
    }

    const oilTrend = crudeOil.wti.change > 0 ? '📈 up' : '📉 down';
    const gasTrend = naturalGas.henryHub.change > 0 ? '📈 up' : '📉 down';
    const rigTrend = rigCount.change > 0 ? '📈 up' : '📉 down';

    return `Oil prices ${oilTrend} (WTI: $${crudeOil.wti.price.toFixed(2)}), ` +
           `Natural gas ${gasTrend} ($${naturalGas.henryHub.price.toFixed(2)}), ` +
           `US rig count ${rigTrend} (${rigCount.total} rigs)`;
  }

  /**
   * Generate market insights
   */
  generateMarketInsights() {
    const insights = [];
    const { crudeOil, naturalGas, rigCount, inventory, refiningMargins } = this.marketData;

    // Oil price insights
    if (crudeOil && crudeOil.wti.price > 80) {
      insights.push({
        type: 'price_alert',
        severity: 'high',
        message: 'Oil prices above $80/bbl - Increased focus on cost optimization and efficiency',
        ibmOpportunity: 'Maximo for asset optimization, watsonx for predictive analytics'
      });
    }

    // Rig count insights
    if (rigCount && rigCount.change > 10) {
      insights.push({
        type: 'activity_increase',
        severity: 'medium',
        message: 'Significant increase in drilling activity',
        ibmOpportunity: 'Digital oilfield solutions, IoT for remote monitoring'
      });
    }

    // Refining margins insights
    if (refiningMargins && refiningMargins.crackSpread.value > 25) {
      insights.push({
        type: 'margin_expansion',
        severity: 'medium',
        message: 'Strong refining margins - Opportunity for modernization investments',
        ibmOpportunity: 'Refinery optimization, predictive maintenance'
      });
    }

    // Inventory insights
    if (inventory && inventory.crudeOil.change < -5) {
      insights.push({
        type: 'inventory_draw',
        severity: 'low',
        message: 'Crude inventory drawdown indicates strong demand',
        ibmOpportunity: 'Supply chain optimization, demand forecasting'
      });
    }

    return insights.length > 0 ? insights : [{
      type: 'stable',
      severity: 'low',
      message: 'Market conditions stable',
      ibmOpportunity: 'Focus on long-term digital transformation initiatives'
    }];
  }

  /**
   * Analyze IBM relevance based on market conditions
   */
  analyzeIBMRelevance() {
    const relevance = [];
    const { crudeOil, rigCount, refiningMargins } = this.marketData;

    // High oil prices = focus on efficiency
    if (crudeOil && crudeOil.wti.price > 75) {
      relevance.push({
        condition: 'High oil prices',
        ibmSolution: 'IBM Maximo',
        rationale: 'Operators focus on maximizing asset efficiency and reducing downtime',
        priority: 'high'
      });
    }

    // Increasing rig count = expansion
    if (rigCount && rigCount.change > 5) {
      relevance.push({
        condition: 'Increasing drilling activity',
        ibmSolution: 'watsonx + IoT',
        rationale: 'Need for digital oilfield solutions and remote monitoring',
        priority: 'high'
      });
    }

    // Strong margins = investment opportunity
    if (refiningMargins && refiningMargins.crackSpread.value > 20) {
      relevance.push({
        condition: 'Strong refining margins',
        ibmSolution: 'IBM Consulting + Hybrid Cloud',
        rationale: 'Refiners have capital for modernization projects',
        priority: 'medium'
      });
    }

    return relevance;
  }

  /**
   * Get specific market indicator
   */
  getIndicator(indicatorName) {
    return this.marketData[indicatorName] || null;
  }

  /**
   * Check if market data is stale
   */
  isDataStale(maxAgeMinutes = 120) {
    if (!this.marketData.lastUpdate) return true;
    
    const lastUpdate = new Date(this.marketData.lastUpdate);
    const now = new Date();
    const ageMinutes = (now - lastUpdate) / (1000 * 60);
    
    return ageMinutes > maxAgeMinutes;
  }

  // ==================== Helper Methods ====================

  simulatePrice(min, max) {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  }

  calculateChange(current, previous) {
    return Math.round((current - previous) * 100) / 100;
  }

  calculateChangePercent(current, previous) {
    return Math.round(((current - previous) / previous) * 10000) / 100;
  }

  getNextOPECMeeting() {
    // Simplified - would calculate actual next meeting date
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split('T')[0];
  }

  /**
   * Get monitoring status
   */
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      lastUpdate: this.marketData.lastUpdate,
      dataStale: this.isDataStale(),
      indicators: Object.keys(this.marketData).filter(k => k !== 'lastUpdate')
    };
  }

  /**
   * Force immediate update
   */
  async forceUpdate() {
    logger.info('Forcing market data update...');
    await this.updateMarketData();
    return this.getMarketReport();
  }
}

module.exports = MarketMonitorAgent;

// Made with Bob
