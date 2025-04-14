# BaseRoot Program

Baseroot is a Solana program written using the Anchor framework. It is composed of two modules: `baseroot` and `baseroot_dao`. These modules together enable decentralized research uploads and voting functionalities.


## Overview

The BaseRoot program enables users to:
1. Upload research metadata to the Solana blockchain.
2. Allow community members to vote on research using a simple DAO mechanism.

The program is designed to ensure data integrity, prevent double voting, and provide a transparent record of votes.

---

## Modules

### `baseroot`

This module handles the uploading of research data to the blockchain. The uploaded data includes:
- The author's public key.
- The title of the research.
- An IPFS hash to store research content in a decentralized manner.
- A timestamp indicating when the research was uploaded.

**Instruction:**
- `upload_research`: Allows a user to upload research metadata.

### `baseroot_dao`

This module provides decentralized voting functionality on research. It allows users to:
- Initialize a voting account for a specific research item.
- Cast a "Yes" or "No" vote for the research.
- Prevent users from voting more than once on the same research.

**Instructions:**
1. `initialize_vote`: Creates a voting account for a research item.
2. `cast_vote`: Allows users to cast a vote (either "Yes" or "No").

---

## Usage

### Initialize Research Upload

To upload research metadata, call the `upload_research` function with the following parameters:
- `title`: The title of the research.
- `ipfs_hash`: The IPFS hash of the research content.

### Example:
```rust
pub fn upload_research(
    ctx: Context<UploadResearch>,
    title: String,
    ipfs_hash: String,
) -> Result<()>;
