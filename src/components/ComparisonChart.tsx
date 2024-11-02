import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ComparisonData } from '../types';

const COLORS = ['#2563eb', '#dc2626', '#16a34a'];

interface ComparisonChartProps {
  data: ComparisonData;
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  if (!data?.timelineData?.length) return null;

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatTooltipValue = (value: number) => `${Math.round(value)} / 100`;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">Search Interest Comparison</h2>
      <div className="h-[500px] w-full">
        <ResponsiveContainer>
          <LineChart data={data.timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 35 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fill: '#666', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fill: '#666', fontSize: 12 }}
              domain={[0, 100]}
              label={{ 
                value: 'Search Interest', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#666', fontSize: 12 }
              }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelFormatter={formatDate}
              formatter={(value: number) => [formatTooltipValue(value), 'Interest']}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => <span className="text-sm font-medium">{value}</span>}
              wrapperStyle={{ paddingBottom: '20px' }}
            />
            {data.keywords.map((keyword, index) => (
              <Line
                key={keyword}
                type="monotone"
                dataKey={keyword}
                name={keyword}
                stroke={COLORS[index]}
                strokeWidth={2.5}
                dot={{ fill: COLORS[index], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 7, fill: COLORS[index] }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <p>* Values represent relative search interest (0-100), where 100 indicates peak popularity for the term during the selected time period.</p>
      </div>
    </div>
  );
}