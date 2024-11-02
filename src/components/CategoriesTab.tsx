import { useState, useEffect } from 'react';
import { Loader2, FolderTree } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

function flattenCategories(categories: any): Category[] {
  const flatten = (obj: any): Category[] => {
    const result: Category[] = [];
    Object.entries(obj).forEach(([id, value]: [string, any]) => {
      if (typeof value === 'object') {
        const children = flatten(value);
        result.push({ id, name: id.split('/')?.pop() || id, children });
      } else {
        result.push({ id, name: value });
      }
    });
    return result;
  };
  return flatten(categories);
}

export function CategoriesTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://pytrends-app.onrender.com/api/categories');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.categories) {
        const flattenedCategories = flattenCategories(data.categories);
        setCategories(flattenedCategories);
      } else {
        throw new Error('Invalid categories data received');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(
        err instanceof Error 
          ? `Error: ${err.message}` 
          : 'Failed to fetch categories. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategory = (category: Category, depth = 0) => (
    <div
      key={category.id}
      className="stat-card group hover:border-orange/30 transition-colors"
      style={{ marginLeft: `${depth * 1.5}rem` }}
    >
      <div className="flex items-center gap-3">
        <FolderTree className={`h-5 w-5 ${depth === 0 ? 'text-orange' : 'text-gray-400'} group-hover:text-orange transition-colors`} />
        <div>
          <span className="text-white group-hover:text-orange transition-colors">
            {category.name}
          </span>
          <span className="text-gray-500 text-sm ml-2">({category.id})</span>
        </div>
      </div>
      {category.children && (
        <div className="mt-4 space-y-3">
          {category.children.map(child => renderCategory(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Google Trends Categories</h2>
          <button
            onClick={fetchCategories}
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              'Refresh'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-dark-charcoal border border-red-900 text-red-400 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange" />
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-4">
            {categories.map(category => renderCategory(category))}
          </div>
        ) : (
          !error && (
            <div className="text-center py-12 text-gray-400">
              No categories available.
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default CategoriesTab;