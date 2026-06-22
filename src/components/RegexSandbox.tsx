/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Search, HelpCircle, FileCode } from 'lucide-react';

export default function RegexSandbox() {
  const [testNim, setTestNim] = useState('23011044');
  const [testEmail, setTestEmail] = useState('budi.santoso@student.ac.id');
  const [testPhone, setTestPhone] = useState('081234567890');

  // Exact Regexes used in oopImplementation and backend simulation
  const nimRegex = /^\d{8,12}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|student\.ac\.id)$/;
  const phoneRegex = /^08\d{8,11}$/;

  const isNimValid = nimRegex.test(testNim);
  const isEmailValid = emailRegex.test(testEmail);
  const isPhoneValid = phoneRegex.test(testPhone);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6" id="regex_sandbox_panel">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight" id="regex_title">
          Borang Visual Validasi Input Regex (Regular Expressions)
        </h2>
        <p className="text-sm text-slate-500 mt-1" id="regex_desc">
          Evaluasi interaktif pencocokan substring Regex untuk menjaga integritas database mahasiswa dari kesalahan inputan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="regex_grid">
        {/* Interactive sandboxes (2 columns) */}
        <div className="lg:col-span-2 space-y-4" id="regex_testers">
          {/* NIM Tester */}
          <div className="p-4 bg-slate-50 border border-slate-205 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 block">1. Validasi Format NIM (Nomor Induk Mahasiswa)</span>
              <span className="font-mono text-[9px] bg-sky-150 p-1 text-sky-700 rounded-md font-bold text-[10px]">r&quot;^\d{'{8,12}'}$&quot;</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={testNim}
                onChange={(e) => setTestNim(e.target.value)}
                placeholder="NIM..."
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-medium focus:outline-hidden"
              />
              <div className="shrink-0">
                {isNimValid ? (
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                    <CheckCircle2 size={15} />
                    <span>NIM VALID</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 text-xs font-semibold">
                    <XCircle size={15} />
                    <span>NIM INVALID</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-sans leading-normal">
              <b>Uraian Aturan:</b> Mulai dari awal <code className="bg-slate-100 px-0.5 rounded text-rose-500 font-mono text-[9px]">^</code>, diikuti oleh digit numerik <code className="bg-slate-100 rounded text-rose-500 font-mono text-[9px]">\d</code> sebanyak 8 hingga 12 karakter <code className="bg-slate-100 rounded text-rose-500 font-mono text-[9px]">{'{8,12}'}</code>, dan berakhir pada ujung karakter <code className="bg-slate-100 rounded text-rose-500 font-mono text-[9px]">$</code>.
            </div>
          </div>

          {/* Email Tester */}
          <div className="p-4 bg-slate-50 border border-slate-205 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 block">2. Validasi Format Surat Elektronik (Email)</span>
              <span className="font-mono text-[9px] bg-sky-150 p-1 text-sky-700 rounded-md font-bold text-[10px]">r&quot;^[a-zA-Z0-9._%+-]+@...&quot;</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Email..."
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-medium focus:outline-hidden"
              />
              <div className="shrink-0">
                {isEmailValid ? (
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                    <CheckCircle2 size={15} />
                    <span>EMAIL VALID</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 text-xs font-semibold">
                    <XCircle size={15} />
                    <span>EMAIL INVALID</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-sans leading-normal">
              <b>Uraian Aturan:</b> Mencocokkan prefix alfa-numerik + tanda titik/garis bawah, lambang <code className="bg-slate-100 rounded text-[9px] text-rose-500 font-mono">@</code>, diikuti domain umum atau secara spesifik didedikasikan untuk institusi mahasiswa <code className="bg-slate-100 rounded text-[9px] text-rose-500 font-mono">student.ac.id</code>.
            </div>
          </div>

          {/* Phone Tester */}
          <div className="p-4 bg-slate-50 border border-slate-205 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 block">3. Validasi Format Telepon Seluler (No HP Indonesia)</span>
              <span className="font-mono text-[9px] bg-sky-150 p-1 text-sky-700 rounded-md font-bold text-[10px]">r&quot;^08\d{'{8,11}'}$&quot;</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="08..."
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-medium focus:outline-hidden"
              />
              <div className="shrink-0">
                {isPhoneValid ? (
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                    <CheckCircle2 size={15} />
                    <span>HP VALID</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 text-xs font-semibold">
                    <XCircle size={15} />
                    <span>HP INVALID</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-sans leading-normal">
              <b>Uraian Aturan:</b> Diawali mutlak dengan angka <code className="bg-slate-100 rounded text-[9px] text-rose-500 font-mono">08</code>, dan memverifikasi sisa digit numerik sepanjang 8 hingga 11 digit demi ketepatan format provider telekomunikasi lokal (Indosat, Telkomsel, XL dll).
            </div>
          </div>
        </div>

        {/* Python execution equivalents (1 column) */}
        <div id="regex_python_equivalent">
          <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-4" id="regex_code_card">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
              <FileCode size={16} className="text-yellow-400" />
              Kode Parser Python `re`
            </h3>

            <div className="space-y-4 font-mono text-[11px] leading-relaxed">
              <p className="text-slate-400 text-xs font-sans">
                Gunakan modul pustaka bawaan python <code className="bg-slate-800 text-rose-400 px-1 py-0.5 rounded font-mono text-[10px]">re</code> untuk melakukan pencocokan formula Regex:
              </p>

              <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-yellow-300">
                <span className="text-slate-550 block"># Import modul reg-ex</span>
                <span className="text-purple-400">import</span> re
                <br /><br />
                <span className="text-slate-550 block"># Fungsi validasi NIM</span>
                <span className="text-purple-400">def</span> <span className="text-sky-400">is_nim_valid</span>(nim):
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;pattern = <span className="text-emerald-400">r&quot;^\d{"{8,12}"}$&quot;</span>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> bool(re.match(pattern, nim))
              </div>

              <div className="text-[10px] text-slate-500 font-sans leading-relaxed">
                💡 Memanggil fungsi <code className="font-mono text-white text-[9px] bg-slate-800 px-1 rounded">re.match()</code> akan mengembalikan objek kecocokan (Match Object) jika valid, atau <code className="font-mono text-rose-400 text-[10px]">None</code> jika data tersebut korup/invalid.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
