from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils.router import AcademicQuestionRouter
from utils.physics_engine import PhysicsLlmEngine
from utils.mathematics_engine import MathsLlmEngine
from utils.animation_engine import AnimationEngine

app = FastAPI(title="NP Server API", description="A FastAPI server", version="1.0.0")


# Request/Response models
class QuestionRequest(BaseModel):
    question: str


class SubjectRequest(BaseModel):
    subject: str


@app.on_event("startup")
async def startup_event():
    """Initialize the AcademicQuestionRouter at startup"""
    await clear_history()
    print("Server startup complete.")


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/set-subject")
async def set_subject(request: SubjectRequest):
    """Set the subject (physics or mathematics)"""
    global llm_instance, subject_init

    subject = request.subject.lower()

    if subject not in ["physics", "mathematics"]:
        raise HTTPException(
            status_code=400, detail="Subject must be 'physics' or 'mathematics'"
        )

    subject_init = subject
    llm_instance = PhysicsLlmEngine()  # change this later
    router_instance.clear_history()
    return {"message": f"Subject set to {subject}"}


@app.post("/api/router_response")
async def router_response(request: QuestionRequest):
    """Classify an academic question and determine routing"""
    if not router_instance:
        raise HTTPException(status_code=500, detail="Router not initialized")

    try:
        # Check if data.json exists and has responses

        result = router_instance.handle_prompt(request.question)

        if (
            result["response"]["visualization_needed"]
            and result["response"]["manim_prompt"]
        ):
            manim_prompt = result["response"]["manim_prompt"]
            visualization_completion = await generate_visualization(manim_prompt)

        if result["response"]["explanation_needed"]:
            llm_response = llm_instance.generate(request.question)

        return {
            "llm_response": llm_response if llm_response else None,
            "visualization": visualization_completion
            if visualization_completion
            else None,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/visualizer")
async def generate_visualization(request: QuestionRequest):
    """Generate visualization prompt using the LLM engine"""
    visualizer = AnimationEngine()

    return "Some video after generating animation"


@app.post("/api/reset")
async def clear_history():
    global router_instance, llm_instance, subject_init
    router_instance = AcademicQuestionRouter()
    print("AcademicQuestionRouter initialized")
    subject_init = "physics"
    llm_instance = PhysicsLlmEngine()
    print("PhysicsLlmEngine initialized")
    return {"message": "Reset Done."}


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to NP Server API", "status": "active"}


if __name__ == "__main__":
    import uvicorn
    import json
    import os

    uvicorn.run(app, host="0.0.0.0", port=8000)
