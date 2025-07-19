// src/components/ManualInput.jsx

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
    onUpdate(target, parseInt(value, 10));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <FaWrench />
        Update Manual
      </h3>
      {/* Perubahan ada di sini: className diubah menjadi flex-col saja */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
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

        <div>
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

        <div>
          <button
            type="submit"
            className="w-full bg-slate-800 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-slate-700 transition-colors mt-2"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualInput;