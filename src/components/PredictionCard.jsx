// src/components/PredictionCard.jsx

import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const PredictionCard = ({ title, prediction, loading }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 text-center">
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
        Perkiraan Ganti {title}
      </p>
      {loading ? (
        <FaSpinner className="animate-spin text-xl text-slate-500 mx-auto" />
      ) : (
        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
          {prediction}
        </p>
      )}
    </div>
  );
};

export default PredictionCard;