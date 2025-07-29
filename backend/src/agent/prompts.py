from datetime import datetime


# Get current date in a readable format
def get_current_date():
    return datetime.now().strftime("%B %d, %Y")


query_writer_instructions = """Your goal is to generate sophisticated and diverse web search queries. These queries are intended for an advanced automated web research tool capable of analyzing complex results, following links, and synthesizing information.

Instructions:
- Always prefer a single search query, only add another query if the original question requests multiple aspects or elements and one query is not enough.
- Each query should focus on one specific aspect of the original question.
- Don't produce more than {number_queries} queries.
- Queries should be diverse, if the topic is broad, generate more than 1 query.
- Don't generate multiple similar queries, 1 is enough.
- Query should ensure that the most current information is gathered. The current date is {current_date}.

Format: 
- Format your response as a JSON object with ALL two of these exact keys:
   - "rationale": Brief explanation of why these queries are relevant
   - "query": A list of search queries

Example:

Topic: What revenue grew more last year apple stock or the number of people buying an iphone
```json
{{
    "rationale": "To answer this comparative growth question accurately, we need specific data points on Apple's stock performance and iPhone sales metrics. These queries target the precise financial information needed: company revenue trends, product-specific unit sales figures, and stock price movement over the same fiscal period for direct comparison.",
    "query": ["Apple total revenue growth fiscal year 2024", "iPhone unit sales growth fiscal year 2024", "Apple stock price growth fiscal year 2024"],
}}
```

Context: {research_topic}"""


web_searcher_instructions = """Conduct targeted Google Searches to gather the most recent, credible information on "{research_topic}" and synthesize it into a verifiable text artifact.

Instructions:
- Query should ensure that the most current information is gathered. The current date is {current_date}.
- Conduct multiple, diverse searches to gather comprehensive information.
- Consolidate key findings while meticulously tracking the source(s) for each specific piece of information.
- The output should be a well-written summary or report based on your search findings. 
- Only include the information found in the search results, don't make up any information.

Research Topic:
{research_topic}
"""

reflection_instructions = """You are an expert research assistant analyzing summaries about "{research_topic}".

Instructions:
- Identify knowledge gaps or areas that need deeper exploration and generate a follow-up query. (1 or multiple).
- If provided summaries are sufficient to answer the user's question, don't generate a follow-up query.
- If there is a knowledge gap, generate a follow-up query that would help expand your understanding.
- Focus on technical details, implementation specifics, or emerging trends that weren't fully covered.

Requirements:
- Ensure the follow-up query is self-contained and includes necessary context for web search.

Output Format:
- Format your response as a JSON object with these exact keys:
   - "is_sufficient": true or false
   - "knowledge_gap": Describe what information is missing or needs clarification
   - "follow_up_queries": Write a specific question to address this gap

Example:
```json
{{
    "is_sufficient": true, // or false
    "knowledge_gap": "The summary lacks information about performance metrics and benchmarks", // "" if is_sufficient is true
    "follow_up_queries": ["What are typical performance benchmarks and metrics used to evaluate [specific technology]?"] // [] if is_sufficient is true
}}
```

Reflect carefully on the Summaries to identify knowledge gaps and produce a follow-up query. Then, produce your output following this JSON format:

Summaries:
{summaries}
"""

answer_instructions = """Generate a high-quality answer to the user's question based on the provided summaries.

Instructions:
- The current date is {current_date}.
- You have access to all the information gathered from the previous steps.
- You have access to the user's question.
- Generate a high-quality answer to the user's question based on the provided summaries and the user's question.
- Include the sources you used from the Summaries in the answer correctly, use markdown format (e.g. [apnews](https://vertexaisearch.cloud.google.com/id/1-0)). THIS IS A MUST.

User Context:
- {research_topic}

Summaries:
{summaries}"""

# - You are the final step of a multi-step research process, don't mention that you are the final step.

# Entity Extraction Agent Prompt
company_extraction_instructions = """You are an expert entity extraction agent specializing in identifying and structuring business-related information from given text summaries.

Your task is to extract entities from the provided text, focusing on companies, investment amounts, associated people, locations, and other relevant business information. Structure the output according to the specified format.

Extraction Guidelines:
- Extract ALL relevant entities mentioned in the text (companies, funding, business deals, partnerships, etc.)
- Capture monetary amounts with currency symbols and exact figures when available
- Extract person names with their roles and company affiliations when mentioned
- Include complete location information when available (city, state, country)
- Identify industry or sector information
- Note any additional relevant business details

Data Quality Requirements:
- Company names should be extracted exactly as mentioned in the text
- Monetary amounts must preserve original currency and format
- Person names should be complete when available
- Locations should be as specific as possible based on available information
- Use null/empty values for fields when information is not available or unclear

Context Handling:
- Consider the entire text context when extracting entities
- Resolve pronouns and references where possible and clear
- Handle multiple companies or deals mentioned in the same text
- Distinguish between different entities when multiple are present

Output Requirements:
- Structure your response as a valid JSON object matching the ExtractionResult schema
- Assign a confidence score (0-1) based on clarity and completeness of extracted information
- Include extraction notes for any ambiguities, assumptions, or missing information
- Ensure all extracted data maintains fidelity to the original text

Example Output Structure:
```json
{{
    "entities": [
        {{
            "company_name": "Example Corp",
            "investment_amount": "$10 million",
            "associated_people": [
                {{
                    "name": "John Doe",
                    "role": "CEO",
                    "company_affiliation": "Example Corp"
                }}
            ],
            "location": {{
                "city": "New York",
                "state": "New York",
                "country": "United States"
            }},
            "industry": "Technology",
            "additional_details": "Expansion into European markets"
        }}
    ],
    "confidence_score": 0.9,
    "extraction_notes": "All key information clearly identified",
    "source_urls": ["[https://example.com/article](https://example.com/article)"]
}}
```

Extract entities from the following text and provide your response in the specified JSON format:

User Context:
- {research_topic}

Summaries:
{summaries}
"""


people_extraction_instructions = """You are an expert research assistant specializing in identifying key decision makers in real estate and related roles for companies based in India with access to Google Search tool.

Goal: 
Identify key decision makers in real estate, facilities management, property development, construction, or adjacent roles for companies operating in India.

Instructions:
- Given a company name, identify decision makers in real estate, facilities management, property development, construction, or related roles using the Google Search tool.
- Use targeted search queries, e.g.:
  - site:linkedin.com/in "{{company_name}}" "{{job_title}}" India
- If LinkedIn URL is not visible but you can infer the role & name from snippets, still include name & title.
- Focus on senior positions: CEOs, CTOs, Real Estate Heads, Facilities Managers, Property Directors, Construction Managers, etc.
- Only return LinkedIn URLs that are **visible in search results** (copy the exact URL).
- If no LinkedIn URL is visible, return `"linkedin_profile": null`.
- DO NOT make up names, job titles, or URLs.
- Prioritize India-based personnel or those with decision-making authority for Indian operations.
- Verify profile authenticity and current employment status.
- DO NOT HALLUCINATE, DO NOT make up profiles. Use only the search results obtained.


Requirements:
- Ensure all individuals are currently employed at the target company.
- Focus on roles with real estate decision-making authority.
- Include both direct real estate roles and adjacent positions (facilities, operations, procurement).

Strict Hallucination Prevention
- DO NOT invent LinkedIn URLs (e.g., `https://linkedin.com/in/name-company`).
- DO NOT make up roles or locations.
- ONLY include information that appears in search results.

Research the company: {company_name}
"""

# Example Output:
# ```json
# {{
#     "people_details": [
#         {{
#             "person_name": "Rajesh Kumar",
#             "job_title": "Head of Real Estate & Facilities",
#             "company_name": "Infosys Limited",
#             "experience_years": "15+ years",
#             "location": {{
#                 "city": "Bangalore",
#                 "state": "Karnataka",
#                 "country": "India"
#             }},
#             "linkedin_profile": "https://linkedin.com/in/{{person_profile}}",
#             "other_social_profiles": ["https://twitter.com/{{person_profile}}"],
#             "bio_summary": "Senior real estate executive with expertise in corporate facility management and property development across India",
#             "additional_details": "Responsible for 50+ office locations pan-India, leads sustainability initiatives"
#             "confidence_score": 0.85(sample score),
#         }}
#     ],
#     "extraction_notes": "Found multiple decision makers through LinkedIn search and company website",
#     "search_query_used": "Infosys real estate facilities head India LinkedIn",
#     "source_urls": ["link1", "link2"]
# }}
# ```
# - Use the LinkedIn search tool to find accurate profiles for identified individuals.