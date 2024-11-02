import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { COUNTRY_CODES } from '../utils/countryData';

interface RegionalBarChartProps {
  data: { [region: string]: number };
  keyword: string;
  country: string;
}

export function RegionalBarChart({ data, keyword, country }: RegionalBarChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(data)
      .map(([code, value]) => ({
        region: COUNTRY_CODES[code.toUpperCase()] || code,
        value: value || 0
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No regional data available for "{keyword}" in {country}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">
        Regional Interest for "{keyword}" in {country}
      </h3>
      
      <div className="h-[600px] w-full">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              stroke="#4B5563"
            />
            <YAxis
              type="category"
              dataKey="region"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              stroke="#4B5563"
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F1F1F',
                border: '1px solid #374151',
                borderRadius: '6px',
                padding: '8px'
              }}
              formatter={(value: number) => [`${value}`, 'Interest']}
            />
            <Bar
              dataKey="value"
              fill="#FF4500"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm text-gray-400 bg-dark-charcoal p-4 rounded-lg">
        <p>* Values represent search interest relative to the highest point (100) for the given region.</p>
        <p>* A value of 100 indicates peak popularity for the term in that region.</p>
        <p>* Only showing top 20 regions with highest interest.</p>
      </div>
    </div>
  );
}