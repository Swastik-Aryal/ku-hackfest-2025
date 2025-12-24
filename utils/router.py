import json
import re
from pathlib import Path
from typing import Dict, Any, Optional, List

from dotenv import load_dotenv
from google import genai
from google.genai import types


class AcademicQuestionRouter:
    """Routes and processes academic questions using Gemini API."""

    ROUTING_SCHEMA = {
        "domain": ["math", "physics"],
        "sub_domain": [
            "mechanics",
            "electromagnetism",
            "thermodynamics",
            "quantum",
            "optics",
            "waves",
            "calculus",
            "algebra",
            "statistics",
            "linear_algebra",
            "differential_equations",
            "geometry",
        ],
        "solver_needed": ["symbolic", "numeric", "logical"],
        "visualization_tool": ["manim", None],
    }

    def __init__(
        self,
        model_name: str = "gemini-3-flash-preview",
        data_filepath: Path = Path("data.json"),
    ):
        load_dotenv()
        self.client = genai.Client()
        self.model_name = model_name
        self.data_filepath = Path(data_filepath)
        self.last_route: Optional[Dict[str, Any]] = None

        if not self.data_filepath.exists():
            self._initialize_data_file()

    def classify_question(self, question: str) -> Dict[str, Any]:
        """Classify an academic question and determine if visualization is needed."""
        prompt = self._build_classification_prompt()

        response = self.client.models.generate_content(
            model=self.model_name,
            config=types.GenerateContentConfig(system_instruction=prompt),
            contents=question,
        )

        classification = self._parse_json_response(response.text)
        self.last_route = classification

        # Save the question and classification
        self._save_interaction(
            {"type": "classification", "question": question, "response": classification}
        )

        return classification

    def handle_followup(self, followup_question: str) -> Dict[str, Any]:
        """Handle follow-up questions based on previous classification and full conversation history."""
        if not self.last_route:
            raise ValueError(
                "No previous classification found. Call classify_question() first."
            )

        # Load conversation history
        conversation_history = self._load_conversation_history()

        prompt = self._build_followup_prompt(conversation_history)

        response = self.client.models.generate_content(
            model=self.model_name,
            config=types.GenerateContentConfig(system_instruction=prompt),
            contents=followup_question,
        )

        followup_response = self._parse_json_response(response.text)

        # Save the follow-up interaction
        self._save_interaction(
            {
                "type": "followup",
                "question": followup_question,
                "response": followup_response,
            }
        )

        return followup_response

    def _build_classification_prompt(self) -> str:
        """Build the system prompt for question classification."""
        return """You are a router that classifies academic questions.
Return EXACTLY one valid JSON object and nothing else — no markdown, no code fences, no explanation.

Schema you must follow:
{
  "domain": "math" | "physics",
  "sub_domain": "mechanics" | "electromagnetism" | "thermodynamics" | "quantum" | "optics" | "waves" | "calculus" | "algebra" | "statistics" | "linear_algebra" | "differential_equations" | "geometry",
  "solver_needed": "symbolic" | "numeric" | "logical",
  "visualization_needed": true | false,
  "visualization_tool": "manim" | null,
  "manim_prompt": string | null
}

Rules:
- Set "domain" and "sub_domain" based on the question.
- "solver_needed" must describe the type of reasoning required to solve the problem.
- If "visualization_needed" is true, then:
    - "visualization_tool" must be "manim"
    - "manim_prompt" must contain a detailed Manim scene prompt optimized for an AI animation generator.
- If "visualization_needed" is false, set:
    - "visualization_tool": null
    - "manim_prompt": null
- JSON must be syntactically correct and complete.

Now classify the question."""

    def _build_followup_prompt(self, conversation_history: List[Dict[str, Any]]) -> str:
        """Build the system prompt for follow-up handling with full conversation context."""
        history_text = json.dumps(conversation_history, indent=2)

        return f"""You are an academic assistant handling a follow-up request.

FULL CONVERSATION HISTORY:
{history_text}

The user's new message is a follow-up. Use the entire conversation context to understand what they're referring to.
Return EXACTLY one valid JSON object and nothing else.

Respond in this schema:
{{
  "action": "solve" | "visualize" | "reclassify",
  "solver_model": string | null,
  "manim_prompt": string | null,
  "context_summary": string
}}

Rules:
- If the user is asking to solve the problem, set action="solve" and provide solver_model.
- If the user asks for animation/diagram/visual output, set action="visualize" and provide manim_prompt.
- If the user asks a completely new academic question, set action="reclassify".
- Always provide a brief context_summary explaining what the user is referring to based on history.
- If not needed, keep fields null."""

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
        self.last_route = None


def main():
    """Example usage."""
    router = AcademicQuestionRouter()

    # Clear any previous history
    router.clear_history()

    # Classify initial question
    question = (
        "Show how two coherent waves interfere to form a moving interference pattern, "
        "and explain how nodal and antinodal lines emerge."
    )

    print("=== Initial Classification ===")
    classification = router.classify_question(question)
    print(json.dumps(classification, indent=2))

    # Handle follow-up with full context
    print("\n=== Follow-up Question ===")
    followup = "What are we talking about?"
    followup_response = router.handle_followup(followup)
    print(json.dumps(followup_response, indent=2))

    # Another follow-up
    print("\n=== Another Follow-up ===")
    followup2 = "Can you visualize this with an animation?"
    followup_response2 = router.handle_followup(followup2)
    print(json.dumps(followup_response2, indent=2))


if __name__ == "__main__":
    main()
