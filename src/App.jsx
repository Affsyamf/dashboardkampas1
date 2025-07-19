import React, { useState, useEffect } from 'react';
import BrakeCard from './components/BrakeCard';
import HistoryPanel from './components/HistoryPanel';
import ManualInput from './components/ManualInput';
import KetebalanChart from './components/ui/chart';
import { FaCarSide, FaOilCan } from 'react-icons/fa';

const statusInfo = {
  100: { status: 'Optimal', color: '#22c55e' },
  75: { status: 'Perlu Perhatian', color: '#eab308' },
  50: { status: 'Tindakan Segera', color: '#ef4444' },
};

const API_URL = 'http://localhost:3001';

function App() {
  const [data, setData] = useState({ remDepan: 0, remBelakang: 0, oliRem: 0 });
  const [history, setHistory] = useState([]);

  const fetchData = async () => {
    try {
      const [depanRes, belakangRes, oliRes, historyRes] = await Promise.all([
        fetch(`${API_URL}/api/status/rem-depan`),
        fetch(`${API_URL}/api/status/rem-belakang`),
        fetch(`${API_URL}/api/status/oli`),
        fetch(`${API_URL}/api/history`)
      ]);

      const depanData = await depanRes.json();
      const belakangData = await belakangRes.json();
      const oliData = await oliRes.json();
      const historyData = await historyRes.json();

      setData({
        remDepan: depanData.ketebalan,
        remBelakang: belakangData.ketebalan,
        oliRem: oliData.ketebalan,
      });

      const processedHistory = historyData.map(item => ({
        ...item,
        status: statusInfo[item.ketebalan]?.status || 'N/A',
        color: statusInfo[item.ketebalan]?.color || '#808080',
      }));
      setHistory(processedHistory);

    } catch (error) {
      console.error("Gagal mengambil data dari server:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleManualUpdate = async (target, value) => {
    try {
      await fetch(`${API_URL}/api/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, value }),
      });
      // Selalu panggil ulang fetchData sebagai satu-satunya sumber kebenaran
      fetchData();
    } catch (error) {
      console.error("Gagal mengirim update ke server:", error);
    }
  };
  
  const simulateChange = async () => {
    const targets = [
      { key: 'remDepan' },
      { key: 'remBelakang' },
      { key: 'oliRem' }
    ];
    const targetInfo = targets[Math.floor(Math.random() * targets.length)];
    const currentThickness = data[targetInfo.key];

    let nextValue;
    if (currentThickness === 100) nextValue = 75;
    else if (currentThickness === 75) nextValue = 50;
    else nextValue = 100;

    await handleManualUpdate(targetInfo.key, nextValue);
  };

  // --- LOGIKA CHART DIPERBAIKI TOTAL ---
  const chartData = Object.values(
    history
      .slice()
      .reverse()
      .reduce((acc, item) => {
        // Buat key timestamp yang konsisten (misal: "14:51")
        const timeKey = new Date(item.timestamp).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        });

        // Jika waktu ini belum ada di akumulator, buat entri baru
        if (!acc[timeKey]) {
          acc[timeKey] = {
            timestamp: timeKey
          };
        }

        // Tambahkan data ketebalan ke waktu yang sesuai
        acc[timeKey][item.target] = item.ketebalan;

        return acc;
      }, {})
  );

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800 font-sans p-4 sm:p-8">
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
          <BrakeCard title="Rem Depan" thickness={data.remDepan} icon={<FaCarSide />} />
          <BrakeCard title="Rem Belakang" thickness={data.remBelakang} icon={<FaCarSide />} />
          <BrakeCard title="Oli Rem" thickness={data.oliRem} icon={<FaOilCan />} />
        </div>
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="lg:w-2/3">
            <KetebalanChart data={chartData} />
          </div>
          <div className="lg:w-1/3">
            <ManualInput onUpdate={handleManualUpdate} />
          </div>
        </div>
        <div className="mt-8">
          {/* --- PERBAIKAN DI SINI --- */}
          {/* Tambahkan kembali prop onSimulate */}
          <HistoryPanel history={history} onSimulate={simulateChange} />
        </div>
      </main>
    </div>
  );
}

export default App;