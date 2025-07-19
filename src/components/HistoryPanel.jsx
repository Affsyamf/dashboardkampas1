import React from 'react';
import { FaTools } from 'react-icons/fa';

const HistoryPanel = ({ history, onSimulate }) => {
  const recentHistory = history.slice(0, 5);
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Aktivitas Terakhir</h3>
        <button onClick={onSimulate} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
          <FaTools />
          <span>Simulasi Perubahan</span>
        </button>
      </div>
      <div className="space-y-3">
        {recentHistory.length > 0 ? (
          recentHistory.map((entry, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4" style={{ borderColor: entry.color }}>
              <div>
                <p className="font-semibold text-gray-800">{entry.target}: <span className="font-normal">{entry.status} ({entry.thickness}%)</span></p>
                <p className="text-sm text-gray-500">{entry.timestamp}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">Belum ada aktivitas tercatat.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;