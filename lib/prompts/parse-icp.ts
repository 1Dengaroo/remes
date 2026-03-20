export function buildParseICPPrompt(input: string): string {
  return `Extract the Ideal Customer Profile from this input (transcript, notes, or description).

Think broadly about the BUYER, not the product being sold:
- "sales automation for B2B SaaS" → industry_keywords should cover diverse SaaS verticals (fintech, HR tech, devtools, etc.)
- industry_keywords = company's core business/sector
- hiring_signals = job titles being hired (e.g. "SDR", "Account Executive") — NOT narrative phrases
- If input mentions "scaling SDR teams", extract role titles into hiring_signals, not industry_keywords
- locations = geographic focus as country names (e.g. ["United States"]). Use [] if not specified.

Employee size mappings: "small" ≈ 1-50, "mid-size" ≈ 50-500, "enterprise" ≈ 500+. Use null for unspecified bounds.

Return ONLY valid JSON:
{
  "description": "one sentence describing the ideal BUYER",
  "industry_keywords": ["5-10 diverse verticals where buyers exist"],
  "min_employees": null,
  "max_employees": null,
  "min_funding_amount": null,
  "funding_stages": [],
  "hiring_signals": ["clean job titles"],
  "tech_keywords": ["technologies the buyer uses"],
  "company_examples": ["mentioned companies"],
  "locations": []
}

Input:
${input}`;
}
