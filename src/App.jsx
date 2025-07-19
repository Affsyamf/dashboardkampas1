import React, { useState } from 'react';
import BrakeCard from './components/BrakeCard';
import HistoryPanel from './components/HistoryPanel';
import ManualInput from './components/ManualInput'; // <-- 1. Impor komponen baru
import { FaCarSide, FaOilCan } from 'react-icons/fa';

const statusInfo = {
  100: { status: 'Optimal', color: '#22c55e' },
  75: { status: 'Perlu Perhatian', color: '#eab308' },
  50: { status: 'Tindakan Segera', color: '#ef4444' },
};

function App() {
  const [data, setData] = useState({
    remDepan: 100,
    remBelakang: 75,
    oliRem: 100,
  });

  const [history, setHistory] = useState([]);

  // 2. Buat fungsi untuk menangani update dari input manual
  const handleManualUpdate = (target, value) => {
    // Buat entri riwayat baru
    const newHistoryEntry = {
      target: target === 'remDepan' ? 'Rem Depan' : target === 'remBelakang' ? 'Rem Belakang' : 'Oli Rem',
      thickness: value,
      status: statusInfo[value].status,
      color: statusInfo[value].color,
      timestamp: `(Manual) ${new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}`,
    };

    setHistory([newHistoryEntry, ...history]);

    // Update state utama
    setData(prev => ({
      ...prev,
      [target]: value,
    }));
  };

  const simulateChange = () => {
    const targets = [
      { key: 'remDepan', name: 'Rem Depan' },
      { key: 'remBelakang', name: 'Rem Belakang' },
      { key: 'oliRem', name: 'Oli Rem' },
    ];
    const target = targets[Math.floor(Math.random() * targets.length)];
    const currentThickness = data[target.key];

    let nextValue;
    if (currentThickness === 100) nextValue = 75;
    else if (currentThickness === 75) nextValue = 50;
    else nextValue = 100;

    const newHistoryEntry = {
      target: target.name,
      thickness: nextValue,
      status: statusInfo[nextValue].status,
      color: statusInfo[nextValue].color,
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
    };

    setHistory([newHistoryEntry, ...history]);

    setData(prev => ({
      ...prev,
      [target.key]: nextValue,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans p-4 sm:p-8">
      <main className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
            Dashboard Status Kendaraan
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Monitor kondisi kampas dan oli rem secara real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <BrakeCard title="Kampas Rem Depan" thickness={data.remDepan} icon={<FaCarSide />} />
          <BrakeCard title="Kampas Rem Belakang" thickness={data.remBelakang} icon={<FaCarSide />} />
          <BrakeCard title="Level Oli Rem" thickness={data.oliRem} icon={<FaOilCan />} />
        </div>
        
        {/* 3. Tampilkan komponen ManualInput di sini */}
        <ManualInput onUpdate={handleManualUpdate} />

        <div className="mt-8">
          <HistoryPanel history={history} onSimulate={simulateChange} />
        </div>
      </main>
    </div>
  );
}

export default App;