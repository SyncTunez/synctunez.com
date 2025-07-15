'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GenreData {
  name: string;
  value: number;
  color: string;
}

const genreData: GenreData[] = [
  { name: 'Pop', value: 40, color: '#0f766e' },
  { name: 'Rock', value: 30, color: '#0d9488' },
  { name: 'Hip Hop', value: 30, color: '#14b8a6' },
];

const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, name, payload } = props;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={payload.color}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-sm font-medium opacity-0 animate-[fadeIn_0.5s_ease-in_forwards]"
    >
      {name}
    </text>
  );
};

export default function GenreChart() {
  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={genreData}
            cx="50%"
            cy="50%"
            innerRadius={20}
            outerRadius={35}
            paddingAngle={2}
            dataKey="value"
            label={renderCustomizedLabel}
            labelLine={false}
            animationDuration={600}
          >
            {genreData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 