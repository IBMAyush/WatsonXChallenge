/**
 * Oil & Gas Opportunity Intelligence Assistant
 * Main entry point for the application
 * 
 * @author IBM Bobathon Team
 * @version 1.0.0
 */

require('dotenv').config();
const { App } = require('@slack/bolt');
const express = require('express');
const logger = require('./utils/logger');

// Initialize Express app for health checks
const expressApp = express();
const PORT = process.env.PORT || 3000;

// Initialize Slack Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: PORT
});

/**
 * Health check endpoint
 */
expressApp.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'oil-gas-intelligence-assistant',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * Slack command: /oilgasbot
 * Main command handler for the bot
 */
app.command('/oilgasbot', async ({ command, ack, respond }) => {
  await ack();
  
  logger.info(`Received command: ${command.text}`);
  
  try {
    // Parse command text
    const commandText = command.text.toLowerCase().trim();
    
    // Route to appropriate handler based on command
    if (commandText.includes('news') || commandText.includes('regarding')) {
      await handleNewsQuery(command, respond);
    } else if (commandText.includes('monitor')) {
      await handleMarketMonitor(command, respond);
    } else if (commandText.includes('prep') || commandText.includes('meeting')) {
      await handleMeetingPrep(command, respond);
    } else if (commandText.includes('opportunities')) {
      await handleOpportunities(command, respond);
    } else if (commandText.includes('alert')) {
      await handleAlertSetup(command, respond);
    } else {
      await respond({
        text: 'Welcome to the Oil & Gas Intelligence Assistant! 🛢️',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Available Commands:*\n\n' +
                    '• `/oilgasbot any relevant news regarding [Company]` - Get company-specific news\n' +
                    '• `/oilgasbot give me current oil and gas monitor` - View market indicators\n' +
                    '• `/oilgasbot prep me for a meeting with [Company]` - Generate meeting brief\n' +
                    '• `/oilgasbot show top oil and gas opportunities this week` - View opportunities\n' +
                    '• `/oilgasbot alert me on major [Company] updates` - Set up alerts'
            }
          }
        ]
      });
    }
  } catch (error) {
    logger.error('Error handling command:', error);
    await respond({
      text: '❌ Sorry, I encountered an error processing your request. Please try again.',
      response_type: 'ephemeral'
    });
  }
});

/**
 * Handle news queries for specific companies
 */
async function handleNewsQuery(command, respond) {
  await respond({
    text: '🔍 Searching for relevant news...',
    response_type: 'ephemeral'
  });
  
  // TODO: Implement news query logic
  // This will integrate with the News Agent and Client Intelligence Agent
  
  await respond({
    text: '📰 *News Query Feature*\n\n' +
          'This feature is under development. It will provide:\n' +
          '• Recent company-specific news\n' +
          '• Source credibility checks\n' +
          '• IBM relevance analysis\n' +
          '• Recommended actions',
    response_type: 'ephemeral'
  });
}

/**
 * Handle market monitor requests
 */
async function handleMarketMonitor(command, respond) {
  await respond({
    text: '📊 Generating market monitor...',
    response_type: 'ephemeral'
  });
  
  // TODO: Implement market monitor logic
  // This will integrate with the Market Monitor Agent
  
  await respond({
    text: '📊 *Oil & Gas Market Monitor*\n\n' +
          '_Market data as of ' + new Date().toLocaleString() + '_\n\n' +
          '*Crude Oil:* $XX.XX/bbl\n' +
          '*Natural Gas:* $X.XX/MMBtu\n' +
          '*Rig Count:* XXX active rigs\n\n' +
          '_Full market monitor feature coming soon..._',
    response_type: 'ephemeral'
  });
}

/**
 * Handle meeting preparation requests
 */
async function handleMeetingPrep(command, respond) {
  await respond({
    text: '📋 Preparing meeting brief...',
    response_type: 'ephemeral'
  });
  
  // TODO: Implement meeting prep logic
  // This will integrate with Client Intelligence Agent
  
  await respond({
    text: '📋 *Meeting Preparation Feature*\n\n' +
          'This feature is under development. It will provide:\n' +
          '• Recent company developments\n' +
          '• Strategic priorities\n' +
          '• Relevant IBM offerings\n' +
          '• Suggested talking points\n' +
          '• Recent engagement history',
    response_type: 'ephemeral'
  });
}

/**
 * Handle opportunity queries
 */
async function handleOpportunities(command, respond) {
  await respond({
    text: '🎯 Analyzing opportunities...',
    response_type: 'ephemeral'
  });
  
  // TODO: Implement opportunities logic
  // This will integrate with Deal Radar Agent
  
  await respond({
    text: '🎯 *Top Opportunities Feature*\n\n' +
          'This feature is under development. It will provide:\n' +
          '• High-scoring opportunities\n' +
          '• IBM solution mapping\n' +
          '• Urgency indicators\n' +
          '• Recommended next steps',
    response_type: 'ephemeral'
  });
}

/**
 * Handle alert setup requests
 */
async function handleAlertSetup(command, respond) {
  await respond({
    text: '🔔 Setting up alerts...',
    response_type: 'ephemeral'
  });
  
  // TODO: Implement alert setup logic
  // This will integrate with Workflow Automation Agent
  
  await respond({
    text: '🔔 *Alert Setup Feature*\n\n' +
          'This feature is under development. It will allow you to:\n' +
          '• Set up company-specific alerts\n' +
          '• Configure alert thresholds\n' +
          '• Choose notification channels\n' +
          '• Manage alert preferences',
    response_type: 'ephemeral'
  });
}

/**
 * Handle app mentions
 */
app.event('app_mention', async ({ event, say }) => {
  logger.info(`App mentioned in channel: ${event.channel}`);
  
  await say({
    text: `Hi <@${event.user}>! 👋 Use \`/oilgasbot\` to interact with me.`,
    thread_ts: event.ts
  });
});

/**
 * Start the application
 */
(async () => {
  try {
    // Start Slack app
    await app.start();
    logger.info('⚡️ Oil & Gas Intelligence Assistant is running!');
    
    // Start Express server for health checks
    expressApp.listen(PORT, () => {
      logger.info(`🚀 Health check server running on port ${PORT}`);
    });
    
    // TODO: Initialize scheduled jobs
    // TODO: Start Deal Radar monitoring
    // TODO: Load account profiles
    
    logger.info('✅ All systems operational');
    
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
})();

/**
 * Graceful shutdown
 */
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  await app.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  await app.stop();
  process.exit(0);
});

module.exports = app;

// Made with Bob
