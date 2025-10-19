from sqlalchemy.orm import Session
from mistralai import Mistral
from config import settings
from controller.member_controller import get_member, calculate_age_at_next_birthday
from view.ai_view import AIMessageRequest, AIMessageResponse, AIExplainability
from fastapi import HTTPException

COUNTRY_TO_LANGUAGE = {
    "Spain": "Spanish",
    "France": "French",
    "Germany": "German",
    "Italy": "Italian",
    "Portugal": "Portuguese",
    "Netherlands": "Dutch",
    "Poland": "Polish",
    "Romania": "Romanian",
    "Greece": "Greek",
    "Sweden": "Swedish",
    "Norway": "Norwegian",
    "Denmark": "Danish",
    "Finland": "Finnish",
    "Japan": "Japanese",
    "China": "Chinese",
    "South Korea": "Korean",
    "Brazil": "Portuguese",
    "Mexico": "Spanish",
    "Argentina": "Spanish",
    "Russia": "Russian"
}


def generate_birthday_message(db: Session, request: AIMessageRequest) -> AIMessageResponse:
    if not settings.MISTRAL_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="MISTRAL_API_KEY not configured"
        )

    member = get_member(db, request.member_id)
    age_turning = calculate_age_at_next_birthday(member.birth_date)

    language = "English"
    if request.localize_language and member.country in COUNTRY_TO_LANGUAGE:
        language = COUNTRY_TO_LANGUAGE[member.country]

    tone_description = "warm and friendly" if request.tone == "friendly" else "respectful and formal"

    prompt = f"""Generate a personalized birthday message for {member.first_name} {member.last_name} who is turning {age_turning} years old.

Context:
- Name: {member.first_name} {member.last_name}
- Age turning: {age_turning}
- Location: {member.city}, {member.country}
- Tone: {tone_description}
- Language: {language}

Please write a {tone_description} birthday message in {language}. Make it personal and heartfelt, mentioning their age and keeping the tone {tone_description}. Keep it to 2-3 sentences."""

    client = Mistral(api_key=settings.MISTRAL_API_KEY)

    model_name = "mistral-small-latest"
    temperature = 0.7
    max_tokens = 300

    # Messages as simple dictionaries
    messages = [
        {"role": "user", "content": prompt}
    ]

    try:
        # Use the new chat.complete method
        response = client.chat.complete(
            model=model_name,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Mistral AI API error: {str(e)}"
        )

    message = response.choices[0].message.content

    rationale = (
        f"Generated a {request.tone} birthday message for {member.first_name} turning {age_turning}. "
        f"Used {language} language to match their country ({member.country}) with personalized details about their milestone age."
    )

    explainability = AIExplainability(
        model_name=model_name,
        key_parameters={
            "temperature": temperature,
            "max_tokens": max_tokens,
            "tone": request.tone,
            "language": language
        },
        prompt_method=f"Direct prompt requesting {tone_description} message in {language} with member details",
        rationale=rationale
    )

    return AIMessageResponse(
        message=message,
        explainability=explainability
    )