'use client';

import { useState } from 'react';
import { useWalletKit } from '@reown/walletkit';
import { deployMemeCoin } from '@/lib/deployContract';

export default function LaunchForm() {
  const { connect, address } = useWalletKit();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleLaunch = async () => {
    if (!address) {
      connect();
      return;
    }

    setLoading(true);
    try {
      const tx = await deployMemeCoin({
        name,
        symbol,
        totalSupply: BigInt(parseInt(supply) * 1e18),
        platformFeeRecipient: address,
      });
      setResult(`Success! Token: ${tx.tokenAddress} | LP: ${tx.lpAddress}`);
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  const handlePremium = () => {
    // Replace with your real Lemon Squeezy checkout URL after Step 5
    window.open('https://app.lemonsqueezy.com/checkout/YOUR_STORE_ID/YOUR_VARIANT_ID?embed=1', '_blank');
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Token Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 mb-4 bg-gray-700 rounded text-white"
      />
      <input
        type="text"
        placeholder="Symbol (e.g. DOGAI)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="w-full p-3 mb-4 bg-gray-700 rounded text-white"
      />
      <input
        type="number"
        placeholder="Supply (e.g. 1000000)"
        value={supply}
        onChange={(e) => setSupply(e.target.value)}
        className="w-full p-3 mb-6 bg-gray-700 rounded text-white"
      />

      <button
        onClick={handlePremium}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded mb-4"
      >
        $19 — Unlock AI Premium Launch
      </button>

      <button
        onClick={handleLaunch}
        disabled={loading || !name || !symbol || !supply}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 py-3 rounded font-bold"
      >
        {loading ? 'Launching...' : address ? 'LAUNCH ON BASE' : 'CONNECT WALLET'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-gray-900 rounded text-sm">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
