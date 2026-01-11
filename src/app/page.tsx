import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-6xl font-bold mb-4 text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-500">
          OpenValoBook
        </h1>
        <p className="text-xl mb-8 text-gray-300 text-center">
          Open-source Valorant strategy planner and sharing platform
        </p>
        
        <div className="flex justify-center mb-12">
          <Link
            href="/editor"
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition text-lg"
          >
            Start Creating
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-6 border border-gray-700 rounded-lg bg-gray-800 hover:border-red-500 transition">
            <h2 className="text-xl font-semibold mb-2 text-white">Strategy Editor</h2>
            <p className="text-sm text-gray-400">
              Create and edit Valorant strategies with an interactive canvas
            </p>
          </div>
          <div className="p-6 border border-gray-700 rounded-lg bg-gray-800 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2 text-white">Share & Discover</h2>
            <p className="text-sm text-gray-400">
              Share your strategies with the community and discover new tactics
            </p>
          </div>
          <div className="p-6 border border-gray-700 rounded-lg bg-gray-800 hover:border-green-500 transition">
            <h2 className="text-xl font-semibold mb-2 text-white">Open Source</h2>
            <p className="text-sm text-gray-400">
              Free forever, built by the community for the community
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
