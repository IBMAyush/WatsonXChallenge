# watsonx Orchestrate Setup Guide for Beginners

## 🎯 Goal
Connect your Oil & Gas Intelligence Assistant to watsonx Orchestrate and Slack so you can chat with it naturally.

---

## 📋 Prerequisites Checklist

Before we start, make sure you have:
- ✅ IBM Cloud account (free tier works!)
- ✅ Slack workspace (or ability to create one)
- ✅ Your API server code ready (you have this!)
- ✅ Terminal access

---

## Part 1: Get Your API Online (15 minutes)

### Why We Need This
watsonx Orchestrate needs to access your API over the internet. Your laptop's `localhost:3000` won't work because it's only accessible on your computer. We'll use **ngrok** to create a public URL.

### Step 1.1: Install ngrok

**On Mac:**
```bash
brew install ngrok
```

**Or download from:** https://ngrok.com/download

### Step 1.2: Create ngrok Account (Free)

1. Go to https://ngrok.com/signup
2. Sign up (free account is fine)
3. After signup, go to https://dashboard.ngrok.com/get-started/your-authtoken
4. Copy your authtoken (looks like: `2abc123def456...`)

### Step 1.3: Configure ngrok

```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with your actual token.

### Step 1.4: Start Your API Server

Open a terminal and run:
```bash
cd /Users/ayushsingh/Desktop/Bobathon
npm run api
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║     🛢️  OIL & GAS INTELLIGENCE API SERVER RUNNING        ║
╚════════════════════════════════════════════════════════════╝

🚀 Server running on: http://localhost:3000
```

**Keep this terminal open!**

### Step 1.5: Expose Your API with ngrok

Open a **NEW terminal** (keep the first one running) and run:
```bash
ngrok http 3000
```

You'll see something like:
```
Session Status                online
Account                       Your Name (Plan: Free)
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

**IMPORTANT:** Copy the `https://abc123.ngrok.io` URL - this is your public API URL!

### Step 1.6: Test Your Public API

In a **third terminal**, test it works:
```bash
curl https://YOUR-NGROK-URL.ngrok.io/health
```

Replace `YOUR-NGROK-URL` with your actual ngrok URL.

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2026-06-23T19:00:00.000Z",
  "service": "Oil & Gas Intelligence API"
}
```

✅ **Success!** Your API is now accessible from the internet.

---

## Part 2: Access watsonx Orchestrate (10 minutes)

### Step 2.1: Get watsonx Orchestrate Access

**Option A: IBM Cloud Trial (Recommended)**
1. Go to https://cloud.ibm.com
2. Log in or create account
3. Search for "watsonx Orchestrate"
4. Click "Try for free" or "Create"
5. Select a region (Dallas or Frankfurt)
6. Wait 2-3 minutes for provisioning

**Option B: IBM Internal (If you're an IBMer)**
1. Go to https://dl.watson-orchestrate.ibm.com
2. Log in with your IBM w3id
3. You'll have instant access

### Step 2.2: Open watsonx Orchestrate

Once provisioned, you'll see the watsonx Orchestrate dashboard.

**Key sections to know:**
- **Skills** - Where we'll create API connections
- **AI Assistants** - Where we'll build our chatbot
- **Integrations** - Where we'll connect to Slack

---

## Part 3: Create Your First Skill (10 minutes)

### What is a Skill?
A skill is a single API endpoint that watsonx Orchestrate can call. We'll create 5 skills total, but let's start with one.

### Step 3.1: Navigate to Skills

1. In watsonx Orchestrate, click **"Skills"** in the left sidebar
2. Click **"Add skill"** or **"Create skill"** button
3. Select **"Custom API"** or **"OpenAPI"**

### Step 3.2: Configure Skill #1 - Score Opportunity

Fill in these fields:

**Basic Information:**
- **Skill name:** `Score Oil & Gas Opportunity`
- **Description:** `Analyzes and scores business opportunities using 8-factor analysis`
- **Category:** `Business Intelligence` (or create new)

**API Configuration:**
- **Method:** `POST`
- **URL:** `https://YOUR-NGROK-URL.ngrok.io/api/score-opportunity`
  - Replace `YOUR-NGROK-URL` with your actual ngrok URL!
- **Headers:** 
  - Key: `Content-Type`
  - Value: `application/json`

**Request Body (JSON):**
```json
{
  "title": "string",
  "client": "string",
  "estimatedValue": 0,
  "urgencyLevel": "string"
}
```

**Input Parameters:**
Click "Add parameter" for each:

1. **title**
   - Type: `String`
   - Required: `Yes`
   - Description: `Opportunity title`
   - Example: `ExxonMobil AI Initiative`

2. **client**
   - Type: `String`
   - Required: `Yes`
   - Description: `Client company name`
   - Example: `ExxonMobil`

3. **estimatedValue**
   - Type: `Number`
   - Required: `Yes`
   - Description: `Deal value in dollars`
   - Example: `10000000`

4. **urgencyLevel**
   - Type: `String`
   - Required: `No`
   - Description: `Urgency: low, medium, high, critical`
   - Example: `high`

### Step 3.3: Test Your Skill

1. Click **"Test"** button
2. Fill in test values:
   ```json
   {
     "title": "ExxonMobil AI Initiative",
     "client": "ExxonMobil",
     "estimatedValue": 10000000,
     "urgencyLevel": "high"
   }
   ```
3. Click **"Run test"**
4. You should see a response with a score!

### Step 3.4: Save Your Skill

1. Click **"Save"** or **"Create skill"**
2. Your first skill is now ready!

---

## Part 4: Create Remaining Skills (20 minutes)

Now create 4 more skills using the same process:

### Skill #2: Get Market Monitor

- **Name:** `Get Oil & Gas Market Monitor`
- **Method:** `GET`
- **URL:** `https://YOUR-NGROK-URL.ngrok.io/api/market-monitor`
- **No parameters needed**
- **Test it:** Should return oil prices, rig counts, etc.

### Skill #3: Search Company News

- **Name:** `Search Oil & Gas Company News`
- **Method:** `GET`
- **URL:** `https://YOUR-NGROK-URL.ngrok.io/api/news/company/{company}`
- **Parameters:**
  - `company` (String, Required) - Company name
- **Test with:** `company=ExxonMobil`

### Skill #4: Get Intelligence Digest

- **Name:** `Get Intelligence Digest`
- **Method:** `GET`
- **URL:** `https://YOUR-NGROK-URL.ngrok.io/api/intelligence-digest`
- **Optional Parameters:**
  - `company` (String, Optional) - Filter by company
- **Test it:** Should return comprehensive digest

### Skill #5: Analyze Opportunity

- **Name:** `Analyze Oil & Gas Opportunity`
- **Method:** `POST`
- **URL:** `https://YOUR-NGROK-URL.ngrok.io/api/analyze-opportunity`
- **Parameters:**
  - `title` (String, Required)
  - `client` (String, Required)
  - `estimatedValue` (Number, Required)
  - `urgencyLevel` (String, Optional)
  - `ibmProducts` (Array, Optional)

---

## Part 5: Build Your AI Assistant (15 minutes)

### Step 5.1: Create Assistant

1. Click **"AI assistants"** in left sidebar
2. Click **"Create assistant"** or **"New assistant"**
3. Choose **"Build from scratch"**

### Step 5.2: Configure Assistant

**Basic Settings:**
- **Name:** `Oil & Gas Intelligence Assistant`
- **Description:** `AI-powered assistant for oil & gas opportunity intelligence`
- **Icon:** Upload an oil rig or IBM logo (optional)

### Step 5.3: Add Skills to Assistant

1. Click **"Add skills"** or **"Skills"** tab
2. Search for your skills
3. Select all 5 skills you created:
   - ✅ Score Oil & Gas Opportunity
   - ✅ Get Oil & Gas Market Monitor
   - ✅ Search Oil & Gas Company News
   - ✅ Get Intelligence Digest
   - ✅ Analyze Oil & Gas Opportunity
4. Click **"Add"** or **"Save"**

### Step 5.4: Configure Conversation Flow

1. Go to **"Conversation"** or **"Dialog"** tab
2. Enable **"Natural language understanding"**
3. Add example phrases:

**For scoring opportunities:**
- "Score this opportunity"
- "Analyze this deal"
- "What's the score for this opportunity?"

**For market data:**
- "What's the oil price?"
- "Show me market data"
- "Current market conditions"

**For news:**
- "Show me news about [company]"
- "What's happening with [company]?"
- "Latest news for [company]"

**For digest:**
- "Give me today's digest"
- "Intelligence update"
- "What's new today?"

### Step 5.5: Test Your Assistant

1. Click **"Try it"** or **"Preview"** button
2. Type: "What's the current oil price?"
3. The assistant should call the Market Monitor skill
4. Try: "Score an opportunity for ExxonMobil worth $10M"
5. The assistant should ask for details and call the scoring skill

---

## Part 6: Connect to Slack (15 minutes)

### Step 6.1: Prepare Your Slack Workspace

**If you don't have a Slack workspace:**
1. Go to https://slack.com/create
2. Create a free workspace
3. Name it something like "Oil & Gas Intelligence"

**If you have a workspace:**
1. Make sure you're an admin or can add apps
2. Open your workspace

### Step 6.2: Connect watsonx Orchestrate to Slack

1. In watsonx Orchestrate, go to **"Integrations"** or **"Channels"**
2. Find **"Slack"** integration
3. Click **"Connect"** or **"Add to Slack"**
4. You'll be redirected to Slack
5. Click **"Allow"** to authorize
6. Select your workspace
7. Choose channels where bot should be available (start with #general)
8. Click **"Allow"** again

### Step 6.3: Configure Slack Bot

Back in watsonx Orchestrate:

1. **Bot name:** `Oil & Gas Intelligence Assistant`
2. **Bot username:** `@oil-gas-bot` (or similar)
3. **Bot icon:** Upload an icon (optional)
4. **Welcome message:**
   ```
   👋 Hi! I'm your Oil & Gas Intelligence Assistant.
   
   I can help you with:
   • 📊 Scoring opportunities
   • 💰 Market monitoring
   • 📰 Company news
   • 📈 Intelligence digests
   
   Just ask me anything!
   ```
5. **Save settings**

### Step 6.4: Invite Bot to Slack

1. Open your Slack workspace
2. Go to a channel (like #general)
3. Type `/invite @oil-gas-bot` (use your bot's username)
4. Press Enter
5. The bot should join the channel!

---

## Part 7: Test Everything! (10 minutes)

### Test 1: Direct Message

1. In Slack, click on your bot's name
2. Send a direct message: "What's the current oil price?"
3. The bot should respond with market data!

### Test 2: Score an Opportunity

Send this message:
```
Score this opportunity:
Title: ExxonMobil AI Initiative
Client: ExxonMobil
Value: $10,000,000
Urgency: High
```

The bot should:
1. Understand your request
2. Call the scoring API
3. Return a detailed score with recommendations

### Test 3: Get News

Send: "Show me news about Chevron"

The bot should return recent news articles.

### Test 4: Get Digest

Send: "Give me today's intelligence digest"

The bot should return a comprehensive update.

### Test 5: In a Channel

1. Go to #general (or another channel)
2. Mention the bot: "@oil-gas-bot what's the oil price?"
3. The bot should respond in the channel

---

## 🎉 Success! You're Done!

You now have:
- ✅ API running and accessible via ngrok
- ✅ 5 skills created in watsonx Orchestrate
- ✅ AI assistant built and configured
- ✅ Slack integration working
- ✅ Fully functional chatbot!

---

## 📝 Important Notes

### ngrok URL Changes
- Free ngrok URLs change every time you restart ngrok
- If you restart ngrok, you'll need to update all skill URLs in watsonx Orchestrate
- For permanent URL, upgrade to ngrok paid plan ($8/month)

### Keeping Everything Running
You need 2 terminals open:
1. **Terminal 1:** `npm run api` (your API server)
2. **Terminal 2:** `ngrok http 3000` (public access)

If either stops, your bot won't work!

### For Production
For a real deployment:
1. Deploy API to IBM Cloud, Heroku, or AWS
2. Get a permanent URL
3. Update skills with permanent URL
4. No need for ngrok anymore!

---

## 🆘 Troubleshooting

### Bot Not Responding in Slack
1. Check both terminals are still running
2. Test ngrok URL: `curl https://YOUR-URL.ngrok.io/health`
3. Check watsonx Orchestrate logs
4. Try disconnecting and reconnecting Slack

### Skills Failing
1. Test the API directly with curl
2. Check ngrok URL is correct in skill configuration
3. Verify request format matches API expectations
4. Check API server logs for errors

### Can't Create Skills
1. Make sure you have watsonx Orchestrate access
2. Try refreshing the page
3. Check your IBM Cloud account status
4. Contact IBM support if needed

---

## 📚 Next Steps

### Enhance Your Bot
1. Add more skills for other API endpoints
2. Improve conversation flows
3. Add custom responses
4. Create automated workflows

### Deploy to Production
1. Deploy API to cloud platform
2. Get SSL certificate
3. Update skill URLs
4. Remove ngrok dependency

### Add More Features
1. Connect to real data sources
2. Integrate with CRM systems
3. Add authentication
4. Create dashboards

---

## 🎯 Quick Reference

### Your URLs
- **Local API:** http://localhost:3000
- **Public API:** https://YOUR-NGROK-URL.ngrok.io
- **Health Check:** https://YOUR-NGROK-URL.ngrok.io/health

### Key Commands
```bash
# Start API server
npm run api

# Start ngrok (in new terminal)
ngrok http 3000

# Test health
curl https://YOUR-NGROK-URL.ngrok.io/health

# Test scoring
curl -X POST https://YOUR-NGROK-URL.ngrok.io/api/score-opportunity \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","client":"ExxonMobil","estimatedValue":10000000}'
```

### Support
- **watsonx Orchestrate Docs:** https://www.ibm.com/docs/en/watsonx/watson-orchestrate
- **Slack API Docs:** https://api.slack.com
- **ngrok Docs:** https://ngrok.com/docs

---

**You're all set! Start chatting with your Oil & Gas Intelligence Assistant in Slack!** 🚀