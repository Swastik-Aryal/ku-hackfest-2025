from transformers import AutoModelForCausalLM, AutoTokenizer


class PhysicsLlmEngine:
    def __init__(self, model_name="benhaotang/llama3.2-1B-physics-finetuned"):
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name, torch_dtype="auto", device_map="auto"
        )
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.conversation_history = [
            {
                "role": "system",
                "content": "You are Mr feynman",
            }
        ]
        print("Model loaded and ready!")

    def generate(self, prompt, max_new_tokens=1024, reset_history=False):
        if reset_history:
            self.conversation_history = [self.conversation_history[0]]

        self.conversation_history.append({"role": "user", "content": prompt})

        text = self.tokenizer.apply_chat_template(
            self.conversation_history,
            tokenize=False,
            add_generation_prompt=True,
            enable_thinking=False,
        )

        model_inputs = self.tokenizer(
            [text], return_tensors="pt").to(self.model.device)

        generated_ids = self.model.generate(
            **model_inputs, max_new_tokens=max_new_tokens
        )

        generated_ids = [
            output_ids[len(input_ids):]
            for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
        ]

        response = self.tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[
            0
        ]
        self.conversation_history.append(
            {"role": "assistant", "content": response})

        return response

    def clear_history(self):
        self.conversation_history = [self.conversation_history[0]]


# Usage
if __name__ == "__main__":
    generator = PhysicsQuestionsPrompt()

# Maintains conversation context
    response1 = generator.generate("What isSimple harmonic motion.")
    print(response1)
# response2 = generator.generate("Now make it rotate.")  # References previous context
# print(response2)

# Start fresh conversation
# response3 = generator.generate("Create a square animation.", reset_history=True)
# print(response3)
