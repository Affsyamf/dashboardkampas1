// src/components/BrakeCard.jsx

import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

const statusConfig = {
  100: {
    label: 'Optimal',
    icon: <FaCheckCircle className="text-xl" />,
    textColor: 'text-green-500',
    barColor: 'bg-green-500',
  },
  75: {
    label: 'Perlu Perhatian',
    icon: <FaExclamationTriangle className="text-xl" />,
    textColor: 'text-yellow-500',
    barColor: 'bg-yellow-500',
  },
  50: {
    label: 'Tindakan Segera',
    icon: <FaExclamationTriangle className="text-xl" />,
    textColor: 'text-red-500',
    barColor: 'bg-red-500',
  },
};

const BrakeCard = ({ title, thickness, icon }) => {
  const currentStatus = statusConfig[thickness] || {
    label: 'Memuat...',
    icon: <FaSpinner className="animate-spin text-xl" />,
    textColor: 'text-gray-400',
    barColor: 'bg-gray-300',
  };

  return (
    // --- PERBAIKAN DI SINI ---
    // Hapus bg-white, dark:bg-slate-800, dll. dan ganti dengan warna tematik
    <div className="relative bg-card text-card-foreground rounded-2xl shadow-lg p-6 border overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="absolute -right-4 -bottom-4 text-gray-100 dark:text-slate-800 text-8xl opacity-20 dark:opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
        {icon}
      </div>
      <div className="relative z-10">
        {/* Hapus text-gray-800 dark:text-gray-100 karena sudah diwarisi dari div utama */}
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-5xl font-bold ${currentStatus.textColor}`}>
            {thickness ? `${thickness}%` : '-'}
          </span>
          <div className={`flex items-center gap-2 font-semibold text-sm px-3 py-1 rounded-full ${currentStatus.textColor} ${currentStatus.barColor}/10`}>
            {currentStatus.icon}
            <span>{currentStatus.label}</span>
          </div>
        </div>
        {/* Progress bar diupdate agar backgroundnya juga tematik */}
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 mt-4">
          <div
            className={`${currentStatus.barColor} h-3 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${thickness}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BrakeCard;