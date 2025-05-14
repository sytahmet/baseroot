# AI Literature Discovery API Usage Guide

## 1. Overview

This document describes the structure and usage of the AI Literature Discovery API, which is part of the Baseroot DeSci platform. The API is designed to help researchers find relevant scientific papers based on keyword searches or by providing an abstract.

**Note:** The current implementation within the sandbox is a *simulated* version. It demonstrates the API endpoint structure and expected request/response formats but does not connect to a live, large-scale machine learning model or a comprehensive literature database. The similarity search logic is placeholder.

## 2. API Endpoint

*   **Endpoint:** `/api/v1/ai/discover` (This is a conceptual path; the actual router prefix might vary based on the main FastAPI app setup in `baseroot_backend/main.py`)
*   **Method:** `GET`
*   **Authentication:** Assumed to be handled by the main API gateway if required (e.g., JWT token for user-specific features, or open for general discovery).

## 3. Request

### Query Parameters

*   `query` (string, required):
    *   The search query. This can be a list of keywords (e.g., "CRISPR gene editing ethics") or a full abstract/text snippet.

### Example Request

Using `curl` or a browser:

```
GET /api/v1/ai/discover?query=quantum%20entanglement%20communication
```

Or with a longer abstract:

```
GET /api/v1/ai/discover?query=This%20paper%20explores%20the%20potential%20of%20using%20entangled%20photons%20for%20secure%20long-distance%20communication.%20We%20discuss%20current%20challenges%20and%20propose%20a%20novel%20architecture...
```

## 4. Response

### Success Response (200 OK)

The API will return a JSON array of relevant research paper objects.

**Format:**

```json
[
  {
    "id": "string", // Unique identifier for the discovered paper (e.g., DOI, internal ID)
    "title": "string", // Title of the paper
    "abstract_snippet": "string", // A relevant snippet from the abstract or full text
    "authors": ["string"], // List of author names
    "similarity_score": "float", // A score (e.g., 0.0 to 1.0) indicating relevance to the query
    "source_url": "string" // (Optional) URL to the full paper or its NFT view on Baseroot
  }
  // ... more results
]
```

**Example Success Response:**

```json
[
  {
    "id": "ai_res_1",
    "title": "Synergies Between Blockchain and AI in Scientific Publishing",
    "abstract_snippet": "This paper explores how blockchain's immutability and AI's analytical power can create a more transparent and efficient scientific publishing ecosystem...",
    "authors": ["Dr. Eva Chain", "Prof. Lex Algorithm"],
    "similarity_score": 0.92,
    "source_url": "/research/view/nft_id_placeholder_1"
  },
  {
    "id": "ai_res_2",
    "title": "Decentralized Data Markets for AI Training in DeSci",
    "abstract_snippet": "We propose a blockchain-based marketplace for scientific data, enabling secure and fair compensation for data providers and access for AI model training...",
    "authors": ["Dr. Ian Token", "Dr. Ada Data"],
    "similarity_score": 0.88,
    "source_url": "/research/view/nft_id_placeholder_2"
  }
]
```

If no results are found, an empty array `[]` will be returned with a 200 OK status.

### Error Responses

*   **400 Bad Request:** If the `query` parameter is missing or invalid.
*   **500 Internal Server Error:** If an unexpected error occurs on the server side during processing.

## 5. Backend Implementation Notes (`baseroot_backend/ai_discovery_api.py`)

*   The current Python backend code (`ai_discovery_api.py`) uses a simulated function `fetch_simulated_ai_discovery_results`.
*   This function returns hardcoded example results based on simple checks of the input query (e.g., presence of keywords like "blockchain").
*   For a production system, this endpoint would integrate with:
    1.  A robust search index (e.g., Elasticsearch, OpenSearch) populated with research paper metadata and embeddings.
    2.  A machine learning model (e.g., a sentence transformer from HuggingFace, or a custom model) to generate embeddings for the input query and compare them against the indexed paper embeddings to find semantic similarity.
    3.  Potentially, access to external academic APIs or databases for richer metadata and citation information (which was marked as out of scope for the initial simulated version).

## 6. Frontend Integration (`baseroot-frontend/src/components/AiLiteratureDiscoveryPage.tsx`)

*   The React component `AiLiteratureDiscoveryPage.tsx` provides a UI for users to input their search query.
*   It calls the (simulated) backend API endpoint and displays the results.
*   The component handles loading states and messages for the user.

This guide should help in understanding and potentially extending the AI Literature Discovery feature of the Baseroot platform.

