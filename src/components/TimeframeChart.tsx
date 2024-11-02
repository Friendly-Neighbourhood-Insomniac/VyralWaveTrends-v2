import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#2563eb', '#dc2626', '#16a34a'];

interface TimeframeChartProps {
  data: {
    [keyword: string]: {
      date: string;
      value: number;
    }[];
  };
}

export function TimeframeChart({ data }: TimeframeChartProps) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No data available for visualization
      </div>
    );
  }

  const keywords = Object.keys(data);
  if (keywords.length === 0) return null;

  const firstKeyword = keywords[0];
  if (!data[firstKeyword] || !Array.isArray(data[firstKeyword])) return null;

  const chartData = data[firstKeyword].map((point, index) => {
    const dataPoint: { [key: string]: any } = { date: point.date };
    keywords.forEach(keyword => {
      dataPoint[keyword] = data[keyword][index]?.value || 0;
    });
    return dataPoint;
  });

  const formatDate = (date: string) => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return date;
    }
  };

  return (
    <div className="h-[500px] w-full">
      <ResponsiveContainer>
        <LineChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 35 }}
        >
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
            formatter={(value) => (
              <span className="text-sm font-medium text-gray-300">{value}</span>
            )}
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
              activeDot={{ r: 6, fill: COLORS[index % COLORS.length] }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TimeframeChart;