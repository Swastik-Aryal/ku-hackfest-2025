import json
import re
from pathlib import Path
from typing import Dict, Any, Optional, List

from dotenv import load_dotenv
from google import genai
from google.genai import types


class AcademicQuestionRouter:
    """Routes and processes academic questions using Gemini API."""

    def __init__(
        self,
        model_name: str = "gemini-3-flash-preview",
        data_filepath: Path = Path("data.json"),
    ):
        load_dotenv()
        self.client = genai.Client()
        self.model_name = model_name
        self.data_filepath = Path(data_filepath)

        self._initialize_data_file()

    def handle_prompt(self, user_prompt: str) -> Dict[str, Any]:
        """Handle any user prompt with full conversation context."""
        # Load conversation history
        conversation_history = self._load_conversation_history()

        prompt = self._build_prompt(conversation_history)

        response = self.client.models.generate_content(
            model=self.model_name,
            config=types.GenerateContentConfig(system_instruction=prompt),
            contents=user_prompt,
        )

        parsed_response = self._parse_json_response(response.text)

        final_reposnse = {
            "question": user_prompt,
            "response": parsed_response,
        }

        # Save the interaction
        self._save_interaction(final_reposnse)

        return final_reposnse

    def _build_prompt(self, conversation_history: List[Dict[str, Any]]) -> str:
        """Build the system prompt with full conversation context."""
        history_text = (
            json.dumps(conversation_history, indent=2)
            if conversation_history
            else "No previous conversation."
        )

        return f"""You are an academic assistant that processes questions and requests.

CONVERSATION HISTORY:
{history_text}

Return EXACTLY one valid JSON object and nothing else — no markdown, no code fences, no explanation.

Schema you must follow:
{{"explanation_needed": true | false,
    "visualization_needed": true | false,
    "manim_prompt": string | null
}}

Rules:
- Set "explanation_needed" to true if the user is asking for an explanation or clarification or general question. Otherwise, set it to false.
- Set "visualization_needed" to true if the user is requesting a visualization or animation or change in animation . Otherwise, set it to false.
- Set both fields to true if both are requested or the explanation can be enhanced with a visualization. 
- If "visualization_needed" is true, then:
    - "manim_prompt" must contain a detailed Manim scene prompt optimized for an AI animation generator.
- If "visualization_needed" is false, set:
    - "manim_prompt": null
- JSON must be syntactically correct and complete."""

    def _load_conversation_history(self) -> List[Dict[str, Any]]:
        """Load the conversation history from the data file."""
        try:
            data = json.loads(self.data_filepath.read_text())
            return data.get("responses", [])
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def _save_interaction(self, interaction: Dict[str, Any]) -> None:
        """Save an interaction to the data file."""
        data = json.loads(self.data_filepath.read_text())
        data["responses"].append(interaction)
        self.data_filepath.write_text(json.dumps(data, indent=2))

    def _initialize_data_file(self) -> None:
        """Initialize the data file with empty responses array."""
        self.data_filepath.write_text(json.dumps({"responses": []}, indent=2))

    @staticmethod
    def _parse_json_response(response_text: str) -> Dict[str, Any]:
        """Extract and parse JSON from model response."""
        # Remove markdown code fences
        cleaned = response_text.strip()
        cleaned = re.sub(r"^```(?:json)?|```$", "", cleaned, flags=re.MULTILINE).strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse JSON response: {e}\nResponse: {cleaned}")

    def clear_history(self) -> None:
        """Clear the conversation history."""
        self._initialize_data_file()


def main():
    """Example usage."""
    router = AcademicQuestionRouter()

    # Clear any previous history
    router.clear_history()

    # Handle initial question
    question = (
        "Show how two coherent waves interfere to form a moving interference pattern, "
        "and explain how nodal and antinodal lines emerge."
    )

    print("=== Initial Question ===")
    response = router.handle_prompt(question)
    print(json.dumps(response, indent=2))

    # Handle follow-up
    print("\n=== Follow-up Question ===")
    followup = "What are we talking about?"
    followup_response = router.handle_prompt(followup)
    print(json.dumps(followup_response, indent=2))

    # Another follow-up
    print("\n=== Another Follow-up ===")
    followup2 = "Can you visualize this with an animation?"
    followup_response2 = router.handle_prompt(followup2)
    print(json.dumps(followup_response2, indent=2))


if __name__ == "__main__":
    main()
