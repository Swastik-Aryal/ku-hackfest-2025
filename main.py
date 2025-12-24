from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.router import AcademicQuestionRouter

app = FastAPI(title="NP Server API", description="A FastAPI server", version="1.0.0")

# Global router instance
router_instance = None


@app.on_event("startup")
async def startup_event():
    """Initialize the AcademicQuestionRouter at startup"""
    global router_instance
    router_instance = AcademicQuestionRouter()
    print("✓ AcademicQuestionRouter initialized")


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to NP Server API"}





if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
