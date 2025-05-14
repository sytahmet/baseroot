import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components
const FundTrackerContainer = styled.div`
  padding: 20px;
  background-color: #e9ecef; /* A slightly different background for this section */
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const SectionTitle = styled.h3`
  color: #495057;
  margin-bottom: 15px;
  border-bottom: 1px solid #ced4da;
  padding-bottom: 8px;
`;

const FundInfo = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px 0;
  text-align: center;
`;

const FundMetric = styled.div`
  padding: 10px;
`;

const MetricValue = styled.p`
  font-size: 1.8em;
  font-weight: bold;
  color: #007bff;
  margin: 0 0 5px 0;
`;

const MetricLabel = styled.p`
  font-size: 0.9em;
  color: #6c757d;
  margin: 0;
`;

const RecentActivityList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 15px;
`;

const ActivityItem = styled.li< { type: 'inflow' | 'outflow' } >`
  padding: 8px 12px;
  border-bottom: 1px solid #f1f3f5;
  font-size: 0.9em;
  color: #495057;
  display: flex;
  justify-content: space-between;

  span:first-child {
    font-weight: 500;
  }

  span:last-child {
    color: ${props => (props.type === 'inflow' ? '#28a745' : '#dc3545')};
    font-weight: bold;
  }

  &:last-child {
    border-bottom: none;
  }
`;

interface DaoTreasuryStats {
    total_funds_sol: number;
    total_funds_usdc?: number; // Optional if supporting multiple currencies
    funds_allocated_sol: number;
    funds_available_sol: number;
    recent_transactions: Transaction[];
}

interface Transaction {
    id: string;
    description: string;
    amount_sol: number;
    type: 'inflow' | 'outflow'; // 'inflow' for funds received, 'outflow' for funds disbursed
    date: string;
}

// Simulated API call to fetch DAO treasury/fund stats
const fetchSimulatedDaoFundStats = async (): Promise<DaoTreasuryStats> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                total_funds_sol: 1500.75, // Example total SOL in treasury
                funds_allocated_sol: 650.25, // Example SOL committed to approved proposals
                funds_available_sol: 850.50, // total - allocated
                recent_transactions: [
                    {
                        id: "txn_1",
                        description: "Funding for 'AI Cancer Detection - Phase 1'",
                        amount_sol: 100,
                        type: "outflow",
                        date: "2025-03-22T10:00:00Z"
                    },
                    {
                        id: "txn_2",
                        description: "Community Donation from WalletXYZ",
                        amount_sol: 50.5,
                        type: "inflow",
                        date: "2025-04-05T15:30:00Z"
                    },
                    {
                        id: "txn_3",
                        description: "Operational Costs Q1 2025",
                        amount_sol: 15.25,
                        type: "outflow",
                        date: "2025-04-10T11:00:00Z"
                    },
                     {
                        id: "txn_4",
                        description: "Grant from Solana Foundation",
                        amount_sol: 500,
                        type: "inflow",
                        date: "2025-02-15T09:00:00Z"
                    }
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by most recent
            });
        }, 700);
    });
};

const DaoFundTrackingDisplay: React.FC = () => {
    const [fundStats, setFundStats] = useState<DaoTreasuryStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            // In a real app: await fetch('/api/dao/fund_stats')
            const fetchedStats = await fetchSimulatedDaoFundStats();
            setFundStats(fetchedStats);
            setLoading(false);
        };
        loadStats();
    }, []);

    if (loading) {
        return <FundTrackerContainer><p>Loading DAO fund information...</p></FundTrackerContainer>;
    }

    if (!fundStats) {
        return <FundTrackerContainer><p>Could not load fund information.</p></FundTrackerContainer>;
    }

    return (
        <FundTrackerContainer>
            <SectionTitle>DAO Treasury Overview (SOL)</SectionTitle>
            <FundInfo>
                <FundMetric>
                    <MetricValue>{fundStats.total_funds_sol.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</MetricValue>
                    <MetricLabel>Total Funds</MetricLabel>
                </FundMetric>
                <FundMetric>
                    <MetricValue>{fundStats.funds_allocated_sol.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</MetricValue>
                    <MetricLabel>Allocated to Projects</MetricLabel>
                </FundMetric>
                <FundMetric>
                    <MetricValue>{fundStats.funds_available_sol.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</MetricValue>
                    <MetricLabel>Available for Funding</MetricLabel>
                </FundMetric>
            </FundInfo>

            <SectionTitle>Recent Transactions</SectionTitle>
            {fundStats.recent_transactions.length > 0 ? (
                <RecentActivityList>
                    {fundStats.recent_transactions.slice(0, 5).map(tx => ( // Show top 5 recent
                        <ActivityItem key={tx.id} type={tx.type}>
                            <span>{tx.description} ({new Date(tx.date).toLocaleDateString()})</span>
                            <span>{tx.type === 'inflow' ? '+' : '-'}{tx.amount_sol.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} SOL</span>
                        </ActivityItem>
                    ))}
                </RecentActivityList>
            ) : (
                <p>No recent transactions.</p>
            )}
        </FundTrackerContainer>
    );
};

export default DaoFundTrackingDisplay;

