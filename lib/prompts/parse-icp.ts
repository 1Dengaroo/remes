export function buildParseICPPrompt(input: string): string {
  return `Extract the Ideal Customer Profile (ICP) from this input. It may be a scoping call transcript, meeting notes, a short query, or a description of a target market.

IMPORTANT: Think broadly about who the ideal customer is. The input describes the PRODUCT being sold and the TYPE of buyer — not a narrow industry vertical. For example:
- If someone sells "sales automation software for B2B SaaS companies", the industry keywords should include ALL relevant B2B SaaS verticals (healthcare SaaS, developer tools, cybersecurity, fintech, HR tech, etc.) — not just "sales automation".
- If someone sells "GPU infrastructure for AI teams", the industry should include any company doing AI/ML (biotech, autonomous vehicles, ad tech, etc.) — not just "GPU infrastructure".

The industry_keywords field should capture the BREADTH of potential buyers, not just echo back the product category.

**CRITICAL DISTINCTION — industry_keywords vs. hiring_signals:**
- industry_keywords = what the company DOES as its core business (their product, market, or sector). Examples: "cybersecurity", "fintech", "developer tools", "HR tech", "healthcare SaaS".
- hiring_signals = JOB TITLES or ROLE NAMES the company is hiring for. Output clean, short role titles — NOT narrative phrases. Examples: "SDR", "BDR", "Sales Development Representative", "Account Executive", "DevOps Engineer". Do NOT prefix with "hiring" or "scaling" — just the role name.

If the input mentions activities like "scaling SDR teams" or "hiring sales reps", extract the role titles into hiring_signals (e.g., "SDR", "Sales Representative") — NOT industry_keywords. The company could be in ANY industry and still be hiring salespeople.

Example: "B2B companies with <100 employees scaling their SDR/BDR teams for outbound sales"
→ industry_keywords: ["B2B SaaS", "developer tools", "cybersecurity", "fintech", "HR tech", "martech", "data analytics", "cloud infrastructure"]
→ hiring_signals: ["SDR", "BDR", "Sales Development Representative", "Business Development Representative", "Account Executive"]
→ min_employees: null (no minimum specified)
→ max_employees: 100

**Employee count:** If the input mentions company size (e.g., "<100 employees", "50-200 people", "small companies", "startups with at least 10 people"), extract min_employees and/or max_employees. Use null for unspecified bounds. Common mappings: "small" ≈ 1-50, "mid-size" ≈ 50-500, "enterprise" ≈ 500+.

Return ONLY valid JSON matching this exact schema, no other text:

{
  "description": "one sentence summary of the ideal customer they want to find — describe the BUYER, not the product being sold",
  "industry_keywords": ["broad list of industries and verticals where these buyers exist — think 5-10 diverse verticals, not just the product's own category"],
  "min_employees": number or null,
  "max_employees": number or null,
  "min_funding_amount": number or null,
  "funding_stages": ["Series A", "Series B", etc] or [],
  "hiring_signals": ["clean job titles/role names the company is hiring for — e.g. 'SDR', 'BDR', 'Account Executive' — NOT narrative phrases"],
  "tech_keywords": ["specific technologies, tools, or infrastructure the buyer would use or be adopting"],
  "company_examples": ["any companies mentioned as examples or comparisons"]
}

Input:
${input}`;
}
