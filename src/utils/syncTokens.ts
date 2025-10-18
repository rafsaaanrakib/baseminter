import { BrowserProvider, Contract, keccak256, toUtf8Bytes, getAddress } from 'ethers';
import { baseMinterFactoryABI } from '@/contracts/abi/BaseMinterFactoryABI';
import { baseTokenABI } from '@/contracts/abi/BaseTokenABI';
import { FACTORY_ADDRESS } from '@/hooks/useContract';

export async function syncDeployedTokens(walletAddress: string) {
  try {
    if (!window.ethereum) return;
    
    const provider = new BrowserProvider(window.ethereum);
    const factory = new Contract(FACTORY_ADDRESS, baseMinterFactoryABI, provider);
    
    // Find TokenCreated events by this wallet
    const topic = keccak256(toUtf8Bytes('TokenCreated(address,address)'));
  const creatorTopic = '0x' + '0'.repeat(24) + getAddress(walletAddress).slice(2).toLowerCase();
    // Determine block range (fallback to 0 if unavailable)
    const latestBlock = await provider.getBlockNumber().catch(() => undefined as any);
    let logs = await provider.getLogs({
      address: FACTORY_ADDRESS,
      topics: [topic, creatorTopic],
      fromBlock: 0 as any,
      toBlock: latestBlock ?? 'latest'
    });
    if (!logs || logs.length === 0) {
      const start = latestBlock && typeof latestBlock === 'number' ? Math.max(0, latestBlock - 1_000_000) : 0;
      const allLogs = await provider.getLogs({
        address: FACTORY_ADDRESS,
        topics: [topic],
        fromBlock: start as any,
        toBlock: latestBlock ?? 'latest'
      });
      logs = allLogs.filter((log: any) => (log.topics?.[1] || '').toLowerCase() === creatorTopic.toLowerCase());
    }

    // Fallback 2: If still none, enumerate factory tokens and check mint Transfer to wallet
    if (!logs || logs.length === 0) {
      try {
        const allTokens: string[] = await factory.getDeployedTokens();
        const transferTopic = keccak256(toUtf8Bytes('Transfer(address,address,uint256)'));
        const zeroTopic = '0x' + '0'.repeat(64); // from 0x0
        const toTopic = creatorTopic; // same 32-byte padded wallet
        const start = latestBlock && typeof latestBlock === 'number' ? Math.max(0, latestBlock - 2_000_000) : 0;

        const found: any[] = [];
        for (const tokenAddr of allTokens) {
          try {
            const mintLogs = await provider.getLogs({
              address: tokenAddr,
              topics: [transferTopic, zeroTopic, toTopic],
              fromBlock: start as any,
              toBlock: latestBlock ?? 'latest'
            });
            if (mintLogs && mintLogs.length > 0) {
              // Treat as created by this wallet (blockNumber from mint log)
              found.push({
                topics: [topic, toTopic, '0x' + tokenAddr.slice(2).padStart(64, '0')],
                blockNumber: mintLogs[0].blockNumber,
              });
            }
          } catch (e) {
            // ignore token errors
          }
        }
        logs = found;
      } catch (e) {
        console.warn('[syncTokens] Fallback by scanning factory tokens failed:', e);
      }
    }
    // Sort newest first
    logs.sort((a: any, b: any) => (Number(b.blockNumber ?? 0) - Number(a.blockNumber ?? 0)));
    const myTokenInfo = logs.map((log: any) => ({
      address: getAddress('0x' + log.topics[2].slice(-40)),
      blockNumber: Number(log.blockNumber ?? 0),
    }));
    if (myTokenInfo.length === 0) {
      console.warn('[syncTokens] No TokenCreated logs found for this wallet. Ensure you are on the correct network.');
    }

    // Fetch details for each token deployed by this wallet
    const tokenDetails = await Promise.all(
      myTokenInfo.map(async (info: { address: string; blockNumber: number }) => {
        try {
          const tokenContract = new Contract(info.address, baseTokenABI, provider);
          const [name, symbol, totalSupply] = await Promise.all([
            tokenContract.name(),
            tokenContract.symbol(),
            tokenContract.totalSupply(),
          ]);
          
          // Format supply to string without precision issues
          let supplyFormatted = totalSupply.toString();
          if (supplyFormatted.length > 18) {
            const whole = supplyFormatted.slice(0, supplyFormatted.length - 18);
            const frac = supplyFormatted.slice(-18).replace(/0+$/, '');
            supplyFormatted = frac ? `${whole}.${frac}` : whole;
          } else {
            const padded = supplyFormatted.padStart(19, '0');
            supplyFormatted = `0.${padded.slice(-18)}`.replace(/0+$/, '');
            if (supplyFormatted === '0.') supplyFormatted = '0';
          }
          
          return {
            name,
            symbol,
            supply: supplyFormatted,
            address: info.address,
            deployer: walletAddress,
            blockNumber: info.blockNumber,
          };
        } catch (err) {
          console.error(`Failed to fetch token details for ${info.address}:`, err);
          return null;
        }
      })
    );
    
    // Filter out failed fetches and merge with existing localStorage
    const validTokens = tokenDetails.filter(t => t !== null) as any[];
    const stored: any[] = JSON.parse(localStorage.getItem('deployedTokens') || '[]');
    // Merge by address, prefer new fields (deployer, blockNumber)
    const byAddr: Record<string, any> = {};
    for (const t of stored) {
      if (t && t.address) byAddr[t.address.toLowerCase()] = { ...t };
    }
    for (const t of validTokens) {
      const key = t.address.toLowerCase();
      byAddr[key] = { ...(byAddr[key] || {}), ...t };
    }
    const merged = Object.values(byAddr) as any[];
    const addedCount = validTokens.filter(t => !stored.some(s => (s.address || '').toLowerCase() === t.address.toLowerCase())).length;
    localStorage.setItem('deployedTokens', JSON.stringify(merged));
    if (addedCount > 0) {
      window.dispatchEvent(new Event('deployedTokensUpdated'));
      console.log(`✅ Synced ${addedCount} new token(s) from blockchain`);
      return addedCount;
    }
    
    console.log('✅ All tokens already synced');
    return 0;
  } catch (error) {
    console.error('Failed to sync deployed tokens:', error);
    return 0;
  }
}
