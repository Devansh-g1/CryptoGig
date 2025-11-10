import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { toast } from 'sonner';

// Contract addresses (update these after deployment)
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS || '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582'; // Polygon Amoy Testnet USDC

// Check if contracts are configured
const isContractConfigured = CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';

// Simplified ERC20 ABI for USDC
const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }]
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }]
  }
];

// Escrow Contract ABI
const ESCROW_ABI = [
  {
    name: 'fundJob',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_jobId', type: 'uint256' },
      { name: '_amount', type: 'uint256' }
    ],
    outputs: []
  },
  {
    name: 'releasePayment',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_jobId', type: 'uint256' }],
    outputs: []
  },
  {
    name: 'getJob',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_jobId', type: 'uint256' }],
    outputs: [
      { name: 'client', type: 'address' },
      { name: 'freelancer', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'depositedAmount', type: 'uint256' },
      { name: 'status', type: 'uint8' },
      { name: 'disputeRaised', type: 'bool' }
    ]
  }
];

/**
 * Hook for funding jobs with USDC
 */
export function useFundJob() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const fundJob = async (jobId, amountInUSDC) => {
    if (!isContractConfigured) {
      toast.error('Smart contract not deployed yet. Check DEPLOYMENT_GUIDE.md');
      return false;
    }

    try {
      // Step 1: Approve USDC spending
      toast.info('Step 1/2: Approving USDC...');
      const amount = parseUnits(amountInUSDC.toString(), 6); // USDC has 6 decimals
      
      await writeContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, amount]
      });
      
      toast.success('USDC approved!');
      
      // Step 2: Fund the job
      toast.info('Step 2/2: Funding job...');
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'fundJob',
        args: [BigInt(jobId), amount]
      });
      
      return true;
    } catch (error) {
      console.error('Fund job error:', error);
      if (error.message?.includes('User rejected')) {
        toast.error('Transaction cancelled by user');
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient USDC balance');
      } else {
        toast.error(error.message || 'Failed to fund job');
      }
      return false;
    }
  };

  return { fundJob, isPending, isConfirming, isSuccess };
}

/**
 * Hook for releasing payment (arbitrator only)
 */
export function useReleasePayment() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const releasePayment = async (jobId) => {
    try {
      toast.info('Releasing payment to freelancer...');
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'releasePayment',
        args: [BigInt(jobId)]
      });
      return true;
    } catch (error) {
      console.error('Release payment error:', error);
      toast.error(error.message || 'Failed to release payment');
      return false;
    }
  };

  return { releasePayment, isPending, isConfirming, isSuccess };
}

/**
 * Hook to get job details from smart contract
 */
export function useJobDetails(jobId) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ESCROW_ABI,
    functionName: 'getJob',
    args: [BigInt(jobId)],
    watch: true // Auto-refresh
  });

  if (!data) return { jobDetails: null, isLoading, error };

  const [client, freelancer, amount, depositedAmount, status, disputeRaised] = data;

  return {
    jobDetails: {
      client,
      freelancer,
      amount: formatUnits(amount, 6), // Convert from wei to USDC
      depositedAmount: formatUnits(depositedAmount, 6),
      status: Number(status),
      disputeRaised
    },
    isLoading,
    error
  };
}

/**
 * Hook to check USDC balance
 */
export function useUSDCBalance(address) {
  const { data, isLoading } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true
  });

  return {
    balance: data ? formatUnits(data, 6) : '0',
    isLoading
  };
}

export { CONTRACT_ADDRESS, USDC_ADDRESS, ESCROW_ABI, ERC20_ABI };
