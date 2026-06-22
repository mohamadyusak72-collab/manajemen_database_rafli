/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Orang, Mahasiswa, Dosen, ValidationException } from '../oopImplementation';
import { ShieldCheck, BookOpen, User, Sparkles, ArrowRight, XCircle } from 'lucide-react';

interface OopVisualizerProps {
  addLog: (message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR', exceptionClass?: string, traceback?: string) => void;
}

export default function OopVisualizer({ addLog }: OopVisualizerProps) {
  // Encapsulation testers
  const [testNama, setTestNama] = useState('Dian Saputra');
  const [testEmail, setTestEmail] = useState('dian@student.ac.id');
  const [testNim, setTestNim] = useState('23011987');
  const [testIpk, setTestIpk] = useState(3.68);
  const [testPhone, setTestPhone] = useState('081299996666');

  // Error feedback for encapsulation tester
  const [liveError, setLiveError] = useState<string | null>(null);

  // Instantiation of Polymorphism demonstration
  const [polymorphSelected, setPolymorphSelected] = useState<'MHS' | 'DOSEN'>('MHS');

  const getPolymorphicInstance = () => {
    try {
      if (polymorphSelected === 'MHS') {
        return new Mahasiswa(
          'Dian Saputra', 
          'dian@student.ac.id', 
          '23011987', 
          3.68, 
          'Teknik Informatika', 
          2023, 
          '081299996666'
        );
      } else {
        return new Dosen(
          'Dr. Eng. Herianto', 
          'herianto@dosen.ac.id', 
          'NIDN.0412038701', 
          'Bidang AI & Algoritma'
        );
      }
    } catch {
      return null;
    }
  };

  const polymorphicInstance = getPolymorphicInstance();

  // Handle live encapsulation testing
  const handleTestingSetter = (field: string, value: any) => {
    setLiveError(null);
    addLog(`Uji Enkapsulasi: Mengubah ${field} -> ${value}`, 'INFO');
    
    // Attempt constructing Object to see if getters/setters validation allows it
    try {
      let nextNama = testNama;
      let nextEmail = testEmail;
      let nextNim = testNim;
      let nextIpk = testIpk;
      let nextPhone = testPhone;

      if (field === 'nama') nextNama = value;
      if (field === 'email') nextEmail = value;
      if (field === 'nim') nextNim = value;
      if (field === 'ipk') nextIpk = Number(value);
      if (field === 'phone') nextPhone = value;

      // This constructor call triggers setters validation
      const tempMhs = new Mahasiswa(nextNama, nextEmail, nextNim, nextIpk, 'Sains Data', 2023, nextPhone);
      
      // If success, save local states
      if (field === 'nama') setTestNama(value);
      if (field === 'email') setTestEmail(value);
      if (field === 'nim') setTestNim(value);
      if (field === 'ipk') setTestIpk(Number(value));
      if (field === 'phone') setTestPhone(value);

      addLog(`Enkapsulasi Berhasil: Data '${field}' disetujui oleh setter!`, 'SUCCESS');
    } catch (err: any) {
      setLiveError(err.message);
      addLog(`EXCEPTION CATCH: Enkapsulasi memblokir input di setter. Pesan: ${err.message}`, 'ERROR', 'ValidationException');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6" id="oop_laboratory_panel">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight" id="oop_title">
          Laboratorium Visual Konsep OOP
        </h2>
        <p className="text-sm text-slate-500 mt-1" id="oop_desc">
          Pelajari secara interaktif implementasi Enkapsulasi, Pewarisan (Inheritance), dan Polimorfisme.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="oop_grid_sections">
        {/* ENCAPSULATION SEC */}
        <div className="space-y-6 border-r border-slate-100 pr-0 lg:pr-6" id="encapsulation_visualizer">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-slate-800 bg-slate-105 rounded-md uppercase tracking-wider mb-2">
              <ShieldCheck size={14} className="text-slate-500" />
              1. Enkapsulasi (Encapsulation)
            </span>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Enkapsulasi menyembunyikan properti internal (ditandai <code className="bg-slate-100 p-0.5 rounded text-rose-500 font-mono text-[10px]">private/protected</code>) dan mewajibkan akses eksklusif melalui properti <code className="bg-slate-100 p-0.5 rounded text-sky-500 font-mono text-[10px]">get & set</code>. Setter di bawah akan memvalidasi tipe data secara ketat.
            </p>
          </div>

          <div className="bg-slate-50/70 border border-slate-150 p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              Borang Uji Coba Setter Mahasiswa
            </h4>

            <div className="space-y-3.5">
              {/* Test Name */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-600">Nama Lengkap</span>
                  <span className="text-[10px] font-semibold text-slate-400 font-mono">_nama (protected)</span>
                </div>
                <input
                  type="text"
                  value={testNama}
                  onChange={(e) => handleTestingSetter('nama', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-medium focus:outline-hidden"
                />
              </div>

              {/* Test NIM */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-600">NIM (8-12 Digit Angka)</span>
                  <span className="text-[10px] font-semibold text-slate-400 font-mono">_nim (private)</span>
                </div>
                <input
                  type="text"
                  value={testNim}
                  placeholder="23011044"
                  onChange={(e) => handleTestingSetter('nim', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-medium focus:outline-hidden"
                />
              </div>

              {/* Test Email */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-600">Email Instansi (Regex verified)</span>
                  <span className="text-[10px] font-semibold text-slate-400 font-mono">_email (protected)</span>
                </div>
                <input
                  type="text"
                  value={testEmail}
                  onChange={(e) => handleTestingSetter('email', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-medium focus:outline-hidden"
                />
              </div>

              {/* Test IPK */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-600">IPK Aktual: {testIpk.toFixed(2)}</span>
                  <span className="text-[10px] font-semibold text-slate-400 font-mono">_ipk (private)</span>
                </div>
                <input
                  type="range"
                  min="-0.5"
                  max="4.5"
                  step="0.05"
                  value={testIpk}
                  onChange={(e) => handleTestingSetter('ipk', e.target.value)}
                  className="w-full accent-sky-600 h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Invalid (-0.5)</span>
                  <span>IPK Valid (0.00 s/d 4.00)</span>
                  <span>Invalid (4.5)</span>
                </div>
              </div>
            </div>

            {/* Setter live feedback */}
            {liveError ? (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs flex gap-2 items-start" id="live_error_card">
                <XCircle size={15} className="shrink-0 mt-0.5 text-red-500 animate-pulse" />
                <div>
                  <span className="font-bold block">ValidationException Ditangkap:</span>
                  {liveError}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs flex gap-2 items-start" id="live_success_card">
                <ShieldCheck size={15} className="shrink-0 mt-0.5 text-emerald-500" />
                <div>
                  <span className="font-semibold block text-emerald-800">Status Enkapsulasi: AMAN</span>
                  Mutasi variabel disetujui seluruhnya oleh controller.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* INHERITANCE + POLYMORPHISM SEC */}
        <div className="space-y-6" id="inheritance_polymorphism_visualizer">
          {/* PEWARISAN */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-slate-800 bg-slate-105 rounded-md uppercase tracking-wider mb-2">
              <BookOpen size={14} className="text-slate-500" />
              2. Pewarisan &amp; Polimorfisme
            </span>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              <strong>Pewarisan (Inheritance):</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-500 text-[10px]">Mahasiswa</code> mewarisi bidang umum <code className="bg-slate-100 px-1 py-0.5 text-[10px] text-indigo-500 font-mono">nama</code> dan <code className="bg-slate-100 px-1 text-[10px] py-0.5 font-mono text-indigo-500">email</code> dari kelas induk <code className="bg-slate-100 px-1 rounded text-neutral-500 font-mono text-[10px]">Orang</code>. 
              <br className="mt-1" />
              <strong>Polimorfisme (Polymorphism):</strong> Kedua kelas menimpa (override) fungsi <code className="bg-slate-100 px-1 text-[10px] font-mono text-rose-500">getSummary()</code> untuk memancarkan deskripsi khas masing-masing secara berlainan ketika dieksekusi secara universal!
            </p>
          </div>

          {/* Interactive Polymorphic selector */}
          <div className="p-5 border border-slate-150 rounded-2xl bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Skema Pewarisan Memori Kelas
              </span>
              <div className="flex gap-1.5 bg-white p-1 border border-slate-205 rounded-lg">
                <button
                  onClick={() => setPolymorphSelected('MHS')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    polymorphSelected === 'MHS' ? 'bg-sky-600 text-white' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Mahasiswa
                </button>
                <button
                  onClick={() => setPolymorphSelected('DOSEN')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    polymorphSelected === 'DOSEN' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Dosen
                </button>
              </div>
            </div>

            {/* Tree architecture */}
            <div className="flex flex-col items-center gap-3 py-2 font-mono text-[11px]" id="class_diagram_tree">
              {/* Parent Class Block */}
              <div className="w-56 p-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 text-center shadow-xs">
                <div className="font-bold text-[10px] text-slate-401 tracking-widest uppercase">SUPERCLASS</div>
                <div className="font-bold text-xs">class Orang</div>
                <div className="text-[9px] text-slate-400 mt-1 border-t border-slate-700 pt-1">
                  properti: nama, email
                </div>
              </div>

              {/* Inherit arrow */}
              <div className="flex flex-col items-center leading-none">
                <div className="h-4 w-0.5 bg-slate-300"></div>
                <div className="text-xs text-slate-400 font-sans">&Delta; [extends]</div>
                <div className="h-4 w-0.5 bg-slate-300"></div>
              </div>

              {/* Child Class Block */}
              <div className={`w-64 p-3 rounded-lg text-center shadow-xs transition-colors border ${
                polymorphSelected === 'MHS' 
                  ? 'bg-sky-50 text-sky-900 border-sky-200' 
                  : 'bg-indigo-50 text-indigo-900 border-indigo-200'
              }`}>
                <div className="font-bold text-[9px] text-slate-500 tracking-widest uppercase">DERIVED SUBCLASS</div>
                <div className="font-bold text-xs">
                  {polymorphSelected === 'MHS' ? 'class Mahasiswa(Orang)' : 'class Dosen(Orang)'}
                </div>
                <div className="text-[9px] text-slate-500 mt-1 border-t border-slate-200 pt-1">
                  {polymorphSelected === 'MHS' 
                    ? 'warisan + nim, ipk, prodi, angkatan, phone' 
                    : 'warisan + nidn, keahlian'}
                </div>
              </div>
            </div>

            {/* Polymorphic Output Box */}
            <div className="bg-slate-900 text-slate-350 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                EVALUASI OUTPUT POLIMORFISME SECARA REAL-TIME
              </div>

              <div className="text-white text-xs leading-relaxed">
                <span className="text-emerald-400 font-bold">objek</span> = <b className="text-purple-400">{polymorphSelected === 'MHS' ? 'Mahasiswa' : 'Dosen'}</b>(...)
                <br />
                <span className="text-emerald-400 font-bold">hasil</span> = objek.<b>getSummary()</b>
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-850 rounded text-slate-100 text-xs">
                {polymorphicInstance ? polymorphicInstance.getSummary() : 'Object instantiation failed.'}
              </div>

              <div className="text-[10px] text-slate-500 leading-normal font-sans">
                💡 Perhatikan bahwa fungsi pemanggilan eksternal tetap sama (<code className="font-mono text-white">getSummary()</code>), namun mengembalikan teks yang bervariasi sesuai instansiasi objek dasarnya!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
