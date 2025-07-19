// src/components/ui/chart.tsx

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'; // <-- Ganti LineChart dengan BarChart, Line dengan Bar

export default function KetebalanChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-96 bg-white rounded-2xl shadow p-4 flex items-center justify-center">
        <p className="text-gray-500">Data history tidak cukup untuk menampilkan grafik.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-white rounded-2xl shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Grafik History Ketebalan</h2>
      <ResponsiveContainer width="100%" height="85%">
        {/* 1. Ganti komponen utama menjadi BarChart */}
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" fontSize={12} tickLine={false} />
          <YAxis unit="%" domain={[0, 100]} fontSize={12} tickLine={false} />
          <Tooltip />
          <Legend />
          {/* 2. Ganti komponen Line menjadi Bar, gunakan 'fill' untuk warna */}
          <Bar dataKey="Rem Depan" fill="#3b82f6" />
          <Bar dataKey="Rem Belakang" fill="#8b5cf6" />
          <Bar dataKey="Oli Rem" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}