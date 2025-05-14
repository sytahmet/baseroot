# Baseroot DAO Governance Token Design

This document outlines the design for the Baseroot DAO's governance token, including its tokenomics and core functionalities, intended for use on the Solana blockchain.

## 1. Token Overview

-   **Token Name**: Baseroot Governance Token
-   **Token Symbol**: BGT (or similar, to be finalized, e.g., BRGT, ROOT)
-   **Blockchain**: Solana (SPL Token)
-   **Purpose**: To enable decentralized governance of the Baseroot platform, primarily for voting on research funding proposals and potentially other platform decisions.

## 2. Core Functionalities

-   **Voting Power**: Each token (or a staked amount of tokens) will represent a certain amount of voting power in the DAO.
-   **Proposal Submission**: Holding a certain threshold of tokens might be required to submit funding proposals to the DAO.
-   **Staking (Optional, for future consideration)**: Users might be able to stake BGT to earn rewards or gain increased voting power/privileges.
-   **Incentives**: BGT could be used to incentivize participation in the ecosystem (e.g., for peer reviewers, active researchers, community moderators). This is an optional enhancement.

## 3. Tokenomics

### 3.1. Total Supply
-   **Initial Total Supply**: To be determined. A fixed supply is generally preferred for governance tokens to prevent inflation diluting voting power, unless a well-defined inflation/emission schedule is part of the long-term incentive mechanism.
-   **Example**: 1,000,000,000 BGT (1 Billion tokens). This number should be chosen carefully to allow for sufficient granularity in distribution and voting.

### 3.2. Allocation & Distribution
This is a critical aspect and needs careful planning. A potential allocation could be:

-   **Community Treasury / DAO Fund (e.g., 40-50%)**: 
    *   To be managed by the DAO itself.
    *   Used for funding research proposals, platform development grants, operational costs, and other community-approved initiatives.
    *   Likely vested or released over time.

-   **Ecosystem Incentives & Rewards (e.g., 20-30%)**:
    *   For airdrops to early adopters, liquidity mining (if applicable), rewards for platform usage (e.g., publishing high-quality research, active participation in governance, peer review contributions).
    *   Released gradually based on milestones or participation metrics.

-   **Team & Advisors (e.g., 15-20%)**:
    *   Subject to vesting schedules (e.g., 1-year cliff, 3-4 year linear vesting) to align long-term interests.

-   **Initial Liquidity Provision (e.g., 5-10%)**:
    *   If the token is to be traded on decentralized exchanges (DEXs) like Serum or Raydium, a portion will be needed for initial liquidity pools.

-   **Public Sale / IDO (Optional, e.g., 0-5%)**:
    *   If a public fundraising round is planned.

### 3.3. Utility & Demand Drivers
-   **Governance**: The primary utility is voting on proposals. The more valuable the decisions being made (e.g., significant funding amounts), the higher the demand for the token.
-   **Access**: Potential requirement to hold/stake BGT for certain platform features or proposal submissions.
-   **Speculation**: As with any token, speculative trading can drive demand.

## 4. Technical Implementation (Solana SPL Token)

-   **Standard**: The token will be created using the Solana Program Library (SPL) Token standard.
-   **Mint Authority**: Initially, a central entity (e.g., Baseroot foundation or core team) will be the mint authority. The plan should be to eventually transfer or renounce mint authority if a fixed supply is desired, or transfer it to the DAO itself for controlled inflation if that's part of the design.
-   **Freeze Authority**: Similar to mint authority, careful consideration is needed. Generally, for a decentralized governance token, freeze authority should be disabled or renounced after the initial setup to ensure censorship resistance.
-   **Decimals**: Standard for SPL tokens is usually 6 to 9 decimals (e.g., 9 decimals for BGT).

## 5. DAO Governance Parameters (Initial Thoughts)

-   **Proposal Threshold**: Minimum BGT required to submit a proposal (e.g., 0.1% - 1% of circulating supply).
-   **Voting Quorum**: Minimum percentage of total (or staked) BGT that must participate in a vote for it to be valid (e.g., 5-10% of circulating supply).
-   **Approval Threshold**: Minimum percentage of votes in favor for a proposal to pass (e.g., >50% or a supermajority like 66%).
-   **Voting Period**: Duration for which a proposal remains open for voting (e.g., 3-7 days).

## 6. Integration with Baseroot Platform

-   The backend will need to interact with the Solana blockchain to:
    *   Verify BGT balances/staked amounts for proposal submission and voting rights.
    *   Record votes (potentially on-chain or off-chain with on-chain settlement).
-   The frontend will display BGT balances and provide interfaces for DAO interactions.

## 7. Future Considerations

-   **Token Burning**: Mechanisms to burn tokens (e.g., from a portion of platform fees) could be introduced to create deflationary pressure, if desired.
-   **Advanced Staking Models**: Different lock-up periods for staking BGT could offer varying levels of rewards or voting power.
-   **Delegation**: Allowing token holders to delegate their voting power to other users (proxies).

This design provides a foundational framework for the Baseroot Governance Token. Specific numbers for supply, allocation, and governance parameters will need further refinement and community discussion if the project were to move towards a live, community-governed state. For the initial implementation, a simpler model focusing on core voting functionality will be prioritized.

