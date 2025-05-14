# Baseroot DeSci Platform - To-Do List

## Phase 1: Smart Contract Development (Solana/Rust)
- [x] **1.1: Setup Solana Development Environment:** Install Rust, Solana CLI, Anchor framework.
- [x] **1.2: Design NFT Metadata Structure:** Define fields (title, abstract, authors, date, content_hash) for research NFTs.
- [x] **1.3: Develop NFT Minting Contract:** Implement logic to mint research outputs as NFTs using SPL.
- [x] **1.4: Design DAO Governance Token:** Define tokenomics and basic functionalities.
- [x] **1.5: Develop DAO Proposal Contract:** Implement logic for submitting research funding proposals.
- [x] **1.6: Develop DAO Voting Contract:** Implement logic for token-based voting on proposals.
- [x] **1.7: Develop DAO Funding Distribution Contract:** Implement logic for distributing funds to approved projects.
- [x] **1.8: Write Unit Tests for Smart Contracts:** Ensure all contract functionalities are thoroughly tested.
- [ ] **1.9: Initial Deployment to Solana Devnet:** Deploy and test contracts on a local or devnet environment.

## Phase 2: Backend Development (FastAPI/Python)
- [x] **2.1: Setup Backend Project:** Initialize FastAPI project, configure database (PostgreSQL).
- [x] **2.2: Design Database Schema:** Define tables for users, research NFTs, DAO proposals, votes, etc.
- [x] **2.3: Implement User Authentication API:** Allow users to connect wallets (e.g., Phantom).
- [x] **2.4: Implement NFT Interaction API Endpoints:** Endpoints for minting (interacting with Solana contracts), fetching NFT metadata.
- [x] **2.5: Implement DAO Interaction API Endpoints:** Endpoints for submitting proposals, voting, viewing proposal status, tracking funds (interacting with Solana contracts).
- [x] **2.6: Develop AI Literature Discovery API - Core Logic:**
    - [x] **2.6.1: Choose and Integrate LLM:** Select and set up either OpenAI GPT or a HuggingFace Transformer model. (Decision: Will start with HuggingFace for potentially lower cost and more control, can switch to OpenAI if needed).
    - [x] **2.6.2: Implement Keyword/Abstract Input Processing.** (Simulated in ai_discovery_api.py)
    - [x] **2.6.3: Implement Similarity Search Algorithm:** Find similar papers based on input. (Simulated in ai_discovery_api.py)
    - [~] **2.6.4: Implement Citation Fetching Logic (if feasible with chosen LLM/data sources).** (Marked as out of scope for initial simulated API due to complexity and reliance on external data sources not available).
- [~] **2.7: Develop AI Literature Discovery API - Optional Features (if time permits):** (Skipped for initial version due to time constraints and focus on core functionality)
    - [~] **2.7.1: Implement Text Summarization Feature.**
    - [~] **2.7.2: Implement Abstract Enhancement Feature.**
- [x] **2.8: Write API Unit and Integration Tests.** (Simulated tests provided in `baseroot_backend/test_api_simulated.py` due to environment limitations. User will be guided on full local testing.)

## Phase 3: Frontend Development (React/Styled-Components)
- [x] **3.1: Setup Frontend Project:** Initialize React project, integrate Styled-Components.
- [x] **3.2: Implement Wallet Integration:** Connect to Phantom/Solflare wallets using Wallet Adapter.
- [x] **3.3: Develop UI - Research Upload & Minting Page:** Form for metadata input, file upload (to IPFS/Arweave via backend), and triggering NFT minting.
- [x] **3.4: Develop UI - Explore Research Page:** Display minted research NFTs, allow filtering and searching.
- [x] **3.5: Develop UI - Individual Research View Page:** Show detailed metadata and link to full content for a selected NFT.
- [x] **3.6: Develop UI - DAO Dashboard:**
    - [x] **3.6.1: Proposal Submission Form.**
    - [x] **3.6.2: List of Active/Past Proposals.**
    - [x] **3.6.3: Voting Interface for Proposals.**
    - [x] **3.6.4: Fund Tracking Display.**
- [x] **3.7: Develop UI - AI Literature Discovery Tool Page:** Input for keywords/abstract, display of similar papers and citations.
- [x] **3.8: Implement API Integrations:** Connect frontend components to backend APIs.
- [ ] **3.9: Ensure Responsive Design:** Optimize for desktop and mobile views.
- [ ] **3.10: Write Frontend Component Tests.**

## Phase 4: Storage Integration (IPFS/Arweave)
- [ ] **4.1: Choose Storage Solution:** Decide between IPFS and Arweave. (Decision: Will start with IPFS due to wider adoption and tooling, can evaluate Arweave if specific persistence guarantees are critical).
- [ ] **4.2: Implement File Upload Logic (Backend):** Integrate chosen storage solution for uploading research files.
- [ ] **4.3: Ensure Content Hash is Stored in NFT Metadata:** Link the storage hash correctly during minting.
- [ ] **4.4: Implement File Retrieval Logic:** Allow users to access full research content via the stored hash.

## Phase 5: Integration, Testing, and Deployment
- [ ] **5.1: Full System Integration:** Connect frontend, backend, smart contracts, and storage.
- [ ] **5.2: End-to-End Testing on Devnet:** Thoroughly test all user flows and functionalities.
- [ ] **5.3: Prepare Deployment Scripts:** Scripts for minting, proposing, voting, funding for different environments.
- [ ] **5.4: Deployment to Solana Testnet:** Deploy all components to the testnet.
- [ ] **5.5: User Acceptance Testing (UAT) on Testnet (Simulated):** Perform comprehensive testing from a user perspective.
- [ ] **5.6: (If Approved by User) Prepare for Mainnet Deployment:** Address any issues found during testnet phase.
- [ ] **5.7: (If Approved by User) Deploy to Solana Mainnet.**

## Phase 6: Documentation and Deliverables
- [ ] **6.1: Write Deployment Documentation:** Detailed steps for deploying the smart contracts, backend, and frontend.
- [ ] **6.2: Write Contribution Documentation:** Guidelines for developers wanting to contribute to the project (code structure, setup, etc.).
- [ ] **6.3: Prepare Final dApp Package:** All code, deployment scripts, and documentation.
- [ ] **6.4: Document AI Tool Backend/API Usage.**
- [ ] **6.5: Final Review of All Deliverables against Project Prompt.**

## Optional Enhancements (Post-MVP, if requested)
- [ ] **OE1: Researcher Reputation Scoring.**
- [ ] **OE2: Peer-to-Peer Review System with Incentives.**
- [ ] **OE3: Interactive AI Guide for Onboarding Users.**

