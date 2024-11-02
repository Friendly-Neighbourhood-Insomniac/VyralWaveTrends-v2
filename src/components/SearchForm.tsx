import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchFormProps {
  onSearch: (keyword: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function SearchForm({ onSearch, isLoading, placeholder = 'Enter a keyword to analyze trends...' }: SearchFormProps) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={placeholder}
            className="input-primary"
            disabled={isLoading}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
        <button
          type="submit"
          disabled={isLoading || !keyword.trim()}
          className="btn-primary"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
    </form>
  );
}