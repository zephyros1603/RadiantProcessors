from langchain.prompts import PromptTemplate

prompt = PromptTemplate(
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

tool_output = open("output.txt").read()  # or from user input
tool_name = "nikto"

response = llm_chain.run(tool_output=tool_output, tool_name=tool_name)
print(response)