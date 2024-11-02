import { TrendingUp } from 'lucide-react';
import type { RelatedTopic } from '../types';

interface TrendingTopicsProps {
  topics: RelatedTopic[];
}

export default function TrendingTopics({ topics }: TrendingTopicsProps) {
  if (!topics || topics.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Related Topics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic, index) => (
          <div 
            key={`${topic.title}-${index}`} 
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-800">{topic.title}</span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${topic.value}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Relevance Score: {topic.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}