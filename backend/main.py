from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import GROQ_MODEL, ENVIRONMENT, PORT
from routers import creators, briefs, proposals, engagements

app = FastAPI(
    title="CREOVATE API",
    description="AI Content Creator Marketplace Backend API",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(creators.router)
app.include_router(briefs.router)
app.include_router(proposals.router)
app.include_router(engagements.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "CREOVATE API",
        "environment": ENVIRONMENT,
        "groq_model": GROQ_MODEL
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
