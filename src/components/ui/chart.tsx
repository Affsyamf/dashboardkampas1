// src/components/ui/chart.tsx

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// 1. Definisikan tipe data untuk props komponen
interface KetebalanChartProps {
  data: {
    timestamp: string;
    "Rem Depan"?: number;     // Tanda '?' berarti properti ini opsional
    "Rem Belakang"?: number;  // Tanda '?' berarti properti ini opsional
    "Oli Rem"?: number;       // Tanda '?' berarti properti ini opsional
  }[];
}

// 2. Terapkan tipe tersebut ke props
export default function KetebalanChart({ data }: KetebalanChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-96 bg-white dark:bg-slate-800 rounded-2xl shadow p-4 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Data history tidak cukup untuk menampilkan grafik.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Grafik History Ketebalan</h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="timestamp" fontSize={12} tickLine={false} stroke="#94a3b8" />
          <YAxis unit="%" domain={[0, 100]} fontSize={12} tickLine={false} stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              borderRadius: '0.5rem' 
            }}
          />
          <Legend />
          <Bar dataKey="Rem Depan" fill="#3b82f6" />
          <Bar dataKey="Rem Belakang" fill="#8b5cf6" />
          <Bar dataKey="Oli Rem" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}