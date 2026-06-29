export const MARKET_METRICS = [
  { key: "wti", label: "WTI Crude", value: 78.42, unit: "USD/bbl", delta: +1.84, deltaPct: +2.4, spark: gen(40, 70, 82, 7) },
  { key: "brent", label: "Brent Crude", value: 82.91, unit: "USD/bbl", delta: +1.62, deltaPct: +2.0, spark: gen(40, 74, 86, 11) },
  { key: "natgas", label: "Henry Hub Gas", value: 2.84, unit: "USD/MMBtu", delta: -0.12, deltaPct: -4.1, spark: gen(40, 2.5, 3.4, 13) },
  { key: "rigs", label: "US Rig Count", value: 624, unit: "rigs", delta: +6, deltaPct: +0.97, spark: gen(40, 580, 640, 17) },
  { key: "inv", label: "Crude Inventory", value: 421.6, unit: "Mbbl", delta: -3.2, deltaPct: -0.75, spark: gen(40, 410, 440, 19) },
  { key: "margin", label: "Refining Margin", value: 24.18, unit: "USD/bbl", delta: +0.94, deltaPct: +4.0, spark: gen(40, 18, 28, 23) },
  { key: "opec", label: "OPEC+ Compliance", value: 117, unit: "%", delta: +3, deltaPct: +2.6, spark: gen(40, 95, 122, 5) },
];

function gen(n, min, max, seed) {
  const out = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    out.push(min + r * (max - min));
  }
  return out;
}

export const TICKER = [
  { sym: "WTI", val: "78.42", d: "+2.40%" },
  { sym: "BRENT", val: "82.91", d: "+2.00%" },
  { sym: "NG", val: "2.84", d: "-4.10%" },
  { sym: "RIGS", val: "624", d: "+6" },
  { sym: "XOM", val: "118.32", d: "+1.12%" },
  { sym: "CVX", val: "164.88", d: "+0.88%" },
  { sym: "SHEL", val: "71.04", d: "+0.42%" },
  { sym: "BP", val: "37.91", d: "-0.18%" },
  { sym: "HAL", val: "39.27", d: "+1.84%" },
  { sym: "SLB", val: "52.14", d: "+2.21%" },
  { sym: "COP", val: "117.45", d: "+0.92%" },
  { sym: "OPEC+", val: "117%", d: "compliance" },
  { sym: "BRENT/WTI", val: "4.49", d: "spread" },
];

export const COMPANIES = ["All", "ExxonMobil", "Chevron", "Shell", "BP", "Halliburton", "SLB", "ConocoPhillips"];
export const CATEGORIES = ["market", "policy", "company", "emissions", "technology"];

export const NEWS = [
  { id: "n1", title: "ExxonMobil greenlights $12B Guyana expansion, accelerates digital twin rollout", source: "Reuters", time: "12m", category: "company", company: "ExxonMobil", relevance: 96, credibility: 98, sentiment: "positive", summary: "Stabroek phase 5 FID brings call for unified asset management across 6 FPSOs." },
  { id: "n2", title: "EPA finalizes methane fee framework affecting upstream operators above 25k mt", source: "Bloomberg", time: "34m", category: "emissions", company: "Chevron", relevance: 91, credibility: 96, sentiment: "negative", summary: "Compliance reporting requirements expand — emissions data governance becomes board-level." },
  { id: "n3", title: "Shell pilots generative AI for subsurface interpretation in Permian", source: "WSJ", time: "1h", category: "technology", company: "Shell", relevance: 89, credibility: 95, sentiment: "positive", summary: "Pilot moves to production; ML-Ops and data fabric requirements expand." },
  { id: "n4", title: "BP reorganizes US trading desk amid hybrid cloud migration", source: "FT", time: "2h", category: "company", company: "BP", relevance: 84, credibility: 94, sentiment: "neutral", summary: "Real-time risk platform refresh, latency-sensitive infrastructure under review." },
  { id: "n5", title: "Halliburton Q3 earnings beat: completions revenue +14% YoY", source: "Reuters", time: "3h", category: "market", company: "Halliburton", relevance: 78, credibility: 97, sentiment: "positive", summary: "CapEx headroom for digital frac fleet optimization opens." },
  { id: "n6", title: "SLB expands Delfi cognitive platform partnerships in Middle East", source: "Upstream", time: "4h", category: "technology", company: "SLB", relevance: 86, credibility: 90, sentiment: "positive", summary: "Adjacent watsonx integration opportunities surface for joint accounts." },
  { id: "n7", title: "OPEC+ holds 2.2 Mbpd voluntary cut into Q2", source: "Reuters", time: "5h", category: "policy", company: "ExxonMobil", relevance: 72, credibility: 98, sentiment: "neutral", summary: "Sustained price floor supports IOC capex; downstream margin compression continues." },
  { id: "n8", title: "ConocoPhillips advances Willow project, files updated emissions plan", source: "E&E News", time: "6h", category: "emissions", company: "ConocoPhillips", relevance: 88, credibility: 92, sentiment: "neutral", summary: "Sustainability reporting + asset performance management converge as anchor needs." },
  { id: "n9", title: "Cyber incident disrupts midstream operator in Texas; SEC disclosure pending", source: "CyberScoop", time: "7h", category: "technology", company: "Chevron", relevance: 93, credibility: 88, sentiment: "negative", summary: "OT/IT segmentation and zero-trust controls move to top of CISO agenda." },
];

export const DEALS = [
  { id: "d1", title: "Asset performance management refresh across Guyana FPSO fleet", client: "ExxonMobil", score: 94, priority: "CRITICAL", value: "$28M – $42M", solution: "IBM Maximo + watsonx", trigger: "Stabroek phase 5 FID + digital twin announcement", nextAction: "Brief Houston AE team, propose joint executive workshop within 7 days", signals: ["FID announced", "Public digital twin commitment", "CIO hire from Maersk", "Q4 capex unlock"], ageMin: 14 },
  { id: "d2", title: "Methane emissions data governance & ESG reporting", client: "Chevron", score: 91, priority: "CRITICAL", value: "$14M – $22M", solution: "Data Governance + Sustainability Solutions", trigger: "EPA methane fee framework finalized", nextAction: "Draft solution brief for ESG steering committee, target 48h delivery", signals: ["Regulatory deadline", "Existing watsonx footprint", "Board-level ESG mandate"], ageMin: 36 },
  { id: "d3", title: "OT/IT zero-trust segmentation for midstream operations", client: "Chevron", score: 88, priority: "URGENT", value: "$9M – $15M", solution: "IBM Security + Hybrid Cloud", trigger: "Texas midstream cyber incident", nextAction: "Schedule CISO threat-modeling session, leverage X-Force preview", signals: ["Peer-incident pressure", "SEC disclosure pending", "CISO budget reload"], ageMin: 48 },
  { id: "d4", title: "Trading platform modernization, low-latency hybrid cloud", client: "BP", score: 83, priority: "URGENT", value: "$18M – $25M", solution: "Hybrid Cloud + Application Modernization", trigger: "US trading desk reorganization", nextAction: "Engage London + Houston account teams, position reference architecture", signals: ["Org change", "Vendor RFI rumored Q1", "Existing Red Hat estate"], ageMin: 92 },
  { id: "d5", title: "Subsurface ML-Ops & data fabric expansion", client: "Shell", score: 81, priority: "HIGH", value: "$11M – $19M", solution: "watsonx + Data Governance", trigger: "Permian generative AI pilot moves to production", nextAction: "Coordinate with IBM Research on co-innovation pitch", signals: ["Pilot-to-prod transition", "Public CTO comments", "Co-innovation lab interest"], ageMin: 140 },
  { id: "d6", title: "Completions fleet optimization & predictive maintenance", client: "Halliburton", score: 77, priority: "HIGH", value: "$8M – $13M", solution: "IBM Maximo + Automation", trigger: "Q3 beat + capex headroom", nextAction: "Send tailored ROI model to VP Digital Operations", signals: ["Earnings catalyst", "Existing Maximo POC", "Champion identified"], ageMin: 220 },
  { id: "d7", title: "Joint go-to-market: Delfi + watsonx for ME nationals", client: "SLB", score: 74, priority: "HIGH", value: "$22M – $35M (partner)", solution: "watsonx + IBM Consulting", trigger: "SLB ME partnership expansion", nextAction: "Loop in partner ecosystem lead, draft joint solution sheet", signals: ["Partner momentum", "NOC interest signals", "Adjacent IBM account heat"], ageMin: 260 },
  { id: "d8", title: "Willow project sustainability reporting platform", client: "ConocoPhillips", score: 71, priority: "MEDIUM", value: "$6M – $10M", solution: "Sustainability Solutions + Maximo", trigger: "Updated emissions plan filing", nextAction: "Share peer case study, request 30-min discovery", signals: ["Regulatory filing", "Public commitment", "Existing CSR partnership"], ageMin: 320 },
  { id: "d9", title: "Supply chain resilience program post-OPEC+ cuts", client: "ExxonMobil", score: 64, priority: "MEDIUM", value: "$5M – $9M", solution: "Supply Chain Optimization", trigger: "Sustained OPEC+ compliance", nextAction: "Add to QBR agenda, position scenario planning workbench", signals: ["Macro tailwind", "Procurement transformation underway"], ageMin: 410 },
  { id: "d10", title: "Application modernization assessment, downstream", client: "BP", score: 52, priority: "LOW", value: "$3M – $6M", solution: "Application Modernization", trigger: "Downstream margin compression", nextAction: "Nurture; share modernization benchmark report", signals: ["Cost pressure", "Legacy mainframe estate"], ageMin: 720 },
];

export const CLIENTS = [
  { name: "ExxonMobil", hq: "Spring, TX", ticker: "XOM", segments: ["Upstream", "Downstream", "Chemicals", "Low Carbon"], geographies: ["USA", "Guyana", "Permian", "Mozambique"], priorities: ["Guyana scale-up", "Digital twin", "Low-carbon solutions", "Capital discipline"], offerings: ["IBM Maximo", "watsonx", "Hybrid Cloud", "Sustainability Solutions"], health: 92, openOpps: 7, pipeline: "$84M" },
  { name: "Chevron", hq: "Houston, TX", ticker: "CVX", segments: ["Upstream", "Midstream", "Downstream", "New Energies"], geographies: ["USA", "Kazakhstan", "Australia"], priorities: ["Methane reduction", "Cybersecurity", "ESG reporting"], offerings: ["IBM Security", "Data Governance", "Sustainability Solutions", "watsonx"], health: 88, openOpps: 9, pipeline: "$71M" },
  { name: "Shell", hq: "London, UK", ticker: "SHEL", segments: ["Integrated Gas", "Upstream", "Mobility", "Renewables"], geographies: ["UK", "Netherlands", "USA", "Nigeria"], priorities: ["AI in subsurface", "Energy transition", "Trading edge"], offerings: ["watsonx", "Data Governance", "Hybrid Cloud", "Application Modernization"], health: 84, openOpps: 6, pipeline: "$58M" },
  { name: "BP", hq: "London, UK", ticker: "BP", segments: ["Production", "Customers", "Gas & Low Carbon"], geographies: ["UK", "USA", "Azerbaijan"], priorities: ["Trading modernization", "Net zero by 2050", "Convenience scale"], offerings: ["Hybrid Cloud", "Application Modernization", "IBM Consulting"], health: 76, openOpps: 5, pipeline: "$46M" },
  { name: "Halliburton", hq: "Houston, TX", ticker: "HAL", segments: ["Completion & Production", "Drilling & Evaluation"], geographies: ["USA", "Middle East", "LatAm"], priorities: ["Digital fleet", "Service margin", "Decarbonized completions"], offerings: ["IBM Maximo", "Automation", "watsonx"], health: 81, openOpps: 4, pipeline: "$32M" },
  { name: "SLB", hq: "Houston / Paris", ticker: "SLB", segments: ["Digital & Integration", "Reservoir Performance", "Well Construction", "Production Systems"], geographies: ["Global"], priorities: ["Delfi platform", "AI partnerships", "Decarbonization tech"], offerings: ["watsonx", "IBM Consulting", "Hybrid Cloud"], health: 86, openOpps: 6, pipeline: "$67M" },
  { name: "ConocoPhillips", hq: "Houston, TX", ticker: "COP", segments: ["Lower 48", "Alaska", "International"], geographies: ["USA", "Norway", "Qatar"], priorities: ["Willow execution", "Returns focus", "Emissions plan"], offerings: ["Sustainability Solutions", "Maximo", "Data Governance"], health: 79, openOpps: 3, pipeline: "$24M" },
];

export const AGENTS = [
  { name: "Market Monitor", status: "active", events: 142, color: "var(--info)" },
  { name: "News & Policy", status: "active", events: 318, color: "var(--info)" },
  { name: "Client Intelligence", status: "active", events: 64, color: "var(--bullish)" },
  { name: "Credibility & Deduplication", status: "active", events: 412, color: "var(--warn)" },
  { name: "Deal Radar", status: "scanning", events: 28, color: "var(--prio-critical)" },
  { name: "Workflow Automation", status: "idle", events: 11, color: "var(--primary)" },
];

export const IBM_SOLUTIONS = [
  "watsonx", "IBM Maximo", "IBM Consulting", "Hybrid Cloud", "IBM Security",
  "Data Governance", "Automation", "Sustainability Solutions", "Supply Chain Optimization", "Application Modernization",
];
