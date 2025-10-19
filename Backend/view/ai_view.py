from pydantic import BaseModel
from typing import Optional, Literal


class AIMessageRequest(BaseModel):
    member_id: int
    tone: Optional[Literal["friendly", "formal"]] = "friendly"
    localize_language: Optional[bool] = False


class AIExplainability(BaseModel):
    model_name: str
    key_parameters: dict
    prompt_method: str
    rationale: str


class AIMessageResponse(BaseModel):
    message: str
    explainability: AIExplainability