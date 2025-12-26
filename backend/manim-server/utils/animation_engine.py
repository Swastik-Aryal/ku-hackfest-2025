import json
import json
import re
import sys
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Optional
import google.genai as genai
from google.genai import types


class AnimationEngine:
    """Generates Manim code using Gemini API and compiles it to video."""

    def __init__(
        self,
        model_name: str = "gemini-3-flash-preview",
        data_filepath: Path = Path("manim.json"),
    ):
        self.api_key = "AIzaSyBPvHZxIMnw7OzJvBg6SjxpL8ehsnq14sc"
        self.client = genai.Client(api_key=self.api_key)
        self.model_name = model_name
        self.data_filepath = data_filepath
        self._initialize_data_file()

    def _initialize_data_file(self) -> None:
        """Initialize JSON storage if not present."""
        if not self.data_filepath.exists():
            self.data_filepath.write_text(
                json.dumps({"responses": []}, indent=2))

    def _save_interaction(self, interaction: Dict[str, Any]) -> None:
        """Append interaction to JSON file."""
        try:
            data = json.loads(self.data_filepath.read_text())
        except Exception:
            data = {"responses": []}

        data["responses"].append(interaction)
        self.data_filepath.write_text(json.dumps(data, indent=2))

    def generate_manim_code(self, prompt: str) -> str:
        """Request Manim code from Gemini API."""
        system_prompt = """You are an expert in Manim code generation.
Return EXACTLY one valid JSON object and nothing else.Give tested code so it will compile surely.

Schema:
{
  "manim_code": string | null
}"""

        response = self.client.models.generate_content(
            model=self.model_name,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt),
            contents=prompt,
        )

        try:
            data = json.loads(response.text)
            return data.get("manim_code", "")
        except Exception:
            return response.text  # raw return if JSON fails

    def handle_prompt(self, user_prompt: str) -> Dict[str, Any]:
        """Generate Manim code and save interaction."""
        code = self.generate_manim_code(user_prompt)
        result = {"question": user_prompt, "response": {"manim_code": code}}
        self._save_interaction(result)
        return result

    def clear_history(self) -> None:
        """Clear stored history."""
        self.data_filepath.write_text(json.dumps({"responses": []}, indent=2))

    def _load_conversation_history(self) -> List[Dict[str, Any]]:
        """Load stored interactions."""
        try:
            data = json.loads(self.data_filepath.read_text())
            return data.get("responses", [])
        except Exception:
            return []

    def compile_manim(self, code: str):
        """Compile Manim scene and print errors if it fails."""
        MANIM_FILE = "waves.py"

        clean = re.sub(r"^```[a-zA-Z]*\n?", "", code)
        clean = re.sub(r"\n?```$", "", clean)
        clean = re.sub(r"<\|.*?\|>", "", clean)
        clean = re.sub(r"</?think>", "", clean)

        Path(MANIM_FILE).write_text(clean, encoding="utf-8")
        print(f"[Stored] → {MANIM_FILE}")

        try:
            result = subprocess.run(
                ["manim", "-ql", MANIM_FILE, "-o", "video.mp4"],
                capture_output=True,
                text=True
            )

            if result.returncode != 0:
                print("\n Compilation Failed:\n")
                print(result.stderr)
                fixed = self.fallback(result.stderr)
                if fixed:
                    print("\n Trying to compile fixed code...\n")
                    self.compile_manim(fixed)
            else:
                print("\n Compiled Successfully!\n")
                print(result.stdout)

        except FileNotFoundError:
            print("⚠ Manim not installed or not in PATH.")
            sys.exit(1)

    def fallback(self, error: str) -> Optional[str]:
        """Ask Gemini to fix code based on error output."""
        history = self._load_conversation_history()

        prompt = f"""You must fix this Manim code so it compiles.

ERROR OUTPUT:
{error}

CONVERSATION HISTORY:
{json.dumps(history, indent=2) if history else "No history"}

Return EXACTLY one valid JSON object:
{{
  "manim_code": string | null
}}
"""

        response = self.client.models.generate_content(
            model=self.model_name,
            config=types.GenerateContentConfig(
                system_instruction="Fix Manim code."),
            contents=prompt,
        )

        try:
            data = json.loads(response.text)
            self._save_interaction(data)
            return data.get("manim_code", "")
        except Exception:
            return None


def main():
    engine = AnimationEngine()
    engine.clear_history()

    prompt = "Animation for simple harmonic motion"

    print("=== Code Generation ===")
    response = engine.handle_prompt(prompt)
    print(json.dumps(response, indent=2))

    code = response["response"]["manim_code"]
    if '\\n' in code:
        code = code.encode('utf-8').decode('unicode_escape')
    print("\n=== Compilation ===")
    engine.compile_manim(code)


if __name__ == "__main__":
    main()
