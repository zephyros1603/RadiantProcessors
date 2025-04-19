import subprocess
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import requests
import json
from logs.last import get_last_command_output  # Import the function

# Import the LMStudioLLM class from your notebook
from langchain.llms.base import LLM
from typing import Any, Mapping

app = FastAPI(
    title="Notebook LLM API",
    description="API to interface with LLM models from notebooks",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LM Studio settings
LM_STUDIO_API_URL = "http://localhost:3001/v1"

# Custom LLM wrapper for LM Studio
class LMStudioLLM(LLM):
    """Custom LLM wrapper for LM Studio API."""
    
    model_name: str = "local-model"
    temperature: float = 0.7
    max_tokens: int = 512
    
    def _call(self, prompt: str, stop=None) -> str:
        """Call the LM Studio API."""
        try:
            # Format the request
            payload = {
                "model": self.model_name,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": self.temperature,
                "max_tokens": self.max_tokens
            }
            
            # Send request to LM Studio API
            response = requests.post(
                f"{LM_STUDIO_API_URL}/chat/completions",
                headers={"Content-Type": "application/json"},
                json=payload
            )
            
            response.raise_for_status()
            response_data = response.json()
            
            # Extract the generated text
            if "choices" in response_data and len(response_data["choices"]) > 0:
                return response_data["choices"][0]["message"]["content"]
            else:
                return "No response generated"
            
        except Exception as e:
            print(f"Error calling LM Studio API: {e}")
            return f"Error: {str(e)}"
    
    @property
    def _llm_type(self) -> str:
        """Return the type of LLM."""
        return "lm_studio"
    
    @property
    def _identifying_params(self) -> Mapping[str, Any]:
        """Get identifying parameters."""
        return {
            "model_name": self.model_name,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens
        }

# Create a global instance of the LLM
llm = LMStudioLLM(temperature=0.7, max_tokens=512)

# Request and response models
class PromptRequest(BaseModel):
    prompt: str
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 512

class ToolAnalysisRequest(BaseModel):
    tool_output: Optional[str]=None
    tool_name: Optional[str]=None
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 512

class LLMResponse(BaseModel):
    response: str

# API endpoints
@app.get("/")
async def root():
    return {"message": "Notebook LLM API is running"}

@app.post("/generate", response_model=LLMResponse)
async def generate_response(request: PromptRequest):
    """Generate a response from the LLM using the provided prompt."""
    try:
        # Configure the LLM with the provided parameters
        llm.temperature = request.temperature
        llm.max_tokens = request.max_tokens
        
        # Generate response
        response = llm(request.prompt)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.post("/analyze-tool", response_model=LLMResponse)
async def analyze_tool_output(request: ToolAnalysisRequest):
    """Analyze tool output using the security analysis template."""
    try:
        # Get the last command and its output
        last_command_data = get_last_command_output()
        cmd = last_command_data.get("cmd")
        output = last_command_data.get("output")

        if not cmd or not output:
            raise HTTPException(status_code=400, detail="No valid command or output found in the logs.")

        print(f"Last command: {cmd}")
        print(f"Command output:\n{output}")

        # Use the output from the scripts to create the analysis prompt
        analysis_prompt = f"""
        You are a cybersecurity expert analyzing the results of a penetration testing tool.

        Tool Name: {request.tool_name or "Unknown"}

        The user has executed the following command in a Kali Linux terminal:

        Command:
        {cmd}

        Output:
        ---
        {output}
        ---

        Based on the output, provide a detailed analysis including:
        - A summary of what the tool did
        - Any important findings or vulnerabilities
        - What these findings mean in practical terms
        - Suggested next steps or follow-up tools
        - Risk level (Low, Medium, High) if applicable

        Be precise, actionable, and technical — but also beginner-friendly if the output is simple.
        """

        # Configure the LLM with the provided parameters
        llm.temperature = request.temperature
        llm.max_tokens = request.max_tokens

        # Generate the analysis response using the invoke method
        response = llm.invoke(analysis_prompt)
        if not response:
            raise HTTPException(status_code=500, detail="LLM returned an empty response.")

        return {"response": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing tool output: {str(e)}")

   

        

@app.get("/health")
async def health_check():
    """Check if the LLM is available and responding."""
    try:
        response = llm("Hello, are you working?")
        return {"status": "healthy", "llm_response": response[:50] + "..."}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"LLM not available: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)