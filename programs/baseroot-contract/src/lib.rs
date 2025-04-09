rust
use anchor_lang::prelude::*;
use std::time::{SystemTime, UNIX_EPOCH};

declare_id!("Fjvgz6K1YtSjP1iK913sX5tNn3tC6fDMyS");

#[program]
pub mod academic_research {
    use super::*;

    // Araştırma yükleme fonksiyonu
    pub fn submit_research(ctx: Context<SubmitResearch>, title: String, ipfs_hash: String) -> Result<()> {
        let research_account = &mut ctx.accounts.research_account;
        let timestamp = Clock::get()?.unix_timestamp;

        // Araştırma bilgilerini kaydet
        research_account.title = title;
        research_account.ipfs_hash = ipfs_hash;
        research_account.author = *ctx.accounts.submitter.key;
        research_account.timestamp = timestamp;
        research_account.verified = false;  // Başlangıçta doğrulanmamış

        Ok(())
    }

    // Proje önerisi gönderme fonksiyonu (DAO)
    pub fn submit_proposal(ctx: Context<SubmitProposal>, title: String, description: String) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal_account;
        proposal.title = title;
        proposal.description = description;
        proposal.votes = 0;  // Başlangıçta 0 oy
        proposal.creator = *ctx.accounts.submitter.key;

        Ok(())
    }

    // Proje oylama fonksiyonu (DAO)
    pub fn vote_for_proposal(ctx: Context<VoteProposal>, proposal_id: u64) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal_account;
        proposal.votes += 1;

        Ok(())
    }
}

// Araştırma kaydını tutan yapı
#[account]
pub struct ResearchRecord {
    pub title: String,            // Araştırmanın başlığı
    pub ipfs_hash: String,        // Araştırma verisinin IPFS hash'i
    pub author: Pubkey,           // Araştırmayı yükleyen kullanıcının public key'i
    pub timestamp: i64,           // Araştırma yüklenme zaman damgası
    pub verified: bool,           // Araştırmanın doğrulama durumu
}

// Proje önerilerini tutan yapı (DAO)
#[account]
pub struct Proposal {
    pub title: String,            // Proje başlığı
    pub description: String,      // Proje açıklaması
    pub votes: u64,               // Projeye verilen oy sayısı
    pub creator: Pubkey,          // Projeyi oluşturan kullanıcının public key'i
}

// Kullanıcılar için gerekli hesap yapıları
#[derive(Accounts)]
pub struct SubmitResearch<'info> {
    #[account(init, payer = submitter, space = 8 + 128 + 128 + 32 + 8 + 1)]
    pub research_account: Account<'info, ResearchRecord>,  // Araştırma kaydı
    #[account(mut)]
    pub submitter: Signer<'info>,    // Araştırmayı yükleyen kullanıcı
    pub system_program: Program<'info, System>,  // Sistem programı
}

#[derive(Accounts)]
pub struct SubmitProposal<'info> {
    #[account(init, payer = submitter, space = 8 + 128 + 256 + 8 + 32)]
    pub proposal_account: Account<'info, Proposal>,  // Proje önerisi
    #[account(mut)]
    pub submitter: Signer<'info>,    // Proje önerisini sunan kullanıcı
    pub system_program: Program<'info, System>,  // Sistem programı
}

#[derive(Accounts)]
pub struct VoteProposal<'info> {
    #[account(mut)]
    pub proposal_account: Account<'info, Proposal>,  // Oy verilecek proje önerisi
    #[account(mut)]
    pub submitter: Signer<'info>,    // Oy veren kullanıcı
}
