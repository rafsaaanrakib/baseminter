import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { Contract, keccak256, toUtf8Bytes, getAddress, BrowserProvider } from 'ethers';
import { baseMinterFactoryABI } from '@/contracts/abi/BaseMinterFactoryABI';
import { baseTokenABI } from '@/contracts/abi/BaseTokenABI';
// Removed duplicate getAddress import

// This should be replaced with your actual deployed factory address
export const FACTORY_ADDRESS = '0x2c080712805487413E181Ac5A23c5fBa8Bd67631' as const;

export function useCreateToken() {
  const { isPending, error } = useWriteContract();

  const createToken = async ({
    args,
    value,
  }: {
    args: [string, string, bigint];
    value: bigint;
  }) => {
    if (window.ethereum) {
  const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(FACTORY_ADDRESS, baseMinterFactoryABI, signer);
      const txResponse = await contract.createToken(args[0], args[1], args[2], { value });
      const txHash = txResponse.hash;
      const receipt = await provider.waitForTransaction(txHash);
      // TokenCreated event topic (keccak256 of 'TokenCreated(address,address)')
      const topic = keccak256(toUtf8Bytes('TokenCreated(address,address)'));
      const event = receipt?.logs?.find((log: any) =>
        log.topics && log.topics[0].toLowerCase() === topic.toLowerCase()
      );
      let tokenAddress = '';
      if (event && event.topics && event.topics.length > 2) {
        // topics[2] is the token address (indexed)
        tokenAddress = getAddress('0x' + event.topics[2].slice(-40));
      }
      return { hash: txHash, contractAddress: tokenAddress };
    }
    return { hash: '', contractAddress: '' };
  };

  return {
    createToken,
    isPending,
    error,
  };
}

export function useDeployedTokens() {
  return useReadContract({
    abi: baseMinterFactoryABI,
    address: FACTORY_ADDRESS,
    functionName: 'getDeployedTokens',
  });
}

export function useDeployFee() {
  return useReadContract({
    abi: baseMinterFactoryABI,
    address: FACTORY_ADDRESS,
    functionName: 'deployFee',
  });
}