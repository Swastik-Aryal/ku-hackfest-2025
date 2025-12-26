from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from utils.animation_engine import AnimationEngine
from pathlib import Path
app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure your video directory
VIDEO_DIR = os.path.join("media/videos/waves", "480p15")


class VideoRequest(BaseModel):
    manim_prompt: str


@app.post("/generate-video")
async def generate_video(request: VideoRequest):
    """
    Endpoint to generate a video based on a prompt.
    Expects JSON input with a 'prompt' field.
    Returns the filename of the generated video.
    """
    animation_engine = AnimationEngine()
    response = animation_engine.handle_prompt(request.manim_prompt)

    code = response["response"]["manim_code"]
    if '\\n' in code:
        code = code.encode('utf-8').decode('unicode_escape')
    print("\n=== Compilation ===")
    animation_engine.compile_manim(code)

    video_path = os.path.join(VIDEO_DIR, "video.mp4")

    if not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Video not found")

    # Stream video directly
    return FileResponse(
        video_path,
        media_type="video/mp4",
        headers={
            "Accept-Ranges": "bytes",
            "Content-Disposition": f'inline; filename="video.mp4"',
        },
    )


@app.post("/reset-history")
async def reset_history():
    data_filepath = Path("manim.json")
    data_filepath.write_text(json.dumps({"responses": []}, indent=2))
    return {"message": "Reset done"}
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8080)
