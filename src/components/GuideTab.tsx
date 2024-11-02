import { Info, Search, TrendingUp, AlertCircle } from 'lucide-react';

export function GuideTab() {
  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
        <Info className="h-6 w-6 text-orange" />
        How to Use Vyral-Trends Analyzer
      </h2>

      <div className="space-y-8">
        <section className="stat-card group">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-orange group-hover:text-magenta transition-colors duration-300" />
            <span className="text-white">Searching for Trends</span>
          </h3>
          <ul className="list-disc pl-6 space-y-3 text-gray-300">
            <li className="hover:text-orange transition-colors duration-200">Enter a specific keyword or topic you want to analyze</li>
            <li className="hover:text-orange transition-colors duration-200">Use clear, concise terms for better results</li>
            <li className="hover:text-orange transition-colors duration-200">Avoid very broad or ambiguous terms</li>
          </ul>
        </section>

        <section className="stat-card group">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange group-hover:text-magenta transition-colors duration-300" />
            <span className="text-white">Understanding Results</span>
          </h3>
          <ul className="list-disc pl-6 space-y-3 text-gray-300">
            <li className="hover:text-orange transition-colors duration-200">The timeline shows search interest over time (0-100 scale)</li>
            <li className="hover:text-orange transition-colors duration-200">Related topics show other popular searches</li>
            <li className="hover:text-orange transition-colors duration-200">The dashboard provides key metrics and trends</li>
          </ul>
        </section>

        <section className="stat-card group">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange group-hover:text-magenta transition-colors duration-300" />
            <span className="text-white">Best Practices</span>
          </h3>
          <ul className="list-disc pl-6 space-y-3 text-gray-300">
            <li className="hover:text-orange transition-colors duration-200">Compare multiple related terms for better insights</li>
            <li className="hover:text-orange transition-colors duration-200">Consider seasonal trends in your analysis</li>
            <li className="hover:text-orange transition-colors duration-200">Use the data to identify emerging patterns and opportunities</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default GuideTab;