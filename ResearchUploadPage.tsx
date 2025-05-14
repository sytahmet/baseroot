import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components for the form
const FormContainer = styled.div`
  padding: 20px;
  background-color: #f0f2f5;
  border-radius: 8px;
  max-width: 600px;
  margin: 20px auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  min-height: 100px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

interface Metadata {
    title: string;
    abstractText: string;
    authors: string; // Comma-separated for simplicity
    publicationDate: string;
    keywords: string; // Comma-separated
}

const ResearchUploadPage: React.FC = () => {
    const [metadata, setMetadata] = useState<Metadata>({
        title: '',
        abstractText: '',
        authors: '',
        publicationDate: '',
        keywords: '',
    });
    const [researchFile, setResearchFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMetadata(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResearchFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!researchFile) {
            setMessage('Please select a research file to upload.');
            return;
        }
        setUploading(true);
        setMessage('Simulating upload and minting process...');

        // Simulate API call to backend
        // In a real app, this would involve:
        // 1. Uploading `researchFile` to IPFS/Arweave via backend, getting content_hash.
        // 2. Calling backend API to mint NFT with metadata and content_hash.
        console.log('Submitting metadata:', metadata);
        console.log('Submitting file:', researchFile.name);

        // Simulate a delay for the process
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Simulate success
        setMessage(`Research "${metadata.title}" uploaded and NFT minting initiated (simulated). Content Hash: sim_hash_${Date.now()}`);
        setUploading(false);
        // Reset form (optional)
        // setMetadata({ title: '', abstractText: '', authors: '', publicationDate: '', keywords: '' });
        // setResearchFile(null);
    };

    return (
        <FormContainer>
            <h2>Upload Research and Mint NFT</h2>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="title">Title</Label>
                    <Input type="text" id="title" name="title" value={metadata.title} onChange={handleInputChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="abstractText">Abstract</Label>
                    <Textarea id="abstractText" name="abstractText" value={metadata.abstractText} onChange={handleInputChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="authors">Authors (comma-separated)</Label>
                    <Input type="text" id="authors" name="authors" value={metadata.authors} onChange={handleInputChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="publicationDate">Publication Date</Label>
                    <Input type="date" id="publicationDate" name="publicationDate" value={metadata.publicationDate} onChange={handleInputChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                    <Input type="text" id="keywords" name="keywords" value={metadata.keywords} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="researchFile">Research File (PDF, etc.)</Label>
                    <Input type="file" id="researchFile" name="researchFile" onChange={handleFileChange} accept=".pdf,.doc,.docx,text/plain" required />
                </FormGroup>
                <Button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload and Mint NFT'}
                </Button>
            </form>
            {message && <p style={{ marginTop: '15px', color: uploading ? 'blue' : 'green' }}>{message}</p>}
        </FormContainer>
    );
};

export default ResearchUploadPage;

