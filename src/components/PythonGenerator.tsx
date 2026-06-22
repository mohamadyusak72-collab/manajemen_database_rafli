/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PYTHON_SISTEM_MAHASISWA_CODE } from '../pythonCodeTemplates';
import { Copy, Download, Check, FileCode, Clock, Scale } from 'lucide-react';

export default function PythonGenerator() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_SISTEM_MAHASISWA_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([PYTHON_SISTEM_MAHASISWA_CODE], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sistem_informasi_mahasiswa.py";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Complexity stats matrix
  const complexityData = [
    { feature: "Autentikasi Login (Retry)", complexity: "O(1)", desc: "Percobaan dibatasi konstan (maksimal 3 kali)." },
    { feature: "Tambah Mahasiswa (C)", complexity: "O(1)", desc: "Menyisipkan Node ke LinkedList Tail melalui pointer instan." },
    { feature: "Tampilkan Mahasiswa (R)", complexity: "O(N)", desc: "Melintasi seluruh simpul Linked List dari Head ke Tail." },
    { feature: "Edit Data Mahasiswa (U)", complexity: "O(N)", desc: "Mencari NIM secara sequential sebelum melakukan pembaruan setter." },
    { feature: "Hapus Record Mahasiswa (D)", complexity: "O(N)", desc: "Mencari node, lalu mere-link bidireksional pointer tetangga." },
    { feature: "Sequential Search", complexity: "O(N)", desc: "Melintasi array tanpa urutan, mengecek kesamaan satu per satu." },
    { feature: "Binary Search", complexity: "O(log N)", desc: "Mencocokkan pertengahan pada array pasca terurut, efisiensi ekshibit." },
    { feature: "Bubble Sort", complexity: "O(N²)", desc: "Pengurutan berat. Melakukan pertukaran pasangan sebelah menyebelah." },
    { feature: "Selection Sort", complexity: "O(N²)", desc: "Memilih elemen minimal berulang kali lalu menaruh di indeks depan." },
    { feature: "Insertion Sort", complexity: "O(N²)", desc: "Menyisipkan kunci satu per satu ke sub-array kiri yang terurut." },
    { feature: "Merge Sort", complexity: "O(N log N)", desc: "Pembagian rekursif berkualifikasi tinggi (Divide & Conquer)." },
    { feature: "Simpan & Muat File I/O", complexity: "O(N)", desc: "Membaca/menulis array mahasiswa ke media penyimpanan lokal (JSON/CSV)." }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6" id="python_generator_panel">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight" id="py_title">
            Pasca Code Generator &amp; Analisis Kompleksitas
          </h2>
          <p className="text-sm text-slate-500 mt-1" id="py_desc">
            Salin atau unduh kode program Python 100% fungsional yang menggabungkan seluruh materi modul akademik Anda untuk dikumpulkan sebagai tugas modul.
          </p>
        </div>

        <div className="flex gap-2.5 shrink-0" id="generator_buttons">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all cursor-pointer"
            id="btn_copy_code"
          >
            {copied ? <Check size={14} className="text-emerald-500 animate-bounce" /> : <Copy size={14} />}
            <span>{copied ? 'Kode Tersalin!' : 'Salin Kode Sumber'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow-xs transition-all cursor-pointer"
            id="btn_download_file"
          >
            <Download size={14} />
            <span>Unduh File .PY</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8" id="py_generator_grid">
        {/* Code terminal window */}
        <div className="flex flex-col border border-slate-800 rounded-2xl shadow-lg bg-slate-950 text-slate-300 h-96 overflow-hidden" id="py_code_viewer">
          {/* Header */}
          <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-850">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
              <span className="text-[10px] font-mono text-slate-401 ml-2">sistem_informasi_mahasiswa.py</span>
            </div>
            <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">
              PYTHON 3.x
            </span>
          </div>

          {/* Scrolling viewer panel */}
          <div className="p-4 overflow-y-auto font-mono text-[11px] leading-relaxed select-all">
            <pre className="text-left text-slate-300">{PYTHON_SISTEM_MAHASISWA_CODE}</pre>
          </div>
        </div>

        {/* Complexity charts & estimation board */}
        <div className="space-y-6" id="complexity_estimates_board">
          <div className="p-5 border border-slate-150 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Scale size={16} className="text-sky-600" />
              Estimasi Pengukuran Kecepatan (Time Complexity)
            </h3>
            
            <p className="text-xs text-slate-500 leading-normal">
              Sesuai dengan ketentuan kewajiban akademis, berikut adalah analisis estimasi Big-O (Time &amp; Space Complexity) fitur-fitur program Manajemen Data Mahasiswa yang telah diintegrasikan:
            </p>

            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500">
                    <th className="p-2.5">Fitur/Prosedur</th>
                    <th className="p-2.5">Worst-Case</th>
                    <th className="p-2.5">Uraian / Rasionalisasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-105">
                  {complexityData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-2.5 font-semibold text-slate-800">{row.feature}</td>
                      <td className="p-2.5 font-mono font-bold text-sky-600">{row.complexity}</td>
                      <td className="p-2.5 text-slate-500 text-[11px] leading-relaxed">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Space Complexity banner */}
            <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-150 flex gap-2.5 text-emerald-800 text-xs">
              <Clock size={16} className="shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <span className="font-bold text-emerald-900 block mb-0.5">Analisis Space Complexity (Kebutuhan Memori RAM):</span>
                LinkedList dan Array membutuhkan memori linear <span className="font-mono font-bold text-emerald-700">O(N)</span> sepanjang jumlah data terekam. Manipulasi pointer mutlak dikoordinasikan secara in-place sehingga tidak memicu kebocoran memori (Memory Leak) atau overhead berat pada execution stack.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
