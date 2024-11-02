import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TimelineDataPoint } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface TrendChartProps {
  data: TimelineDataPoint[];
  keyword: string;
  isLoading?: boolean;
}

export function TrendChart({ data, keyword, isLoading = false }: TrendChartProps) {
  if (isLoading) {
    return (
      <div className="card min-h-[400px] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card min-h-[400px] flex items-center justify-center">
        <p className="text-gray-400">No trend data available</p>
      </div>
    );
  }

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 text-white">Search Interest Over Time: {keyword}</h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
              stroke="#4B5563"
            />
            <YAxis 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              domain={[0, 100]}
              stroke="#4B5563"
              label={{ 
                value: 'Search Interest', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#9CA3AF' }
              }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1F1F1F',
                border: '1px solid #374151',
                borderRadius: '6px',
                padding: '8px',
                color: '#fff'
              }}
              labelFormatter={formatDate}
              formatter={(value: number) => [`${value}`, 'Interest']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#FF4500" 
              strokeWidth={2}
              dot={{ fill: '#FF4500', strokeWidth: 2 }}
              activeDot={{ 
                r: 6, 
                fill: '#FF4500',
                className: "pulse-effect"
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-400">
        <p>* Values represent search interest on a scale of 0-100, where 100 is peak popularity.</p>
      </div>
    </div>
  );
}