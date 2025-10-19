import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCreateToken, useDeployFee } from '@/hooks/useContract';
import { parseUnits, encodeAbiParameters, parseAbiParameters } from 'viem';
import { useAccount } from 'wagmi';

export default function TokenForm() {
  const [showModal, setShowModal] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  // Only deployment logic remains. All verification removed.
  const { address } = useAccount();
  const deployFeeResult = useDeployFee();
  const { createToken, isPending } = useCreateToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!address || !name || !symbol || !supply || !deployFeeResult.data) {
      setErrorMsg('Missing required fields or deploy fee.');
      return;
    }
    try {
      const tx = await createToken({
        args: [name, symbol, parseUnits(supply, 18)],
        value: deployFeeResult.data as bigint,
      });
      setSuccessMsg('Token deployment transaction sent!');
      if (tx?.contractAddress) {
        setDeployedAddress(tx.contractAddress);
        setShowModal(true);
        // Persist to localStorage and notify listeners (Recent/Gallery/Analytics/Profile)
        try {
          const stored = JSON.parse(localStorage.getItem('deployedTokens') || '[]');
          const newToken = {
            name,
            symbol,
            supply,
            address: tx.contractAddress,
            deployer: address,
            blockNumber: Date.now(), // Use timestamp to ensure newest tokens appear first
          };
          const deduped = [newToken, ...stored.filter((t: any) => (t?.address || '').toLowerCase() !== tx.contractAddress.toLowerCase())];
          localStorage.setItem('deployedTokens', JSON.stringify(deduped));
          window.dispatchEvent(new Event('deployedTokensUpdated'));
        } catch {}
      }
    } catch (error: any) {
      console.error('Deployment error:', error);
      
      // Parse error message for common cases
      const errorString = error?.message || error?.reason || error?.toString() || '';
      
      if (errorString.includes('insufficient funds') || errorString.includes('insufficient balance')) {
        setErrorMsg('⚠️ Insufficient funds! Please deposit at least 0.0004 ETH to your wallet for gas fees.');
      } else if (errorString.includes('user rejected') || errorString.includes('User denied')) {
        setErrorMsg('❌ Transaction cancelled by user.');
      } else if (errorString.includes('network') || errorString.includes('connection')) {
        setErrorMsg('🌐 Network error. Please check your connection and try again.');
      } else {
        setErrorMsg('❌ Token deployment failed. Please try again or contact support.');
      }
    }
  };

  return (
    <div>
      <motion.section className="w-full max-w-xl mx-auto bg-white/80 rounded-3xl shadow-xl p-8 mt-8">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-6 text-center" id="token-form-title">Create Your Base Token</h1>
        <form onSubmit={handleSubmit} className="space-y-8 w-full" aria-labelledby="token-form-title">
          <div>
            <label htmlFor="token-name" className="block text-base sm:text-lg font-bold mb-2 text-blue-900">Token Name</label>
              <input
                id="token-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/60 border border-blue-400/50 rounded-2xl focus:ring-2 focus:ring-blue-700 focus:border-transparent text-base sm:text-lg font-semibold placeholder-blue-500 text-blue-900 shadow-md"
                placeholder="e.g., Base Coin"
                required
                aria-required="true"
                aria-label="Token name"
              />
            </div>
            <div>
              <label htmlFor="token-symbol" className="block text-base sm:text-lg font-bold mb-2 text-blue-900">Token Symbol</label>
              <input
                id="token-symbol"
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/60 border border-blue-400/50 rounded-2xl focus:ring-2 focus:ring-blue-700 focus:border-transparent text-base sm:text-lg font-semibold placeholder-blue-500 text-blue-900 shadow-md"
                placeholder="e.g., BASE"
                required
                aria-required="true"
                aria-label="Token symbol"
              />
            </div>
            <div>
              <label htmlFor="token-supply" className="block text-base sm:text-lg font-bold mb-2 text-blue-900">Initial Supply</label>
              <input
                id="token-supply"
                type="number"
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/60 border border-blue-400/50 rounded-2xl focus:ring-2 focus:ring-blue-700 focus:border-transparent text-base sm:text-lg font-semibold placeholder-blue-500 text-blue-900 shadow-md"
                placeholder="e.g., 1000000"
                required
                aria-required="true"
                aria-label="Initial supply"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 0 80px rgba(0,0,255,0.4)', filter: 'brightness(1.08)' }}
              whileTap={{ scale: 0.98, filter: 'brightness(0.96)' }}
              type="submit"
              disabled={isPending || !address}
              className="w-full py-4 sm:py-5 px-4 sm:px-6 bg-gradient-to-r from-[#0000FF] to-blue-400 text-white font-extrabold rounded-2xl shadow-[0_0_60px_rgba(0,0,255,0.2)] hover:shadow-[0_0_80px_rgba(0,0,255,0.4)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xl sm:text-2xl focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-60"
              aria-label="Deploy token"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" fill="none" /></svg>
                  Deploying...
                </span>
              ) : 'Deploy Token'}
            </motion.button>
            {!address && (
              <p className="text-base sm:text-lg text-center text-red-500 font-bold mt-2" role="alert">
                Please connect your wallet to deploy tokens
              </p>
            )}
            {errorMsg && (
              <p className="text-base sm:text-lg text-center text-red-500 font-bold mt-2" role="alert">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="text-base sm:text-lg text-center text-green-500 font-bold mt-2" role="status">{successMsg}</p>
            )}
          </form>
        </motion.section>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true">
            <div className="bg-gradient-to-br from-blue-700 via-blue-400 to-white rounded-3xl shadow-2xl p-7 max-w-md w-full relative border-4 border-blue-400 flex flex-col items-center">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-blue-900 hover:text-blue-700 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
                aria-label="Close contract address modal"
              >
                ×
              </button>
              <h2 className="text-2xl font-extrabold mb-3 text-blue-900 text-center">🎉 Token Successfully Deployed!</h2>
              <div className="mb-2 text-base font-bold text-blue-900">Contract Address:</div>
              <div className="mb-4 text-sm font-mono break-all bg-blue-50 rounded-lg px-3 py-2 border border-blue-400 flex items-center justify-between w-full">
                <span className="text-blue-900 font-bold">{deployedAddress}</span>
                <button
                  className="ml-2 px-2 py-1 rounded bg-blue-200 text-blue-900 font-bold hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => {navigator.clipboard.writeText(deployedAddress);}}
                  aria-label="Copy contract address"
                >Copy</button>
              </div>
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2"
                onClick={() => {
                  const tweet = encodeURIComponent(
                    `🚀 Just launched my new Base token!\n\nCheck it out 👇\nCA: ${deployedAddress}\n\nBuilt instantly with⚡@BaseMinterFun\n#BaseMinter #Base #OnBase #BaseChain #DeFi #Crypto #Memecoin`
                  );
                  window.open(`https://twitter.com/intent/tweet?text=${tweet}`);
                }}
                aria-label="Share contract address on X"
              >
                <span aria-hidden="true">🐦</span> Share on X
              </button>
            </div>
          </div>
        )}
      </div>
  );
}