from transformers import AutoModelForCausalLM, AutoTokenizer
import torch


class PhysicsLlmEngine:
    def __init__(self, model_name="benhaotang/llama3.2-1B-physics-finetuned"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.bfloat16,  # fastest on RTX 4050
            device_map=None,  # we set device manually
            attn_implementation="flash_attention_2"
            if self._flash_available()
            else None,
        ).to(self.device)

        # Optional: compile model for speedup (torch 2.0+)
        try:
            self.model = torch.compile(self.model)
        except:
            pass  # ignore if compile not supported

        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.conversation_history = [
            {"role": "system", "content": "You are a physics expert"}
        ]
        print("Physics Model loaded and ready on", self.device)

    def _flash_available(self):
        try:
            import flash_attn

            return True
        except:
            return False

    def generate(self, prompt, max_new_tokens=1024, reset_history=False):
        if reset_history:
            self.conversation_history = [self.conversation_history[0]]

        self.conversation_history.append({"role": "user", "content": prompt})

        # Build prompt text once
        text = self.tokenizer.apply_chat_template(
            self.conversation_history,
            tokenize=False,
            add_generation_prompt=True,
        )

        # Tokenize without tracking gradients
        with torch.inference_mode():
            model_inputs = self.tokenizer(text, return_tensors="pt").to(self.device)
            generated_ids = self.model.generate(
                input_ids=model_inputs.input_ids,
                attention_mask=model_inputs.attention_mask,
                max_new_tokens=max_new_tokens,
                do_sample=True,
                temperature=0.6,
                top_p=0.9,
                pad_token_id=self.tokenizer.eos_token_id,
            )

        # Decode only new tokens
        new_tokens = generated_ids[0][model_inputs.input_ids.shape[-1] :]
        response = self.tokenizer.decode(new_tokens, skip_special_tokens=True)

        self.conversation_history.append({"role": "assistant", "content": response})
        return response

    def clear_history(self):
        self.conversation_history = [self.conversation_history[0]]


# Usage
if __name__ == "__main__":
    generator = PhysicsLlmEngine()

    response1 = generator.generate("What is Simple harmonic motion.")
    print(response1)
