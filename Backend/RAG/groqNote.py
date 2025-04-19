import subprocess
import sys
import requests
import json
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional, Mapping
from langchain.llms.base import LLM
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.prompts import (
    PromptTemplate,
    ChatPromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from groq import Groq
from logs.last import get_last_command_output, clean_log_file

# Groq settings
GROQ_API_KEY = "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"

class GroqLLM(LLM):
    """Custom LLM wrapper for Groq API."""
    
    model_name: str = "meta-llama/llama-4-scout-17b-16e-instruct"
    temperature: float = 0.7
    max_tokens: int = 512
    client: Any = None  # Add this line to declare client as a field
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Initialize the client after parent initialization
        self.client = Groq(api_key=GROQ_API_KEY)
    
    def _call(self, prompt: str, stop=None) -> str:
        """Call the Groq API."""
        try:
            messages = [
                {"role": "system", "content": "You are a cybersecurity assistant specialized in penetration testing tools and analysis."},
                {"role": "user", "content": prompt}
            ]
            
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                top_p=1,
                stream=False
            )
            
            return completion.choices[0].message.content
            
        except Exception as e:
            print(f"Error calling Groq API: {e}")
            return f"Error: {str(e)}"
    
    @property
    def _llm_type(self) -> str:
        return "groq"
    
    @property
    def _identifying_params(self) -> Mapping[str, Any]:
        return {
            "model_name": self.model_name,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens
        }

# Create a global instance of the LLM
llm = GroqLLM(temperature=0.7, max_tokens=512)

# Request and Response Models
class ChatRequest(BaseModel):
    prompt: str
    history: Optional[List[Dict[str, str]]] = []
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 512

class ToolAnalysisRequest(BaseModel):
    tool_output: Optional[str] = None
    tool_name: Optional[str] = None
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 512

class LLMResponse(BaseModel):
    response: str

# Create shared memory and conversation chain
shared_memory = ConversationBufferMemory(
    return_messages=True,
    memory_key="history"
)

conversation = ConversationChain(
    memory=shared_memory,
    prompt=ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template("""
You are a cybersecurity assistant specialized in penetration testing tools and analysis.
For general queries: Provide factual tools and concise CLI commands.
For tool analysis: Analyze outputs and provide structured security insights.
Maintain context of the entire conversation for both tool analysis and general queries.
        """),
        MessagesPlaceholder(variable_name="history"),
        HumanMessagePromptTemplate.from_template("{input}")
    ]),
    llm=llm,
    verbose=True
)

# FastAPI Application
app = FastAPI(
    title="Notebook LLM API",
    description="API to interface with LLM models for security analysis",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Security Analysis LLM API is running"}

@app.post("/generate", response_model=LLMResponse)
async def generate_response(request: ChatRequest):
    """Generate a response using shared conversation memory."""
    try:
        llm.temperature = request.temperature
        llm.max_tokens = request.max_tokens
        response = conversation.predict(input=request.prompt)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.post("/analyze-tool", response_model=LLMResponse)
async def analyze_tool_output(request: ToolAnalysisRequest):
    """Analyze tool output using shared conversation memory."""
    try:
        clean_log_file()
        last_command_data = get_last_command_output()
        cmd = last_command_data.get("cmd")
        output = last_command_data.get("output")

        if not cmd or not output:
            raise HTTPException(status_code=400, detail="No valid command or output found in the logs.")

        analysis_input = f"""
[Tool Analysis Request]
Tool: {cmd}
Output: {output}

Provide:
1. Execution Summary
2. Key Findings/Vulnerabilities
3. Implications
4. Next Steps
5. Risk Level (Low/Medium/High)
"""
        llm.temperature = request.temperature
        llm.max_tokens = request.max_tokens
        response = conversation.predict(input=analysis_input)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing tool output: {str(e)}")

@app.post("/clear-history")
async def clear_history():
    """Clear the shared conversation history."""
    try:
        shared_memory.clear()
        return {"message": "Conversation history cleared"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing history: {str(e)}")

@app.get("/health")
async def health_check():
    """Check if the LLM is available and responding."""
    try:
        response = llm("Hello, are you working?")
        return {"status": "healthy", "llm_response": response[:50] + "..."}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"LLM not available: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)