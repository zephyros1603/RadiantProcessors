from typing import List, Dict, Any, Optional, Union
from fastapi import FastAPI, HTTPException, BackgroundTasks, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
from typing import List, Dict, Any, Optional

app = FastAPI(
    title="LLM API Bridge",
    description="API to interface with LM Studio's local LLM endpoints",
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
LM_STUDIO_API_URL = "http://localhost:3003/v1"

# Models for request/response
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: str = "local-model"
    messages: List[ChatMessage]
    temperature: float = 0.7
    max_tokens: int = 500
    stream: Optional[bool] = False

class CompletionRequest(BaseModel):
    model: str = "local-model"
    prompt: str
    temperature: float = 0.7
    max_tokens: int = 500
    stream: Optional[bool] = False

class EmbeddingRequest(BaseModel):
    model: str = "local-model"
    input: Union[str, List[str]]

# We're removing the strict response model to avoid validation errors
# class ModelInfoResponse(BaseModel):
#    models: List[Dict[str, Any]]

# GET endpoint to retrieve available models
@app.get("/models")  # Remove the response_model parameter
async def get_models(response: Response):
    try:
        response_data = requests.get(f"{LM_STUDIO_API_URL}/models")
        response_data.raise_for_status()
        return response_data.json()  # Return the raw JSON from LM Studio
    except requests.exceptions.RequestException as e:
        response.status_code = getattr(e.response, "status_code", 500)
        return {"error": f"Failed to fetch models from LM Studio: {str(e)}"}

# POST endpoint to generate chat completions
@app.post("/chat/completions")
async def create_chat_completion(request: ChatCompletionRequest, response: Response):
    try:
        # Convert Pydantic model to dict
        payload = request.dict()
        
        # Make request to LM Studio
        response_data = requests.post(
            f"{LM_STUDIO_API_URL}/chat/completions", 
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        response_data.raise_for_status()
        return response_data.json()
    except requests.exceptions.RequestException as e:
        response.status_code = getattr(e.response, "status_code", 500)
        return {"error": f"Failed to get chat completion from LM Studio: {str(e)}"}

# POST endpoint for regular completions
@app.post("/completions")
async def create_completion(request: CompletionRequest, response: Response):
    try:
        payload = request.dict()
        
        response_data = requests.post(
            f"{LM_STUDIO_API_URL}/completions", 
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        response_data.raise_for_status()
        return response_data.json()
    except requests.exceptions.RequestException as e:
        response.status_code = getattr(e.response, "status_code", 500)
        return {"error": f"Failed to get completion from LM Studio: {str(e)}"}

# POST endpoint for embeddings
@app.post("/embeddings")
async def create_embedding(request: EmbeddingRequest, response: Response):
    try:
        payload = request.dict()
        
        response_data = requests.post(
            f"{LM_STUDIO_API_URL}/embeddings", 
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        response_data.raise_for_status()
        return response_data.json()
    except requests.exceptions.RequestException as e:
        response.status_code = getattr(e.response, "status_code", 500)
        return {"error": f"Failed to get embeddings from LM Studio: {str(e)}"}

# Simple health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Simple example for testing
@app.get("/")
async def root():
    return {
        "message": "LLM API Bridge is running",
        "endpoints": {
            "GET /models": "Retrieve available models from LM Studio",
            "POST /chat/completions": "Generate chat completions using LM Studio",
            "POST /completions": "Generate text completions using LM Studio",
            "POST /embeddings": "Generate embeddings using LM Studio",
            "GET /health": "Check if the API is healthy"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)