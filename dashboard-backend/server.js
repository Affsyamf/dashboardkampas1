import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise'; // <-- Hapus / di akhir baris

// 2. Inisialisasi aplikasi Express
const app = express();
const PORT = 3001; // Kita akan menjalankan backend di port 3001

// 3. Gunakan Middleware
app.use(cors()); // Mengizinkan akses dari origin (domain/port) lain
app.use(express.json()); // Memungkinkan server membaca body request dalam format JSON

// 4. Konfigurasi Koneksi Database
// Ganti nilai di bawah ini dengan informasi database Anda sendiri!
const dbPool = mysql.createPool({
  host: 'localhost',         // atau alamat IP server database Anda
  user: 'root',              // username database Anda
  password: '',          // password database Anda
  database: 'dashboardkampas1' // nama database Anda
});

// 5. Buat Endpoint API
// Endpoint untuk mendapatkan status terakhir kampas rem depan
app.get('/api/status/rem-depan', async (req, res) => {
  try {
    const sql = "SELECT ketebalan, timestamp FROM kampas_rem_depan ORDER BY timestamp DESC LIMIT 1";
    const [rows] = await dbPool.query(sql);
    
    if (rows.length > 0) {
      res.json(rows[0]); // Kirim data pertama (yang terbaru) sebagai response
    } else {
      res.status(404).json({ message: 'Data tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error saat mengambil data rem depan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// Endpoint untuk mendapatkan status terakhir kampas rem belakang
app.get('/api/status/rem-belakang', async (req, res) => {
  try {
    const sql = "SELECT ketebalan, timestamp FROM kampas_rem_belakang ORDER BY timestamp DESC LIMIT 1";
    const [rows] = await dbPool.query(sql);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Data tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error saat mengambil data rem belakang:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// Endpoint untuk mendapatkan status terakhir level oli
app.get('/api/status/oli', async (req, res) => {
  try {
    const sql = "SELECT ketebalan, timestamp FROM level_oli ORDER BY timestamp DESC LIMIT 1";
    const [rows] = await dbPool.query(sql);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Data tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error saat mengambil data oli:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// Endpoint untuk MENERIMA data update dari frontend
app.post('/api/update', async (req, res) => {
  try {
    const { target, value } = req.body; // Ambil data dari body request

    let tableName;
    switch (target) {
      case 'remDepan':
        tableName = 'kampas_rem_depan';
        break;
      case 'remBelakang':
        tableName = 'kampas_rem_belakang';
        break;
      case 'oliRem':
        tableName = 'level_oli';
        break;
      default:
        return res.status(400).json({ message: 'Target tidak valid' });
    }

    const sql = `INSERT INTO ?? (ketebalan) VALUES (?)`; // ?? dan ? untuk keamanan
    await dbPool.query(sql, [tableName, value]);

    res.status(201).json({ message: 'Data berhasil disimpan' });

  } catch (error) {
    console.error('Error saat menyimpan data:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// Endpoint untuk MENGAMBIL history aktivitas terakhir
app.get('/api/history', async (req, res) => {
  try {
    // Query ini menggabungkan data dari 3 tabel, memberi label pada masing-masing,
    // mengurutkannya dari yang terbaru, dan membatasinya hanya 10 entri terakhir.
    const sql = `
      (SELECT 'Rem Depan' as target, ketebalan, timestamp FROM kampas_rem_depan)
      UNION ALL
      (SELECT 'Rem Belakang' as target, ketebalan, timestamp FROM kampas_rem_belakang)
      UNION ALL
      (SELECT 'Oli Rem' as target, ketebalan, timestamp FROM level_oli)
      ORDER BY timestamp DESC
      LIMIT 10
    `;
    const [rows] = await dbPool.query(sql);
    res.json(rows); // Kirim array berisi history

  } catch (error) {
    console.error('Error saat mengambil history:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// Endpoint untuk MENGHITUNG statistik
app.get('/api/stats', async (req, res) => {
  try {
    // 1. Ambil semua data dari 7 hari terakhir
    const sql = `
      (SELECT 'Rem Depan' as target, ketebalan FROM kampas_rem_depan WHERE timestamp >= NOW() - INTERVAL 7 DAY)
      UNION ALL
      (SELECT 'Rem Belakang' as target, ketebalan FROM kampas_rem_belakang WHERE timestamp >= NOW() - INTERVAL 7 DAY)
      UNION ALL
      (SELECT 'Oli Rem' as target, ketebalan FROM level_oli WHERE timestamp >= NOW() - INTERVAL 7 DAY)
    `;
    const [rows] = await dbPool.query(sql);

    if (rows.length === 0) {
      return res.json({
        mostFrequent: { label: 'Kondisi Paling Sering', value: 'Data Kosong' },
        needsReplacement: { label: 'Penggantian Diperlukan', value: 'Data Kosong' },
        bestPerformance: { label: 'Performa Terbaik', value: 'Data Kosong' },
      });
    }

    // 2. Proses data untuk dihitung
    const conditionCounts = { 'Optimal': 0, 'Perlu Perhatian': 0, 'Bahaya': 0 };
    const componentTotals = {};
    const componentCounts = {};

    rows.forEach(row => {
      // Hitung kondisi paling sering
      if (row.ketebalan === 100) conditionCounts['Optimal']++;
      else if (row.ketebalan === 75) conditionCounts['Perlu Perhatian']++;
      else if (row.ketebalan === 50) conditionCounts['Bahaya']++;

      // Akumulasi data untuk rata-rata performa
      if (!componentTotals[row.target]) {
        componentTotals[row.target] = 0;
        componentCounts[row.target] = 0;
      }
      componentTotals[row.target] += row.ketebalan;
      componentCounts[row.target]++;
    });

    // Cari kondisi paling sering
    const mostFrequentCondition = Object.keys(conditionCounts).reduce((a, b) => conditionCounts[a] > conditionCounts[b] ? a : b);

    // Hitung rata-rata dan cari performa terbaik & terburuk
    const averages = {};
    for (const target in componentTotals) {
      averages[target] = componentTotals[target] / componentCounts[target];
    }
    
    const sortedByPerf = Object.keys(averages).sort((a, b) => averages[a] - averages[b]);
    const needsReplacementComponent = sortedByPerf[0] || 'N/A';
    const bestPerformanceComponent = sortedByPerf[sortedByPerf.length - 1] || 'N/A';

    // 3. Kirim hasil statistik
    res.json({
      mostFrequent: { label: 'Kondisi Paling Sering', value: mostFrequentCondition },
      needsReplacement: { label: 'Penggantian Diperlukan', value: needsReplacementComponent },
      bestPerformance: { label: 'Performa Terbaik', value: bestPerformanceComponent },
    });

  } catch (error) {
    console.error('Error saat menghitung statistik:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// Endpoint untuk PREDIKSI PENGGANTIAN
app.get('/api/prediction/:componentName', async (req, res) => {
  const { componentName } = req.params;

  let tableName;
  switch (componentName) {
    case 'rem-depan':
      tableName = 'kampas_rem_depan';
      break;
    case 'rem-belakang':
      tableName = 'kampas_rem_belakang';
      break;
    case 'oli-rem':
      tableName = 'level_oli';
      break;
    default:
      return res.status(400).json({ message: 'Nama komponen tidak valid' });
  }

  try {
    const sql = `SELECT ketebalan, timestamp FROM ?? ORDER BY timestamp ASC`;
    const [rows] = await dbPool.query(sql, [tableName]);

    if (rows.length < 2) {
      return res.json({ prediction: 'Data tidak cukup untuk prediksi' });
    }

    // Ambil data terbaru dan terlama
    const latestReading = rows[rows.length - 1];
    const firstReading = rows[0];

    // Hitung selisih waktu dalam hari
    const timeDiff = new Date(latestReading.timestamp) - new Date(firstReading.timestamp);
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    // Hitung total keausan
    const wearDiff = firstReading.ketebalan - latestReading.ketebalan;

    // Jika tidak ada perbedaan hari atau tidak ada keausan, anggap stabil
    if (daysDiff < 1 || wearDiff <= 0) {
      return res.json({ prediction: 'Kondisi Stabil' });
    }

    // Hitung laju keausan per hari
    const dailyWearRate = wearDiff / daysDiff;

    // Hitung sisa ketebalan sebelum mencapai batas bahaya (50%)
    const remainingWear = latestReading.ketebalan - 50;
    if (remainingWear <= 0) {
      return res.json({ prediction: 'Segera Ganti!' });
    }

    // Hitung sisa hari
    const daysLeft = Math.floor(remainingWear / dailyWearRate);

    // Hitung tanggal prediksi
    const predictionDate = new Date();
    predictionDate.setDate(predictionDate.getDate() + daysLeft);
    const formattedDate = predictionDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    res.json({ prediction: `~ ${formattedDate}` });

  } catch (error) {
    console.error(`Error saat prediksi ${componentName}:`, error);
    res.status(500).json({ message: 'Gagal membuat prediksi' });
  }
});

// 6. Jalankan Server
app.listen(PORT, () => {
  console.log(`🚀 Server backend berjalan di http://localhost:${PORT}`);
});