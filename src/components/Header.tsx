import { TrendingUp } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-dark-charcoal border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <TrendingUp className="h-8 w-8 text-orange animate-pulse" />
            <div className="absolute inset-0 h-8 w-8 bg-orange/20 rounded-full animate-pulse-slow"></div>
          </div>
          <h1 className="text-2xl font-bold text-white">Vyral-Trends Analyzer</h1>
        </div>
        <p className="mt-2 text-gray-400">Analyze search trends and discover related topics</p>
      </div>
    </header>
  );
}

export default Header;