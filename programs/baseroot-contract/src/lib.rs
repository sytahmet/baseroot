rust
use anchor_lang::prelude::*;
use std::time::{SystemTime, UNIX_EPOCH};

declare_id!("Fjvgz6K1YtSjP1iK913sX5tNn3tC6fDMyS");

#[program]
pub mod academic_research {
    use super::*;

    // Araştırma yükleme fonksiyonu
    pub fn submit_research(
        ctx: Context<SubmitResearch>,
        title: String,
        ipfs_hash: String,
    ) -> Result<()> {
        // Girdi doğrulama
        if title.len() > 128 {
            return Err(error!(ErrorCode::TitleTooLong));
        }
        if ipfs_hash.len() != 46 || !ipfs_hash.starts_with("Qm") {
            return Err(error!(ErrorCode::InvalidIpfsHash));
        }

        let research_account = &mut ctx.accounts.research_account;
        let timestamp = Clock::get()?.unix_timestamp;

        // Araştırma bilgilerini kaydet
        research_account.title = title;
        research_account.ipfs_hash = ipfs_hash;
        research_account.author = *ctx.accounts.submitter.key;
        research_account.timestamp = timestamp;
        research_account.verified = false; // Başlangıçta doğrulanmamış

        Ok(())
    }

    // Araştırma doğrulama fonksiyonu
    pub fn verify_research(ctx: Context<VerifyResearch>) -> Result<()> {
        // Sadece admin doğrulama yapabilir
        if *ctx.accounts.admin.key != ctx.accounts.system_program.key() {
            return Err(error!(ErrorCode::Unauthorized));
        }

        let research_account = &mut ctx.accounts.research_account;
        research_account.verified = true;

        Ok(())
    }

    // Proje önerisi gönderme fonksiyonu (DAO)
    pub fn submit_proposal(
        ctx: Context<SubmitProposal>,
        title: String,
        description: String,
    ) -> Result<()> {
        // Girdi doğrulama
        if title.len() > 128 {
            return Err(error!(ErrorCode::TitleTooLong));
        }
        if description.len() > 256 {
            return Err(error!(ErrorCode::DescriptionTooLong));
        }

        let proposal = &mut ctx.accounts.proposal_account;
        proposal.title = title;
        proposal.description = description;
        proposal.votes = 0; // Başlangıçta 0 oy
        proposal.creator = *ctx.accounts.submitter.key;

        Ok(())
    }

    // Proje oylama fonksiyonu (DAO)
    pub fn vote_for_proposal(ctx: Context<VoteProposal>) -> Result<()> {
        let vote_record = &mut ctx.accounts.vote_record;

        // Kullanıcı daha önce oy kullandıysa hata döndür
        if vote_record.voted {
            return Err(error!(ErrorCode::AlreadyVoted));
        }

        let proposal = &mut ctx.accounts.proposal_account;
        proposal.votes += 1;

        // Kullanıcının oy kullandığını işaretle
        vote_record.voted = true;

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

// Kullanıcının oy kaydını tutan yapı
#[account]
pub struct VoteRecord {
    pub voted: bool,              // Kullanıcının oy kullanıp kullanmadığı
}

// Kullanıcılar için gerekli hesap yapıları
#[derive(Accounts)]
pub struct SubmitResearch<'info> {
    #[account(init, payer = submitter, space = 8 + 128 + 46 + 32 + 8 + 1)]
    pub research_account: Account<'info, ResearchRecord>,  // Araştırma kaydı
    #[account(mut)]
    pub submitter: Signer<'info>,    // Araştırmayı yükleyen kullanıcı
    pub system_program: Program<'info, System>,  // Sistem programı
}

#[derive(Accounts)]
pub struct VerifyResearch<'info> {
    #[account(mut)]
    pub research_account: Account<'info, ResearchRecord>,  // Doğrulanacak araştırma kaydı
    pub admin: Signer<'info>,           // Admin hesabı
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
    #[account(init_if_needed, payer = submitter, space = 8 + 1)]
    pub vote_record: Account<'info, VoteRecord>,     // Kullanıcının oy kaydı
    #[account(mut)]
    pub submitter: Signer<'info>,    // Oy veren kullanıcı
    pub system_program: Program<'info, System>,  // Sistem programı
}

// Hata kodları
#[error_code]
pub enum ErrorCode {
    #[msg("Başlık çok uzun.")]
    TitleTooLong,
    #[msg("Açıklama çok uzun.")]
    DescriptionTooLong,
    #[msg("Geçersiz IPFS hash.")]
    InvalidIpfsHash,
    #[msg("Zaten oy kullandınız.")]
    AlreadyVoted,
    #[msg("Yetkisiz işlem.")]
    Unauthorized,
}
