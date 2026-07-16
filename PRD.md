# Product Requirements Document
## Oil & Gas Intelligence Assistant

**Owner:** Ayush Singh | **Team:** IBMAyush, rsrivatsan06, nicperry-IBM, golamyasar67, wynstonphan | **Date:** June 25, 2026

---

## 1. The Problem

IBM sales teams pursuing oil & gas opportunities waste 30% of their time on manual research and administrative tasks. Account executives spend 4-6 hours weekly compiling market data, reading industry news, and updating CRM systems—time that should be spent engaging clients. Without standardized evaluation criteria, teams inconsistently prioritize opportunities, leading to 40% variance in deal success rates between top and bottom performers. Critical opportunities are missed because teams lack continuous monitoring of market shifts and client activities, allowing competitors to engage first. Information fragmentation across multiple tools (market data, news, CRM, documents) slows decision-making and reduces productivity. This results in $2-5M annually in lost revenue, delayed response times, and clients perceiving IBM as less informed than competitors.

**Core Issues:**
- **Information Overload:** 4-6 hours/week on manual research per person
- **Inconsistent Evaluation:** No standardized opportunity assessment framework
- **Missed Opportunities:** Reactive approach means competitors engage first
- **Manual Workflows:** Administrative overhead delays deal progression
- **Tool Fragmentation:** Context switching reduces productivity by 30%

**Solution:** An AI-powered conversational assistant that provides instant access to market intelligence, automated opportunity scoring, and workflow automation through natural language interactions in Slack. Four specialized AI agents (Market Monitor, News, Client Intelligence, Deal Radar) work together to continuously monitor conditions, automatically score opportunities using an 8-factor algorithm, and execute seven automated workflows—reducing qualification time from hours to seconds.

---

## 2. Success Metrics

### Business Impact (6-Month Targets)
- **Revenue:** 20% increase in closed deals ($5M+ additional revenue)
- **Productivity:** 50% reduction in research time (10+ hours saved per user/week)
- **Win Rate:** 30% improvement in opportunity conversion (25% → 32.5%)
- **Response Time:** 70% faster response to opportunities (48 hours → 14 hours)

### User Adoption (3-Month Targets)
- **Active Users:** 80% of sales team (40+ of 50 users)
- **Engagement:** 15 interactions per user per week (600+ total weekly)
- **Satisfaction:** Net Promoter Score >50
- **Trust:** 90% user agreement with opportunity scores

### Technical Performance
- **Response Time:** <3 seconds for 95th percentile
- **Uptime:** 99.9% availability (8.76 hours downtime/year)
- **Throughput:** 100 concurrent users, 1,000 requests/minute
- **Accuracy:** 90% scoring algorithm agreement rate

---

## 3. Rollout & Timeline

### Phase 1: MVP - Complete ✅ (Weeks 1-4)
**Delivered:** Core intelligence platform with 4 AI agents, opportunity scoring, workflow automation, Slack bot with 8 commands, demo script, comprehensive documentation. **Status:** 5,000+ lines of code, fully functional, ready for integration.

### Phase 2: watsonx Integration - In Progress 🚧 (Weeks 5-6)
**Week 5:** Create 5 watsonx Orchestrate skills (Score Opportunity, Market Monitor, Company News, Intelligence Digest, Analyze Opportunity), configure AI assistant with natural language understanding, test skill orchestration.  
**Week 6:** Connect assistant to Slack, end-to-end testing with real users, fix bugs, optimize performance, prepare for production deployment.  
**Blockers:** Need watsonx Orchestrate access, ngrok URL for skill configuration, Slack workspace permissions.

### Phase 3: Production Deployment (Weeks 7-8)
**Week 7:** Deploy API to IBM Cloud, configure SSL/TLS, implement API key authentication, set up monitoring (APM, error tracking, health checks), load testing with 100 concurrent users.  
**Week 8:** User training sessions, create video tutorials, onboard pilot group (10 users), gather feedback, iterate based on usage patterns, prepare for full rollout.  
**Success Criteria:** 99.9% uptime, <3s response time, zero critical bugs, positive pilot feedback.

### Phase 4: Real Data Integration (Weeks 9-12)
**Weeks 9-10:** Integrate Alpha Vantage for live market data, connect NewsAPI for real-time news, implement Salesforce CRM sync, add IBM Watson NLP for sentiment analysis.  
**Weeks 11-12:** Historical data analysis (90 days), predictive analytics for opportunity scoring, A/B test scoring algorithm improvements, measure impact on win rates.  
**Goal:** Transition from simulated to production data, improve scoring accuracy to 95%.

### Phase 5: Scale & Optimize (Months 4-6)
**Month 4:** Expand to 50+ users, mobile app (iOS/Android), email integration, calendar sync.  
**Month 5:** Advanced analytics dashboard, custom workflow builder, multi-language support (Spanish, Portuguese).  
**Month 6:** Expand to other industries (manufacturing, financial services), white-label for client use, measure ROI and business impact.  
**Target:** 200+ active users, $10M+ attributed revenue, industry recognition.

---

## Appendix: Technical Summary

**Architecture:** Multi-agent AI system with 4 specialized agents (Market Monitor, News, Client Intelligence, Deal Radar), 2 core services (Opportunity Scorer, Workflow Automation), 3 integration layers (Slack Bot, REST API, watsonx Orchestrate).

**Stack:** Node.js 18+, Express.js, Slack Bolt SDK, Winston logging, watsonx Orchestrate, IBM Cloud deployment.

**Key Features:** 8-factor opportunity scoring (0-100), 7 automated workflows, real-time market monitoring (60min updates), news aggregation (30min updates), client profiling, opportunity detection (15min cycles), 8 Slack commands, 20+ REST API endpoints.

**Current Status:** MVP complete (5,000+ lines), API server ready, documentation comprehensive, demo impressive. **Next:** Create watsonx skills, configure AI assistant, connect to Slack.

**Repository:** github.com/IBMAyush/Bobathon | **Demo:** `node demo.js` | **API:** `npm run api`
