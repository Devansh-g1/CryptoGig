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
      if (chainId !== '0xaa36a7') { // Not Sepolia
        toast.error('⚠️ Please switch to Sepolia network', { duration: 5000 });
      }
    } catch (error) {
      console.error('Failed to check network:', error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not found. Please install MetaMask extension.');
      // Redirect to helper page
      setTimeout(() => {
        window.open('https://metamask.io/download/', '_blank');
      }, 1000);
      return;
    }

    setIsConnecting(true);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      }).catch(err => {
        // Ignore extension ID errors
        if (err.message && err.message.includes('Extension ID')) {
          return [];
        }
        throw err;
      });
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        toast.success('Wallet connected successfully!');
        
        // Force switch to Sepolia testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia testnet (11155111 in hex)
          }).catch(err => {
            // Ignore extension ID errors
            if (err.message && err.message.includes('Extension ID')) {
              return;
            }
            throw err;
          });
          toast.success('Switched to Sepolia network');
        } catch (switchError) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0xaa36a7',
                  chainName: 'Sepolia Testnet',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io']
                }]
              }).catch(err => {
                // Ignore extension ID errors
                if (err.message && err.message.includes('Extension ID')) {
                  return;
                }
                throw err;
              });
              toast.success('Sepolia network added!');
            } catch (addError) {
              console.error('Failed to add network:', addError);
              toast.info('Please use the helper page to add Sepolia');
              // Open helper page
              setTimeout(() => {
                window.open('/add-sepolia.html', '_blank');
              }, 1000);
            }
          } else if (switchError.code !== 4001) { // Ignore user rejection
            toast.info('Please use the helper page to add Sepolia');
            setTimeout(() => {
              window.open('/add-sepolia.html', '_blank');
            }, 1000);
          }
        }
      }
    } catch (error) {
      // Ignore extension ID errors
      if (error.message && error.message.includes('Extension ID')) {
        toast.info('Please connect manually in MetaMask');
        return;
      }
      
      if (error.code === 4001) {
        toast.error('Connection rejected');
      } else {
        console.error('Connection failed:', error);
        toast.error('Failed to connect wallet');
      }
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