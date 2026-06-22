/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentData } from '../types';
import { 
  ArrowRight, ArrowUp, Zap, HelpCircle, Cpu, RefreshCw, Plus, Trash2, ShieldCheck, Layers, Play 
} from 'lucide-react';

interface QueueStackVisualizerProps {
  students: StudentData[];
  addLog: (message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => void;
}

interface ActionStackItem {
  id: string;
  action: string;
  studentName: string;
  timestamp: string;
}

export default function QueueStackVisualizer({ students, addLog }: QueueStackVisualizerProps) {
  // Mode selection: Queue vs Stack
  const [mode, setMode] = useState<'QUEUE' | 'STACK'>('QUEUE');

  // Queue state (First-In, First-Out)
  const [queue, setQueue] = useState<StudentData[]>([
    students[0] || { id: "1", nim: "23011032", nama: "Adrian Wijaya", email: "adrian@student.ac.id", ipk: 3.82, prodi: "Teknik Informatika", angkatan: 2023, phone: "081234567890" },
    students[1] || { id: "2", nim: "23011044", nama: "Siti Rahma", email: "siti@student.ac.id", ipk: 3.71, prodi: "Sistem Informasi", angkatan: 2023, phone: "081345678911" }
  ]);
  const [selectedQueueStudent, setSelectedQueueStudent] = useState<string>(students[2]?.id || '');

  // Stack state (Last-In, First-Out)
  const [stack, setStack] = useState<ActionStackItem[]>([
    { id: "S1", action: "TAMBAH_DATA", studentName: "Adrian Wijaya", timestamp: "10:15:32" },
    { id: "S2", action: "SUNTING_IPK", studentName: "Siti Rahma", timestamp: "10:20:45" }
  ]);
  const [stackActionName, setStackActionName] = useState<string>('SUNTING_PROFIL');
  const [selectedStackStudent, setSelectedStackStudent] = useState<string>(students[0]?.id || '');

  // ----------------------------------------------------
  // QUEUE OPERATIONS
  // ----------------------------------------------------
  const handleEnqueue = () => {
    const student = students.find(s => s.id === selectedQueueStudent);
    if (!student) {
      addLog("Gagal melakukan Enqueue: Silakan pilih mahasiswa terlebih dahulu.", "ERROR");
      return;
    }
    
    // Check if copy is already in queue (optional, let's allow multiples or warn)
    setQueue(prev => [...prev, student]);
    addLog(`Enqueue: Menambahkan '${student.nama}' ke ujung antrean (REAR). Queue size: ${queue.length + 1}`, 'SUCCESS');
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      addLog("Gagal melakukan Dequeue: Antrean kosong (Underflow)!", "ERROR");
      return;
    }

    const removed = queue[0];
    setQueue(prev => prev.slice(1));
    addLog(`Dequeue: Melayani mahasiswa '${removed.nama}' di posisi terdepan (FRONT). Antrean menyusut: ${queue.length - 1} tersisa.`, 'SUCCESS');
  };

  const handleClearQueue = () => {
    setQueue([]);
    addLog("Antrean registrasi berhasil dikosongkan.", "WARNING");
  };

  // ----------------------------------------------------
  // STACK OPERATIONS
  // ----------------------------------------------------
  const handlePush = () => {
    const student = students.find(s => s.id === selectedStackStudent);
    const studentName = student ? student.nama : "Tanpa Nama";
    const timestamp = new Date().toTimeString().split(' ')[0];
    const newItem: ActionStackItem = {
      id: "STK-" + Math.floor(Math.random() * 10000),
      action: stackActionName,
      studentName,
      timestamp
    };

    setStack(prev => [newItem, ...prev]); // Push on TOP (index 0)
    addLog(`Push: Menumpuk aksi '${stackActionName}' (${studentName}) ke posisi teratas (TOP) Stack.`, 'SUCCESS');
  };

  const handlePop = () => {
    if (stack.length === 0) {
      addLog("Gagal melakukan Pop: Stack kosong (Underflow)!", "ERROR");
      return;
    }

    const removed = stack[0];
    setStack(prev => prev.slice(1));
    addLog(`Pop: Membatalkan/mengambil aksi teratas '${removed.action}' (${removed.studentName}) dari Stack.`, 'SUCCESS');
  };

  const handleClearStack = () => {
    setStack([]);
    addLog("Tumpukan aksi (Stack) berhasil dikosongkan.", "WARNING");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6" id="queue_stack_panel">
      
      {/* Panel Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight" id="qs_title">
            Visualisasi Struktur Data Queue &amp; Stack
          </h2>
          <p className="text-sm text-slate-500 mt-1" id="qs_desc">
            Laboratorium interaktif untuk mengasimilasi logika struktur data Antrean (First-In, First-Out) dan Tumpukan (Last-In, First-Out).
          </p>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 self-start md:self-center" id="qs_mode_selector">
          <button
            onClick={() => setMode('QUEUE')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'QUEUE' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            Antrean (FIFO Queue)
          </button>
          <button
            onClick={() => setMode('STACK')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'STACK' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            Tumpukan (LIFO Stack)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="qs_grid">
        
        {/* Left Control Column (1 col) */}
        <div className="lg:col-span-1 space-y-6" id="qs_controls">
          
          {mode === 'QUEUE' ? (
            /* Queue controller board */
            <div className="p-5 border border-slate-150 rounded-2xl space-y-4 bg-slate-50/50">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Cpu size={16} className="text-sky-600" />
                Operasi Antrean (Queue)
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pilih Mahasiswa</label>
                  <select
                    value={selectedQueueStudent}
                    onChange={(e) => setSelectedQueueStudent(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 bg-white border border-slate-205 rounded-lg focus:outline-hidden text-slate-700"
                  >
                    <option value="">-- Pilih Mahasiswa --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.nama} ({s.nim})</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={handleEnqueue}
                    className="flex justify-center items-center gap-1 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    Enqueue (Rear)
                  </button>

                  <button
                    onClick={handleDequeue}
                    className="flex justify-center items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs"
                  >
                    <Play size={14} />
                    Dequeue (Front)
                  </button>
                </div>

                <button
                  onClick={handleClearQueue}
                  className="w-full flex justify-center items-center gap-1.5 py-1.5 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-600 font-bold text-[11px] rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 size={13} />
                  Kosongkan Antrean
                </button>
              </div>

              <div className="pt-3 border-t border-slate-150 space-y-2 text-[11px] text-slate-500 leading-normal">
                <span className="font-bold text-slate-700 block">Karakteristik Queue:</span>
                <ul className="list-disc pl-4 space-y-1 text-[10px]">
                  <li>Berlaku prinsip <b className="text-sky-600 font-mono">First In First Out (FIFO)</b>.</li>
                  <li>Elemen dimasukkan dari belakang (REAR) dan dikeluarkan dari depan (FRONT).</li>
                  <li>Sangat cocok untuk simulasi registrasi loket atau antrean verifikasi server SMTP.</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Stack controller board */
            <div className="p-5 border border-slate-150 rounded-2xl space-y-4 bg-slate-50/50">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Layers size={16} className="text-purple-600" />
                Operasi Tumpukan (Stack)
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jenis Aksi (Transaction)</label>
                  <select
                    value={stackActionName}
                    onChange={(e) => setStackActionName(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 bg-white border border-slate-205 rounded-lg focus:outline-hidden text-slate-700 font-mono"
                  >
                    <option value="SUNTING_PROFIL">SUNTING_PROFIL</option>
                    <option value="TAMBAH_DATA">TAMBAH_DATA</option>
                    <option value="HAPUS_RECORD">HAPUS_RECORD</option>
                    <option value="UPDATE_IPK">UPDATE_IPK</option>
                    <option value="KIRIM_EMAIL">KIRIM_EMAIL</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sasaran Mahasiswa</label>
                  <select
                    value={selectedStackStudent}
                    onChange={(e) => setSelectedStackStudent(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 bg-white border border-slate-205 rounded-lg focus:outline-hidden text-slate-700"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.nama}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePush}
                    className="flex justify-center items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs"
                  >
                    <Plus size={14} />
                    Push (Top)
                  </button>

                  <button
                    onClick={handlePop}
                    className="flex justify-center items-center gap-1 px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs"
                  >
                    <Trash2 size={14} />
                    Pop (Top)
                  </button>
                </div>

                <button
                  onClick={handleClearStack}
                  className="w-full flex justify-center items-center gap-1.5 py-1.5 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-600 font-bold text-[11px] rounded-lg transition-all cursor-pointer"
                >
                  <RefreshCw size={13} />
                  Kosongkan Stack
                </button>
              </div>

              <div className="pt-3 border-t border-slate-150 space-y-2 text-[11px] text-slate-500 leading-normal">
                <span className="font-bold text-slate-700 block">Karakteristik Stack:</span>
                <ul className="list-disc pl-4 space-y-1 text-[10px]">
                  <li>Berlaku prinsip <b className="text-purple-600 font-mono">Last In First Out (LIFO)</b>.</li>
                  <li>Operasi tambah (Push) dan ambil (Pop) hanya dapat dilakukan dari satu pintu atas (TOP).</li>
                  <li>Lazim diimplementasikan untuk fungsi Undo/Redo editor serta parsing struktur pohon biner.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Right Interactive Visualization Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6" id="qs_visualizer_arena">
          
          <div className="p-5 border border-slate-150 rounded-2xl min-h-[300px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-600 block uppercase tracking-wide">
                {mode === 'QUEUE' ? 'Interactive Queue Stage (FIFO)' : 'Interactive Stack Tower (LIFO)'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Size: {mode === 'QUEUE' ? queue.length : stack.length}
              </span>
            </div>

            {/* Visualization Arena */}
            <div className="flex-1 flex items-center justify-center py-4 bg-slate-50/50 rounded-xl border border-slate-100/55 p-4 overflow-x-auto min-h-[180px]">
              {mode === 'QUEUE' ? (
                /* FIFO Queue rendering */
                queue.length === 0 ? (
                  <div className="text-center text-slate-400 text-xs italic">
                    Antrean kosong. Silakan lakukan Enqueue mahasiswa dari panel kiri.
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-6">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-extrabold text-emerald-600 tracking-widest uppercase mb-1 flex items-center gap-0.5 font-mono">
                        <ArrowUp size={10} /> FRONT
                      </span>
                      <div className="w-8 h-8 rounded-full border border-dashed border-emerald-300 flex items-center justify-center text-emerald-500 bg-emerald-50 text-[10px] font-bold">
                        Out
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <ArrowRight size={14} className="text-slate-400 animate-pulse shrink-0" />
                      
                      {queue.map((student, idx) => {
                        const isFront = idx === 0;
                        const isRear = idx === queue.length - 1;

                        return (
                          <div key={idx} className="flex items-center gap-1.5 shrink-0">
                            <div className={`p-3 rounded-xl border transition-all duration-300 transform hover:scale-105 flex flex-col items-center min-w-[100px] shadow-xs ${
                              isFront ? 'bg-emerald-50 border-emerald-250 ring-2 ring-emerald-500/20' :
                              isRear ? 'bg-sky-50 border-sky-250 ring-2 ring-sky-500/20' :
                              'bg-white border-slate-200'
                            }`}>
                              <span className="text-[9px] font-mono text-slate-400 text-center font-bold">
                                Indeks [{idx}]
                              </span>
                              <span className="text-xs font-bold text-slate-800 tracking-tight text-center mt-1 truncate max-w-[85px]">
                                {student.nama}
                              </span>
                              <span className="text-[9px] bg-slate-100 px-1 py-0.5 rounded text-slate-500 font-mono mt-1 text-center font-bold">
                                {student.nim}
                              </span>
                            </div>
                            
                            {!isRear && (
                              <ArrowRight size={14} className="text-slate-400 shrink-0" />
                            )}
                          </div>
                        );
                      })}

                      <ArrowRight size={14} className="text-slate-400 animate-pulse shrink-0" />
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-extrabold text-sky-600 tracking-widest uppercase mb-1 flex items-center gap-0.5 font-mono">
                        <ArrowUp size={10} /> REAR
                      </span>
                      <div className="w-8 h-8 rounded-full border border-dashed border-sky-300 flex items-center justify-center text-sky-505 bg-sky-50 text-[10px] font-bold">
                        In
                      </div>
                    </div>
                  </div>
                )
              ) : (
                /* LIFO Stack representation (as a vertical tower) */
                stack.length === 0 ? (
                  <div className="text-center text-slate-400 text-xs italic">
                    Tumpukan aksi kosong. Silakan lakukan Push aksi dari panel kiri.
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full max-w-sm space-y-1.5 py-4">
                    {stack.map((item, idx) => {
                      const isTop = idx === 0;

                      return (
                        <div 
                          key={item.id}
                          className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 transform hover:scale-[1.01] shadow-xs relative ${
                            isTop 
                              ? 'bg-purple-50 border-purple-250 ring-2 ring-purple-500/20 text-purple-900' 
                              : 'bg-white border-slate-150 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isTop && (
                              <span className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] font-black text-purple-600 font-mono tracking-widest uppercase animate-bounce">
                                TOP <ArrowRight size={10} />
                              </span>
                            )}
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1 py-0.5 rounded font-mono">
                              [{idx}]
                            </span>
                            <div>
                              <span className="text-xs font-mono font-bold block">{item.action}</span>
                              <span className="text-[10px] text-slate-400 font-medium">Sasaran: {item.studentName}</span>
                            </div>
                          </div>

                          <span className="text-[9px] text-slate-400 font-mono font-semibold shrink-0">
                            {item.timestamp}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>

            {/* Bottom dynamic informational logs */}
            <div className="mt-4 p-3.5 bg-slate-900 text-slate-300 rounded-xl space-y-2 text-[10px] font-mono leading-relaxed">
              <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
                <ShieldCheck size={12} />
                <span>TRACE EXECUTION CONSOLE :</span>
              </div>
              {mode === 'QUEUE' ? (
                <div>
                  queue = <span className="text-emerald-400">[{queue.map(q => `"${q.nim}"`).join(', ')}]</span>
                  <br />
                  front_ptr = <span className="text-sky-305">{queue.length > 0 ? `0 /* ${queue[0].nama} */` : 'None'}</span>
                  <br />
                  rear_ptr = <span className="text-sky-305">{queue.length > 0 ? `${queue.length - 1} /* ${queue[queue.length - 1].nama} */` : 'None'}</span>
                </div>
              ) : (
                <div>
                  stack = <span className="text-purple-400">[{stack.map(s => `"${s.action}"`).join(', ')}]</span>
                  <br />
                  top_ptr = <span className="text-pink-305">{stack.length > 0 ? `0 /* ${stack[0].action} */` : '-1 (Underflow)'}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
