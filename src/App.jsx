// src/App.jsx

import React, { useState, useEffect } from 'react'; // 1. Impor useEffect
import BrakeCard from './components/BrakeCard';
import HistoryPanel from './components/HistoryPanel';
import ManualInput from './components/ManualInput';
import { FaCarSide, FaOilCan } from 'react-icons/fa';

const statusInfo = {
  100: { status: 'Optimal', color: '#22c55e' },
  75: { status: 'Perlu Perhatian', color: '#eab308' },
  50: { status: 'Tindakan Segera', color: '#ef4444' },
};

// URL ke backend Anda
const API_URL = 'http://localhost:3001';

function App() {
  const [data, setData] = useState({ /* ... */ });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data dari semua endpoint secara paralel, termasuk history
        const [depanRes, belakangRes, oliRes, historyRes] = await Promise.all([
          fetch(`${API_URL}/api/status/rem-depan`),
          fetch(`${API_URL}/api/status/rem-belakang`),
          fetch(`${API_URL}/api/status/oli`),
          fetch(`${API_URL}/api/history`) // <-- Panggil endpoint history
        ]);

        const depanData = await depanRes.json();
        const belakangData = await belakangRes.json();
        const oliData = await oliRes.json();
        const historyData = await historyRes.json(); // <-- Dapatkan data history

        // Update state status
        setData({
          remDepan: depanData.ketebalan,
          remBelakang: belakangData.ketebalan,
          oliRem: oliData.ketebalan,
        });

        // Proses dan update state history
        // Kita perlu menambahkan 'status' dan 'color' berdasarkan 'ketebalan'
        const processedHistory = historyData.map(item => ({
          ...item,
          status: statusInfo[item.ketebalan]?.status || 'N/A',
          color: statusInfo[item.ketebalan]?.color || '#808080',
          timestamp: new Date(item.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
        }));
        setHistory(processedHistory);

      } catch (error) {
        console.error("Gagal mengambil data dari server:", error);
      }
    };

    fetchData();
  }, []); // <-- Array kosong berarti efek ini hanya berjalan sekali

  // Fungsi ini perlu diupdate untuk mengirim data ke backend juga
  const handleManualUpdate = async (target, value) => {
    try {
      // Kirim data ke backend untuk disimpan
      await fetch(`${API_URL}/api/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ target, value }),
      });

      // Update UI secara langsung setelah berhasil
      setData(prev => ({ ...prev, [target]: value }));

      // Tambahkan ke history di UI (idealnya history juga dikelola backend)
      const newHistoryEntry = {
        target: target === 'remDepan' ? 'Rem Depan' : target === 'remBelakang' ? 'Rem Belakang' : 'Oli Rem',
        thickness: value,
        status: statusInfo[value].status,
        color: statusInfo[value].color,
        timestamp: `(Manual) ${new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}`,
      };
      setHistory([newHistoryEntry, ...history]);

    } catch (error) {
      console.error("Gagal mengirim update ke server:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans p-4 sm:p-8">
      <main className="max-w-7xl mx-auto">
        {/* ... sisa kode JSX tidak berubah ... */}
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
        <ManualInput onUpdate={handleManualUpdate} />
        <div className="mt-8">
          <HistoryPanel history={history} onSimulate={() => {}} /> {/* Simulasi bisa dimatikan dulu */}
        </div>
      </main>
    </div>
  );
}

export default App;