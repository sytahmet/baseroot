import React, { useState } from 'react';
import styled from 'styled-components';

// Re-using or adapting styled components from ResearchUploadPage for consistency
const FormContainer = styled.div`
  padding: 20px;
  background-color: #f0f2f5;
  border-radius: 8px;
  max-width: 700px;
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
  min-height: 120px;
`;

const Button = styled.button`
  background-color: #28a745; /* Green for DAO actions */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #ccc;
  }
`;

interface ProposalFormData {
    title: string;
    description: string;
    ipfsHashDetails: string; // Optional IPFS hash for detailed proposal document
    requestedAmount: string; // String to handle large numbers, convert to number before sending
    currency: string;
    targetFundingAddress: string;
}

const DaoProposalSubmitForm: React.FC = () => {
    const [formData, setFormData] = useState<ProposalFormData>({
        title: '',
        description: '',
        ipfsHashDetails: '',
        requestedAmount: '',
        currency: 'SOL', // Default to SOL, could be a select if multiple are supported
        targetFundingAddress: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('Submitting proposal (simulated)...');

        // Basic validation (more can be added)
        if (!formData.title || !formData.description || !formData.requestedAmount || !formData.targetFundingAddress) {
            setMessage('Please fill in all required fields.');
            setSubmitting(false);
            return;
        }

        const payload = {
            title: formData.title,
            description: formData.description,
            ipfs_hash_details: formData.ipfsHashDetails || null,
            requested_amount: parseInt(formData.requestedAmount, 10), // Assuming lamports or smallest unit
            currency: formData.currency,
            target_funding_address: formData.targetFundingAddress,
        };

        console.log('Submitting DAO Proposal:', payload);

        // Simulate API call to backend (e.g., POST /dao/submit_proposal)
        // const response = await fetch('/api/dao/submit_proposal', { // Replace with actual API endpoint
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(payload),
        // });

        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

        // if (response.ok) {
        //     const result = await response.json();
        //     setMessage(`Proposal "${formData.title}" submitted successfully! On-chain ID: ${result.on_chain_proposal_id}`);
        // } else {
        //     setMessage('Failed to submit proposal. Please try again.');
        // }
        setMessage(`Proposal "${formData.title}" submitted successfully (simulated)! On-chain ID: sim_dao_prop_${Date.now()}`);
        setSubmitting(false);
        // Optionally reset form
        // setFormData({ title: '', description: '', ipfsHashDetails: '', requestedAmount: '', currency: 'SOL', targetFundingAddress: '' });
    };

    return (
        <FormContainer>
            <h2>Submit DAO Funding Proposal</h2>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="title">Proposal Title</Label>
                    <Input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="ipfsHashDetails">IPFS Hash for Detailed Document (Optional)</Label>
                    <Input type="text" id="ipfsHashDetails" name="ipfsHashDetails" value={formData.ipfsHashDetails} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="requestedAmount">Requested Amount (e.g., in Lamports for SOL)</Label>
                    <Input type="number" id="requestedAmount" name="requestedAmount" value={formData.requestedAmount} onChange={handleInputChange} required min="0" />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="currency">Currency</Label>
                    {/* For now, hardcoding SOL. Could be a dropdown if other tokens are supported */}
                    <Input type="text" id="currency" name="currency" value={formData.currency} onChange={handleInputChange} required readOnly /> 
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="targetFundingAddress">Target Wallet Address for Funding</Label>
                    <Input type="text" id="targetFundingAddress" name="targetFundingAddress" value={formData.targetFundingAddress} onChange={handleInputChange} required />
                </FormGroup>
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Proposal'}
                </Button>
            </form>
            {message && <p style={{ marginTop: '15px', color: submitting ? 'blue' : (message.includes('Failed') ? 'red' : 'green') }}>{message}</p>}
        </FormContainer>
    );
};

export default DaoProposalSubmitForm;

