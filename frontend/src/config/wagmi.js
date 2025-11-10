import { http } from 'wagmi';
import { polygon, polygonAmoy } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Simplified wallet configuration for development
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '2f05a7cde2bb14b478f07c00594118b1';

export const wagmiConfig = getDefaultConfig({
  appName: 'CryptoGig',
  projectId,
  chains: [polygonAmoy], // Use only testnet for development
  transports: {
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology'),
  },
  ssr: false,
  // Reduce connection attempts to minimize errors
  multiInjectedProviderDiscovery: false,
});