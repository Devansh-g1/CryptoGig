import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

// Holesky USDC address (mock USDC for testing)
const USDC_ADDRESS = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'; // Holesky USDC
const ESCROW_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Minimal ERC20 ABI for approve
const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

// Escrow ABI for fundJob
const ESCROW_ABI = [
  {
    inputs: [
      { name: 'jobId', type: 'uint256' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'fundJob',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

export function useFundJob() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const fundJob = async (jobId, amountUSDC) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return false;
    }

    if (!ESCROW_ADDRESS) {
      toast.error('Contract address not configured');
      return false;
    }

    setIsLoading(true);
    
    try {
      const amount = parseUnits(amountUSDC.toString(), 6); // USDC has 6 decimals
      
      // Step 1: Approve USDC
      toast.info('Step 1/3: Approving USDC...');
      const approveHash = await writeContractAsync({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [ESCROW_ADDRESS, amount],
      });
      
      toast.info('Waiting for approval confirmation...');
      // Wait for approval
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Step 2: Fund job
      toast.info('Step 2/3: Funding job...');
      const fundHash = await writeContractAsync({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'fundJob',
        args: [BigInt(jobId), amount],
      });
      
      toast.info('Waiting for transaction confirmation...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Step 3: Update backend
      toast.info('Step 3/3: Updating job status...');
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API}/jobs/${jobId}/status`,
        { status: 'created', tx_hash: fundHash },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('✅ Job funded successfully!');
      return true;
    } catch (error) {
      console.error('Fund job error:', error);
      
      if (error.message?.includes('User rejected')) {
        toast.error('Transaction rejected');
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient USDC balance');
      } else {
        toast.error('Failed to fund job: ' + (error.message || 'Unknown error'));
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { fundJob, isLoading };
}
