import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Base } from '@thirdweb-dev/chains';
import { ethers } from 'ethers';

const UNISWAP_ROUTER = '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24'; // Base

export async function deployMemeCoin({
  name,
  symbol,
  totalSupply,
  platformFeeRecipient,
}: {
  name: string;
  symbol: string;
  totalSupply: bigint;
  platformFeeRecipient: string;
}) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const sdk = new ThirdwebSDK(Base, {
    secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY || '',
  });

  const contract = await sdk.deployer.deployToken({
    name,
    symbol,
    initialSupply: totalSupply.toString(),
    primarySaleRecipient: platformFeeRecipient,
  });

  const router = new ethers.Contract(UNISWAP_ROUTER, [
    "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)"
  ], signer);

  await contract.call("approve", [UNISWAP_ROUTER, totalSupply / 10n]);
  await router.addLiquidityETH(
    await contract.getAddress(),
    totalSupply / 10n,
    0, 0,
    platformFeeRecipient,
    Math.floor(Date.now() / 1000) + 300,
    { value: ethers.parseEther("0.1") }
  );

  return {
    tokenAddress: await contract.getAddress(),
    lpAddress: "https://app.uniswap.org/#/swap?chain=base",
  };
}
