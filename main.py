from fastapi import FastAPI
from baseroot_backend.auth_api import router as auth_router
from baseroot_backend.nft_api import router as nft_router
from baseroot_backend.dao_api import router as dao_router
from baseroot_backend.ai_discovery_api import router as ai_router

app = FastAPI(title="Baseroot DeSci Platform API - Simulated")

# Include routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(nft_router, prefix="/api/v1/nft", tags=["NFT Interaction"])
app.include_router(dao_router, prefix="/api/v1/dao", tags=["DAO Interaction"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI Discovery"])

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Baseroot DeSci Platform API (Simulated Mode). Visit /docs for API documentation."}

# In a real setup, you would also have database initialization, etc.
# For this demo, all data is simulated within the API route handlers themselves.

