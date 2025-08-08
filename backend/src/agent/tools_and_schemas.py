from typing import List, Optional
from pydantic import BaseModel, Field
from langchain_core.tools import tool
from langchain_community.utilities import GoogleSearchAPIWrapper


class SearchQueryList(BaseModel):
    query: List[str] = Field(
        description="A list of search queries to be used for web research."
    )
    rationale: str = Field(
        description="A brief explanation of why these queries are relevant to the research topic."
    )


class Reflection(BaseModel):
    is_sufficient: bool = Field(
        description="Whether the provided summaries are sufficient to answer the user's question."
    )
    knowledge_gap: str = Field(
        description="A description of what information is missing or needs clarification."
    )
    follow_up_queries: List[str] = Field(
        description="A list of follow-up queries to address the knowledge gap."
    )
    
# Pydantic Models for structured output
class Person(BaseModel):
    name: Optional[str] = Field(description="Full name of the person")
    role: Optional[str] = Field(default=None, description="Role or title (e.g., CEO, Founder, Investor)")
    company_affiliation: Optional[str] = Field(default=None, description="Company they are associated with")

class Location(BaseModel):
    city: Optional[str] = Field(default=None, description="City name")
    state: Optional[str] = Field(default=None, description="State or province")
    country: Optional[str] = Field(default=None, description="Country name")
    # full_address: Optional[str] = Field(default=None, description="Complete address if available")

class InvestmentEntity(BaseModel):
    company_name: str = Field(description="Name of the company receiving investment")
    investment_amount: Optional[str] = Field(default=None, description="Investment amount with currency (e.g., '$10M', '€5 million')")
    # investment_round: Optional[str] = Field(default=None, description="Type of investment round (e.g., Series A, Seed, Pre-IPO)")
    # investors: List[str] = Field(default_factory=list, description="List of investor names or firms")
    associated_people: Optional[List[Person]] = Field(default_factory=list, description="Key people mentioned in relation to the investment")
    location: Optional[Location] = Field(default=None, description="Company location or investment location")
    industry: Optional[str] = Field(default=None, description="Industry or sector of the company")
    # investment_date: Optional[str] = Field(default=None, description="Date of investment if mentioned")
    # valuation: Optional[str] = Field(default=None, description="Company valuation if mentioned")
    # use_of_funds: Optional[str] = Field(default=None, description="Stated purpose or use of the investment funds")
    additional_details: Optional[str] = Field(default=None, description="Any other relevant investment details")

class ExtractionResult(BaseModel):
    entities: List[InvestmentEntity] = Field(description="List of extracted investment entities")
    confidence_score: float = Field(ge=0.0, le=1.0, description="Confidence score for the extraction (0-1)")
    extraction_notes: Optional[str] = Field(default=None, description="Any notes about the extraction process or ambiguities")
    source_urls: List[str] = Field(description="List of the article/source URL from which entities were extracted")

# New schema for people information extraction
class PersonDetail(BaseModel):
    person_name: str = Field(description="Full name of the person")
    job_title: Optional[str] = Field(default=None, description="Current job title or position")
    experience_years: Optional[str] = Field(default=None, description="Years of experience if mentioned")
    location: Optional[Location] = Field(default=None, description="Person's location (office/residence)")
    linkedin_profile: Optional[str] = Field(default=None, description="LinkedIn profile URL if mentioned")
    # other_social_profiles: Optional[List[str]] = Field(default_factory=list, description="Other social media profiles if mentioned")
    bio_summary: Optional[str] = Field(default=None, description="Brief biographical summary")
    confidence_score: float = Field(ge=0.0, le=1.0, description="Confidence score for the extraction (0-1)")
    additional_details: Optional[str] = Field(default=None, description="Any other relevant personal/professional details")

class PeopleExtractionResult(BaseModel):
    people_details: List[PersonDetail] = Field(description="List of extracted people details")
    company_name: str = Field(description="Name of the company they are associated with")
    extraction_notes: Optional[str] = Field(default=None, description="Any notes about the extraction process or ambiguities")
    # search_query_used: str = Field(description="The search query used to find this information")
    # source_urls: List[str] = Field(description="URLs of articles/sources from which people details were extracted")

class FinalResult(BaseModel):
    companies: List[PeopleExtractionResult] = Field(description="List of extracted companies with people details")


@tool
def find_people_profiles(query: str, k=5):
    """Tool node that performs a google search to find linkednin profiles of people in a company

    Args:
        query (str): linkedin search query
        k (int, optional): number of results to return. Defaults to 5.
    """
    search = GoogleSearchAPIWrapper(k=k)
    results =  search.results(query, k)
    print("GOOGLE SEARCH RESULTS: ", results)
    return results