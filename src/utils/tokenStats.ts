// Utility functions to fetch live token stats from Basescan and Uniswap

export async function fetchHoldersBasescan(contractAddress: string, apiKey?: string): Promise<number | null> {
  try {
    const key = apiKey ? `&apikey=${apiKey}` : '';
    const url = `https://api.basescan.org/api?module=token&action=tokenholderlist&contractaddress=${contractAddress}${key}`;
    const res = await fetch(url);
    const data = await res.json();
    // Example: data.result is an array of holders
    if (data.status === '1' && Array.isArray(data.result)) {
      return data.result.length;
    }
    return null;
  } catch {
    return null;
  }
}


// Fetch liquidity from Uniswap pool (Base chain)
export async function fetchLiquidityUniswap(contractAddress: string): Promise<string | null> {
  try {
    // Uniswap v3 subgraph for Base chain
    const query = `{
      pools(where: { token0: "${contractAddress.toLowerCase()}" }) {
        liquidity
        token0 { symbol }
        token1 { symbol }
      }
    }`;
    const res = await fetch('https://api.thegraph.com/subgraphs/name/ianlapham/base-uniswap-v3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const { data } = await res.json();
    if (data && data.pools && data.pools.length > 0) {
      // Return liquidity of the first pool found
      return data.pools[0].liquidity;
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchPriceUniswap(contractAddress: string): Promise<string | null> {
  try {
    // Uniswap v3 subgraph for Base chain
    const query = `{
      token(id: "${contractAddress.toLowerCase()}") {
        derivedETH
        symbol
      }
    }`;
    const res = await fetch('https://api.thegraph.com/subgraphs/name/ianlapham/base-uniswap-v3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const { data } = await res.json();
    if (data && data.token && data.token.derivedETH) {
      // You can convert ETH price to USD if needed
      return data.token.derivedETH;
    }
    return null;
  } catch {
    return null;
  }
}
