# Slack Bot Setup Guide

## Overview

This guide will walk you through setting up the Oil & Gas Intelligence Assistant Slack bot for your workspace.

## Prerequisites

- Slack workspace with admin permissions
- Node.js 18+ installed
- GitHub repository cloned locally

## Step 1: Create Slack App

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps)
2. Click **"Create New App"**
3. Select **"From scratch"**
4. Enter app name: `Oil & Gas Intelligence Assistant`
5. Select your workspace
6. Click **"Create App"**

## Step 2: Configure Bot Permissions

### OAuth & Permissions

1. In the left sidebar, click **"OAuth & Permissions"**
2. Scroll to **"Scopes"** section
3. Add the following **Bot Token Scopes**:
   - `app_mentions:read` - View messages that mention the app
   - `channels:history` - View messages in public channels
   - `channels:read` - View basic channel info
   - `chat:write` - Send messages
   - `chat:write.public` - Send messages to channels the app isn't in
   - `commands` - Add shortcuts and/or slash commands
   - `groups:history` - View messages in private channels
   - `groups:read` - View basic private channel info
   - `im:history` - View messages in direct messages
   - `im:read` - View basic direct message info
   - `im:write` - Start direct messages
   - `users:read` - View people in the workspace

4. Scroll up and click **"Install to Workspace"**
5. Click **"Allow"**
6. Copy the **"Bot User OAuth Token"** (starts with `xoxb-`)
   - Save this as `SLACK_BOT_TOKEN` in your `.env` file

## Step 3: Enable Socket Mode

1. In the left sidebar, click **"Socket Mode"**
2. Toggle **"Enable Socket Mode"** to ON
3. Enter a token name: `oil-gas-bot-socket`
4. Click **"Generate"**
5. Copy the **App-Level Token** (starts with `xapp-`)
   - Save this as `SLACK_APP_TOKEN` in your `.env` file

## Step 4: Configure Slash Commands

1. In the left sidebar, click **"Slash Commands"**
2. Click **"Create New Command"**
3. Enter the following details:
   - **Command:** `/oilgasbot`
   - **Request URL:** Leave blank (Socket Mode handles this)
   - **Short Description:** `Oil & Gas Intelligence Assistant`
   - **Usage Hint:** `[command] [parameters]`
4. Click **"Save"**

## Step 5: Enable Event Subscriptions

1. In the left sidebar, click **"Event Subscriptions"**
2. Toggle **"Enable Events"** to ON
3. Under **"Subscribe to bot events"**, add:
   - `app_mention` - When the app is mentioned
   - `message.channels` - Messages in public channels (optional)
   - `message.groups` - Messages in private channels (optional)
   - `message.im` - Direct messages (optional)
4. Click **"Save Changes"**

## Step 6: Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_APP_TOKEN=xapp-your-app-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here

# IBM watsonx Configuration (Optional - for AI features)
WATSONX_API_KEY=your-watsonx-api-key
WATSONX_PROJECT_ID=your-project-id
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# News API Keys (Optional - for real news integration)
REUTERS_API_KEY=your-reuters-api-key
BLOOMBERG_API_KEY=your-bloomberg-api-key
NEWS_API_KEY=your-newsapi-key

# Market Data APIs (Optional - for real market data)
EIA_API_KEY=your-eia-api-key
BAKER_HUGHES_API_KEY=your-baker-hughes-key

# Database Configuration (Optional)
MONGODB_URI=mongodb://localhost:27017/oilgas-intelligence
REDIS_URL=redis://localhost:6379

# Application Settings
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# Feature Flags
ENABLE_SCHEDULED_UPDATES=true
ENABLE_DEAL_RADAR=true
ENABLE_WORKFLOW_AUTOMATION=true

# Alert Settings
DEFAULT_SLACK_CHANNEL=#oil-gas-intelligence
URGENT_ALERT_CHANNEL=#oil-gas-urgent-alerts
DEFAULT_OPPORTUNITY_SCORE_THRESHOLD=60
URGENT_ALERT_THRESHOLD=85
```

## Step 7: Install Dependencies

```bash
cd /path/to/Bobathon
npm install
```

## Step 8: Start the Bot

```bash
npm start
```

You should see:
```
⚡️ Oil & Gas Intelligence Assistant is running!
🚀 Health check server running on port 3000
✅ Client Intelligence Agent initialized
✅ Market Monitor started
✅ News Agent started
✅ Deal Radar monitoring started (5 min interval)
✅ All systems operational
```

## Step 9: Test the Bot

### In Slack:

1. **Invite the bot to a channel:**
   ```
   /invite @Oil & Gas Intelligence Assistant
   ```

2. **Test basic command:**
   ```
   /oilgasbot
   ```
   You should see a welcome message with available commands.

3. **Test news query:**
   ```
   /oilgasbot any relevant news regarding ExxonMobil?
   ```

4. **Test market monitor:**
   ```
   /oilgasbot give me current oil and gas monitor
   ```

5. **Test opportunities:**
   ```
   /oilgasbot show top oil and gas opportunities this week
   ```

## Step 10: Create Channels (Recommended)

Create dedicated channels for the bot:

1. **#oil-gas-intelligence** - Main intelligence updates
2. **#oil-gas-urgent-alerts** - Critical/urgent opportunities
3. **#oil-gas-market-monitor** - Market updates
4. **Company-specific channels** (optional):
   - #exxonmobil-intelligence
   - #chevron-intelligence
   - #shell-intelligence

Update your `.env` file with these channel names.

## Troubleshooting

### Bot not responding

1. **Check bot is running:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Check logs:**
   ```bash
   tail -f logs/combined.log
   ```

3. **Verify tokens:**
   - Ensure `SLACK_BOT_TOKEN` starts with `xoxb-`
   - Ensure `SLACK_APP_TOKEN` starts with `xapp-`
   - Check tokens haven't expired

### Permission errors

1. Go to Slack App settings
2. Navigate to **OAuth & Permissions**
3. Verify all required scopes are added
4. Reinstall the app if needed

### Socket Mode issues

1. Ensure Socket Mode is enabled
2. Verify App-Level Token is correct
3. Check firewall isn't blocking WebSocket connections

## Advanced Configuration

### Scheduled Updates

To enable 10-hour scheduled updates:

```javascript
// In src/index.js, add:
const cron = require('node-cron');

// Run every 10 hours
cron.schedule('0 */10 * * *', async () => {
  const digest = await generateIntelligenceDigest();
  await app.client.chat.postMessage({
    channel: process.env.DEFAULT_SLACK_CHANNEL,
    ...digest
  });
});
```

### Custom Alert Channels

Configure different channels for different priority levels:

```env
CRITICAL_ALERT_CHANNEL=#oil-gas-critical
URGENT_ALERT_CHANNEL=#oil-gas-urgent
HIGH_ALERT_CHANNEL=#oil-gas-high
MEDIUM_ALERT_CHANNEL=#oil-gas-intelligence
```

### Database Setup (Optional)

For persistent storage:

```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Install Redis
brew install redis

# Start Redis
brew services start redis
```

## Production Deployment

### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t oil-gas-bot .
docker run -d --env-file .env -p 3000:3000 oil-gas-bot
```

### Using PM2

```bash
npm install -g pm2
pm2 start src/index.js --name oil-gas-bot
pm2 save
pm2 startup
```

### Environment Variables for Production

```env
NODE_ENV=production
LOG_LEVEL=warn
ENABLE_SCHEDULED_UPDATES=true
ENABLE_DEAL_RADAR=true
```

## Monitoring

### Health Check Endpoint

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "service": "oil-gas-intelligence-assistant",
  "version": "1.0.0",
  "timestamp": "2026-06-23T18:00:00.000Z"
}
```

### Log Files

- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- `logs/exceptions.log` - Uncaught exceptions
- `logs/rejections.log` - Unhandled promise rejections

## Support

For issues or questions:
1. Check logs in `logs/` directory
2. Review GitHub issues
3. Contact the Bobathon team

## Next Steps

1. **Create account profiles** - Add profiles for your key oil & gas clients
2. **Configure API keys** - Set up real news and market data APIs
3. **Customize alerts** - Adjust thresholds for your needs
4. **Train the team** - Share command guide with users
5. **Monitor usage** - Track which features are most valuable

---

**Last Updated:** June 2026  
**Version:** 1.0  
**Maintained by:** IBM Bobathon Team