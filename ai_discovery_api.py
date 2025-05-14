from fastapi import APIRouter, HTTPException, Body, status
from pydantic import BaseModel, Field
from typing import List, Optional, Dict

# For actual model loading and inference
# from transformers import AutoTokenizer, AutoModel
# from sentence_transformers import SentenceTransformer
# import torch

router = APIRouter(
    prefix="/ai",
    tags=["ai_literature_discovery"],
)

class AISearchRequest(BaseModel):
    keywords: Optional[List[str]] = Field(default=None, example=["decentralized science", "blockchain research"])
    abstract: Optional[str] = Field(default=None, example="This paper explores the intersection of AI and DeSci...")
    top_k: int = Field(default=5, ge=1, le=20)

class SimilarPaper(BaseModel):
    id: str # Could be a DOI, IPFS hash, or internal ID from a corpus
    title: str
    abstract_snippet: str
    similarity_score: float
    source_url: Optional[str] = None
    authors: Optional[List[str]] = None
    publication_date: Optional[str] = None

class AISearchResponse(BaseModel):
    query_received: Dict
    similar_papers: List[SimilarPaper]
    message: str

# Placeholder for a pre-loaded model and tokenizer (or SentenceTransformer model)
# In a real app, these would be loaded at startup to avoid long inference times per request.
# model_name = "sentence-transformers/all-MiniLM-L6-v2" # Example model
# tokenizer = None
# model = None
# sentence_model = None

# Simulated corpus of research papers (in reality, this would be a database or a vector store)
fake_corpus = [
    {
        "id": "paper_001", 
        "title": "The Future of Decentralized Research Funding", 
        "abstract": "Exploring novel mechanisms for funding scientific research using decentralized autonomous organizations (DAOs) and tokenomics. We propose a new model...",
        "keywords": ["decentralized science", "funding", "dao"],
        "authors": ["Dr. Alice Wonderland"],
        "publication_date": "2024-01-15"
    },
    {
        "id": "paper_002", 
        "title": "Blockchain Applications in Scientific Data Management", 
        "abstract": "This study reviews the current applications of blockchain technology for ensuring the integrity and provenance of scientific data. Challenges and opportunities are discussed...",
        "keywords": ["blockchain", "scientific data", "integrity"],
        "authors": ["Dr. Bob The Builder"],
        "publication_date": "2023-11-20"
    },
    {
        "id": "paper_003", 
        "title": "AI-Powered Literature Review for Medical Research", 
        "abstract": "We present an AI tool that automates parts of the literature review process for medical researchers, using natural language processing and machine learning to identify relevant studies.",
        "keywords": ["ai", "literature review", "medical research"],
        "authors": ["Dr. Carol Danvers"],
        "publication_date": "2024-03-01"
    },
    {
        "id": "paper_004", 
        "title": "NFTs for Intellectual Property in Science", 
        "abstract": "This paper investigates the potential of Non-Fungible Tokens (NFTs) as a means to manage and transfer intellectual property rights for scientific discoveries and research outputs.",
        "keywords": ["nft", "intellectual property", "science"],
        "authors": ["Dr. David Copperfield"],
        "publication_date": "2023-09-05"
    },
     {
        "id": "paper_005", 
        "title": "Tokenizing Research: A New Paradigm for DeSci", 
        "abstract": "We delve into the concept of tokenizing research assets, including papers, data, and IP, to create new economic models within the decentralized science ecosystem.",
        "keywords": ["desci", "tokenization", "research assets"],
        "authors": ["Dr. Eve Adams"],
        "publication_date": "2024-05-01"
    }
]

@router.post("/discover_literature", response_model=AISearchResponse)
async def discover_literature_endpoint(request: AISearchRequest = Body(...)):
    """
    Endpoint for AI-powered literature discovery.
    Accepts keywords and/or an abstract to find similar research papers.
    
    Simplified simulation:
    - Processes input keywords/abstract.
    - "Calculates" similarity against a fake corpus (random scores).
    - Returns top_k results.
    
    Real implementation would:
    1. Load a pre-trained sentence embedding model (e.g., from HuggingFace Sentence Transformers).
    2. Convert the input keywords/abstract into a dense vector embedding.
    3. Have a corpus of research papers, also pre-processed into vector embeddings, stored in a vector database (e.g., FAISS, Pinecone, Weaviate) or a searchable index.
    4. Perform a similarity search (e.g., cosine similarity) between the input vector and the corpus vectors.
    5. Retrieve the top_k most similar papers.
    6. Optionally, fetch citation data if available.
    """
    query_received = {}
    input_text_parts = []

    if not request.keywords and not request.abstract:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Either keywords or an abstract must be provided.")

    if request.keywords:
        query_received["keywords"] = request.keywords
        input_text_parts.extend(request.keywords)
    
    if request.abstract:
        query_received["abstract"] = request.abstract
        input_text_parts.append(request.abstract)
    
    # Combine input parts into a single string for embedding (simplified)
    combined_input_text = " ".join(input_text_parts)
    query_received["combined_input_for_similarity"] = combined_input_text

    # Simulate similarity search
    # In a real scenario, you would embed combined_input_text and compare with embeddings of fake_corpus items
    import random
    results = []
    for paper in fake_corpus:
        # Simulate a score based on keyword overlap or just random for now
        score = 0
        if request.keywords:
            for kw in request.keywords:
                if kw.lower() in paper["title"].lower() or kw.lower() in paper["abstract"].lower() or kw.lower() in [pk.lower() for pk in paper.get("keywords", [])]:
                    score += random.uniform(0.3, 0.8) # Increased score for keyword match
        if request.abstract: # Add some score if abstract is provided, very naive
            score += random.uniform(0.1, 0.3)
        
        # Ensure score is capped and normalized somewhat for this simulation
        final_score = min(max(score, 0.0), 1.0) 
        if final_score == 0.0: # Ensure some score if no keywords matched but abstract was given
            final_score = random.uniform(0.05, 0.2) if request.abstract else 0.0

        results.append({
            "id": paper["id"],
            "title": paper["title"],
            "abstract_snippet": paper["abstract"][:150] + "...", # Snippet
            "similarity_score": round(final_score, 4),
            "source_url": f"https://example.com/papers/{paper['id']}", # Fake URL
            "authors": paper.get("authors"),
            "publication_date": paper.get("publication_date")
        })
    
    # Sort by similarity score (descending) and take top_k
    sorted_results = sorted(results, key=lambda x: x["similarity_score"], reverse=True)
    top_k_results = [SimilarPaper(**res) for res in sorted_results[:request.top_k]]

    return AISearchResponse(
        query_received=query_received,
        similar_papers=top_k_results,
        message=f"Successfully retrieved {len(top_k_results)} similar papers (simulated)."
    )

# TODO:
# - Implement actual model loading and embedding generation.
# - Integrate with a vector database or FAISS for efficient similarity search.
# - Populate the corpus from actual research data (e.g., via an API or database).
# - Implement citation fetching logic (complex, may require external APIs like Semantic Scholar, CrossRef).
# - Add more sophisticated text processing and query understanding.
# - Error handling for model inference and external service calls.

