/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { StudentData, EmailLog, ExecutionLog } from './types';
import StudentTable from './components/StudentTable';
import AlgorithmSandbox from './components/AlgorithmSandbox';
import OopVisualizer from './components/OopVisualizer';
import PointerVisualizer from './components/PointerVisualizer';
import EmailSimulator from './components/EmailSimulator';
import RegexSandbox from './components/RegexSandbox';
import PythonGenerator from './components/PythonGenerator';
import QueueStackVisualizer from './components/QueueStackVisualizer';

import { 
  User, Lock, AlertCircle, RefreshCw, LogOut, Database, Cpu, 
  ShieldCheck, Share2, Award, Terminal, Trash2, Mail, CheckCircle, Layers 
} from 'lucide-react';

const DEFAULT_STUDENTS: StudentData[] = [
  {
    id: "23011032",
    nim: "23011032",
    nama: "Adrian Wijaya",
    email: "adrian@student.ac.id",
    ipk: 3.82,
    prodi: "Teknik Informatika",
    angkatan: 2023,
    phone: "081234567890"
  },
  {
    id: "23011044",
    nim: "23011044",
    nama: "Siti Rahma",
    email: "siti@student.ac.id",
    ipk: 3.71,
    prodi: "Sistem Informasi",
    angkatan: 2023,
    phone: "081345678911"
  },
  {
    id: "22011123",
    nim: "22011123",
    nama: "Budi Santoso",
    email: "budi.s@student.ac.id",
    ipk: 2.95,
    prodi: "Teknik Elektro",
    angkatan: 2022,
    phone: "081987654321"
  },
  {
    id: "24011005",
    nim: "24011005",
    nama: "Putri Amelia",
    email: "putri.a@student.ac.id",
    ipk: 3.45,
    prodi: "Teknik Komputer",
    angkatan: 2024,
    phone: "082143658709"
  },
  {
    id: "21011089",
    nim: "21011089",
    nama: "Rian Pratama",
    email: "rian.pratama@gmail.com",
    ipk: 3.12,
    prodi: "Teknik Informatika",
    angkatan: 2021,
    phone: "085298761234"
  }
];

export default function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('mahasiswa123');
  const [loginAttemptsLeft, setLoginAttemptsLeft] = useState(3);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLockedOut, setIsLockedOut] = useState(false);

  // Database persistent states (File I/O Simulation)
  const [students, setStudents] = useState<StudentData[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [executeLogs, setExecuteLogs] = useState<ExecutionLog[]>([]);

  // Active workspace tab
  const [activeTab, setActiveTab] = useState<'DATABASE' | 'ALGORITHMS' | 'OOP' | 'POINTERS' | 'QUEUE_STACK' | 'EMAIL' | 'REGEX' | 'PYTHON'>('DATABASE');

  // Ref to automatically scroll terminal console log
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Load database from localStorage on startup (Simulating File IO)
  useEffect(() => {
    try {
      const persistedStuds = localStorage.getItem('manajemen_mhs_data');
      if (persistedStuds) {
        setStudents(JSON.parse(persistedStuds));
      } else {
        setStudents(DEFAULT_STUDENTS);
        localStorage.setItem('manajemen_mhs_data', JSON.stringify(DEFAULT_STUDENTS));
      }

      // Prepopulate system logs
      addExecuteLog("Sistem Informasi Akademik initialized.", "INFO");
      addExecuteLog("Simulasi Database File I/O: Berhasil memuat berkas lokal 'mahasiswa.dat'.", "SUCCESS");
    } catch {
      setStudents(DEFAULT_STUDENTS);
    }
  }, []);

  // Sync to local storage on record updates
  const syncWithDisk = (updatedList: StudentData[]) => {
    setStudents(updatedList);
    localStorage.setItem('manajemen_mhs_data', JSON.stringify(updatedList));
  };

  // Scroll console to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [executeLogs]);

  // Unified logging framework simulating dry-run Exceptions
  const addExecuteLog = (
    message: string, 
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR',
    exceptionClass?: string,
    traceback?: string
  ) => {
    const timestamp = new Date().toISOString();
    const newLog: ExecutionLog = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp,
      message,
      type,
      exceptionClass,
      traceback
    };
    setExecuteLogs(prev => [...prev, newLog]);
  };

  // Handle Authentication with strict retry countdown
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    addLogEvent(`Percobaan login username: '${username}'...`, 'INFO');

    if (isLockedOut) {
      setLoginError("Sistem terkunci! Hubungi administrator akademik untuk menyetel ulang kunci.");
      return;
    }

    if (username === 'admin' && password === 'mahasiswa123') {
      setIsAuthenticated(true);
      setLoginError(null);
      addExecuteLog("Otentikasi berhasil. Admin diberikan akses manipulasi data.", "SUCCESS");
    } else {
      const nextAttempts = loginAttemptsLeft - 1;
      setLoginAttemptsLeft(nextAttempts);
      addExecuteLog(`Kesalahan Otentikasi: Username/Sandi salah. Sisa upaya: ${nextAttempts}x`, "ERROR", "UnauthorizedAccessException");

      if (nextAttempts <= 0) {
        setIsLockedOut(true);
        setLoginError("Security Lockout: Upaya otentikasi habis! Akses ditolak sepenuhnya.");
      } else {
        setLoginError(`Kredensial salah! Akun Anda akan terkunci dalam ${nextAttempts} kali kesalahan lagi.`);
      }
    }
  };

  // Reset login lockout for preview demonstration convenience
  const handleResetLockout = () => {
    setLoginAttemptsLeft(3);
    setIsLockedOut(false);
    setLoginError(null);
    addExecuteLog("Sistem keamanan disetel ulang: Upaya login didefinisikan ke 3x.", "WARNING");
  };

  // CRUD handlers
  const handleAddStudent = (newData: StudentData) => {
    const updated = [...students, newData];
    syncWithDisk(updated);
  };

  const handleUpdateStudent = (id: string, updatedData: StudentData) => {
    const updated = students.map(s => s.id === id ? updatedData : s);
    syncWithDisk(updated);
  };

  const handleDeleteStudent = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    syncWithDisk(updated);
  };

  // Real-time Email Dispatch Simulation
  const handleTriggerEmailNotification = (recipient: string, type: 'WELCOME' | 'UPDATE' | 'OTP', customData: any = {}) => {
    let subject = '';
    let content = '';
    let code: string | undefined;

    if (type === 'WELCOME') {
      subject = 'Selamat Datang di Portal Akademik';
      content = `Halo ${customData.nama || 'Mahasiswa'}, Akun akademik Anda dengan NIM ${customData.nim || 'Nir-daftar'} telah terbit. Silakan masuk memakai kredensial awal. No HP: ${customData.phone || '-'}`;
    } else if (type === 'UPDATE') {
      subject = 'Pembaruan Informasi Profil Akademik';
      content = `Yth. ${customData.nama || 'Mahasiswa'}, Kami mengonfirmasi bahwa terdapat perubahan informasi profil Anda pada pangkalan data mahasiswa.`;
    } else if (type === 'OTP') {
      subject = 'Kode OTP Verifikasi Keamanan';
      const genCode = Math.floor(100000 + Math.random() * 900000).toString();
      code = genCode;
      content = `Kode verifikasi keamanan OTP Anda untuk autentikasi adalah: ${genCode}. Harap jangan menyebarkan kode ini.`;
    }

    const email: EmailLog = {
      id: "MSG-" + Math.floor(Math.random() * 100000).toString().padStart(5, '0'),
      recipient,
      subject,
      content,
      timestamp: new Date().toISOString(),
      type,
      status: 'DELIVERED',
      verificationCode: code
    };

    setEmailLogs(prev => [email, ...prev]);
    addExecuteLog(`Kirim email [${type}] sukses ke: ${recipient}.`, 'SUCCESS');
  };

  // Manual OTP trigger inside email tab
  const handleManualEmailTrigger = (email: string) => {
    // Find matching student
    const student = students.find(s => s.email === email);
    handleTriggerEmailNotification(email, 'OTP', { nama: student?.nama || 'Pengguna' });
  };

  // Clear Terminal execution stack
  const clearTerminalLogs = () => {
    setExecuteLogs([]);
  };

  // Safe wrapper logging for simple components
  const addLogEvent = (msg: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR', exp?: string, trace?: string) => {
    addExecuteLog(msg, type, exp, trace);
  };

  // Mathematical Analytics helpers
  const averageGPA = students.length > 0 
    ? (students.reduce((acc, s) => acc + s.ipk, 0) / students.length).toFixed(2) 
    : "0.00";

  const numErrors = executeLogs.filter(l => l.type === 'ERROR').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-sky-100 selection:text-sky-900" id="master_app_wrapper">
      
      {/* 1. Header Branded Banner */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-35" id="app_header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between" id="header_container">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm tracking-widest shadow-sm">
              MD
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-805 tracking-tight leading-none">
                Manajemen Data Mahasiswa
              </h1>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-1 inline-block">
                Portal Akademik &amp; Analisis Lab Visual
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  <span>Sesi Admin Aktif</span>
                </div>

                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    addExecuteLog("Sesi admin ditutup secara manual.", "WARNING");
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-bold rounded-lg border border-slate-150 transition-all cursor-pointer"
                  id="btn_logout"
                >
                  <LogOut size={13} />
                  Keluar Sesi
                </button>
              </>
            ) : (
              <span className="text-[11px] text-slate-450 font-bold font-mono">AUTHENTICATION REQUIRED</span>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Content Block */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {!isAuthenticated ? (
          /* ==============================================================================
             A. AUTHENTICATION LOGIN VIEW GORGEOUS CARD
             ============================================================================== */
          <div className="max-w-md mx-auto my-12" id="login_screen_container">
            <div className="bg-white rounded-3xl border border-slate-150 shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-6 text-white text-center relative">
                <div className="absolute top-3 right-3 bg-rose-500/10 text-rose-300 font-mono text-[10px] px-1.5 py-0.5 rounded border border-rose-505 font-bold uppercase">
                  SECURITY LOCKOUT
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-3 shadow-inner">
                  🔐
                </div>
                <h2 className="text-lg font-black tracking-tight leading-none">Portal Secure Gateway</h2>
                <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Log masuk dengan kredensial modul Anda untuk mengelola basis data.</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 block">Username</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <User size={13} />
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Contoh: admin"
                      disabled={isLockedOut}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-450 focus:bg-white disabled:opacity-40"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 block">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Lock size={13} />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLockedOut}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-450 focus:bg-white disabled:opacity-40"
                      required
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-705 rounded-xl text-[11px] flex items-start gap-2 leading-relaxed" id="login_error_alert">
                    <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-500 animate-pulse" />
                    <div>
                      <span className="font-bold block text-red-800">Gagal Masuk:</span>
                      {loginError}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLockedOut}
                  className="w-full py-2.5 bg-slate-805 hover:bg-slate-900 text-white font-extrabold text-xs tracking-wide rounded-xl shadow-md transition-all cursor-pointer flex justify-center items-center gap-1.5 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  Otentikasi Klien
                </button>

                {isLockedOut && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={handleResetLockout}
                      className="text-xs text-sky-600 hover:text-sky-700 underline font-bold transition-all cursor-pointer"
                      id="btn_reset_lockout"
                    >
                      Setel Ulang Upaya Pemblokiran (Buka Kunci Demo)
                    </button>
                  </div>
                )}
              </form>

              {/* Informative credentials foot */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-[10px] text-slate-400 space-y-1 font-mono text-center">
                <div>KREDENSIAL DEFAULT DUMMY :</div>
                <div>Username: <b className="text-slate-600">admin</b> | Kata Sandi: <b className="text-slate-600">mahasiswa123</b></div>
              </div>
            </div>
          </div>
        ) : (
          /* ==============================================================================
             B. MAIN LOGGED-IN SYSTEM GATEWAY INTERACTIVE DASHBOARD
             ============================================================================== */
          <div className="space-y-6" id="dashboard_panel">
            
            {/* Academic stats cards ticker section */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="academic_stats_dashboard">
              
              {/* Stat Total Student */}
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Terekam di File</span>
                  <div className="text-2xl font-black text-slate-850 tracking-tight mt-0.5">{students.length} Orang</div>
                  <span className="text-[9px] text-sky-500 font-bold font-mono">Memory Locked</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">
                  <Database size={18} />
                </div>
              </div>

              {/* Stat rata-rata IPK */}
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Rasio IPK Rata-Rata</span>
                  <div className="text-2xl font-black text-slate-850 tracking-tight mt-0.5">{averageGPA}</div>
                  <span className="text-[9px] text-emerald-500 font-bold">Standard Kurva</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-650 font-bold text-lg">
                  <Award size={18} className="text-amber-500" />
                </div>
              </div>

              {/* Stat email log size */}
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">SMTP Dispatched</span>
                  <div className="text-2xl font-black text-slate-850 tracking-tight mt-0.5">{emailLogs.length} MIME</div>
                  <span className="text-[9px] text-sky-500 font-bold font-mono">&le; 250 OK Queue</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-650 font-bold text-lg">
                  <Mail size={18} />
                </div>
              </div>

              {/* Stat log errors count representing Try-Except validation */}
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Try-Catch Exceptions</span>
                  <div className="text-2xl font-black text-slate-850 tracking-tight mt-0.5">{numErrors} Catches</div>
                  <span className="text-[9px] text-red-500 font-bold">Try-Except Validated</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-105 flex items-center justify-center text-rose-500 font-bold text-lg">
                  <Cpu size={18} />
                </div>
              </div>
            </section>

            {/* Navigation Tabs bar */}
            <div className="bg-white border border-slate-150 p-2 rounded-2xl flex flex-wrap gap-1.5" id="navigation_tabs_bar">
              {[
                { id: 'DATABASE', label: 'Borang & Tabel CRUD', icon: Database },
                { id: 'ALGORITHMS', label: 'Sandbox Algoritma', icon: Cpu },
                { id: 'QUEUE_STACK', label: 'Queue & Stack', icon: Layers },
                { id: 'OOP', label: 'Simulasi OOP', icon: ShieldCheck },
                { id: 'POINTERS', label: 'Alokasi Pointers', icon: Share2 },
                { id: 'EMAIL', label: 'Kirim Email Real-time', icon: Mail },
                { id: 'REGEX', label: 'Validasi Regex', icon: ShieldCheck },
                { id: 'PYTHON', label: 'Pasca Code Generator', icon: Terminal }
              ].map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => {
                    setActiveTab(tb.id as any);
                    addExecuteLog(`Membuka tab modul akademik: ${tb.label}`, 'INFO');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === tb.id 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-850'
                  }`}
                >
                  <tb.icon size={13} />
                  <span>{tb.label}</span>
                </button>
              ))}
            </div>

            {/* Active view layout routing */}
            <div className="min-h-96" id="active_workspace_canvas">
              {activeTab === 'DATABASE' && (
                <StudentTable
                  students={students}
                  onAddStudent={handleAddStudent}
                  onUpdateStudent={handleUpdateStudent}
                  onDeleteStudent={handleDeleteStudent}
                  onTriggerEmail={(recipient, type, data) => handleTriggerEmailNotification(recipient, type, data)}
                  addLog={addLogEvent}
                />
              )}

              {activeTab === 'ALGORITHMS' && (
                <AlgorithmSandbox
                  students={students}
                  addLog={addLogEvent}
                />
              )}

              {activeTab === 'OOP' && (
                <OopVisualizer
                  addLog={addLogEvent}
                />
              )}

              {activeTab === 'POINTERS' && (
                <PointerVisualizer
                  students={students}
                  addLog={addLogEvent}
                />
              )}

              {activeTab === 'QUEUE_STACK' && (
                <QueueStackVisualizer
                  students={students}
                  addLog={addLogEvent}
                />
              )}

              {activeTab === 'EMAIL' && (
                <EmailSimulator
                  students={students}
                  emailLogs={emailLogs}
                  onTriggerOTP={handleManualEmailTrigger}
                  addLog={addLogEvent}
                />
              )}

              {activeTab === 'REGEX' && (
                <RegexSandbox />
              )}

              {activeTab === 'PYTHON' && (
                <PythonGenerator />
              )}
            </div>

            {/* 3. Terminal Logger console panel */}
            <section className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden mt-6" id="app_terminal_console">
              {/* Terminal Title Header */}
              <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-850 text-slate-400">
                <span className="text-[10px] font-mono tracking-wider font-extrabold flex items-center gap-1.5">
                  <Terminal size={12} className="text-emerald-400 animate-pulse" />
                  SISTEM TERMINAL CONSOLE &amp; EXCEPTIONS REPORT
                </span>
                <button
                  onClick={clearTerminalLogs}
                  className="text-[9px] font-mono hover:text-rose-400 transition-all font-bold cursor-pointer border border-slate-800 hover:border-rose-900 bg-slate-950 px-1.5 py-0.5 rounded"
                >
                  Bersihkan Log
                </button>
              </div>

              {/* Scrolling Log rows container */}
              <div className="p-4 h-48 overflow-y-auto font-mono text-[10px] space-y-1.5" id="terminal_logs_box">
                {executeLogs.length === 0 ? (
                  <div className="text-slate-600 text-center py-12 italic">Konsol bersih. Mengonfirmasi tidak ada kesalahan dryrun terdeteksi.</div>
                ) : (
                  executeLogs.map((log) => {
                    const isError = log.type === 'ERROR';
                    const isSuccess = log.type === 'SUCCESS';
                    const isWarning = log.type === 'WARNING';

                    return (
                      <div key={log.id} className="text-left border-b border-slate-900/40 pb-1">
                        <div className="flex items-start gap-1">
                          <span className="text-slate-500 font-semibold shrink-0">
                            [{log.timestamp.split('T')[1]?.substring(0, 8) || '10:30'}]
                          </span>
                          
                          <span className={`px-1 rounded text-[8px] font-black shrink-0 ${
                            isError ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                            isSuccess ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            isWarning ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          }`}>
                            {log.type}
                          </span>

                          <span className={`ml-1 font-medium ${
                            isError ? 'text-red-400' :
                            isSuccess ? 'text-emerald-450' :
                            isWarning ? 'text-amber-400 font-bold animate-pulse' : 'text-slate-300'
                          }`}>
                            {log.message}
                          </span>
                        </div>

                        {/* If Exception has specialized Traceback, print it like terminal output */}
                        {log.traceback && (
                          <div className="pl-6 pt-1 text-rose-500/90 whitespace-pre-wrap leading-tight bg-red-950/20 p-2 rounded-lg border border-red-900/30 mt-1 max-w-2xl font-mono text-[9px]">
                            {log.traceback}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={terminalEndRef} />
              </div>
            </section>

          </div>
        )}

      </main>

      {/* 3. Footer branding */}
      <footer className="bg-white border-t border-slate-100 py-4 text-center text-xs text-slate-400 font-medium" id="app_footer">
        <div className="max-w-7xl mx-auto px-4">
          Sistem Informasi Manajemen Data Mahasiswa &bull; Laboratorium Visual Materi Algoritma &amp; OOP &bull; &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
