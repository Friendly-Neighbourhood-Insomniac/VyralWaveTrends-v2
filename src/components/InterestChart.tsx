import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#2563eb', '#dc2626', '#16a34a'];

interface InterestChartProps {
  data: {
    date: string;
    [key: string]: number | string;
  }[];
  keywords: string[];
}

export function InterestChart({ data, keywords }: InterestChartProps) {
  if (!data || data.length === 0) return null;

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Interest Trends Comparison</h3>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 35 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
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
                style: { fill: '#9CA3AF' }
              }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1F1F1F',
                border: '1px solid #374151',
                borderRadius: '6px',
                padding: '8px'
              }}
              labelFormatter={formatDate}
              formatter={(value: number) => [`${value}`, 'Interest']}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => <span className="text-gray-300">{value}</span>}
            />
            {keywords.map((keyword, index) => (
              <Line
                key={keyword}
                type="monotone"
                dataKey={keyword}
                name={keyword}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 4 }}
                activeDot={{ 
                  r: 6, 
                  fill: COLORS[index % COLORS.length],
                  className: "pulse-effect"
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm text-gray-400 bg-dark-charcoal p-4 rounded-lg">
        <p>* Values represent search interest relative to the highest point (100) for the given time period.</p>
        <p>* A value of 100 indicates peak popularity for the term.</p>
      </div>
    </div>
  );
}

export default InterestChart;