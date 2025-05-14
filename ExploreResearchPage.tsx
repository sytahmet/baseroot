import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components
const PageContainer = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 30px;
`;

const FilterControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const NFTCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const NFTTitle = styled.h3`
  color: #007bff;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.1em;
`;

const NFTAbstract = styled.p`
  font-size: 0.9em;
  color: #555;
  line-height: 1.4;
  height: 60px; // Fixed height for snippet
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NFTAuthors = styled.p`
  font-size: 0.8em;
  color: #777;
  margin-bottom: 5px;
`;

const NFTDate = styled.p`
  font-size: 0.8em;
  color: #777;
`;

// Simulated NFT data type
interface ResearchNFT {
    mint_address: string;
    title: string;
    abstract_text: string;
    authors: string[];
    publication_date: string;
    keywords: string[];
    content_storage_hash: string;
}

// Simulated API call to fetch NFTs
const fetchSimulatedNFTs = async (): Promise<ResearchNFT[]> => {
    // In a real app, this would fetch from your backend API (e.g., /nft/list_nfts)
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    mint_address: "sim_mint_addr_123",
                    title: "Decentralized AI: A New Frontier for Science",
                    abstract_text: "This paper explores the potential of combining decentralized technologies with artificial intelligence to revolutionize scientific research, focusing on data ownership, collaborative models, and transparent computation...",
                    authors: ["Dr. Ada Lovelace", "Dr. Alan Turing"],
                    publication_date: "2025-03-15",
                    keywords: ["DeSci", "AI", "Blockchain", "Research"],
                    content_storage_hash: "ipfs_hash_abc123"
                },
                {
                    mint_address: "sim_mint_addr_456",
                    title: "Tokenomics of Research Funding DAOs",
                    abstract_text: "We propose a novel tokenomic model for Decentralized Autonomous Organizations (DAOs) dedicated to funding scientific research. Our model aims to align incentives between researchers, funders, and the broader community...",
                    authors: ["Dr. Satoshi Nakamoto"],
                    publication_date: "2025-04-20",
                    keywords: ["DAO", "Tokenomics", "Funding", "DeSci"],
                    content_storage_hash: "arweave_hash_def456"
                },
                {
                    mint_address: "sim_mint_addr_789",
                    title: "Verifiable Credentials for Scientific Publications",
                    abstract_text: "The use of verifiable credentials (VCs) can enhance the trustworthiness and authenticity of scientific publications. This work details an implementation using W3C standards and distributed ledger technology...",
                    authors: ["Dr. Tim Berners-Lee"],
                    publication_date: "2025-02-10",
                    keywords: ["Verifiable Credentials", "Publications", "Trust", "DLT"],
                    content_storage_hash: "ipfs_hash_ghi789"
                }
            ]);
        }, 1000);
    });
};

const ExploreResearchPage: React.FC = () => {
    const [nfts, setNfts] = useState<ResearchNFT[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all'); // e.g., 'ai', 'blockchain', 'dao'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNFTs = async () => {
            setLoading(true);
            const fetchedNfts = await fetchSimulatedNFTs();
            setNfts(fetchedNfts);
            setLoading(false);
        };
        loadNFTs();
    }, []);

    const filteredNfts = nfts.filter(nft => {
        const matchesSearchTerm = nft.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  nft.abstract_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  nft.keywords.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = filterCategory === 'all' || nft.keywords.some(kw => kw.toLowerCase() === filterCategory.toLowerCase());
        return matchesSearchTerm && matchesCategory;
    });

    // Placeholder for navigating to individual NFT view
    const handleCardClick = (mintAddress: string) => {
        console.log(`Navigate to NFT details for: ${mintAddress}`);
        // Example: history.push(`/research/${mintAddress}`); // if using react-router
        alert(`Would navigate to details for NFT: ${mintAddress}`);
    };

    if (loading) {
        return <PageContainer><p>Loading research NFTs...</p></PageContainer>;
    }

    return (
        <PageContainer>
            <Title>Explore Research NFTs</Title>
            <FilterControls>
                <Input 
                    type="text" 
                    placeholder="Search by title, abstract, keyword..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="all">All Categories</option>
                    <option value="desci">DeSci</option>
                    <option value="ai">AI</option>
                    <option value="blockchain">Blockchain</option>
                    <option value="dao">DAO</option>
                    <option value="funding">Funding</option>
                    {/* Add more categories as needed or derive from data */}
                </Select>
            </FilterControls>
            {filteredNfts.length > 0 ? (
                <NFTGrid>
                    {filteredNfts.map(nft => (
                        <NFTCard key={nft.mint_address} onClick={() => handleCardClick(nft.mint_address)}>
                            <NFTTitle>{nft.title}</NFTTitle>
                            <NFTAbstract>{nft.abstract_text}</NFTAbstract>
                            <NFTAuthors>Authors: {nft.authors.join(', ')}</NFTAuthors>
                            <NFTDate>Published: {nft.publication_date}</NFTDate>
                        </NFTCard>
                    ))}
                </NFTGrid>
            ) : (
                <p>No research NFTs found matching your criteria.</p>
            )}
        </PageContainer>
    );
};

export default ExploreResearchPage;

