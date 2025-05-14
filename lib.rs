use anchor_lang::prelude::*;
use anchor_spl::token::{TokenAccount, Mint};

declare_id!("GovER5Lthms3bLBqWub97yVrMmEogP18GfV3ZqZ1tZzT"); // Placeholder, will be updated after deployment

#[program]
pub mod baseroot_dao {
    use super::*; 

    // TODO: Define constants for proposal thresholds, voting periods etc.

    pub fn initialize_dao_state(
        ctx: Context<InitializeDaoState>,
        proposal_fee: u64,
        min_quorum_votes: u64,
        min_threshold_votes: u64, // Min votes to pass, out of total votes for the proposal
        voting_period_slots: u64
    ) -> Result<()> {
        let dao_state = &mut ctx.accounts.dao_state;
        dao_state.admin = *ctx.accounts.admin.key;
        dao_state.proposal_count = 0;
        dao_state.proposal_fee = proposal_fee;
        dao_state.governance_token_mint = ctx.accounts.governance_token_mint.key();
        dao_state.min_quorum_votes = min_quorum_votes; // Minimum total votes for a proposal to be valid
        dao_state.min_threshold_votes_percentage = min_threshold_votes; // e.g., 51 for 51%
        dao_state.voting_period_slots = voting_period_slots; // Duration in Solana slots
        msg!("DAO State Initialized");
        Ok(())
    }

    pub fn submit_proposal(
        ctx: Context<SubmitProposal>,
        title: String, 
        description: String, 
        ipfs_hash: String, // Link to detailed proposal document on IPFS
        requested_amount: u64 // Amount of SOL or stablecoin requested
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal_account;
        let dao_state = &mut ctx.accounts.dao_state;

        // TODO: Check if proposer holds enough governance tokens (if required by design)
        // TODO: Collect proposal fee (transfer from proposer to DAO treasury)

        proposal.proposer = *ctx.accounts.proposer.key;
        proposal.id = dao_state.proposal_count;
        proposal.title = title;
        proposal.description = description;
        proposal.ipfs_hash = ipfs_hash;
        proposal.requested_amount = requested_amount;
        proposal.yes_votes = 0;
        proposal.no_votes = 0;
        proposal.start_slot = Clock::get()?.slot;
        proposal.end_slot = proposal.start_slot + dao_state.voting_period_slots;
        proposal.executed = false;
        proposal.status = ProposalStatus::Voting;
        
        dao_state.proposal_count = dao_state.proposal_count.checked_add(1).unwrap();
        msg!("Proposal #{} submitted: {}", proposal.id, proposal.title);
        // Emit event
        emit!(ProposalSubmitted {
            proposal_id: proposal.id,
            proposer: proposal.proposer,
            title: proposal.title.clone(),
            end_slot: proposal.end_slot
        });

        Ok(())
    }

    // Other functions (vote_on_proposal, execute_proposal, etc.) will be added later.
}

#[account]
#[derive(Default)]
pub struct DaoState {
    pub admin: Pubkey,
    pub proposal_count: u64,
    pub proposal_fee: u64,
    pub governance_token_mint: Pubkey,
    pub min_quorum_votes: u64, // Min total votes (yes + no) for a proposal to be considered valid
    pub min_threshold_votes_percentage: u64, // Min percentage of YES votes out of total votes for proposal to pass (e.g., 51 for 51%)
    pub voting_period_slots: u64, // Duration of voting in Solana slots
}

#[account]
#[derive(Default)]
pub struct ProposalAccount {
    pub id: u64,
    pub proposer: Pubkey,
    pub title: String,      // Max 100 chars
    pub description: String, // Max 500 chars
    pub ipfs_hash: String,  // Max 64 chars (e.g. IPFS CIDv1)
    pub requested_amount: u64, // in lamports or token smallest unit
    pub yes_votes: u64,
    pub no_votes: u64,
    pub start_slot: u64,
    pub end_slot: u64,
    pub executed: bool,
    pub status: ProposalStatus,
    // pub funding_target_address: Pubkey, // Address to send funds if approved
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Default)]
pub enum ProposalStatus {
    #[default]
    Pending, // Not yet active, or draft
    Voting,
    SucceededQuorumNotMet, // Voting ended, quorum not met
    SucceededAwaitingExecution, // Voting ended, passed, quorum met
    Defeated, // Voting ended, did not pass
    Executed, // Funds distributed
    Cancelled, // Cancelled by proposer or admin (if allowed)
}

#[derive(Accounts)]
pub struct InitializeDaoState<	extquotesingleinfo> {
    #[account(init, payer = admin, space = 8 + 32 + 8 + 8 + 32 + 8 + 8 + 8)] // Adjust space as needed
    pub dao_state: Account<	extquotesingleinfo, DaoState>,
    #[account(mut)]
    pub admin: Signer<	extquotesingleinfo>,
    pub governance_token_mint: Account<	extquotesingleinfo, Mint>,
    pub system_program: Program<	extquotesingleinfo, System>,
}


#[derive(Accounts)]
#[instruction(title: String, description: String, ipfs_hash: String)]
pub struct SubmitProposal<	extquotesingleinfo> {
    #[account(init, 
        payer = proposer, 
        space = 8 + 8 + 32 + (4 + title.len()) + (4 + description.len()) + (4 + ipfs_hash.len()) + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 32, // Approx space, refine
        seeds = [b"proposal", dao_state.proposal_count.to_le_bytes().as_ref()], 
        bump
    )]
    pub proposal_account: Account<	extquotesingleinfo, ProposalAccount>,
    #[account(mut)]
    pub dao_state: Account<	extquotesingleinfo, DaoState>,
    #[account(mut)]
    pub proposer: Signer<	extquotesingleinfo>,
    // pub proposer_token_account: Account<	extquotesingleinfo, TokenAccount>, // To check token holding for proposal rights
    // pub dao_treasury: AccountInfo<	extquotesingleinfo>, // To receive proposal fee
    pub system_program: Program<	extquotesingleinfo, System>,
    // pub token_program: Program<	extquotesingleinfo, Token>,
}

#[event]
pub struct ProposalSubmitted {
    proposal_id: u64,
    proposer: Pubkey,
    title: String,
    end_slot: u64,
}

// TODO: Add events for VoteCast, ProposalExecuted, ProposalStatusChange
// TODO: Add more detailed error handling and access controls




    pub fn vote_on_proposal(
        ctx: Context<VoteOnProposal>,
        proposal_id: u64,
        vote_option: VoteOption // true for Yes, false for No
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal_account;
        let voter_record = &mut ctx.accounts.voter_record;
        let dao_state = &ctx.accounts.dao_state;

        // Check if proposal exists and is active
        require!(proposal.id == proposal_id, BaserootDaoError::ProposalNotFound);
        require!(proposal.status == ProposalStatus::Voting, BaserootDaoError::ProposalNotActiveForVoting);
        
        let current_slot = Clock::get()?.slot;
        require!(current_slot <= proposal.end_slot, BaserootDaoError::VotingPeriodEnded);

        // Check if voter has already voted for this proposal
        require!(!voter_record.has_voted(proposal_id), BaserootDaoError::AlreadyVoted);

        // Check if voter has enough governance tokens
        // This check depends on whether voting power is 1 token = 1 vote, or based on staked amount, etc.
        // For simplicity, assume 1 token = 1 vote, and voter_token_account has tokens.
        let voter_token_balance = ctx.accounts.voter_token_account.amount;
        require!(voter_token_balance > 0, BaserootDaoError::InsufficientTokensToVote);

        // Record the vote
        match vote_option {
            VoteOption::Yes => proposal.yes_votes = proposal.yes_votes.checked_add(voter_token_balance).unwrap(),
            VoteOption::No => proposal.no_votes = proposal.no_votes.checked_add(voter_token_balance).unwrap(),
        }

        voter_record.proposal_id = proposal_id;
        voter_record.voter = *ctx.accounts.voter.key;
        voter_record.vote_option = vote_option;
        voter_record.vote_weight = voter_token_balance; // Store the weight of the vote

        msg!("Vote cast for proposal #{}: {:?} with weight {}", proposal_id, vote_option, voter_token_balance);
        // Emit event
        emit!(VoteCast {
            proposal_id,
            voter: *ctx.accounts.voter.key,
            vote_option,
            vote_weight: voter_token_balance,
        });

        Ok(())
    }

    pub fn tally_votes_and_update_status(ctx: Context<TallyVotes>, proposal_id: u64) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal_account;
        let dao_state = &ctx.accounts.dao_state;

        require!(proposal.id == proposal_id, BaserootDaoError::ProposalNotFound);
        require!(proposal.status == ProposalStatus::Voting, BaserootDaoError::ProposalNotActiveForVoting);

        let current_slot = Clock::get()?.slot;
        require!(current_slot > proposal.end_slot, BaserootDaoError::VotingPeriodNotEnded);

        let total_votes = proposal.yes_votes.checked_add(proposal.no_votes).unwrap();

        if total_votes < dao_state.min_quorum_votes {
            proposal.status = ProposalStatus::SucceededQuorumNotMet;
            msg!("Proposal #{} ended: Quorum not met.", proposal_id);
            emit!(ProposalStatusChanged {
                proposal_id,
                new_status: proposal.status.clone(),
                total_yes_votes: proposal.yes_votes,
                total_no_votes: proposal.no_votes,
            });
            return Ok(());
        }

        // Calculate percentage of yes votes from total votes cast for this proposal
        // (yes_votes * 100) / total_votes
        let yes_percentage = if total_votes > 0 {
            proposal.yes_votes.checked_mul(100).unwrap().checked_div(total_votes).unwrap_or(0)
        } else {
            0
        };

        if yes_percentage >= dao_state.min_threshold_votes_percentage {
            proposal.status = ProposalStatus::SucceededAwaitingExecution;
            msg!("Proposal #{} Succeeded and is Awaiting Execution.", proposal_id);
        } else {
            proposal.status = ProposalStatus::Defeated;
            msg!("Proposal #{} Defeated.", proposal_id);
        }
        
        emit!(ProposalStatusChanged {
            proposal_id,
            new_status: proposal.status.clone(),
            total_yes_votes: proposal.yes_votes,
            total_no_votes: proposal.no_votes,
        });

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum VoteOption {
    Yes,
    No,
}

#[account]
#[derive(Default)]
pub struct VoterRecord {
    pub proposal_id: u64,
    pub voter: Pubkey,
    pub vote_option: VoteOption,
    pub vote_weight: u64, // Number of tokens used for this vote
    // pub has_voted: bool, // Simple flag, or use a more complex structure if a user can vote on multiple proposals
                           // For this example, one VoterRecord PDA per voter per proposal
}

impl VoterRecord {
    // A simple check. In a real scenario, you might query if a PDA for this voter+proposal exists.
    // This current structure implies one VoterRecord account per vote.
    pub fn has_voted(&self, _proposal_id_to_check: u64) -> bool {
        // If this account exists and self.voter is set, it means this voter has voted on self.proposal_id
        // This check is more about whether this specific VoterRecord account has been initialized for *a* vote.
        // A better check would be to try_accounts for a PDA seeded with voter key and proposal_id.
        // For now, if this account is being used, it means a vote is being cast or has been cast.
        self.voter != Pubkey::default() // If voter is not default, it means it's initialized
    }
}


#[derive(Accounts)]
#[instruction(proposal_id: u64)]
pub struct VoteOnProposal<	extquotesingleinfo> {
    #[account(mut, seeds = [b"proposal", proposal_id.to_le_bytes().as_ref()], bump)] // Assuming proposal_id is used in seed for ProposalAccount
    pub proposal_account: Account<	extquotesingleinfo, ProposalAccount>,
    
    #[account(init, 
        payer = voter, 
        space = 8 + 8 + 32 + 1 + 8, // VoterRecord space: discriminator + proposal_id + voter_pubkey + vote_option + vote_weight
        seeds = [b"vote_record", proposal_id.to_le_bytes().as_ref(), voter.key().as_ref()], 
        bump
    )]
    pub voter_record: Account<	extquotesingleinfo, VoterRecord>,
    
    #[account(mut)]
    pub voter: Signer<	extquotesingleinfo>,
    // Voter's token account holding the governance tokens
    #[account(constraint = voter_token_account.mint == dao_state.governance_token_mint)]
    pub voter_token_account: Account<	extquotesingleinfo, TokenAccount>,
    
    #[account()]
    pub dao_state: Account<	extquotesingleinfo, DaoState>,
    pub system_program: Program<	extquotesingleinfo, System>,
}

#[derive(Accounts)]
#[instruction(proposal_id: u64)]
pub struct TallyVotes<	extquotesingleinfo> {
    #[account(mut, seeds = [b"proposal", proposal_id.to_le_bytes().as_ref()], bump)]
    pub proposal_account: Account<	extquotesingleinfo, ProposalAccount>,
    #[account()]
    pub dao_state: Account<	extquotesingleinfo, DaoState>,
    // pub clock: Sysvar<	extquotesingleinfo, Clock>, // Clock is already available via Clock::get()?
}


#[event]
pub struct VoteCast {
    proposal_id: u64,
    voter: Pubkey,
    vote_option: VoteOption,
    vote_weight: u64,
}

#[event]
pub struct ProposalStatusChanged {
    proposal_id: u64,
    new_status: ProposalStatus,
    total_yes_votes: u64,
    total_no_votes: u64,
}

#[error_code]
pub enum BaserootDaoError {
    #[msg("Proposal not found.")]
    ProposalNotFound,
    #[msg("Proposal is not active for voting.")]
    ProposalNotActiveForVoting,
    #[msg("Voting period has ended for this proposal.")]
    VotingPeriodEnded,
    #[msg("Voter has already voted on this proposal.")]
    AlreadyVoted,
    #[msg("Insufficient governance tokens to vote.")]
    InsufficientTokensToVote,
    #[msg("Voting period has not yet ended.")]
    VotingPeriodNotEnded,
    #[msg("Quorum not met for this proposal.")]
    QuorumNotMet,
    #[msg("Proposal already executed.")]
    ProposalAlreadyExecuted,
    #[msg("Proposal not in a state for execution.")]
    ProposalNotExecutable,
    #[msg("Arithmetic overflow.")]
    ArithmeticOverflow,
}



    pub fn execute_proposal(
        ctx: Context<ExecuteProposal>,
        proposal_id: u64
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal_account;

        require!(proposal.id == proposal_id, BaserootDaoError::ProposalNotFound);
        require!(!proposal.executed, BaserootDaoError::ProposalAlreadyExecuted);
        require!(proposal.status == ProposalStatus::SucceededAwaitingExecution, BaserootDaoError::ProposalNotExecutable);

        // TODO: Implement actual fund transfer logic.
        // This would involve transferring `proposal.requested_amount` from a DAO treasury
        // (e.g., a PDA or a specific token account) to the `proposal.funding_target_address` (needs to be added to ProposalAccount).
        // For now, we just mark it as executed.
        // Example: If using SOL from a PDA treasury:
        // **(ctx.accounts.dao_treasury.to_account_info().try_borrow_mut_lamports())? -= proposal.requested_amount;
        // **(ctx.accounts.funding_target_account.to_account_info().try_borrow_mut_lamports())? += proposal.requested_amount;
        // Or if using SPL tokens:
        // token::transfer( ... ) CPI call

        proposal.executed = true;
        proposal.status = ProposalStatus::Executed;

        msg!("Proposal #{} executed successfully.", proposal_id);
        emit!(ProposalExecuted {
            proposal_id,
            funding_amount: proposal.requested_amount,
            // funding_receiver: proposal.funding_target_address,
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(proposal_id: u64)]
pub struct ExecuteProposal<	extquotesingleinfo> {
    #[account(mut, seeds = [b"proposal", proposal_id.to_le_bytes().as_ref()], bump)]
    pub proposal_account: Account<	extquotesingleinfo, ProposalAccount>,
    // #[account(mut)]
    // pub dao_treasury: AccountInfo<	extquotesingleinfo>, // The DAO's treasury account (PDA or TokenAccount)
    // /// CHECK: This is the account that will receive the funds.
    // #[account(mut)]
    // pub funding_target_account: AccountInfo<	extquotesingleinfo>, // Should match proposal.funding_target_address
    #[account(mut)]
    pub admin_or_executor: Signer<	extquotesingleinfo>, // Authority to execute (e.g., DAO admin or designated executor)
    // pub token_program: Option<Program<	extquotesingleinfo, Token>>, // If transferring SPL tokens
    pub system_program: Program<	extquotesingleinfo, System>, // If transferring SOL
}

#[event]
pub struct ProposalExecuted {
    proposal_id: u64,
    funding_amount: u64,
    // funding_receiver: Pubkey,
}

// Note: The ProposalAccount needs a `funding_target_address: Pubkey` field.
// The ExecuteProposal context needs `dao_treasury` and `funding_target_account` properly defined and constrained.
// The actual transfer logic needs to be implemented based on whether SOL or SPL tokens are being transferred.

