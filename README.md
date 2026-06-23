# Oil & Gas Opportunity Intelligence Assistant

**IBM Bobathon Project**

An AI-powered Slack assistant that helps IBM teams working with oil and gas clients quickly understand industry developments, identify opportunities, and take action.

## 🎯 Project Vision

Instead of building separate AI agents for every oil and gas account, this project creates **one general Oil & Gas Account Intelligence Agent** that monitors the entire industry and uses account-specific profiles to personalize responses for major clients including:

- ExxonMobil
- Chevron
- SLB
- Halliburton
- Shell
- BP
- ConocoPhillips
- And other major oil and gas clients

## 🚀 Key Features

### 1. Scheduled Intelligence Mode
Every 10 hours, the bot generates structured updates covering:
- Recent oil & gas news
- Market conditions
- Account-specific insights
- Source credibility checks
- Duplicate content detection
- IBM relevance analysis
- Recommended next steps

### 2. Real-Time Deal Radar Mode
Continuous scanning for major client-related events with proactive alerts for:
- Urgent developments
- High-value opportunities
- Time-sensitive situations

### 3. Slack Commands
```
/oilgasbot any relevant news regarding ExxonMobil?
/oilgasbot give me current oil and gas monitor
/oilgasbot prep me for a meeting with Halliburton
/oilgasbot show top oil and gas opportunities this week
/oilgasbot alert me on major Chevron updates
```

## 📊 Oil & Gas Market Monitor

Real-time tracking of key industry indicators:
- Crude oil prices
- Natural gas prices
- Refining margins
- Inventory levels
- Drilling activity & rig counts
- Sector equity movements
- LNG trends
- OPEC+ activity
- Regulatory developments
- Emissions & sustainability trends

## 🎯 IBM Solution Mapping

Automatically connects market events to relevant IBM offerings:
- **watsonx** - AI and data platform
- **IBM Maximo Application Suite** - Asset management
- **IBM Consulting** - Strategic services
- **Hybrid Cloud** - Infrastructure modernization
- **Cybersecurity Services** - Security solutions
- **Data Governance** - Data management
- **Automation** - Process optimization
- **Sustainability Solutions** - Emissions management
- **Supply Chain Optimization**
- **Application Modernization**

## 🏗️ Project Structure

```
Bobathon/
├── src/
│   ├── agents/           # AI agent implementations
│   ├── services/         # Core services (Slack, news, market data)
│   ├── utils/            # Utility functions
│   └── config/           # Configuration files
├── data/
│   ├── profiles/         # Account-specific profiles
│   └── cache/            # Cached data
├── docs/                 # Documentation
├── tests/                # Test files
└── README.md
```

## 📋 Account Profile Structure

Each account profile includes:
- Company name and aliases
- Business segments
- Key geographies
- Strategic priorities
- Relevant IBM offerings
- IBM relationship details
- Account team contacts
- Watchlist topics
- Custom alert thresholds

## 🎯 Opportunity Scoring Rubric

Each relevant event is scored based on:
- Client relevance
- Business impact
- IBM solution fit
- Urgency
- Deal potential
- Executive visibility
- Competitive risk
- Relationship impact

## 🔄 Workflow Automation

After identifying opportunities, the assistant can:
- Notify account teams
- Draft client outreach messages
- Create meeting briefs
- Log leads in CRM
- Assign follow-ups
- Schedule briefing sessions
- Save insights to account plans

## 🤖 AI Agent Architecture

The system uses multiple specialized agents:
- **Market Monitor Agent** - Tracks industry indicators
- **News, Policy, and Emissions Agent** - Monitors developments
- **Client Intelligence Agent** - Analyzes account-specific data
- **Credibility and Deduplication Agent** - Validates sources
- **Deal Radar Agent** - Identifies opportunities
- **Workflow Automation Agent** - Executes actions

## 🎯 Core Questions Answered

The assistant doesn't just answer "What happened?" It provides:
- **Why does this matter?**
- **Which client does it affect?**
- **What IBM solution could be relevant?**
- **How urgent is this?**
- **Who should act next?**
- **What should the account team say or do?**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Slack workspace with bot permissions
- API keys for news and market data sources
- IBM watsonx access (for AI capabilities)

### Installation
```bash
# Clone the repository
git clone git@github.com:IBMAyush/Bobathon.git
cd Bobathon

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Run the application
npm start
```

## 📝 Configuration

Create a `.env` file with:
```
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_APP_TOKEN=xapp-your-token
WATSONX_API_KEY=your-watsonx-key
NEWS_API_KEY=your-news-api-key
MARKET_DATA_API_KEY=your-market-data-key
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- agents

# Run with coverage
npm run test:coverage
```

## 📚 Documentation

Detailed documentation is available in the `/docs` directory:
- [Architecture Overview](docs/architecture.md)
- [Account Profile Guide](docs/account-profiles.md)
- [API Reference](docs/api-reference.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

This is a Bobathon project. Contributions and suggestions are welcome!

## 📄 License

IBM Internal Use Only

## 👥 Team

IBM Bobathon Team

---

**Built with ❤️ for IBM Oil & Gas Account Teams**
