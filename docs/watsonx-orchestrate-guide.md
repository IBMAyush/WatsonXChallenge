# watsonx Orchestrate Integration Guide

## Overview

This guide shows you how to connect your Oil & Gas Intelligence Assistant to watsonx Orchestrate and Slack.

---

## Step 1: Start Your API Server

### Install the new dependency:
```bash
cd /Users/ayushsingh/Desktop/Bobathon
npm install cors
```

### Start the API server:
```bash
npm run api
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║     🛢️  OIL & GAS INTELLIGENCE API SERVER RUNNING        ║
╚════════════════════════════════════════════════════════════╝

🚀 Server running on: http://localhost:3000
📊 Health check: http://localhost:3000/health
```

### Test it works:
```bash
curl http://localhost:3000/health
```

---

## Step 2: Test Your API Endpoints

### Test Opportunity Scoring:
```bash
curl -X POST http://localhost:3000/api/score-opportunity \
  -H "Content-Type: application/json" \
  -d '{
    "title": "ExxonMobil AI Initiative",
    "client": "ExxonMobil",
    "estimatedValue": 10000000,
    "urgencyLevel": "critical"
  }'
```

### Test Market Monitor:
```bash
curl http://localhost:3000/api/market-monitor
```

### Test News Search:
```bash
curl http://localhost:3000/api/news/company/ExxonMobil
```

### Test Intelligence Digest:
```bash
curl http://localhost:3000/api/intelligence-digest?company=ExxonMobil
```

---

## Step 3: Create Skills in watsonx Orchestrate

### Log into watsonx Orchestrate
1. Go to your watsonx Orchestrate instance
2. Navigate to **"Skills"** section

### Create Skill #1: Score Opportunity

1. Click **"Create Skill"** → **"Custom API"**
2. **Skill Name:** `Score Oil & Gas Opportunity`
3. **Description:** `Scores business opportunities using 8-factor analysis`
4. **API Configuration:**
   - **Method:** POST
   - **URL:** `http://localhost:3000/api/score-opportunity`
   - **Headers:** `Content-Type: application/json`
5. **Input Parameters:**
   ```json
   {
     "title": "string",
     "client": "string",
     "estimatedValue": "number",
     "urgencyLevel": "string"
   }
   ```
6. **Test the skill** with sample data
7. **Save**

### Create Skill #2: Get Market Monitor

1. Click **"Create Skill"** → **"Custom API"**
2. **Skill Name:** `Get Oil & Gas Market Monitor`
3. **Description:** `Retrieves current oil & gas market data`
4. **API Configuration:**
   - **Method:** GET
   - **URL:** `http://localhost:3000/api/market-monitor`
5. **No input parameters needed**
6. **Test the skill**
7. **Save**

### Create Skill #3: Search Company News

1. Click **"Create Skill"** → **"Custom API"**
2. **Skill Name:** `Search Oil & Gas Company News`
3. **Description:** `Searches news for a specific oil & gas company`
4. **API Configuration:**
   - **Method:** GET
   - **URL:** `http://localhost:3000/api/news/company/{company}`
5. **Input Parameters:**
   ```json
   {
     "company": "string"
   }
   ```
6. **Test with:** `company=ExxonMobil`
7. **Save**

### Create Skill #4: Get Intelligence Digest

1. Click **"Create Skill"** → **"Custom API"**
2. **Skill Name:** `Get Intelligence Digest`
3. **Description:** `Comprehensive intelligence digest for oil & gas`
4. **API Configuration:**
   - **Method:** GET
   - **URL:** `http://localhost:3000/api/intelligence-digest`
5. **Optional Input Parameters:**
   ```json
   {
     "company": "string (optional)"
   }
   ```
6. **Test the skill**
7. **Save**

### Create Skill #5: Analyze Opportunity

1. Click **"Create Skill"** → **"Custom API"**
2. **Skill Name:** `Analyze Oil & Gas Opportunity`
3. **Description:** `Complete opportunity analysis with scoring and context`
4. **API Configuration:**
   - **Method:** POST
   - **URL:** `http://localhost:3000/api/analyze-opportunity`
   - **Headers:** `Content-Type: application/json`
5. **Input Parameters:**
   ```json
   {
     "title": "string",
     "client": "string",
     "estimatedValue": "number",
     "urgencyLevel": "string",
     "ibmProducts": "array"
   }
   ```
6. **Test the skill**
7. **Save**

---

## Step 4: Create AI Agent in watsonx Orchestrate

### Create Your Agent

1. Go to **"AI Agents"** section
2. Click **"Create Agent"**
3. **Agent Name:** `Oil & Gas Intelligence Assistant`
4. **Description:** `AI-powered assistant for oil & gas opportunity intelligence`

### Add Skills to Agent

1. Click **"Add Skills"**
2. Select all 5 skills you created:
   - Score Oil & Gas Opportunity
   - Get Oil & Gas Market Monitor
   - Search Oil & Gas Company News
   - Get Intelligence Digest
   - Analyze Oil & Gas Opportunity
3. **Save**

### Configure Conversational Flows

Create example conversations:

**Flow 1: Opportunity Analysis**
- User: "Analyze this ExxonMobil opportunity"
- Agent: Uses "Analyze Oil & Gas Opportunity" skill
- Agent: Returns scoring, news, and recommendations

**Flow 2: Market Check**
- User: "What's the current oil price?"
- Agent: Uses "Get Oil & Gas Market Monitor" skill
- Agent: Returns market data

**Flow 3: Company News**
- User: "Show me news about Chevron"
- Agent: Uses "Search Oil & Gas Company News" skill
- Agent: Returns recent articles

**Flow 4: Daily Digest**
- User: "Give me today's intelligence digest"
- Agent: Uses "Get Intelligence Digest" skill
- Agent: Returns comprehensive update

---

## Step 5: Connect to Slack

### In watsonx Orchestrate:

1. Go to **"Integrations"** or **"Channels"**
2. Click **"Add Channel"** → **"Slack"**
3. Click **"Connect to Slack"**
4. **Authorize** the connection
5. **Select your Slack workspace**
6. **Choose channels** where the bot should be available
7. **Save**

### Configure Slack Settings:

1. **Bot Name:** `Oil & Gas Intelligence Assistant`
2. **Bot Icon:** Upload an oil rig or IBM logo
3. **Welcome Message:** 
   ```
   Hi! I'm your Oil & Gas Intelligence Assistant. 
   I can help you with:
   • Scoring opportunities
   • Market monitoring
   • Company news
   • Intelligence digests
   
   Just ask me anything!
   ```

---

## Step 6: Test in Slack

### In your Slack workspace:

1. **Find the bot** in your workspace
2. **Send a direct message** or **mention in a channel**

### Try these commands:

```
@Oil & Gas Intelligence Assistant analyze this opportunity:
Title: ExxonMobil AI Initiative
Value: $10M
Urgency: Critical
```

```
@Oil & Gas Intelligence Assistant what's the current oil price?
```

```
@Oil & Gas Intelligence Assistant show me news about Chevron
```

```
@Oil & Gas Intelligence Assistant give me today's intelligence digest
```

---

## Step 7: Deploy for Production

### Option A: Deploy API to Cloud

**Using IBM Cloud:**
```bash
# Install IBM Cloud CLI
# Deploy your API server
ibmcloud cf push oil-gas-api -m 512M
```

**Using Heroku:**
```bash
# Install Heroku CLI
heroku create oil-gas-intelligence-api
git push heroku main
```

**Using Docker:**
```bash
# Build Docker image
docker build -t oil-gas-api .

# Run container
docker run -p 3000:3000 oil-gas-api
```

### Option B: Use ngrok for Testing

If you want to test without deploying:

```bash
# Install ngrok
brew install ngrok

# Start your API server
npm run api

# In another terminal, expose it
ngrok http 3000
```

Then use the ngrok URL in watsonx Orchestrate skills:
```
https://your-ngrok-url.ngrok.io/api/score-opportunity
```

---

## API Endpoints Reference

### Opportunity Scoring
- `POST /api/score-opportunity` - Score single opportunity
- `POST /api/score-opportunities` - Batch score opportunities
- `POST /api/analyze-opportunity` - Complete analysis

### Market Monitor
- `GET /api/market-monitor` - Full market report
- `GET /api/market-monitor/prices` - Current prices only
- `GET /api/market-monitor/rig-count` - Rig count data
- `POST /api/market-monitor/update` - Force update

### News
- `GET /api/news/top` - Top stories
- `GET /api/news/company/:company` - Company news
- `GET /api/news/search?keywords=` - Keyword search
- `GET /api/news/policy` - Policy updates
- `GET /api/news/emissions` - Emissions news

### Client Intelligence
- `GET /api/clients` - Tracked companies
- `GET /api/clients/:company/profile` - Company profile
- `POST /api/clients/:company/intelligence` - Intelligence report

### Opportunities
- `GET /api/opportunities` - Detected opportunities
- `GET /api/opportunities/status` - Deal Radar status

### Workflows
- `POST /api/workflow/execute` - Execute workflow
- `GET /api/workflow/types` - Available types

### Combined
- `GET /api/intelligence-digest` - Comprehensive digest
- `GET /api/intelligence-digest?company=X` - Company-specific

---

## Troubleshooting

### API Server Won't Start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Use different port
API_PORT=3001 npm run api
```

### Skills Not Working in watsonx
1. Check API server is running
2. Test endpoint with curl
3. Verify URL in skill configuration
4. Check request/response format

### Slack Not Responding
1. Verify Slack integration is active
2. Check bot has permissions in channel
3. Test skills individually first
4. Review watsonx Orchestrate logs

---

## Example Slack Conversations

### Conversation 1: Opportunity Analysis
```
You: @Oil & Gas Bot analyze opportunity for ExxonMobil AI project worth $15M

Bot: 🎯 Analyzing opportunity...

📊 Opportunity Score: 85/100
🎯 Priority: URGENT

Key Factors:
• Client Relevance: 95/100
• Business Impact: 88/100
• IBM Solution Fit: 90/100

💡 Recommendations:
• Immediate action required
• Notify account team
• Schedule executive briefing

📰 Related News: Found 3 recent articles about ExxonMobil
📈 Market Context: Oil prices at $78/bbl, favorable conditions
```

### Conversation 2: Market Check
```
You: @Oil & Gas Bot what's the market looking like?

Bot: 📊 Oil & Gas Market Monitor

💰 Current Prices:
• WTI Crude: $78.45/bbl (+2.3%)
• Brent: $82.10/bbl (+1.8%)
• Natural Gas: $3.25/MMBtu (-0.5%)

🔧 Drilling Activity:
• US Rig Count: 625 rigs (+5)

💡 Insights:
• Oil prices above $75 - focus on efficiency
• Increased drilling activity indicates expansion
```

---

## Next Steps

1. ✅ Start API server: `npm run api`
2. ✅ Test endpoints with curl
3. ✅ Create skills in watsonx Orchestrate
4. ✅ Build AI agent
5. ✅ Connect to Slack
6. ✅ Test in Slack
7. ✅ Deploy to production (optional)

---

**You're ready to demo your watsonx Orchestrate integration!** 🚀

For questions or issues, check the logs:
```bash
tail -f logs/combined.log