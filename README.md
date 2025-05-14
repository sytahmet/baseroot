# Baseroot DeSci Platform - Project Deliverables

## Overview

This project, Baseroot, is a Decentralized Science (DeSci) platform built on the Solana blockchain. It aims to empower researchers by providing tools for publishing research as NFTs, securing funding through a DAO, and discovering relevant literature using AI-powered tools.

This package contains all the source code for the smart contracts, backend services, and frontend user interface, along with documentation to help you set up, deploy, and contribute to the project.

## Core Components

1.  **Smart Contracts (Solana/Rust/Anchor):** Located in `/home/ubuntu/baseroot_nft_minter` and `/home/ubuntu/baseroot_dao`.
    *   **NFT Minter:** Allows researchers to mint their research outputs (papers, datasets, etc.) as NFTs on the Solana blockchain. Metadata includes title, abstract, authors, publication date, and a content hash pointing to the research file stored on IPFS.
    *   **DAO Contracts:** Govern the platform, enabling token-based voting for research funding proposals and managing fund distribution.

2.  **Backend (FastAPI/Python):** Located in `/home/ubuntu/baseroot_backend`.
    *   Provides APIs for user authentication (wallet connection), NFT interaction (minting, metadata fetching), DAO operations (proposal submission, voting, status tracking), and AI-powered literature discovery.
    *   Designed to interact with the Solana smart contracts and a PostgreSQL database (schema provided).
    *   Includes a simulated AI literature discovery module using HuggingFace sentence transformers (actual model training and large-scale data processing are out of scope for this simulation but the API structure is present).

3.  **Frontend (React/TypeScript/Styled-Components):** Located in `/home/ubuntu/baseroot-frontend`.
    *   A user-friendly interface for interacting with all platform features.
    *   Wallet integration (Phantom, Solflare via Solana Wallet Adapter).
    *   Research upload and minting page.
    *   Page to explore minted research NFTs with search and filter capabilities.
    *   Individual research view page displaying detailed metadata and a link to the full content.
    *   DAO dashboard for submitting proposals, viewing active/past proposals, voting, and tracking DAO funds (simulated data for display).
    *   AI Literature Discovery tool page for searching similar papers.

4.  **Storage Integration (IPFS - Conceptual):**
    *   The design includes storing research files on IPFS, with the content hash being part of the NFT metadata. The backend API for file upload is designed conceptually, and actual IPFS setup and integration would be the next step in a live environment.

## Documentation

*   **`deployment_guide.md`:** Detailed instructions for setting up the development environment, building, testing (with notes on local smart contract testing), and deploying each component (smart contracts, backend, frontend).
*   **`CONTRIBUTING.md`:** Guidelines for developers who wish to contribute to the Baseroot project, covering code structure, setup, and best practices.
*   **`ai_tool_api_usage.md`:** Information on how the AI literature discovery API is structured and how it can be used (based on the simulated implementation).
*   **`todo.md`:** The detailed checklist used throughout the project development, showing completed, skipped (with reasons), and pending tasks.
*   **Design Documents:**
    *   `/home/ubuntu/nft_metadata_design.md`
    *   `/home/ubuntu/dao_governance_token_design.md`
    *   `/home/ubuntu/baseroot_backend/database_schema.md`

## Important Notes

*   **Smart Contract Testing Environment:** As communicated, I encountered persistent issues with the Solana toolchain (v1.18.4) installation within the sandbox environment, preventing full `anchor test` execution. The smart contract code is provided, and the `deployment_guide.md` includes instructions on how you can set up your local Solana environment to build and test these contracts thoroughly.
*   **Simulated Data:** Many frontend components and backend API endpoints currently use simulated data for demonstration purposes (e.g., NFT listings, DAO proposals, AI search results, fund tracking). Full integration with a live database and on-chain data requires further setup as outlined in the deployment guide.
*   **Styling:** The frontend was developed using Styled-Components after encountering issues with TailwindCSS setup in the sandbox environment.

We believe this provides a solid foundation for the Baseroot DeSci platform. Please refer to the respective documentation files for more detailed information.

