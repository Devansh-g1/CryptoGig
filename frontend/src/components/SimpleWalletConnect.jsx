import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';
import { toast } from 'sonner';

export default function SimpleWalletConnect() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            checkNetwork();
          }
        })
        .catch(console.error);
      
      // Listen for network changes
      window.ethereum.on('chainChanged', checkNetwork);
      
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('chainChanged', checkNetwork);
        }
      };
    }
  }, []);

  const checkNetwork = async () => {
    if (!window.ethereum) return;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x4268') { // Not Holesky
        toast.error('⚠️ Please switch to Holesky network', { duration: 5000 });
      }
    } catch (error) {
      console.error('Failed to check network:', error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not found. Please install MetaMask extension.');
      return;
    }

    setIsConnecting(true);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        toast.success('Wallet connected successfully!');
        
        // Force switch to Holesky testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4268' }], // Holesky testnet (17000 in hex)
          });
          toast.success('Switched to Holesky network');
        } catch (switchError) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x4268',
                  chainName: 'Holesky Testnet',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://ethereum-holesky-rpc.publicnode.com'],
                  blockExplorerUrls: ['https://holesky.etherscan.io']
                }]
              });
              toast.success('Holesky network added!');
            } catch (addError) {
              console.error('Failed to add network:', addError);
              toast.error('Please manually switch to Holesky network');
            }
          } else {
            toast.error('Please manually switch to Holesky network');
          }
        }
      }
    } catch (error) {
      console.error('Connection failed:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    toast.success('Wallet disconnected');
  };

  if (account) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm text-slate-300">
          {account.slice(0, 6)}...{account.slice(-4)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className="border-slate-700 text-slate-300"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}