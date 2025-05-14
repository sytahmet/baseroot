import React from 'react';
import './App.css'; // Keep or replace with global styles if needed
import { WalletContextProvider } from './contexts/WalletContextProvider';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styled from 'styled-components';

// Example of a styled component
const AppContainer = styled.div`
  text-align: center;
`;

const AppHeader = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const WalletButtonContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  background-color: #61dafb; /* React blue, for visibility */
`;

function App() {
  return (
    <WalletContextProvider>
      <AppContainer>
        <AppHeader>
          <p>Welcome to Baseroot DeSci Platform</p>
          <WalletButtonContainer>
            <WalletMultiButton />
          </WalletButtonContainer>
          {/* Other components and routes will go here */}
        </AppHeader>
      </AppContainer>
    </WalletContextProvider>
  );
}

export default App;

