// src/components/BrakeCard.jsx

import React from 'react';
// 1. Tambahkan FaSpinner untuk ikon loading
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
  // 2. INI PERBAIKANNYA:
  // Jika thickness tidak ada di statusConfig (misal: 0 atau null),
  // kita berikan objek default untuk loading state.
  const currentStatus = statusConfig[thickness] || {
    label: 'Memuat...',
    icon: <FaSpinner className="animate-spin text-xl" />,
    textColor: 'text-gray-400',
    barColor: 'bg-gray-300',
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-200/80 overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="absolute -right-4 -bottom-4 text-gray-100 text-8xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
        {icon}
      </div>
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-5xl font-bold ${currentStatus.textColor}`}>
            {/* Tampilkan tanda strip jika nilai masih 0 */}
            {thickness ? `${thickness}%` : '-'}
          </span>
          <div className={`flex items-center gap-2 font-semibold text-sm px-3 py-1 rounded-full ${currentStatus.textColor} ${currentStatus.barColor}/10`}>
            {currentStatus.icon}
            <span>{currentStatus.label}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
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