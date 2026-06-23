# Architecture Overview

## System Design

The Oil & Gas Opportunity Intelligence Assistant follows a modular, agent-based architecture designed for scalability, maintainability, and extensibility.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Slack Interface                       │
│                    (User Interaction Layer)                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Main Orchestrator Agent                    │
│              (Coordinates all sub-agents)                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Market     │ │    News &    │ │   Client     │
│   Monitor    │ │   Policy     │ │ Intelligence │
│   Agent      │ │   Agent      │ │   Agent      │
└──────────────┘ └──────────────┘ └──────────────┘
        │             │             │
        ▼             ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Credibility  │ │ Deal Radar   │ │  Workflow    │
│    & Dedup   │ │   Agent      │ │ Automation   │
│   Agent      │ │              │ │   Agent      │
└──────────────┘ └──────────────┘ └──────────────┘
        │             │             │
        └─────────────┼─────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Account    │  │    Market    │  │     News     │     │
│  │   Profiles   │  │     Data     │  │     Cache    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Main Orchestrator Agent

**Responsibilities:**
- Receives user requests from Slack
- Routes requests to appropriate sub-agents
- Aggregates responses from multiple agents
- Formats final output for Slack
- Manages conversation context
- Handles error recovery

**Key Features:**
- Natural language understanding
- Intent classification
- Multi-agent coordination
- Response synthesis

### 2. Market Monitor Agent

**Responsibilities:**
- Tracks oil & gas market indicators
- Monitors price movements
- Analyzes drilling activity
- Tracks inventory levels
- Monitors OPEC+ decisions

**Data Sources:**
- EIA (Energy Information Administration)
- Bloomberg API
- Reuters Market Data
- Baker Hughes Rig Count
- OPEC reports

**Update Frequency:**
- Real-time for critical indicators
- Hourly for market prices
- Daily for inventory data
- Weekly for rig counts

### 3. News, Policy, and Emissions Agent

**Responsibilities:**
- Monitors industry news
- Tracks regulatory changes
- Monitors emissions policies
- Identifies sustainability initiatives
- Tracks ESG developments

**Data Sources:**
- Reuters News API
- Bloomberg News
- Oil & Gas Journal
- Upstream Online
- EPA and regulatory sites
- Company press releases

**Features:**
- Real-time news monitoring
- Policy change detection
- Emissions tracking
- Sustainability scoring

### 4. Client Intelligence Agent

**Responsibilities:**
- Maintains account profiles
- Tracks client-specific developments
- Monitors company announcements
- Analyzes earnings reports
- Tracks strategic initiatives

**Account Profile Elements:**
```json
{
  "company_name": "ExxonMobil",
  "aliases": ["Exxon", "XOM"],
  "business_segments": [
    "Upstream",
    "Downstream",
    "Chemical"
  ],
  "key_geographies": [
    "United States",
    "Guyana",
    "Brazil"
  ],
  "strategic_priorities": [
    "Low-carbon solutions",
    "Digital transformation",
    "Operational efficiency"
  ],
  "relevant_ibm_offerings": [
    "watsonx",
    "Maximo",
    "Hybrid Cloud"
  ],
  "watchlist_topics": [
    "AI initiatives",
    "Refinery modernization",
    "Cybersecurity"
  ],
  "alert_thresholds": {
    "capex_announcement": 1000000000,
    "acquisition_value": 500000000
  }
}
```

### 5. Credibility and Deduplication Agent

**Responsibilities:**
- Validates news sources
- Checks source credibility
- Identifies duplicate content
- Removes redundant information
- Flags misinformation

**Credibility Scoring:**
- Source reputation (0-100)
- Author expertise
- Citation quality
- Fact-checking status
- Publication standards

**Deduplication Logic:**
- Content similarity detection
- Cross-source verification
- Timeline analysis
- Primary source identification

### 6. Deal Radar Agent

**Responsibilities:**
- Identifies business opportunities
- Scores opportunity potential
- Triggers proactive alerts
- Tracks competitive activity
- Monitors RFPs and tenders

**Opportunity Scoring Model:**
```python
opportunity_score = (
    client_relevance * 0.25 +
    business_impact * 0.20 +
    ibm_solution_fit * 0.20 +
    urgency * 0.15 +
    deal_potential * 0.10 +
    executive_visibility * 0.05 +
    competitive_risk * 0.03 +
    relationship_impact * 0.02
)
```

**Alert Triggers:**
- Score > 80: Immediate Slack alert
- Score 60-80: Daily digest
- Score 40-60: Weekly summary
- Score < 40: Logged only

### 7. Workflow Automation Agent

**Responsibilities:**
- Automates follow-up actions
- Creates meeting briefs
- Drafts outreach messages
- Logs CRM entries
- Schedules notifications
- Assigns tasks

**Supported Workflows:**
- Opportunity notification
- Meeting preparation
- Client outreach
- CRM logging
- Task assignment
- Report generation

## Data Flow

### Scheduled Intelligence Mode (Every 10 hours)

```
1. Market Monitor Agent → Collects market data
2. News Agent → Gathers recent news
3. Client Intelligence Agent → Filters by account profiles
4. Credibility Agent → Validates and deduplicates
5. Deal Radar Agent → Scores opportunities
6. Main Orchestrator → Synthesizes report
7. Slack → Delivers to subscribed channels
```

### Real-Time Deal Radar Mode (Continuous)

```
1. News Agent → Monitors news feeds (real-time)
2. Client Intelligence Agent → Matches to accounts
3. Deal Radar Agent → Scores urgency
4. IF score > threshold:
   - Workflow Agent → Triggers alert
   - Slack → Immediate notification
   - CRM → Logs opportunity
```

### On-Demand Query Mode (User-initiated)

```
1. User → Slack command
2. Main Orchestrator → Parses intent
3. Relevant Agents → Execute queries
4. Credibility Agent → Validates results
5. Main Orchestrator → Formats response
6. Slack → Returns to user
```

## Technology Stack

### Core Platform
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **AI/ML:** IBM watsonx, LangChain
- **Messaging:** Slack Bolt SDK

### Data Storage
- **Profiles:** JSON files / MongoDB
- **Cache:** Redis
- **Logs:** Elasticsearch

### External APIs
- **News:** Reuters, Bloomberg
- **Market Data:** EIA, Baker Hughes
- **AI:** IBM watsonx, OpenAI (fallback)
- **Slack:** Slack Web API

### Deployment
- **Container:** Docker
- **Orchestration:** Kubernetes
- **Cloud:** IBM Cloud / AWS
- **CI/CD:** GitHub Actions

## Scalability Considerations

### Horizontal Scaling
- Stateless agent design
- Load balancing across instances
- Distributed caching with Redis
- Message queue for async processing

### Performance Optimization
- Response caching (5-minute TTL)
- Batch API requests
- Lazy loading of account profiles
- Incremental news updates

### Reliability
- Circuit breakers for external APIs
- Retry logic with exponential backoff
- Fallback to cached data
- Health checks and monitoring

## Security

### Authentication
- Slack OAuth 2.0
- API key rotation
- Service account management

### Data Protection
- Encryption at rest
- TLS for data in transit
- PII redaction
- Access control lists

### Compliance
- IBM data governance policies
- Client confidentiality
- Audit logging
- Data retention policies

## Monitoring and Observability

### Metrics
- Request latency
- Agent response times
- API call success rates
- Cache hit rates
- Opportunity detection rate

### Logging
- Structured JSON logs
- Request/response tracking
- Error stack traces
- User interaction logs

### Alerting
- System health alerts
- API failure notifications
- High-value opportunity alerts
- Performance degradation warnings

## Future Enhancements

1. **Multi-language Support**
   - Spanish, Portuguese for LATAM operations
   - Arabic for Middle East operations

2. **Voice Interface**
   - Integration with IBM Watson Assistant
   - Voice commands via Slack huddles

3. **Predictive Analytics**
   - ML models for opportunity prediction
   - Trend forecasting
   - Client behavior analysis

4. **Enhanced Visualization**
   - Interactive dashboards
   - Trend charts
   - Relationship maps

5. **Integration Expansion**
   - Microsoft Teams support
   - Salesforce native integration
   - Email digest option
   - Mobile app

---

**Last Updated:** June 2026  
**Version:** 1.0  
**Maintained by:** IBM Bobathon Team