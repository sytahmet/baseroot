import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components
const ListContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ProposalItem = styled.div`
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 6px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const ProposalTitle = styled.h4`
  color: #007bff;
  margin-top: 0;
  margin-bottom: 8px;
`;

const ProposalStatus = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
  color: white;
  background-color: ${props => {
    switch (props.children) {
      case 'Voting': return '#ffc107'; // Yellow
      case 'Approved': return '#28a745'; // Green
      case 'Rejected': return '#dc3545'; // Red
      case 'Executed': return '#17a2b8'; // Teal
      default: return '#6c757d'; // Grey
    }
  }};
`;

const ProposalDetails = styled.p`
  font-size: 0.9em;
  color: #555;
  margin-bottom: 5px;
`;

interface DAOProposal {
    on_chain_proposal_id: number;
    db_proposal_id: number;
    proposer_wallet_address: string;
    title: string;
    description: string;
    ipfs_hash_details?: string;
    requested_amount: number;
    currency: string;
    target_funding_address: string;
    yes_votes_on_chain: number;
    no_votes_on_chain: number;
    start_slot_on_chain: number;
    end_slot_on_chain: number;
    status_on_chain: string; // e.g., "Voting", "Approved", "Rejected", "Executed"
    executed_on_chain: boolean;
    created_at: string;
}

// Simulated API call to fetch DAO proposals
const fetchSimulatedDaoProposals = async (statusFilter?: string): Promise<DAOProposal[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const allProposals: DAOProposal[] = [
                {
                    on_chain_proposal_id: 101,
                    db_proposal_id: 1,
                    proposer_wallet_address: "WalletABC...XYZ",
                    title: "Fund Quantum Entanglement Communication Research",
                    description: "This project aims to explore the feasibility of quantum communication networks using entangled photons. Initial funding requested for equipment and personnel.",
                    requested_amount: 50000000000, // 50 SOL in lamports
                    currency: "SOL",
                    target_funding_address: "RecipientWallet1...",
                    yes_votes_on_chain: 1250,
                    no_votes_on_chain: 150,
                    start_slot_on_chain: 12345670,
                    end_slot_on_chain: 12518470, // Approx 1 day later
                    status_on_chain: "Voting",
                    executed_on_chain: false,
                    created_at: "2025-05-10T10:00:00Z"
                },
                {
                    on_chain_proposal_id: 102,
                    db_proposal_id: 2,
                    proposer_wallet_address: "WalletDEF...UVW",
                    title: "Develop Open-Source DeSci Toolkit",
                    description: "A proposal to create a suite of open-source tools for decentralized science, including smart contract templates and IPFS integration libraries.",
                    requested_amount: 25000000000, // 25 SOL
                    currency: "SOL",
                    target_funding_address: "RecipientWallet2...",
                    yes_votes_on_chain: 2500,
                    no_votes_on_chain: 50,
                    start_slot_on_chain: 12000000,
                    end_slot_on_chain: 12172800,
                    status_on_chain: "Approved",
                    executed_on_chain: false, // Not yet executed
                    created_at: "2025-04-28T14:30:00Z"
                },
                {
                    on_chain_proposal_id: 103,
                    db_proposal_id: 3,
                    proposer_wallet_address: "WalletGHI...RST",
                    title: "Study on Microplastics Impact in Marine Life",
                    description: "Funding for a comprehensive study on the long-term effects of microplastic pollution on various marine species. Includes field research and lab analysis.",
                    requested_amount: 75000000000, // 75 SOL
                    currency: "SOL",
                    target_funding_address: "RecipientWallet3...",
                    yes_votes_on_chain: 800,
                    no_votes_on_chain: 950,
                    start_slot_on_chain: 11800000,
                    end_slot_on_chain: 11972800,
                    status_on_chain: "Rejected",
                    executed_on_chain: false,
                    created_at: "2025-04-15T09:00:00Z"
                },
                 {
                    on_chain_proposal_id: 100,
                    db_proposal_id: 4,
                    proposer_wallet_address: "WalletJKL...MNO",
                    title: "AI for Early Cancer Detection - Phase 1",
                    description: "Initial funding for developing an AI model to detect early signs of specific cancers from medical imaging data. This phase focuses on data acquisition and model prototyping.",
                    requested_amount: 100000000000, // 100 SOL
                    currency: "SOL",
                    target_funding_address: "RecipientWallet4...",
                    yes_votes_on_chain: 3500,
                    no_votes_on_chain: 200,
                    start_slot_on_chain: 11500000,
                    end_slot_on_chain: 11672800,
                    status_on_chain: "Executed",
                    executed_on_chain: true,
                    created_at: "2025-03-20T12:00:00Z"
                }
            ];
            if (statusFilter && statusFilter !== 'all') {
                resolve(allProposals.filter(p => p.status_on_chain.toLowerCase() === statusFilter.toLowerCase()));
            } else {
                resolve(allProposals);
            }
        }, 800);
    });
};

interface DaoProposalListProps {
    onSelectProposal?: (proposalId: number) => void; // Callback for when a proposal is clicked
    statusFilter?: string; // e.g., "Voting", "Approved", "all"
}

const DaoProposalList: React.FC<DaoProposalListProps> = ({ onSelectProposal, statusFilter = 'all' }) => {
    const [proposals, setProposals] = useState<DAOProposal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProposals = async () => {
            setLoading(true);
            // In a real app, use the actual API endpoint: /dao/list_proposals?status_filter=...
            const fetchedProposals = await fetchSimulatedDaoProposals(statusFilter);
            setProposals(fetchedProposals);
            setLoading(false);
        };
        loadProposals();
    }, [statusFilter]);

    const handleProposalClick = (proposalId: number) => {
        if (onSelectProposal) {
            onSelectProposal(proposalId);
        } else {
            // Default behavior if no callback is provided (e.g., navigate or alert)
            alert(`Selected proposal ID: ${proposalId}. Implement navigation or detail view.`);
        }
    };

    if (loading) {
        return <ListContainer><p>Loading proposals...</p></ListContainer>;
    }

    if (proposals.length === 0) {
        return <ListContainer><p>No proposals found matching the criteria.</p></ListContainer>;
    }

    return (
        <ListContainer>
            <h3>{statusFilter === 'all' ? 'All' : statusFilter} Proposals</h3>
            {proposals.map(proposal => (
                <ProposalItem key={proposal.on_chain_proposal_id} onClick={() => handleProposalClick(proposal.on_chain_proposal_id)}>
                    <ProposalTitle>{proposal.title}</ProposalTitle>
                    <ProposalStatus>{proposal.status_on_chain}</ProposalStatus>
                    <ProposalDetails>Requested: {proposal.requested_amount / 1_000_000_000} {proposal.currency}</ProposalDetails>
                    <ProposalDetails>Proposer: {proposal.proposer_wallet_address.substring(0,6)}...{proposal.proposer_wallet_address.slice(-4)}</ProposalDetails>
                    <ProposalDetails>Votes: {proposal.yes_votes_on_chain} Yes / {proposal.no_votes_on_chain} No</ProposalDetails>
                </ProposalItem>
            ))}
        </ListContainer>
    );
};

export default DaoProposalList;

