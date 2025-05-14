from fastapi import APIRouter, HTTPException, Depends, status, Body
from pydantic import BaseModel, Field
from typing import List, Optional

# Placeholder for Solana interaction library, DB models, and session
# from ..services.solana_service import verify_signature, call_mint_nft_contract # Placeholder
# from ..database import get_db, ResearchNft, User # Placeholder
# from ..auth.auth_api import UserResponse # Assuming UserResponse is available for user context

router = APIRouter(
    prefix="/nft",
    tags=["nft_interaction"],
)

class NftMetadataInput(BaseModel):
    title: str = Field(..., example="A Novel Approach to Decentralized Science")
    abstract_text: str = Field(..., example="This paper details a new method for...")
    authors: List[str] = Field(..., example=["Dr. Ada Lovelace", "Dr. Charles Babbage"])
    publication_date: str = Field(..., example="2025-05-15") # ISO 8601 date string
    content_storage_hash: str = Field(..., example="bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi") # IPFS/Arweave hash
    content_storage_provider: str = Field(default="IPFS", example="IPFS")
    keywords: Optional[List[str]] = Field(default=None, example=["DeSci", "NFT", "Solana"])
    research_type: Optional[str] = Field(default=None, example="Research Paper")
    # The off-chain JSON metadata URI will be constructed by the backend or passed if already created
    # For this endpoint, we assume the backend will create the JSON, upload it, and get its URI.
    # The actual on-chain mint will use this URI.

class MintRequest(BaseModel):
    metadata: NftMetadataInput
    # uploader_wallet_address: str # This would come from an authenticated session/token
    # signature: str # To authorize the minting action from the user's wallet

class NftResponse(BaseModel):
    mint_address: str
    metadata_uri: str
    title: str
    message: str

class NftDetailResponse(BaseModel):
    mint_address: str
    uploader_wallet_address: str
    title: str
    abstract_text: str
    authors: List[str]
    publication_date: str
    content_storage_hash: str
    content_storage_provider: str
    metadata_uri: str
    keywords: Optional[List[str]] = None
    research_type: Optional[str] = None
    created_at: str # Should be datetime, but string for simplicity here

# Simulated DB for NFTs
fake_nft_db = {}
next_nft_id = 1

@router.post("/mint_research_nft", response_model=NftResponse, status_code=status.HTTP_201_CREATED)
async def mint_research_nft_endpoint(request: MintRequest = Body(...)):
    """
    Endpoint to mint a new research NFT.
    This is a simplified version. A real implementation would:
    1. Authenticate the user (e.g., via a token or signed message from their wallet).
    2. Prepare the full off-chain JSON metadata based on `request.metadata`.
    3. Upload the JSON metadata to IPFS/Arweave to get a `metadata_uri`.
    4. Construct the on-chain transaction to call the `mint_research_nft` smart contract method,
       passing the `title`, a symbol (e.g., "BSRTR"), and the `metadata_uri`.
    5. Require the user to sign this transaction (or have it signed by a backend wallet if delegated minting).
    6. Submit the transaction to the Solana network.
    7. On success, get the new NFT mint address.
    8. Store the NFT details (mint address, metadata URI, uploader, etc.) in the PostgreSQL database.
    """
    global next_nft_id
    # uploader_wallet = request.uploader_wallet_address # From auth context
    # For simulation, we generate a fake mint address and use input directly

    # Simulate metadata JSON creation and upload (in reality, this would involve IPFS/Arweave)
    simulated_metadata_uri = f"ipfs://{request.metadata.content_storage_hash}_metadata_json"

    # Simulate calling the on-chain contract
    # In a real scenario, this would involve solana-py or similar to interact with the deployed contract
    # For now, we generate a fake mint address
    simulated_mint_address = f"FakeMintAddr{next_nft_id:03d}{request.metadata.title[:5].replace(' ','')}"

    # Simulate saving to DB
    db_nft_entry = {
        "id": next_nft_id,
        "mint_address": simulated_mint_address,
        "uploader_user_id": 1, # Assuming user with ID 1 is the uploader for simulation
        "title": request.metadata.title,
        "abstract_text": request.metadata.abstract_text,
        "authors": request.metadata.authors,
        "publication_date": request.metadata.publication_date,
        "content_storage_hash": request.metadata.content_storage_hash,
        "content_storage_provider": request.metadata.content_storage_provider,
        "metadata_uri": simulated_metadata_uri,
        "keywords": request.metadata.keywords,
        "research_type": request.metadata.research_type,
        "on_chain_symbol": "BSRTR",
        "created_at": "2025-05-15T10:00:00Z" # Simulated timestamp
    }
    fake_nft_db[simulated_mint_address] = db_nft_entry
    next_nft_id += 1

    return NftResponse(
        mint_address=simulated_mint_address,
        metadata_uri=simulated_metadata_uri,
        title=request.metadata.title,
        message="Research NFT minted successfully (simulated)."
    )

@router.get("/get_nft_metadata/{mint_address}", response_model=NftDetailResponse)
async def get_nft_metadata_endpoint(mint_address: str):
    """
    Fetches the metadata for a given NFT mint address from the database.
    In a real scenario, it might also fetch live data from on-chain if needed,
    or resolve the metadata_uri to get the full JSON from IPFS/Arweave.
    """
    nft_data = fake_nft_db.get(mint_address)
    if not nft_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="NFT not found.")
    
    # Simulate fetching uploader wallet from a user table
    # uploader_wallet = fake_users_db.get(nft_data["uploader_user_id"]).wallet_address if fake_users_db.get(nft_data["uploader_user_id"]) else "UnknownUploader"
    uploader_wallet = "SimulatedUploaderWalletAddress"

    return NftDetailResponse(
        mint_address=nft_data["mint_address"],
        uploader_wallet_address=uploader_wallet, # Placeholder
        title=nft_data["title"],
        abstract_text=nft_data["abstract_text"],
        authors=nft_data["authors"],
        publication_date=nft_data["publication_date"],
        content_storage_hash=nft_data["content_storage_hash"],
        content_storage_provider=nft_data["content_storage_provider"],
        metadata_uri=nft_data["metadata_uri"],
        keywords=nft_data["keywords"],
        research_type=nft_data["research_type"],
        created_at=nft_data["created_at"]
    )

@router.get("/list_nfts", response_model=List[NftDetailResponse])
async def list_nfts_endpoint(skip: int = 0, limit: int = 10):
    """
    Lists research NFTs, with pagination.
    """
    all_nfts = []
    for nft_data in list(fake_nft_db.values())[skip : skip + limit]:
        uploader_wallet = "SimulatedUploaderWalletAddress" # Placeholder
        all_nfts.append(NftDetailResponse(
            mint_address=nft_data["mint_address"],
            uploader_wallet_address=uploader_wallet,
            title=nft_data["title"],
            abstract_text=nft_data["abstract_text"],
            authors=nft_data["authors"],
            publication_date=nft_data["publication_date"],
            content_storage_hash=nft_data["content_storage_hash"],
            content_storage_provider=nft_data["content_storage_provider"],
            metadata_uri=nft_data["metadata_uri"],
            keywords=nft_data["keywords"],
            research_type=nft_data["research_type"],
            created_at=nft_data["created_at"]
        ))
    return all_nfts

# TODO:
# - Integrate with actual PostgreSQL database using SQLAlchemy.
# - Implement actual Solana smart contract interactions for minting.
# - Implement IPFS/Arweave integration for metadata and content storage.
# - Add proper authentication and authorization for minting.
# - Add more robust error handling and input validation.
# - Add filtering and sorting options for list_nfts.

