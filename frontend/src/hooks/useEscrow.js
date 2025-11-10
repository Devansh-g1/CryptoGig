import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

// Contract addresses (update these after deployment)
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS || '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582'; // Polygon Amoy USDC

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
    name: 'assignFreelancer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_jobId', type: 'uint256' },
      { name: '_freelancer', type: 'address' }
    ],
    outputs: []
  },
  {
    name: 'completeJob',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_jobId', type: 'uint256' }],
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
    name: 'raiseDispute',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_jobId', type: 'uint256' }],
    outputs: []
  },
  {
    name: 'resolveDispute',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_jobId', type: 'uint256' },
      { name: '_clientPercentage', type: 'uint256' },
      { name: '_freelancerPercentage', type: 'uint256' }
    ],
    outputs: []
  },
  {
    name: 'jobs',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'jobId', type: 'uint256' },
      { name: 'client', type: 'address' },
      { name: 'freelancer', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'depositedAmount', type: 'uint256' },
      { name: 'status', type: 'uint8' },
      { name: 'disputeRaised', type: 'bool' },
      { name: 'createdAt', type: 'uint256' },
      { name: 'completedAt', type: 'uint256' }
    ]
  }
];

/**
 * Hook for funding jobs with USDC (Client)
 */
export function useFundJob() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const fundJob = async (jobId, amountInUSDC) => {
    if (!isContractConfigured) {
      toast.error('Smart contract not deployed yet. Using database mode for now.');
      return false;
    }

    try {
      toast.info('Step 1/2: Approving USDC...');
      const amount = parseUnits(amountInUSDC.toString(), 6); // USDC has 6 decimals
      
      // Step 1: Approve USDC spending
      await writeContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, amount]
      });
      
      toast.success('USDC approved!');
      
      // Step 2: Fund the job
      toast.info('Step 2/2: Funding job escrow...');
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'fundJob',
        args: [BigInt(jobId), amount]
      });
      
      toast.success('Job funded! Money is now in escrow.');
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
 * Hook for assigning freelancer (Client)
 */
export function useAssignFreelancer() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const assignFreelancer = async (jobId, freelancerAddress) => {
    if (!isContractConfigured) {
      toast.info('Smart contract not deployed. Assignment recorded in database.');
      return true;
    }

    try {
      toast.info('Assigning freelancer to job...');
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'assignFreelancer',
        args: [BigInt(jobId), freelancerAddress]
      });
      
      toast.success('Freelancer assigned successfully!');
      return true;
    } catch (error) {
      console.error('Assign freelancer error:', error);
      toast.error(error.message || 'Failed to assign freelancer');
      return false;
    }
  };

  return { assignFreelancer, isPending, isConfirming, isSuccess };
}

/**
 * Hook for completing job (Freelancer)
 */
export function useCompleteJob() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const completeJob = async (jobId) => {
    if (!isContractConfigured) {
      toast.info('Smart contract not deployed. Completion recorded in database.');
      return true;
    }

    try {
      toast.info('Marking job as completed...');
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'completeJob',
        args: [BigInt(jobId)]
      });
      
      toast.success('Job marked as completed! Waiting for arbitrator approval.');
      return true;
    } catch (error) {
      console.error('Complete job error:', error);
      toast.error(error.message || 'Failed to complete job');
      return false;
    }
  };

  return { completeJob, isPending, isConfirming, isSuccess };
}

/**
 * Hook for releasing payment (Arbitrator only)
 */
export function useReleasePayment() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const releasePayment = async (jobId) => {
    if (!isContractConfigured) {
      toast.info('Smart contract not deployed. Payment release recorded in database.');
      return true;
    }

    try {
      toast.info('Releasing payment to freelancer...');
      toast.info('Arbitrator will receive 5% fee, freelancer gets 95%');
      
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'releasePayment',
        args: [BigInt(jobId)]
      });
      
      toast.success('Payment released! Freelancer has been paid.');
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
 * Hook for raising disputes
 */
export function useRaiseDispute() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const raiseDispute = async (jobId) => {
    if (!isContractConfigured) {
      toast.info('Smart contract not deployed. Dispute recorded in database.');
      return true;
    }

    try {
      toast.info('Raising dispute...');
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'raiseDispute',
        args: [BigInt(jobId)]
      });
      
      toast.success('Dispute raised! Arbitrator will review.');
      return true;
    } catch (error) {
      console.error('Raise dispute error:', error);
      toast.error(error.message || 'Failed to raise dispute');
      return false;
    }
  };

  return { raiseDispute, isPending, isConfirming, isSuccess };
}

/**
 * Hook for resolving disputes (Arbitrator only)
 */
export function useResolveDispute() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const resolveDispute = async (jobId, clientPercentage, freelancerPercentage) => {
    if (!isContractConfigured) {
      toast.info('Smart contract not deployed. Dispute resolution recorded in database.');
      return true;
    }

    try {
      toast.info('Resolving dispute...');
      toast.info(`Arbitrator will receive 8% fee for dispute resolution`);
      
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'resolveDispute',
        args: [BigInt(jobId), BigInt(clientPercentage), BigInt(freelancerPercentage)]
      });
      
      toast.success('Dispute resolved! Funds distributed according to decision.');
      return true;
    } catch (error) {
      console.error('Resolve dispute error:', error);
      toast.error(error.message || 'Failed to resolve dispute');
      return false;
    }
  };

  return { resolveDispute, isPending, isConfirming, isSuccess };
}

/**
 * Hook to get job details from smart contract
 */
export function useJobDetails(jobId) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ESCROW_ABI,
    functionName: 'jobs',
    args: [BigInt(jobId)],
    watch: true // Auto-refresh
  });

  if (!data || !isContractConfigured) return { jobDetails: null, isLoading, error };

  const [jobIdOnChain, client, freelancer, amount, depositedAmount, status, disputeRaised, createdAt, completedAt] = data;

  return {
    jobDetails: {
      jobId: Number(jobIdOnChain),
      client,
      freelancer,
      amount: formatUnits(amount, 6), // Convert from wei to USDC
      depositedAmount: formatUnits(depositedAmount, 6),
      status: Number(status),
      disputeRaised,
      createdAt: Number(createdAt),
      completedAt: Number(completedAt)
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