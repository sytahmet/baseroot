# Baseroot NFT Metadata Structure Design

This document outlines the metadata structure for Research NFTs on the Baseroot platform, deployed on the Solana blockchain.

## Core Principles
- **Standardization:** Adhere to common NFT metadata standards where applicable, while accommodating specific needs of research outputs.
- **Discoverability:** Ensure metadata fields support efficient searching and filtering of research.
- **Verifiability:** Include fields that aid in verifying the authenticity and origin of the research.
- **Extensibility:** While defining a core set, the structure should allow for potential future additions if necessary.

## Metadata Fields

Based on the project prompt, the following fields are defined:

1.  **`title`**: 
    *   **Description**: The main title of the research output (e.g., paper, dataset).
    *   **Data Type**: String.
    *   **Constraints**: Should be concise yet descriptive. Max length might be considered (e.g., 256 characters).
    *   **Example**: "A Novel Approach to Decentralized AI Model Training"

2.  **`abstract`**:
    *   **Description**: A summary of the research output.
    *   **Data Type**: String.
    *   **Constraints**: Recommended length (e.g., 200-500 words). Should accurately represent the content.
    *   **Example**: "This paper introduces a new framework for training machine learning models in a decentralized manner, leveraging blockchain for incentive alignment and federated learning for privacy preservation..."

3.  **`authors`**:
    *   **Description**: A list of individuals or entities who contributed to the research. Each author could be represented as a string or a more structured object if more details (like affiliations or ORCID IDs) are desired in the future. For simplicity in V1, a list of strings is proposed.
    *   **Data Type**: Array of Strings (e.g., `["Dr. Alice Wonderland", "Bob The Builder"]`) or Array of Objects (e.g., `[{"name": "Dr. Alice Wonderland", "affiliation": "University X"}, ...]` - V1 will use Array of Strings).
    *   **Constraints**: At least one author must be specified.
    *   **Example**: `["Jane Doe", "John Smith"]`

4.  **`date`**:
    *   **Description**: The publication or creation date of the research output.
    *   **Data Type**: String (ISO 8601 format recommended, e.g., "YYYY-MM-DD").
    *   **Constraints**: Must be a valid date.
    *   **Example**: "2025-05-14"

5.  **`content_hash`** (formerly IPFS hash):
    *   **Description**: The cryptographic hash of the full research content (e.g., PDF, dataset archive) stored on a decentralized storage system like IPFS or Arweave. This hash serves as a unique identifier and a pointer to the content.
    *   **Data Type**: String.
    *   **Constraints**: Must be a valid hash from the chosen storage provider (e.g., IPFS CIDv0 or CIDv1, Arweave transaction ID).
    *   **Example (IPFS CIDv1)**: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"

6.  **`content_url`** (Implicit, derived from `content_hash`):
    *   **Description**: While not directly stored in the on-chain metadata to save space, this would be the resolvable URL to access the content (e.g., `ipfs://<content_hash>` or `https://<gateway>/ipfs/<content_hash>`, or `ar://<transaction_id>`). The frontend will construct this URL.

7.  **`keywords`** (Recommended Addition):
    *   **Description**: A list of keywords relevant to the research, aiding in discovery.
    *   **Data Type**: Array of Strings.
    *   **Constraints**: Optional, but highly recommended for better searchability.
    *   **Example**: `["DeSci", "Solana", "NFT", "AI", "Literature Review"]`

8.  **`research_type`** (Recommended Addition):
    *   **Description**: Type of research output (e.g., "Research Paper", "Dataset", "Preprint", "Review Article", "Software").
    *   **Data Type**: String (potentially an enum or controlled vocabulary).
    *   **Constraints**: Optional, but helps in categorization.
    *   **Example**: "Research Paper"

## On-Chain vs. Off-Chain Metadata

-   **On-Chain (Solana NFT Metadata)**: A URI pointing to an off-chain JSON file that contains the detailed metadata described above. Solana's Metaplex token-metadata program standard will be used. The on-chain data will typically include `name` (can be `title`), `symbol` (e.g., "BSRT"), and the `uri` to the off-chain JSON.
-   **Off-Chain (IPFS/Arweave JSON File)**: The actual JSON file containing all the fields (`title`, `abstract`, `authors`, `date`, `content_hash`, `keywords`, `research_type`, etc.). This JSON file itself will be stored on IPFS/Arweave, and its hash/URI will be the `uri` field in the on-chain Metaplex metadata.

## Example Off-Chain JSON Metadata File (stored on IPFS/Arweave):

```json
{
  "name": "A Novel Approach to Decentralized AI Model Training",
  "symbol": "BSRTR", // Baseroot Research
  "description": "This paper introduces a new framework for training machine learning models in a decentralized manner... (Can be same as abstract or a shorter version)",
  "seller_fee_basis_points": 0, // Assuming no secondary market fees for now
  "image": "uri_to_a_preview_image_or_logo.png", // Optional: A preview image for the NFT
  "animation_url": null, // Optional
  "external_url": "uri_to_platform_page_for_this_research.com", // Optional: Link back to Baseroot platform
  "attributes": [
    {"trait_type": "Publication Date", "value": "2025-05-14"},
    {"trait_type": "Research Type", "value": "Research Paper"}
    // Other relevant attributes can be added here
  ],
  "properties": {
    "authors": ["Jane Doe", "John Smith"],
    "keywords": ["DeSci", "AI", "Federated Learning"],
    "files": [
      {"uri": "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi", "type": "application/pdf"} // content_hash and type
    ],
    "category": "research_output", // As per Metaplex standard
    "creators": [
        // Solana addresses of creators and their share, if applicable for royalties
        // For Baseroot, this might be the uploader's address
        // {"address": "creator_wallet_address_1", "verified": true, "share": 100}
    ]
  },
  // Custom Baseroot specific fields (can be nested under properties or at top level)
  "baseroot_title": "A Novel Approach to Decentralized AI Model Training", // Redundant if `name` is used, but explicit
  "baseroot_abstract": "This paper introduces a new framework for training machine learning models in a decentralized manner, leveraging blockchain for incentive alignment and federated learning for privacy preservation...",
  "baseroot_content_hash": "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
  "baseroot_date": "2025-05-14",
  "baseroot_authors_list": ["Jane Doe", "John Smith"], // Explicitly named for clarity
  "baseroot_research_type": "Research Paper"
}
```

This structure aligns with Metaplex standards for NFTs on Solana while ensuring all necessary information for Baseroot's functionality is captured.
The `content_hash` will directly point to the research file (e.g., PDF on IPFS), and the JSON metadata itself will also be stored on IPFS/Arweave, with its URI stored on-chain.

