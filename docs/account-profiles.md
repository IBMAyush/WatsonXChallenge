# Account Profile Guide

## Overview

Account profiles are the foundation of personalized intelligence delivery. Each profile contains company-specific information that helps the assistant filter, prioritize, and contextualize industry developments for IBM account teams.

## Profile Structure

### Complete Profile Schema

```json
{
  "profile_id": "exxonmobil_001",
  "company_name": "ExxonMobil Corporation",
  "aliases": [
    "Exxon",
    "XOM",
    "Exxon Mobil",
    "ExxonMobil"
  ],
  "ticker_symbol": "XOM",
  "headquarters": {
    "city": "Spring",
    "state": "Texas",
    "country": "United States"
  },
  "business_segments": [
    {
      "name": "Upstream",
      "description": "Exploration and production of crude oil and natural gas",
      "priority": "high"
    },
    {
      "name": "Downstream",
      "description": "Refining and marketing of petroleum products",
      "priority": "high"
    },
    {
      "name": "Chemical",
      "description": "Manufacturing and marketing of petrochemicals",
      "priority": "medium"
    },
    {
      "name": "Low Carbon Solutions",
      "description": "Carbon capture, hydrogen, and biofuels",
      "priority": "high"
    }
  ],
  "key_geographies": [
    {
      "region": "United States",
      "operations": ["Permian Basin", "Gulf of Mexico"],
      "priority": "high"
    },
    {
      "region": "Guyana",
      "operations": ["Stabroek Block"],
      "priority": "high"
    },
    {
      "region": "Brazil",
      "operations": ["Pre-salt fields"],
      "priority": "medium"
    }
  ],
  "strategic_priorities": [
    "Digital transformation and AI adoption",
    "Low-carbon solutions and emissions reduction",
    "Operational efficiency and cost optimization",
    "Cybersecurity enhancement",
    "Supply chain resilience",
    "Asset performance management"
  ],
  "relevant_ibm_offerings": [
    {
      "product": "watsonx",
      "use_cases": [
        "Predictive maintenance",
        "Reservoir optimization",
        "Supply chain analytics"
      ],
      "priority": "high"
    },
    {
      "product": "IBM Maximo Application Suite",
      "use_cases": [
        "Asset management",
        "Predictive maintenance",
        "Work order management"
      ],
      "priority": "high"
    },
    {
      "product": "IBM Consulting",
      "use_cases": [
        "Digital transformation",
        "Cloud migration",
        "Process optimization"
      ],
      "priority": "high"
    },
    {
      "product": "Hybrid Cloud",
      "use_cases": [
        "Infrastructure modernization",
        "Edge computing for remote operations"
      ],
      "priority": "medium"
    },
    {
      "product": "IBM Security",
      "use_cases": [
        "OT/IT security",
        "Threat detection",
        "Compliance management"
      ],
      "priority": "high"
    }
  ],
  "ibm_relationship": {
    "relationship_status": "strategic",
    "active_contracts": [
      {
        "contract_id": "IBM-XOM-2024-001",
        "product": "Maximo",
        "start_date": "2024-01-15",
        "end_date": "2027-01-14",
        "value": 15000000
      }
    ],
    "key_contacts": [
      {
        "name": "John Smith",
        "title": "CIO",
        "email": "john.smith@exxonmobil.com",
        "focus_areas": ["Digital transformation", "Cloud strategy"]
      }
    ],
    "account_team": {
      "account_executive": "Jane Doe (IBM)",
      "technical_sales_leader": "Bob Johnson (IBM)",
      "account_technical_leader": "Alice Williams (IBM)"
    },
    "recent_engagements": [
      {
        "date": "2024-05-10",
        "type": "Executive briefing",
        "topic": "AI in upstream operations"
      }
    ]
  },
  "watchlist_topics": [
    {
      "topic": "AI and machine learning initiatives",
      "keywords": ["artificial intelligence", "machine learning", "AI", "ML", "automation"],
      "priority": "high"
    },
    {
      "topic": "Refinery modernization",
      "keywords": ["refinery upgrade", "modernization", "digital refinery"],
      "priority": "high"
    },
    {
      "topic": "Cybersecurity incidents",
      "keywords": ["cyber attack", "ransomware", "data breach", "security incident"],
      "priority": "critical"
    },
    {
      "topic": "Carbon capture and storage",
      "keywords": ["CCS", "carbon capture", "CO2 storage", "emissions reduction"],
      "priority": "high"
    },
    {
      "topic": "Major capital investments",
      "keywords": ["capex", "investment", "project FID", "acquisition"],
      "priority": "high"
    },
    {
      "topic": "Cloud and digital transformation",
      "keywords": ["cloud migration", "digital transformation", "IT modernization"],
      "priority": "medium"
    }
  ],
  "alert_thresholds": {
    "capex_announcement_usd": 1000000000,
    "acquisition_value_usd": 500000000,
    "production_change_percent": 10,
    "cybersecurity_incident": "any",
    "executive_change": "C-level",
    "earnings_surprise_percent": 5
  },
  "competitive_intelligence": {
    "main_competitors": ["Chevron", "Shell", "BP", "TotalEnergies"],
    "track_competitor_wins": true,
    "track_technology_partnerships": true
  },
  "custom_filters": {
    "exclude_topics": ["retail gas stations", "convenience stores"],
    "minimum_news_relevance_score": 60,
    "preferred_news_sources": [
      "Reuters",
      "Bloomberg",
      "Oil & Gas Journal",
      "Upstream Online"
    ]
  },
  "notification_preferences": {
    "slack_channel": "#exxonmobil-intelligence",
    "email_digest": true,
    "digest_frequency": "daily",
    "urgent_alert_threshold": 85
  },
  "metadata": {
    "created_date": "2024-01-01",
    "last_updated": "2024-06-15",
    "updated_by": "jane.doe@ibm.com",
    "version": "2.1"
  }
}
```

## Profile Categories

### 1. Basic Information
- Company name and aliases
- Ticker symbol
- Headquarters location
- Industry classification

### 2. Business Context
- Business segments and divisions
- Key geographic operations
- Strategic priorities
- Recent major initiatives

### 3. IBM Relationship
- Relationship status (strategic, active, prospect)
- Active contracts and their details
- Key client contacts
- IBM account team members
- Recent engagements and meetings

### 4. Intelligence Preferences
- Watchlist topics and keywords
- Alert thresholds for different event types
- Notification preferences
- Custom filters and exclusions

### 5. Opportunity Mapping
- Relevant IBM offerings
- Specific use cases
- Priority levels
- Past proposals and outcomes

## Creating a New Profile

### Step 1: Gather Basic Information
```bash
# Use the profile template
cp data/profiles/template.json data/profiles/company_name.json
```

### Step 2: Research the Company
- Review company website and investor relations
- Check recent earnings calls and presentations
- Identify strategic priorities from annual reports
- Research current technology initiatives

### Step 3: Map IBM Offerings
- Identify relevant IBM products and services
- Define specific use cases
- Prioritize based on client needs and IBM capabilities

### Step 4: Configure Watchlist
- Define key topics to monitor
- Set appropriate keywords
- Configure alert thresholds
- Specify notification preferences

### Step 5: Validate and Test
```bash
# Validate profile schema
npm run validate-profile data/profiles/company_name.json

# Test profile with sample queries
npm run test-profile company_name
```

## Profile Maintenance

### Regular Updates (Monthly)
- Review and update strategic priorities
- Add new IBM engagements
- Update contact information
- Adjust alert thresholds based on feedback

### Quarterly Reviews
- Comprehensive profile audit
- Update business segment priorities
- Review IBM offering relevance
- Analyze alert effectiveness

### Event-Driven Updates
- Major organizational changes
- New strategic initiatives announced
- Significant IBM wins or losses
- Changes in account team

## Example Profiles

### ExxonMobil Profile Highlights
```json
{
  "company_name": "ExxonMobil Corporation",
  "strategic_priorities": [
    "Low-carbon solutions",
    "Digital transformation",
    "Operational efficiency"
  ],
  "top_ibm_offerings": [
    "watsonx",
    "Maximo",
    "Hybrid Cloud"
  ],
  "critical_watchlist": [
    "AI initiatives",
    "Cybersecurity",
    "Carbon capture"
  ]
}
```

### Chevron Profile Highlights
```json
{
  "company_name": "Chevron Corporation",
  "strategic_priorities": [
    "Higher returns, lower carbon",
    "Digital innovation",
    "Operational excellence"
  ],
  "top_ibm_offerings": [
    "watsonx",
    "IBM Consulting",
    "Security"
  ],
  "critical_watchlist": [
    "Renewable energy",
    "Cloud migration",
    "Supply chain"
  ]
}
```

### SLB Profile Highlights
```json
{
  "company_name": "SLB",
  "strategic_priorities": [
    "Digital transformation",
    "New energy solutions",
    "Core business optimization"
  ],
  "top_ibm_offerings": [
    "watsonx",
    "Hybrid Cloud",
    "Data & AI"
  ],
  "critical_watchlist": [
    "AI/ML in oilfield services",
    "Digital platforms",
    "Technology partnerships"
  ]
}
```

## Profile Best Practices

### DO:
✅ Keep profiles up-to-date with latest company information  
✅ Use specific, relevant keywords for watchlist topics  
✅ Set realistic alert thresholds to avoid noise  
✅ Include context about IBM relationship and history  
✅ Document the rationale for priority levels  
✅ Test profiles regularly with real queries  

### DON'T:
❌ Use overly broad keywords that generate false positives  
❌ Set alert thresholds too low (creates alert fatigue)  
❌ Include outdated contact information  
❌ Forget to update after major company changes  
❌ Duplicate information across multiple profiles  
❌ Include sensitive or confidential client data  

## Profile Validation

### Required Fields
- company_name
- aliases (at least one)
- business_segments (at least one)
- strategic_priorities (at least three)
- relevant_ibm_offerings (at least two)
- watchlist_topics (at least three)

### Validation Script
```javascript
// Run validation
npm run validate-profile <profile-path>

// Example output
✓ Profile structure valid
✓ All required fields present
✓ IBM offerings properly mapped
✓ Alert thresholds within acceptable ranges
⚠ Warning: No recent engagements recorded
✓ Profile ready for deployment
```

## Profile Templates

### Template for New Oil & Gas Major
Located at: `data/profiles/templates/oil_major_template.json`

### Template for Oilfield Services Company
Located at: `data/profiles/templates/oilfield_services_template.json`

### Template for Midstream Company
Located at: `data/profiles/templates/midstream_template.json`

## Integration with Agents

### How Agents Use Profiles

**Market Monitor Agent:**
- Filters market data by relevant geographies
- Prioritizes indicators based on business segments

**News Agent:**
- Uses watchlist topics and keywords
- Applies custom filters and exclusions

**Client Intelligence Agent:**
- Matches news to specific accounts
- Applies alert thresholds

**Deal Radar Agent:**
- Maps opportunities to IBM offerings
- Scores based on strategic priorities

**Workflow Agent:**
- Routes alerts to specified channels
- Notifies account team members

## Troubleshooting

### Profile Not Triggering Alerts
1. Check alert thresholds - may be set too high
2. Verify watchlist keywords are relevant
3. Ensure profile is active in system
4. Review recent news matches in logs

### Too Many False Positives
1. Refine watchlist keywords to be more specific
2. Add exclusion topics
3. Increase minimum relevance score
4. Review and adjust alert thresholds

### Missing Important Updates
1. Expand watchlist topics
2. Add more keyword variations
3. Lower alert thresholds temporarily
4. Check if news sources are being monitored

---

**Last Updated:** June 2026  
**Version:** 1.0  
**Maintained by:** IBM Bobathon Team