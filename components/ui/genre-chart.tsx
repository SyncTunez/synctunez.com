'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const genreData = [
  { name: 'Pop', value: 40, color: '#0f766e' },
  { name: 'Rock', value: 30, color: '#0d9488' },
  { name: 'Hip Hop', value: 30, color: '#14b8a6' },
];

export function GenreChart() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
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
            >
              {genreData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-3 mt-2 text-xs">
        {genreData.map((genre) => (
          <span key={genre.name} className="flex items-center gap-1">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: genre.color }}
            />
            <span className="text-gray-400">{genre.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
} 