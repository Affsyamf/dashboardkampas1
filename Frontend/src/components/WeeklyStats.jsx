// src/components/WeeklyStats.jsx

import React, { useState, useEffect } from 'react';
import { FaArrowDown, FaArrowUp, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const StatItem = ({ label, value, icon, color }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${color}/20 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="font-semibold text-gray-800 dark:text-gray-100">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{value}</p>
      </div>
    </div>
  </div>
);

const WeeklyStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/stats');
        const data = await response.json();
        
        // Transformasi data untuk ditambahkan ikon & warna
        const displayData = [
          { ...data.mostFrequent, icon: <FaCheckCircle />, color: 'text-green-500' },
          { ...data.needsReplacement, icon: <FaArrowDown />, color: 'text-red-500' },
          { ...data.bestPerformance, icon: <FaArrowUp />, color: 'text-blue-500' },
        ];
        
        setStats(displayData);
      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
        setStats([]); // Set ke array kosong jika error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 h-full flex justify-center items-center">
        <FaSpinner className="animate-spin text-2xl text-slate-500" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 h-full">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Statistik Mingguan
      </h3>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <StatItem key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default WeeklyStats;