from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

# This will be in a separate db.py or models.py later
# For now, let's assume a User model and a get_db dependency are available
# from ..database import get_db, User # Placeholder

# Placeholder for database models and session, will be fleshed out later
# For now, we'll simulate some aspects.

class WalletConnectRequest(BaseModel):
    wallet_address: str

class UserResponse(BaseModel):
    id: int
    wallet_address: str
    username: str | None = None
    message: str

    class Config:
        orm_mode = True # or from_attributes = True for Pydantic v2

router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
)

# Simulated DB for now
fake_users_db = {}
next_user_id = 1

class DBUser:
    def __init__(self, id, wallet_address, username=None):
        self.id = id
        self.wallet_address = wallet_address
        self.username = username

@router.post("/connect_wallet", response_model=UserResponse)
async def connect_wallet(request: WalletConnectRequest):
    """
    Connects a user's wallet. 
    If the wallet address is new, a new user record is created.
    If the wallet address already exists, logs the user in (conceptually).
    """
    global next_user_id
    wallet_address = request.wallet_address

    # Basic validation for Solana wallet address (length, characters - very basic)
    if not (32 <= len(wallet_address) <= 44 and wallet_address.isalnum()):
        # This is a very basic check, real validation would be more robust (e.g. base58 check)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid wallet address format.")

    # Check if user exists
    existing_user = None
    for user_id, user_data in fake_users_db.items():
        if user_data.wallet_address == wallet_address:
            existing_user = user_data
            break

    if existing_user:
        return UserResponse(
            id=existing_user.id,
            wallet_address=existing_user.wallet_address,
            username=existing_user.username,
            message="Wallet connected successfully. Welcome back!"
        )
    else:
        # Create new user
        new_user_id = next_user_id
        new_db_user = DBUser(id=new_user_id, wallet_address=wallet_address)
        fake_users_db[new_user_id] = new_db_user
        next_user_id += 1
        
        return UserResponse(
            id=new_db_user.id,
            wallet_address=new_db_user.wallet_address,
            message="New user created and wallet connected successfully."
        )

# TODO:
# - Integrate with actual PostgreSQL database using SQLAlchemy.
# - Implement proper session management (e.g., JWT tokens if needed for subsequent requests, though wallet signature might be used).
# - Add more robust error handling.
# - Add endpoint to update user profile (e.g., set username).

# Example of how this might be integrated into main.py later:
# from fastapi import FastAPI
# from .routers import auth_router # Assuming this file is in routers/auth_router.py
# app = FastAPI()
# app.include_router(auth_router.router)

