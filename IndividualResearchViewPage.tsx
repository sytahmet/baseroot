import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import { useParams } from 'react-router-dom'; // If using React Router for navigation

// Styled components
const PageContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const MetadataSection = styled.div`
  margin-bottom: 20px;
`;

const MetadataLabel = styled.strong`
  color: #555;
`;

const MetadataValue = styled.span`
  color: #777;
  display: block;
  margin-top: 4px;
  white-space: pre-wrap; /* To respect newlines in abstract */
`;

const AbstractText = styled.p`
  line-height: 1.6;
  color: #444;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #eee;
`;

const KeywordsContainer = styled.div`
  margin-top: 10px;
`;

const KeywordPill = styled.span`
  display: inline-block;
  background-color: #e0e0e0;
  color: #333;
  padding: 5px 10px;
  border-radius: 15px;
  margin-right: 8px;
  margin-bottom: 8px;
  font-size: 0.9em;
`;

const LinkButton = styled.a`
  display: inline-block;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 20px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// Simulated NFT data type (should match the one in ExploreResearchPage or a more detailed one)
interface ResearchNFTDetail {
    mint_address: string;
    title: string;
    abstract_text: string;
    authors: string[];
    publication_date: string;
    keywords: string[];
    content_storage_hash: string;
    content_storage_provider: string; // e.g., IPFS, Arweave
    full_text_url?: string; // Direct link if available, or construct from hash
    doi?: string;
    license?: string;
}

// Simulated API call to fetch a single NFT's details
const fetchSimulatedNFTDetail = async (mintAddress: string): Promise<ResearchNFTDetail | null> => {
    // In a real app, this would fetch from your backend API (e.g., /nft/get_nft_metadata/{mint_address})
    return new Promise(resolve => {
        setTimeout(() => {
            // Find a specific NFT or return a generic one for simulation
            const sampleNFTs: ResearchNFTDetail[] = [
                {
                    mint_address: "sim_mint_addr_123",
                    title: "Decentralized AI: A New Frontier for Science",
                    abstract_text: "This paper explores the potential of combining decentralized technologies with artificial intelligence to revolutionize scientific research, focusing on data ownership, collaborative models, and transparent computation. We delve into specific use cases and challenges, proposing a framework for future development in the DeSci space. The implications for open science and reproducible research are also discussed in detail.",
                    authors: ["Dr. Ada Lovelace", "Dr. Alan Turing"],
                    publication_date: "2025-03-15",
                    keywords: ["DeSci", "AI", "Blockchain", "Research", "Open Science"],
                    content_storage_hash: "ipfs_hash_abc123",
                    content_storage_provider: "IPFS",
                    doi: "10.1234/desci.2025.001",
                    license: "CC BY 4.0"
                },
                {
                    mint_address: "sim_mint_addr_456",
                    title: "Tokenomics of Research Funding DAOs",
                    abstract_text: "We propose a novel tokenomic model for Decentralized Autonomous Organizations (DAOs) dedicated to funding scientific research. Our model aims to align incentives between researchers, funders, and the broader community, fostering a more equitable and efficient funding landscape. Key aspects include governance mechanisms, reward distribution, and sustainability planning.",
                    authors: ["Dr. Satoshi Nakamoto"],
                    publication_date: "2025-04-20",
                    keywords: ["DAO", "Tokenomics", "Funding", "DeSci", "Governance"],
                    content_storage_hash: "arweave_hash_def456",
                    content_storage_provider: "Arweave",
                    doi: "10.5678/token.2025.002",
                    license: "MIT"
                }
            ];
            const foundNft = sampleNFTs.find(nft => nft.mint_address === mintAddress);
            resolve(foundNft || null);
        }, 500);
    });
};

// This component would typically get the mint_address from URL params if using React Router
// For simulation, we can pass it as a prop or hardcode for now.
interface IndividualResearchViewPageProps {
    mintAddress?: string; // Optional for now, will use a default if not provided
}

const IndividualResearchViewPage: React.FC<IndividualResearchViewPageProps> = ({ mintAddress = "sim_mint_addr_123" }) => {
    // const { mintAddress } = useParams<{ mintAddress: string }>(); // If using React Router
    const [nftDetail, setNftDetail] = useState<ResearchNFTDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadNftDetail = async () => {
            if (!mintAddress) {
                setError("No research NFT address provided.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const fetchedDetail = await fetchSimulatedNFTDetail(mintAddress);
                if (fetchedDetail) {
                    setNftDetail(fetchedDetail);
                } else {
                    setError("Research NFT not found.");
                }
            } catch (e) {
                setError("Failed to load research details.");
                console.error(e);
            }
            setLoading(false);
        };
        loadNftDetail();
    }, [mintAddress]);

    const getContentUrl = (nft: ResearchNFTDetail): string => {
        if (nft.content_storage_provider.toLowerCase() === 'ipfs') {
            return `https://ipfs.io/ipfs/${nft.content_storage_hash}`; // Example IPFS gateway
        }
        // Add other providers like Arweave if needed
        // return `https://arweave.net/${nft.content_storage_hash}`; 
        return `#/content/${nft.content_storage_hash}`; // Fallback placeholder
    };

    if (loading) {
        return <PageContainer><p>Loading research details...</p></PageContainer>;
    }

    if (error) {
        return <PageContainer><p style={{ color: 'red' }}>Error: {error}</p></PageContainer>;
    }

    if (!nftDetail) {
        return <PageContainer><p>No research data available.</p></PageContainer>;
    }

    return (
        <PageContainer>
            <Title>{nftDetail.title}</Title>
            
            <MetadataSection>
                <MetadataLabel>Authors:</MetadataLabel>
                <MetadataValue>{nftDetail.authors.join(', ')}</MetadataValue>
            </MetadataSection>

            <MetadataSection>
                <MetadataLabel>Publication Date:</MetadataLabel>
                <MetadataValue>{nftDetail.publication_date}</MetadataValue>
            </MetadataSection>

            {nftDetail.doi && (
                <MetadataSection>
                    <MetadataLabel>DOI:</MetadataLabel>
                    <MetadataValue><a href={`https://doi.org/${nftDetail.doi}`} target="_blank" rel="noopener noreferrer">{nftDetail.doi}</a></MetadataValue>
                </MetadataSection>
            )}

            <MetadataSection>
                <MetadataLabel>Abstract:</MetadataLabel>
                <AbstractText>{nftDetail.abstract_text}</AbstractText>
            </MetadataSection>

            <MetadataSection>
                <MetadataLabel>Keywords:</MetadataLabel>
                <KeywordsContainer>
                    {nftDetail.keywords.map(keyword => (
                        <KeywordPill key={keyword}>{keyword}</KeywordPill>
                    ))}
                </KeywordsContainer>
            </MetadataSection>
            
            {nftDetail.license && (
                 <MetadataSection>
                    <MetadataLabel>License:</MetadataLabel>
                    <MetadataValue>{nftDetail.license}</MetadataValue>
                </MetadataSection>
            )}

            <MetadataSection>
                <MetadataLabel>Content Hash ({nftDetail.content_storage_provider}):</MetadataLabel>
                <MetadataValue>{nftDetail.content_storage_hash}</MetadataValue>
            </MetadataSection>

            <LinkButton href={getContentUrl(nftDetail)} target="_blank" rel="noopener noreferrer">
                Access Full Content ({nftDetail.content_storage_provider})
            </LinkButton>
        </PageContainer>
    );
};

export default IndividualResearchViewPage;

