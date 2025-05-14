# Baseroot Backend Database Schema

This document outlines the proposed database schema for the Baseroot platform's backend, designed for PostgreSQL.

## Tables

### 1. `users`
Stores information about registered users (researchers, community members).
- `id` (SERIAL PRIMARY KEY): Unique identifier for the user.
- `wallet_address` (VARCHAR(44) UNIQUE NOT NULL): User's Solana wallet address (e.g., Phantom address, typically 32-44 characters).
- `username` (VARCHAR(255) UNIQUE): Optional chosen username.
- `email` (VARCHAR(255) UNIQUE): Optional email for notifications.
- `profile_info` (TEXT): JSON blob for profile details (bio, links, etc.).
- `created_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP): Timestamp of user creation.
- `updated_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP): Timestamp of last profile update.

### 2. `research_nfts`
Stores metadata and on-chain information about minted research NFTs.
- `id` (SERIAL PRIMARY KEY): Unique identifier for the NFT record in the database.
- `mint_address` (VARCHAR(44) UNIQUE NOT NULL): Solana address of the minted NFT.
- `on_chain_metadata_uri` (VARCHAR(255)): URI pointing to the on-chain metadata (e.g., Arweave/IPFS link for Metaplex standard).
- `title` (TEXT NOT NULL): Title of the research.
- `abstract` (TEXT): Abstract or summary of the research.
- `authors` (TEXT[]): Array of author names or references to user IDs.
- `publication_date` (DATE): Date of publication/minting.
- `content_hash` (VARCHAR(255) NOT NULL): IPFS/Arweave hash of the full research content.
- `keywords` (TEXT[]): Keywords associated with the research.
- `uploader_user_id` (INTEGER REFERENCES users(id)): User who uploaded/minted the research.
- `created_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP): Timestamp of record creation.
- `updated_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP): Timestamp of last update.

### 3. `dao_proposals`
Stores information about DAO funding proposals.
- `id` (SERIAL PRIMARY KEY): Unique identifier for the proposal in the database.
- `on_chain_proposal_id` (VARCHAR(255) UNIQUE NOT NULL): Identifier for the proposal on the Solana smart contract.
- `proposer_user_id` (INTEGER REFERENCES users(id) NOT NULL): User who submitted the proposal.
- `title` (TEXT NOT NULL): Title of the proposal.
- `description` (TEXT NOT NULL): Detailed description of the research project and funding request.
- `requested_amount_sol` (BIGINT): Requested funding amount in SOL (lamports).
- `target_funding_address` (VARCHAR(44) NOT NULL): Solana address to receive funds if approved.
- `ipfs_details_hash` (VARCHAR(255)): Optional IPFS hash for supplementary proposal documents.
- `status` (VARCHAR(50) DEFAULT 'Pending'): Current status (e.g., Pending, Voting, Approved, Rejected, Executed, Cancelled).
- `vote_start_timestamp` (TIMESTAMP WITH TIME ZONE): When voting begins.
- `vote_end_timestamp` (TIMESTAMP WITH TIME ZONE): When voting ends.
- `yes_votes` (INTEGER DEFAULT 0): Count of 'yes' votes (can be mirrored from on-chain or tallied by backend).
- `no_votes` (INTEGER DEFAULT 0): Count of 'no' votes.
- `created_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP): Timestamp of proposal submission.
- `updated_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP): Timestamp of last update.

### 4. `dao_votes`
Records individual votes on DAO proposals.
- `id` (SERIAL PRIMARY KEY): Unique identifier for the vote.
- `proposal_id` (INTEGER REFERENCES dao_proposals(id) NOT NULL): The proposal being voted on.
- `voter_user_id` (INTEGER REFERENCES users(id) NOT NULL): The user who cast the vote.
- `on_chain_voter_address` (VARCHAR(44) NOT NULL): Wallet address that cast the vote on-chain.
- `vote_type` (BOOLEAN NOT NULL): True for 'Yes', False for 'No'.
- `voting_power` (BIGINT): Amount of governance tokens used for the vote (if applicable).
- `transaction_signature` (VARCHAR(88)): Solana transaction signature for the on-chain vote.
- `voted_at` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP): Timestamp of the vote.
- UNIQUE (`proposal_id`, `voter_user_id`)
- UNIQUE (`proposal_id`, `on_chain_voter_address`)

### 5. `governance_tokens` (Optional - if tracking off-chain balances or for more complex logic)
Could store user governance token balances if not solely relying on on-chain data for voting power.
- `user_id` (INTEGER REFERENCES users(id) PRIMARY KEY): User ID.
- `balance` (BIGINT NOT NULL): User's governance token balance.
- `last_updated` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP).

## Relationships
- A `user` can upload multiple `research_nfts`.
- A `user` can submit multiple `dao_proposals`.
- A `user` can cast multiple `dao_votes` (one per proposal).
- Each `dao_vote` belongs to one `dao_proposal` and one `user`.

## Notes
- Timestamps should be stored in UTC.
- Indexing should be added to frequently queried columns (e.g., `wallet_address`, `mint_address`, `status` in `dao_proposals`).
- This schema is a starting point and can be expanded based on evolving requirements (e.g., comments, reviews, reputation scores).
- For fields like `authors` and `keywords` (TEXT[]), consider if a separate related table would be better for more complex querying if these become central features.

