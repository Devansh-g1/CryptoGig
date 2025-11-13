import { http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { rainbowWallet } from '@rainbow-me/rainbowkit/wallets';

// Simplified wallet configuration - Rainbow only
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '2f05a7cde2bb14b478f07c00594118b1';

export const wagmiConfig = getDefaultConfig({
  appName: 'CryptoGig',
  projectId,
  chains: [sepolia], // Sepolia testnet
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
  },
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [rainbowWallet],
    },
  ],
  ssr: false,
  multiInjectedProviderDiscovery: false,
});