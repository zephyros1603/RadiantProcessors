from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
from langchain.llms.base import LLM
from langchain.chains import ConversationChain, LLMChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate

# Load CodeLlama model
model_name = "codellama/CodeLlama-7b-Instruct-hf"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto")

# Custom LangChain LLM wrapper
class CodeLlamaLLM(LLM):
    def _call(self, prompt: str, stop=None) -> str:
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        outputs = model.generate(
            **inputs,
            max_new_tokens=512,
            temperature=0.7,
            top_p=0.95,
            do_sample=True,
            eos_token_id=tokenizer.eos_token_id,
            pad_token_id=tokenizer.eos_token_id,
        )
        full_output = tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = full_output[len(prompt):].strip()

        # Clean output if it starts repeating
        if "Human:" in response:
            response = response.split("Human:")[0].strip()
        if "AI:" in response:
            response = response.split("AI:")[-1].strip()

        return response

    @property
    def _llm_type(self) -> str:
        return "custom_codellama"

llm = CodeLlamaLLM()

# 🛠️ Analysis Prompt Template for Tool Output
analysis_prompt = PromptTemplate(
    input_variables=["tool_output", "tool_name"],
    template="""
You are a cybersecurity expert analyzing the results of a penetration testing tool.

Tool Name: {tool_name}

The user has executed the tool manually in a Kali Linux terminal. Below is the raw output from the tool:

---
{tool_output}
---

Based on the output, provide a detailed analysis including:
- A summary of what the tool did
- Any important findings or vulnerabilities
- What these findings mean in practical terms
- Suggested next steps or follow-up tools
- Risk level (Low, Medium, High) if applicable

Be precise, actionable, and technical — but also beginner-friendly if the output is simple.
"""
)

# 🤖 Create LLM chain for analysis
llm_chain = LLMChain(llm=llm, prompt=analysis_prompt)

# 🧠 Memory + Chat mode for follow-ups
chat_prompt = PromptTemplate(
    input_variables=["history", "input"],
    template="""
You are a cybersecurity assistant. Only respond with factual tools and commands used in penetration testing. Do not make up data.

{history}
Human: {input}
AI:"""
)

conversation = ConversationChain(
    llm=llm,
    memory=ConversationBufferMemory(),
    prompt=chat_prompt,
    verbose=True
)

# 📂 Load tool output and run analysis
try:
    tool_output = open("output.txt").read()
    tool_name = "nikto"
    print("\n📊 Initial Tool Output Analysis:\n")
    analysis = llm_chain.run(tool_output=tool_output, tool_name=tool_name)
    print(analysis)
except FileNotFoundError:
    print("⚠️ 'output.txt' not found. Skipping tool analysis.")
    tool_output = None

# 💬 Start chat for follow-up questions (command suggestion, deeper recon, etc.)
print("\n💬 You can now ask follow-up questions (e.g., suggest command, deeper scan). Type 'exit' to quit.\n")
while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit"]:
        break
    response = conversation.predict(input=user_input)
    print(f"AI: {response}\n")