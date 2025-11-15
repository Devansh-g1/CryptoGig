import { http, createConfig } from 'wagmi';
import { holesky } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Force Holesky testnet only - better faucet availability
export const wagmiConfig = createConfig({
  chains: [holesky],
  connectors: [
    injected({
      target: 'metaMask',
    }),
  ],
  transports: {
    [holesky.id]: http('https://ethereum-holesky-rpc.publicnode.com'),
  },
});