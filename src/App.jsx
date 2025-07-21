import React, { useState, useEffect } from 'react';
import BrakeCard from './components/BrakeCard';
import HistoryPanel from './components/HistoryPanel';
import ManualInput from './components/ManualInput';
import WeeklyStats from './components/WeeklyStats';
import KetebalanChart from './components/ui/chart';
import PredictionCard from './components/PredictionCard';
import { FaCarSide, FaOilCan } from 'react-icons/fa';
import { ModeToggle } from './components/ModeToggle';

const statusInfo = {
  100: { status: 'Optimal', color: '#22c55e' },
  75: { status: 'Perlu Perhatian', color: '#eab308' },
  50: { status: 'Tindakan Segera', color: '#ef4444' },
};

const API_URL = 'http://localhost:3001';

function App() {
  const [data, setData] = useState({ remDepan: 0, remBelakang: 0, oliRem: 0 });
  const [history, setHistory] = useState([]);
  const [predictions, setPredictions] = useState({
    'rem-depan': '',
    'rem-belakang': '',
    'oli-rem': '',
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Set loading true di awal fetch
      setLoading(true);
      const [
        depanRes, belakangRes, oliRes, historyRes,
        predDepanRes, predBelakangRes, predOliRes
      ] = await Promise.all([
        fetch(`${API_URL}/api/status/rem-depan`),
        fetch(`${API_URL}/api/status/rem-belakang`),
        fetch(`${API_URL}/api/status/oli`),
        fetch(`${API_URL}/api/history`),
        fetch(`${API_URL}/api/prediction/rem-depan`),
        fetch(`${API_URL}/api/prediction/rem-belakang`),
        fetch(`${API_URL}/api/prediction/oli-rem`),
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

      const predDepanData = await predDepanRes.json();
      const predBelakangData = await predBelakangRes.json();
      const predOliData = await predOliRes.json();

      setPredictions({
        'rem-depan': predDepanData.prediction,
        'rem-belakang': predBelakangData.prediction,
        'oli-rem': predOliData.prediction,
      });

    } catch (error) {
      console.error("Gagal mengambil data dari server:", error);
    } finally {
      // Set loading false setelah semua fetch selesai
      setLoading(false);
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

  const chartData = Object.values(
    history
      .slice()
      .reverse()
      .reduce((acc, item) => {
        const timeKey = new Date(item.timestamp).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        });
        if (!acc[timeKey]) {
          acc[timeKey] = { timestamp: timeKey };
        }
        acc[timeKey][item.target] = item.ketebalan;
        return acc;
      }, {})
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground font-sans p-4 sm:p-8 transition-colors duration-300">
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-start mb-10">
          <div className='text-left'>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Dashboard Status Kendaraan
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Monitor kondisi kampas dan oli rem secara real-time.
            </p>
          </div>
          <ModeToggle />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-4">
          <BrakeCard title="Rem Depan" thickness={data.remDepan} icon={<FaCarSide />} />
          <BrakeCard title="Rem Belakang" thickness={data.remBelakang} icon={<FaCarSide />} />
          <BrakeCard title="Oli Rem" thickness={data.oliRem} icon={<FaOilCan />} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <PredictionCard title="Rem Depan" prediction={predictions['rem-depan']} loading={loading} />
          <PredictionCard title="Rem Belakang" prediction={predictions['rem-belakang']} loading={loading} />
          <PredictionCard title="Oli Rem" prediction={predictions['oli-rem']} loading={loading} />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="lg:w-2/3">
            <KetebalanChart data={chartData} />
          </div>
          <div className="lg:w-1/3">
            <WeeklyStats />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <HistoryPanel history={history} onSimulate={simulateChange} />
          </div>
          <div className="lg:w-1/3">
            <ManualInput onUpdate={handleManualUpdate} />
          </div>
        </div>
        
      </main>
    </div>
  );
}

export default App;