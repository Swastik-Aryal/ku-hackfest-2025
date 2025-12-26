from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained(
    "Shaleen123/phi-3-mini-maths", trust_remote_code=True
)
model = AutoModelForCausalLM.from_pretrained(
    "Shaleen123/phi-3-mini-maths", trust_remote_code=True
)


messages = [
    {"role": "user", "content": "Convert the cartesian coordinate (x,y)=(2,4) to polar coordinates"},
]

inputs = tokenizer.apply_chat_template(
    messages,
    add_generation_prompt=True,
    tokenize=True,
    return_dict=True,
    return_tensors="pt",
).to(model.device)

outputs = model.generate(
    **inputs,
    max_new_tokens=1024,
    use_cache=False,
    do_sample=True,
    pad_token_id=tokenizer.eos_token_id,
)
print(tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1] :]))
