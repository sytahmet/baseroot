import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components
const PageContainer = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 25px;
`;

const SearchForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 30px;
`;

const Label = styled.label`
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  min-height: 100px;
  font-size: 1em;
`;

const Button = styled.button`
  background-color: #17a2b8; /* Teal for AI tool */
  color: white;
  padding: 12px 18px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #138496;
  }

  &:disabled {
    background-color: #ccc;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 20px;
`;

const ResultItem = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
`;

const ResultTitle = styled.h4`
  color: #007bff;
  margin-top: 0;
  margin-bottom: 8px;
`;

const ResultAbstract = styled.p`
  font-size: 0.9em;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
`;

const ResultAuthors = styled.p`
  font-size: 0.85em;
  color: #777;
  font-style: italic;
`;

const ResultScore = styled.p`
  font-size: 0.85em;
  color: #28a745; /* Green for score */
  font-weight: bold;
`;

interface AiSearchResult {
    id: string;
    title: string;
    abstract_snippet: string;
    authors: string[];
    similarity_score: number;
    // Potentially add link to full paper or NFT view
}

// Simulated API call for AI literature discovery
const fetchSimulatedAiDiscovery = async (query: string): Promise<AiSearchResult[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Simulate results based on query length or keywords for variety
            if (query.toLowerCase().includes("blockchain")) {
                resolve([
                    {
                        id: "ai_res_1",
                        title: "Synergies Between Blockchain and AI in Scientific Publishing",
                        abstract_snippet: "This paper explores how blockchain's immutability and AI's analytical power can create a more transparent and efficient scientific publishing ecosystem...",
                        authors: ["Dr. Eva Chain", "Prof. Lex Algorithm"],
                        similarity_score: 0.92,
                    },
                    {
                        id: "ai_res_2",
                        title: "Decentralized Data Markets for AI Training in DeSci",
                        abstract_snippet: "We propose a blockchain-based marketplace for scientific data, enabling secure and fair compensation for data providers and access for AI model training...",
                        authors: ["Dr. Ian Token", "Dr. Ada Data"],
                        similarity_score: 0.88,
                    }
                ]);
            } else if (query.length > 10) {
                resolve([
                    {
                        id: "ai_res_3",
                        title: "Advanced Neural Networks for Protein Folding Prediction",
                        abstract_snippet: "Recent advancements in deep learning, particularly transformer architectures, have significantly improved the accuracy of protein structure prediction...",
                        authors: ["Dr. Alpha Fold", "Dr. Beta Structure"],
                        similarity_score: 0.95,
                    },
                    {
                        id: "ai_res_4",
                        title: "Ethical Considerations in AI-Driven Research Discovery",
                        abstract_snippet: "As AI tools become more prevalent in scientific discovery, it is crucial to address the ethical implications, including bias in algorithms and data privacy...",
                        authors: ["Prof. Ethica Value", "Dr. Justin Principle"],
                        similarity_score: 0.85,
                    }
                ]);
            } else {
                resolve([]);
            }
        }, 1200);
    });
};

const AiLiteratureDiscoveryPage: React.FC = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<AiSearchResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [message, setMessage] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) {
            setMessage("Please enter keywords or an abstract to search.");
            setResults([]);
            return;
        }
        setSearching(true);
        setMessage("Searching for relevant literature... (simulated)");
        setResults([]); // Clear previous results

        // In a real app: await fetch(`/api/ai/discover?query=${encodeURIComponent(query)}`)
        const fetchedResults = await fetchSimulatedAiDiscovery(query);
        setResults(fetchedResults);
        
        if (fetchedResults.length === 0) {
            setMessage("No similar papers found for your query. Try different keywords.");
        } else {
            setMessage(""); // Clear searching message
        }
        setSearching(false);
    };

    return (
        <PageContainer>
            <Title>AI Literature Discovery Tool</Title>
            <SearchForm onSubmit={handleSearch}>
                <Label htmlFor="searchQuery">Enter Keywords or Abstract:</Label>
                <Textarea 
                    id="searchQuery" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="e.g., 'crispr gene editing ethics' or paste an abstract..."
                    rows={5}
                />
                <Button type="submit" disabled={searching}>
                    {searching ? 'Searching...' : 'Discover Similar Papers'}
                </Button>
            </SearchForm>

            {message && <p>{message}</p>}

            {results.length > 0 && (
                <ResultsContainer>
                    <h3>Search Results:</h3>
                    {results.map(result => (
                        <ResultItem key={result.id}>
                            <ResultTitle>{result.title}</ResultTitle>
                            <ResultAbstract>{result.abstract_snippet}</ResultAbstract>
                            <ResultAuthors>Authors: {result.authors.join(', ')}</ResultAuthors>
                            <ResultScore>Similarity Score: {(result.similarity_score * 100).toFixed(1)}%</ResultScore>
                            {/* Link to full view could be added here */}
                        </ResultItem>
                    ))}
                </ResultsContainer>
            )}
        </PageContainer>
    );
};

export default AiLiteratureDiscoveryPage;

