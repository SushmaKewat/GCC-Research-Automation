from __future__ import annotations

from dataclasses import dataclass, field
from typing import TypedDict, List, Sequence

from langgraph.graph import add_messages
from langgraph.graph.ui import AnyUIMessage, ui_message_reducer
from typing_extensions import Annotated
from agent.tools_and_schemas import ExtractionResult


import operator


class OverallState(TypedDict):
    messages: Annotated[list, add_messages]
    ui: Annotated[Sequence[AnyUIMessage], ui_message_reducer]
    search_query: Annotated[list, operator.add]
    web_research_result: Annotated[list, operator.add]
    sources_gathered: Annotated[list, operator.add]
    initial_search_query_count: int
    max_research_loops: int
    research_loop_count: int
    reasoning_model: str
    companies_found: Annotated[list, operator.add]
    people_details: Annotated[list, operator.add]


class ReflectionState(TypedDict):
    is_sufficient: bool
    knowledge_gap: str
    follow_up_queries: Annotated[list, operator.add]
    research_loop_count: int
    number_of_ran_queries: int


class Query(TypedDict):
    query: str
    rationale: str


class QueryGenerationState(TypedDict):
    search_query: list[Query]


class WebSearchState(TypedDict):
    search_query: str
    id: str
    
class CompanyExtractionState(TypedDict):
    companies: Annotated[List[ExtractionResult], operator.add]
    company_list: List[str]
    
class ExtractPeopleDetailsState(TypedDict):
    company: str
    id: str
    

@dataclass(kw_only=True)
class SearchStateOutput:
    running_summary: str = field(default=None)  # Final report
