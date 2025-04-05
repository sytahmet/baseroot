rust
use anchor_lang::prelude::*;
use std::time::{SystemTime, UNIX_EPOCH};

declare_id!("Fjvgz6K1YtSjP1iK913sX5tNn3tC6fDMyS");

#[program]
pub mod academic_research {
    use super::*;

    pub fn submit_research(ctx: Context<SubmitResearch>, research_hash: [u8; 32]) -> Result<()> {
        // Get the research account from the context.
        let research_account = &mut ctx.accounts.research_account;

        // Get the current timestamp.
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        // Set the owner of the research.
        research_account.owner = *ctx.accounts.submitter.key;
        // Set the research hash.
        research_account.research_hash = research_hash;
        // Set the timestamp of submission.
        research_account.timestamp = timestamp;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SubmitResearch<'info> {
    // The research account to store research details.
    #[account(init, payer = submitter, space = 8 + 32 + 32 + 8)]
    pub research_account: Account<'info, ResearchAccount>,
    // The user who is submitting the research.
    #[account(mut)]
    pub submitter: Signer<'info>,
    // The system program.
    pub system_program: Program<'info, System>,
}

#[account]
pub struct ResearchAccount {
    // The owner of the research.
    pub owner: Pubkey,
    // The hash of the research.
    pub research_hash: [u8; 32],
    // The timestamp of when the research was submitted.
    pub timestamp: u64,
}