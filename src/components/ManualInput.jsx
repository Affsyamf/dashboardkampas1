import React, { useState } from 'react';
import { FaWrench } from 'react-icons/fa';

const ManualInput = ({ onUpdate }) => {
  const [target, setTarget] = useState('remDepan');
  const [value, setValue] = useState(100);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!target || !value) {
      alert('Pilih target dan nilai terlebih dahulu!');
      return;
    }
    // Mengirim data ke komponen App
    onUpdate(target, parseInt(value, 10));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <FaWrench />
        Update Manual
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
        {/* Pilihan Target */}
        <div className="w-full sm:w-1/3">
          <label htmlFor="target" className="block text-sm font-medium text-gray-600 mb-1">
            Target Komponen
          </label>
          <select
            id="target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="remDepan">Rem Depan</option>
            <option value="remBelakang">Rem Belakang</option>
            <option value="oliRem">Oli Rem</option>
          </select>
        </div>

        {/* Pilihan Nilai */}
        <div className="w-full sm:w-1/3">
          <label htmlFor="value" className="block text-sm font-medium text-gray-600 mb-1">
            Set Nilai (%)
          </label>
          <select
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="100">100%</option>
            <option value="75">75%</option>
            <option value="50">50%</option>
          </select>
        </div>

        {/* Tombol Submit */}
        <div className="w-full sm:w-auto pt-2 sm:pt-6">
          <button
            type="submit"
            className="w-full bg-slate-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualInput;