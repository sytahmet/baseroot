import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components
const VotingContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa; /* Light grey background */
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin-top: 20px;
`;

const ProposalTitle = styled.h3`
  color: #343a40; /* Dark grey for title */
  margin-bottom: 10px;
`;

const ProposalDescription = styled.p`
  font-size: 0.95em;
  color: #495057; /* Medium grey for description */
  margin-bottom: 15px;
  line-height: 1.5;
`;

const VoteStats = styled.div`
  margin-bottom: 20px;
  font-size: 0.9em;
  color: #6c757d; /* Lighter grey for stats */
`;

const VoteButton = styled.button<{ voteType: 'yes' | 'no' }>`
  background-color: ${props => (props.voteType === 'yes' ? '#28a745' : '#dc3545')};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin-right: 10px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    background-color: #adb5bd; /* Grey out when disabled */
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  margin-top: 15px;
  font-size: 0.9em;
  color: ${props => (props.color || '#6c757d')};
`;

// Simplified Proposal Detail for Voting Context
interface ProposalForVoting {
    on_chain_proposal_id: number;
    title: string;
    description: string;
    current_yes_votes: number;
    current_no_votes: number;
    user_has_voted: boolean; // To simulate if the current user already voted
    is_active_for_voting: boolean; // Is the proposal currently in voting period
}

// Simulated API call to fetch proposal details for voting
const fetchSimulatedProposalForVoting = async (proposalId: number): Promise<ProposalForVoting | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            // This would typically fetch specific proposal data from the backend
            // For simulation, we'll use a sample based on ID
            if (proposalId === 101) { // Corresponds to the "Voting" proposal in DaoProposalList
                resolve({
                    on_chain_proposal_id: 101,
                    title: "Fund Quantum Entanglement Communication Research",
                    description: "This project aims to explore the feasibility of quantum communication networks using entangled photons. Initial funding requested for equipment and personnel. Voting is now open.",
                    current_yes_votes: 1250,
                    current_no_votes: 150,
                    user_has_voted: false, // Simulate user hasn't voted yet
                    is_active_for_voting: true,
                });
            } else if (proposalId === 102) { // Corresponds to "Approved" but let's say voting just closed
                 resolve({
                    on_chain_proposal_id: 102,
                    title: "Develop Open-Source DeSci Toolkit",
                    description: "A proposal to create a suite of open-source tools for decentralized science. Voting has recently concluded.",
                    current_yes_votes: 2500,
                    current_no_votes: 50,
                    user_has_voted: true, // Simulate user already voted
                    is_active_for_voting: false,
                });
            } else {
                resolve(null); // Proposal not found or not relevant for this component's simulation
            }
        }, 500);
    });
};

interface DaoVotingInterfaceProps {
    proposalId: number; // The ID of the proposal to vote on
}

const DaoVotingInterface: React.FC<DaoVotingInterfaceProps> = ({ proposalId }) => {
    const [proposal, setProposal] = useState<ProposalForVoting | null>(null);
    const [loading, setLoading] = useState(true);
    const [submittingVote, setSubmittingVote] = useState(false);
    const [voteMessage, setVoteMessage] = useState('');

    useEffect(() => {
        const loadProposal = async () => {
            setLoading(true);
            // In a real app: await fetch(`/api/dao/proposal_for_voting/${proposalId}`)
            const fetchedProposal = await fetchSimulatedProposalForVoting(proposalId);
            setProposal(fetchedProposal);
            setLoading(false);
            if (!fetchedProposal) {
                setVoteMessage("Could not load proposal details for voting.");
            }
        };
        loadProposal();
    }, [proposalId]);

    const handleVote = async (vote: 'yes' | 'no') => {
        if (!proposal || proposal.user_has_voted || !proposal.is_active_for_voting) return;

        setSubmittingVote(true);
        setVoteMessage(`Submitting your vote (${vote})... (simulated)`);

        // Simulate API call to backend (e.g., POST /dao/vote_on_proposal)
        // const response = await fetch("/api/dao/vote", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ proposal_id: proposal.on_chain_proposal_id, vote_type: vote, user_wallet: "connected_wallet_address" })
        // });

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

        // if (response.ok) {
        //     setVoteMessage("Your vote has been successfully recorded! (simulated)");
        //     // Update proposal state to reflect vote and potentially new vote counts
        //     setProposal(prev => prev ? ({ ...prev, user_has_voted: true, current_yes_votes: prev.current_yes_votes + (vote === 'yes' ? 1 : 0), current_no_votes: prev.current_no_votes + (vote === 'no' ? 1 : 0) }) : null);
        // } else {
        //     setVoteMessage("Failed to submit your vote. Please try again. (simulated)");
        // }
        setVoteMessage(`Your vote (${vote}) has been successfully recorded! (simulated)`);
        setProposal(prev => prev ? ({ ...prev, user_has_voted: true, current_yes_votes: prev.current_yes_votes + (vote === 'yes' ? 1 : 0), current_no_votes: prev.current_no_votes + (vote === 'no' ? 1 : 0) }) : null);
        setSubmittingVote(false);
    };

    if (loading) {
        return <VotingContainer><p>Loading voting interface...</p></VotingContainer>;
    }

    if (!proposal) {
        return <VotingContainer><Message color="red">{voteMessage || "Proposal not found or not available for voting."}</Message></VotingContainer>;
    }

    return (
        <VotingContainer>
            <ProposalTitle>{proposal.title}</ProposalTitle>
            <ProposalDescription>{proposal.description}</ProposalDescription>
            <VoteStats>
                Current Votes: {proposal.current_yes_votes} Yes / {proposal.current_no_votes} No
            </VoteStats>

            {proposal.is_active_for_voting ? (
                !proposal.user_has_voted ? (
                    <div>
                        <p>Cast your vote:</p>
                        <VoteButton voteType="yes" onClick={() => handleVote('yes')} disabled={submittingVote}>
                            Vote Yes
                        </VoteButton>
                        <VoteButton voteType="no" onClick={() => handleVote('no')} disabled={submittingVote}>
                            Vote No
                        </VoteButton>
                    </div>
                ) : (
                    <Message color="green">You have already voted on this proposal.</Message>
                )
            ) : (
                <Message color="#ffc107">Voting for this proposal is currently closed.</Message>
            )}
            
            {voteMessage && !loading && <Message color={voteMessage.includes("Failed") ? "red" : "green"}>{voteMessage}</Message>}
        </VotingContainer>
    );
};

export default DaoVotingInterface;

