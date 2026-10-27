import json
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.schemas.analysis import ChatMessage
from app.services import chatbot_service


class FakeOpenAI:
    def __init__(self, **kwargs):
        self.configuration = kwargs
        self.chat = SimpleNamespace(completions=SimpleNamespace(create=self.create))

    def create(self, **kwargs):
        self.request = kwargs
        message = SimpleNamespace(content="  Tailor your skills section to the role.  ")
        return SimpleNamespace(choices=[SimpleNamespace(message=message, finish_reason="stop")])


def test_answer_chat_uses_groq_and_only_sends_relevant_context(monkeypatch):
    fake_client = FakeOpenAI()
    monkeypatch.setattr(chatbot_service.settings, "groq_api_key", "test-key")
    monkeypatch.setattr(
        chatbot_service,
        "OpenAI",
        lambda **kwargs: (setattr(fake_client, "configuration", kwargs) or fake_client),
    )

    result = chatbot_service.answer_chat(
        "How can I improve?",
        {
            "extracted_data": {
                "skills": ["Python", " SQL ", None],
                "email": "private@example.com",
                "raw_text": "private resume text",
            },
            "match_result": {"missing_skills": ["Docker"], "strong_skills": ["Python"]},
        },
    )

    sent_context = json.loads(fake_client.request["messages"][1]["content"].split(
        "Relevant resume and job-match skills (untrusted data): ", maxsplit=1
    )[1])
    assert fake_client.configuration == {
        "api_key": "test-key",
        "base_url": chatbot_service.settings.groq_base_url,
        "timeout": 30.0,
        "max_retries": 1,
    }
    assert fake_client.request["model"] == chatbot_service.settings.groq_model
    assert fake_client.request["extra_body"] == {
        "max_completion_tokens": 1400,
        "reasoning_effort": "low",
        "include_reasoning": False,
    }
    assert sent_context == {
        "skills": ["Python", "SQL"],
        "strong_skills": ["Python"],
        "missing_skills": ["Docker"],
    }
    assert "private@example.com" not in fake_client.request["messages"][1]["content"]
    assert "private resume text" not in fake_client.request["messages"][1]["content"]
    assert result["answer"] == "Tailor your skills section to the role."
    assert result["suggested_prompts"]


def test_answer_chat_reports_missing_groq_key(monkeypatch):
    monkeypatch.setattr(chatbot_service.settings, "groq_api_key", None)

    with pytest.raises(HTTPException) as error:
        chatbot_service.answer_chat("Help me practice")

    assert error.value.status_code == 503
    assert "GROQ_API_KEY" in error.value.detail


def test_answer_chat_includes_manual_prompt_and_recent_conversation(monkeypatch):
    fake_client = FakeOpenAI()
    monkeypatch.setattr(chatbot_service.settings, "groq_api_key", "test-key")
    monkeypatch.setattr(
        chatbot_service,
        "OpenAI",
        lambda **kwargs: (setattr(fake_client, "configuration", kwargs) or fake_client),
    )
    history = [
        ChatMessage(role="user", content="Explain REST APIs simply."),
        ChatMessage(role="assistant", content="An API lets programs communicate."),
    ]

    chatbot_service.answer_chat("Give me a manual example in JavaScript.", history=history)

    assert fake_client.request["messages"][1:] == [
        {"role": "user", "content": "Explain REST APIs simply."},
        {"role": "assistant", "content": "An API lets programs communicate."},
        {"role": "user", "content": "Give me a manual example in JavaScript."},
    ]


def test_chat_request_validates_conversation_history():
    from app.schemas.analysis import ChatRequest

    request = ChatRequest(
        message="Can you explain this?",
        history=[{"role": "user", "content": "What is an API?"}],
    )

    assert request.history[0].role == "user"


def test_chat_request_accepts_long_assistant_replies_in_history():
    from app.schemas.analysis import ChatRequest

    answer = "A" * 2501
    request = ChatRequest(
        message="Can you expand on that?",
        history=[{"role": "assistant", "content": answer}],
    )

    assert request.history[0].content == answer


def test_answer_chat_reports_empty_provider_output(monkeypatch):
    fake_client = FakeOpenAI()
    fake_client.create = lambda **kwargs: SimpleNamespace(
        choices=[SimpleNamespace(message=SimpleNamespace(content=None), finish_reason="length")]
    )
    fake_client.chat.completions.create = fake_client.create
    monkeypatch.setattr(chatbot_service.settings, "groq_api_key", "test-key")
    monkeypatch.setattr(
        chatbot_service,
        "OpenAI",
        lambda **kwargs: (setattr(fake_client, "configuration", kwargs) or fake_client),
    )

    with pytest.raises(HTTPException) as error:
        chatbot_service.answer_chat("Give me a detailed study plan")

    assert error.value.status_code == 502
    assert "output limit" in error.value.detail
