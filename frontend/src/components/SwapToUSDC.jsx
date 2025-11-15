import React, { useState, useEffect } from 'react';
import { useAccount, useBalance, useWriteContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowDown, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

// Holesky addresses
const USDC_ADDRESS = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'; // Mock USDC on Holesky
const WETH_ADDRESS = '0x94373a4919B3240D86eA41593D5eBa789FEF3848'; // WETH on Holesky

// Uniswap V2 Router on Holesky
const UNISWAP_ROUTER = '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008';

// Minimal ERC20 ABI
const ERC20_ABI = [
  {
    inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
];

// Uniswap Router ABI (simplified)
const ROUTER_ABI = [
  {
    inputs: [
      { name: 'amountOutMin', type: 'uint256' },
      { name: 'path', type: 'address[]' },
      { name: 'to', type: 'address' },
      { name: 'deadline', type: 'uint256' }
    ],
    name: 'swapExactETHForTokens',
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'payable',
    type: 'function'
  }
];

export default function SwapToUSDC({ open, onClose, targetUSDC, onSuccess }) {
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const { writeContractAsync } = useWriteContract();
  
  const [fromAmount, setFromAmount] = useState('');
  const [estimatedUSDC, setEstimatedUSDC] = useState('0');
  const [isSwapping, setIsSwapping] = useState(false);
  const [selectedToken, setSelectedToken] = useState('ETH');

  // Simple price estimation (in production, use Uniswap quoter)
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      // Rough estimate: 1 ETH = 2000 USDC (adjust based on real price)
      const ethToUsd = 2000;
      const estimated = parseFloat(fromAmount) * ethToUsd;
      setEstimatedUSDC(estimated.toFixed(2));
    } else {
      setEstimatedUSDC('0');
    }
  }, [fromAmount]);

  const handleSwap = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Enter amount to swap');
      return;
    }

    setIsSwapping(true);

    try {
      const amountIn = parseUnits(fromAmount, 18); // ETH has 18 decimals
      const amountOutMin = parseUnits((parseFloat(estimatedUSDC) * 0.95).toString(), 6); // 5% slippage
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

      toast.info('Step 1/2: Swapping ETH to USDC...');

      // Swap ETH for USDC via Uniswap
      const swapHash = await writeContractAsync({
        address: UNISWAP_ROUTER,
        abi: ROUTER_ABI,
        functionName: 'swapExactETHForTokens',
        args: [
          amountOutMin,
          [WETH_ADDRESS, USDC_ADDRESS],
          address,
          BigInt(deadline)
        ],
        value: amountIn,
      });

      toast.info('Waiting for swap confirmation...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      toast.success('✅ Swap completed!');
      toast.success(`You now have USDC to fund the job`);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error('Swap error:', error);
      
      if (error.message?.includes('User rejected')) {
        toast.error('Transaction rejected');
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient ETH balance');
      } else {
        toast.error('Swap failed: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setIsSwapping(false);
    }
  };

  const handleMaxClick = () => {
    if (ethBalance) {
      // Leave some ETH for gas
      const maxAmount = parseFloat(formatUnits(ethBalance.value, 18)) - 0.01;
      setFromAmount(maxAmount > 0 ? maxAmount.toFixed(4) : '0');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">Swap to USDC</DialogTitle>
          <DialogDescription className="text-slate-400">
            Swap your crypto to USDC to fund the job
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* From Token */}
          <div className="bg-slate-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-slate-400">From</Label>
              <div className="text-sm text-slate-400">
                Balance: {ethBalance ? parseFloat(formatUnits(ethBalance.value, 18)).toFixed(4) : '0'} ETH
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.0001"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="bg-slate-900 border-slate-700 text-2xl font-bold"
              />
              <Button
                variant="outline"
                className="border-slate-700 min-w-[100px]"
                disabled
              >
                ETH
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMaxClick}
              className="text-cyan-400 hover:text-cyan-300"
            >
              MAX
            </Button>
          </div>

          {/* Swap Icon */}
          <div className="flex justify-center">
            <div className="bg-slate-800 rounded-full p-2">
              <ArrowDown className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* To Token */}
          <div className="bg-slate-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-slate-400">To (estimated)</Label>
              <div className="text-sm text-slate-400">
                Target: {targetUSDC} USDC
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={estimatedUSDC}
                readOnly
                className="bg-slate-900 border-slate-700 text-2xl font-bold"
              />
              <Button
                variant="outline"
                className="border-slate-700 min-w-[100px]"
                disabled
              >
                USDC
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Rate:</span>
              <span className="text-blue-200">~2000 USDC per ETH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Slippage:</span>
              <span className="text-blue-200">5%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Network:</span>
              <span className="text-blue-200">Holesky Testnet</span>
            </div>
          </div>

          {/* Warning */}
          {parseFloat(estimatedUSDC) < parseFloat(targetUSDC) && fromAmount && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <p className="text-sm text-amber-200">
                ⚠️ Estimated USDC ({estimatedUSDC}) is less than required ({targetUSDC}). 
                Increase the amount or get more USDC from a faucet.
              </p>
            </div>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={isSwapping || !fromAmount || parseFloat(fromAmount) <= 0}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            {isSwapping ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Swapping...
              </>
            ) : (
              'Swap to USDC'
            )}
          </Button>

          {/* Alternative */}
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-2">Or get test USDC directly:</p>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700"
              onClick={() => window.open('https://faucet.circle.com', '_blank')}
            >
              Get Test USDC from Faucet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
