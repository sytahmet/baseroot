# Baseroot DeSci Platform - Deployment Guide

## 1. Introduction

This guide provides instructions for setting up the development environment, building, testing (with specific notes for smart contracts), and deploying the Baseroot DeSci platform components: Solana Smart Contracts, FastAPI Backend, and React Frontend.

**Important Note on Smart Contract Testing:** Due to persistent Solana toolchain (v1.18.4 for `cargo-build-sbf`) installation issues within the provided sandbox environment, `anchor test` could not be fully executed there. This guide will instruct you on setting up a local Solana environment where you can build and thoroughly test the smart contracts.

## 2. Prerequisites

Ensure you have the following installed on your local machine:

*   **Rust:** (Latest stable version) - For Solana smart contract development.
*   **Solana CLI:** (Version 1.18.x recommended for Anchor 0.31.1 compatibility) - For interacting with the Solana network.
*   **Anchor Framework:** (Version 0.31.1) - For Solana smart contract development.
*   **Node.js & npm:** (Latest LTS version) - For frontend development and some backend utilities.
*   **Python:** (Version 3.9+) - For backend development.
*   **pip & venv:** For Python package management.
*   **PostgreSQL:** (Latest stable version) - For the backend database.
*   **Git:** For version control (optional, but recommended).
*   **Docker:** (Optional) For containerizing PostgreSQL or other services.

## 3. Solana Smart Contract Setup & Deployment

Project directories: `/home/ubuntu/baseroot_nft_minter` and `/home/ubuntu/baseroot_dao`

### 3.1. Environment Setup (Local Machine Recommended)

1.  **Install Rust:**
    ```bash
    curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source $HOME/.cargo/env
    ```

2.  **Install Solana CLI (v1.18.x):**
    *   Refer to the official Solana documentation for installing a specific version. For example:
        ```bash
        sh -c "$(curl -sSfL https://release.solana.com/v1.18.15/install)" 
        # (Replace v1.18.15 with the latest stable 1.18.x if needed)
        export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
        solana --version 
        ```
    *   Configure Solana CLI to use a localnet or devnet:
        ```bash
        solana config set --url localhost # For local testing
        # or
        solana config set --url devnet
        solana config get
        ```
    *   Create a local validator (if using localhost):
        ```bash
        solana-test-validator
        ```
        (Keep this running in a separate terminal)
    *   Create a wallet if you don't have one and airdrop some SOL:
        ```bash
        solana-keygen new --outfile ~/.config/solana/id.json
        solana airdrop 2 # (to your default keypair, on localnet/devnet)
        ```

3.  **Install Anchor Framework (v0.31.1):**
    ```bash
    cargo install --git https://github.com/coral-xyz/anchor --tag v0.31.1 anchor-cli --locked
    anchor --version
    ```
    *   **Crucial for `cargo-build-sbf`:** Ensure your Solana CLI installation (specifically the SBF tools like `cargo-build-sbf`) is compatible with Anchor 0.31.1. This usually means Solana CLI v1.18.x. If you encounter `cargo-build-sbf: command not found` errors, double-check your Solana installation and PATH. You might need to install `sbf-tools` for your Solana version explicitly:
        ```bash
        # Example for Solana v1.18.15, adjust version as needed
        # This step might be part of the main Solana CLI install script for some versions.
        # cargo install sbf-tools --version <your-solana-version> 
        ```

### 3.2. Building the Smart Contracts

Navigate to each contract directory (`baseroot_nft_minter`, `baseroot_dao`) and run:

```bash
anchor build
```

This will compile the Rust code and generate the program IDL and binary in the `target/` subdirectory.

### 3.3. Testing the Smart Contracts (Local Machine)

Navigate to each contract directory and run:

```bash
anchor test
```

This command will:
*   Start a local Solana test validator (if not already running and configured for localnet).
*   Deploy the contract to this local validator.
*   Run the tests defined in the `tests/` directory (usually TypeScript tests using Mocha/Chai).

**Troubleshooting `anchor test`:**
*   Ensure `solana-test-validator` can run and that you have SOL in your local wallet.
*   Verify Anchor and Solana CLI versions are compatible.
*   Check for `cargo-build-sbf` issues as mentioned above.

### 3.4. Deploying to Devnet/Testnet/Mainnet

1.  **Update `Anchor.toml`:**
    *   In each contract directory, open `Anchor.toml`.
    *   Change `provider.cluster` to your target network (e.g., `devnet`, `testnet`, `mainnet-beta`).
    *   Ensure `provider.wallet` points to the Solana wallet keypair file you intend to use for deployment (this wallet must have SOL for transaction fees).

2.  **Build the contract (if not already done):**
    ```bash
    anchor build
    ```

3.  **Deploy the contract:**
    ```bash
    anchor deploy
    ```
    This will output the Program ID for the deployed contract. Note this ID down as it will be needed by the backend and frontend to interact with the contract.

4.  **(Optional) Initialize contract state:** Some contracts might require an initialization instruction to be called after deployment. This would typically be done via a script or the frontend.

## 4. Backend Setup & Deployment (FastAPI/Python)

Project directory: `/home/ubuntu/baseroot_backend`

### 4.1. Environment Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd /home/ubuntu/baseroot_backend
    ```

2.  **Create and activate a Python virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt 
    # (You will need to create a requirements.txt file first)
    # Or install manually as done during development:
    # pip install fastapi uvicorn psycopg2-binary sqlalchemy asyncpg transformers torch sentence-transformers
    ```
    To create `requirements.txt` (after manual installation):
    ```bash
    pip freeze > requirements.txt
    ```

4.  **Setup PostgreSQL Database:**
    *   Install PostgreSQL if you haven't already.
    *   Create a new database and a user for the Baseroot application.
        ```sql
        -- Example PSQL commands
        CREATE DATABASE baseroot_db;
        CREATE USER baseroot_user WITH PASSWORD 'your_strong_password';
        GRANT ALL PRIVILEGES ON DATABASE baseroot_db TO baseroot_user;
        ```
    *   Refer to `database_schema.md` for the table structures. You will need to create these tables in your `baseroot_db` (e.g., using a migration tool like Alembic, or manually executing SQL scripts based on the schema).

5.  **Configure Environment Variables:**
    *   The backend will require environment variables for database connection, Solana RPC endpoint, program IDs, etc.
    *   Create a `.env` file in the `/home/ubuntu/baseroot_backend` directory (ensure `.env` is in `.gitignore`).
    *   Example `.env` content:
        ```env
        DATABASE_URL="postgresql+asyncpg://baseroot_user:your_strong_password@localhost/baseroot_db"
        SOLANA_RPC_URL="https://api.devnet.solana.com" # Or your local/testnet RPC
        NFT_PROGRAM_ID="YOUR_DEPLOYED_NFT_PROGRAM_ID"
        DAO_PROGRAM_ID="YOUR_DEPLOYED_DAO_PROGRAM_ID"
        # Add other necessary configs like JWT secrets if implementing full auth
        ```
    *   The application code (e.g., in a `config.py` file) should load these variables.

### 4.2. Running the Backend Locally

From the `/home/ubuntu/baseroot_backend` directory (with `venv` activated):

```bash
# Assuming your main FastAPI app instance is in main.py (e.g., app = FastAPI())
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API should now be accessible at `http://localhost:8000` (or your server's IP).

### 4.3. Deploying the Backend

For production, you would typically deploy the FastAPI application using a production-ready ASGI server like Uvicorn managed by a process manager (e.g., systemd, Supervisor) and often behind a reverse proxy (e.g., Nginx, Traefik).

*   **Containerization (Docker):** Consider creating a `Dockerfile` for the backend to simplify deployment.
*   **Cloud Platforms:** Platforms like Heroku, AWS (ECS, Elastic Beanstalk), Google Cloud (App Engine, Cloud Run) offer various ways to deploy Python applications.

## 5. Frontend Setup & Deployment (React/TypeScript)

Project directory: `/home/ubuntu/baseroot-frontend`

### 5.1. Environment Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd /home/ubuntu/baseroot-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    *   The frontend will need to know the backend API URL and Solana network details.
    *   Create a `.env` file in the `/home/ubuntu/baseroot-frontend` root directory.
    *   Example `.env` content (React uses `REACT_APP_` prefix):
        ```env
        REACT_APP_BACKEND_API_URL="http://localhost:8000/api/v1"
        REACT_APP_SOLANA_RPC_URL="https://api.devnet.solana.com"
        REACT_APP_NFT_PROGRAM_ID="YOUR_DEPLOYED_NFT_PROGRAM_ID"
        REACT_APP_DAO_PROGRAM_ID="YOUR_DEPLOYED_DAO_PROGRAM_ID"
        REACT_APP_SOLANA_NETWORK="devnet" # or "localnet", "testnet-beta", "mainnet-beta"
        ```
    *   The application code (e.g., in `src/config.ts`) should access these variables (`process.env.REACT_APP_...`).

### 5.2. Running the Frontend Locally

From the `/home/ubuntu/baseroot-frontend` directory:

```bash
npm start
```

This will start the React development server, usually at `http://localhost:3000`.

### 5.3. Building for Production

```bash
npm run build
```

This creates an optimized static build of your application in the `build/` directory.

### 5.4. Deploying the Frontend

The `build/` directory contains static assets that can be deployed to any static site hosting service:

*   **Netlify, Vercel, GitHub Pages:** Excellent choices for easy deployment of React apps.
*   **AWS S3 + CloudFront, Google Cloud Storage, Azure Blob Storage:** For more custom setups.
*   **Traditional Web Server:** Serve the `build/` directory using Nginx, Apache, etc.

Ensure your hosting service is configured correctly for single-page applications (SPAs) by redirecting all routes to `index.html` to handle client-side routing.

## 6. Storage Integration (IPFS)

*   **Setup IPFS:** You'll need an IPFS node. You can run your own (e.g., IPFS Desktop, `kubo` CLI) or use a pinning service like Pinata, Infura IPFS, Web3.Storage.
*   **Backend Logic:** The backend API endpoint responsible for file uploads (e.g., `/research/upload_file`) needs to be implemented to take a file, add it to IPFS, and return the Content Identifier (CID).
*   **Frontend Logic:** The frontend research upload form will send the file to this backend endpoint.
*   **NFT Minting:** The CID returned by the backend should be stored as part of the NFT metadata (`content_hash`).

## 7. Final Integration and Testing

1.  **Deploy all components:** Smart contracts, backend, and frontend to your chosen environments (devnet/testnet for initial testing).
2.  **Configure all Program IDs and API URLs** correctly across all components.
3.  **Thorough End-to-End Testing:**
    *   User wallet connection.
    *   Research file upload to IPFS (via backend) and NFT minting.
    *   Viewing minted NFTs and their metadata.
    *   Accessing research content via IPFS hash.
    *   DAO proposal submission.
    *   Voting on proposals.
    *   Checking proposal status and fund distribution (simulated or actual if fully implemented).
    *   Using the AI Literature Discovery tool.

This guide provides a comprehensive overview. Specific configurations might vary based on your exact deployment choices and infrastructure.

