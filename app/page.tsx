import LaunchForm from '@/components/LaunchForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-5xl font-bold mb-4">AI Meme Coin Launchpad</h1>
        <p className="text-xl text-gray-300 mb-8">
          Launch your meme coin in 60 seconds — AI generates, deploys, and adds liquidity.
        </p>
        <LaunchForm />
      </div>
    </main>
  );
}
