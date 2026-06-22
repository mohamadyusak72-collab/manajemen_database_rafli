/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentData, ExecutionLog } from '../types';
import { Mahasiswa, ValidationException, DuplicateNIMException } from '../oopImplementation';
import { 
  Plus, Edit2, Trash2, Download, Upload, AlertCircle, RefreshCw, FileCode, CheckCircle 
} from 'lucide-react';

interface StudentTableProps {
  students: StudentData[];
  onAddStudent: (student: StudentData) => void;
  onUpdateStudent: (id: string, updated: StudentData) => void;
  onDeleteStudent: (id: string) => void;
  onTriggerEmail: (recipient: string, type: 'WELCOME' | 'UPDATE', data: any) => void;
  addLog: (message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR', exceptionClass?: string, traceback?: string) => void;
}

export default function StudentTable({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onTriggerEmail,
  addLog
}: StudentTableProps) {
  // Toggle states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [ipk, setIpk] = useState('');
  const [prodi, setProdi] = useState('Teknik Informatika');
  const [angkatan, setAngkatan] = useState('2023');
  const [phone, setPhone] = useState('');

  // Search/Filter states inside grid
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('ALL');

  // Local validation error message
  const [validationError, setValidationError] = useState<string | null>(null);

  // List of Study Programs
  const prodis = [
    'Teknik Informatika',
    'Sistem Informasi',
    'Teknik Elektro',
    'Teknik Komputer',
    'Sains Data',
    'Teknik Industri'
  ];

  // Handle Form Submission with full Try-Except simulation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    addLog(`Mengeksekusi 'try' block: Validasi pendaftaran mahasiswa NIM ${nim || '?'}.`, 'INFO');

    try {
      // 1. Validate duplicates (if it is a new student)
      if (!editingId) {
        const duplicate = students.find(s => s.nim === nim);
        if (duplicate) {
          throw new DuplicateNIMException(`NIM '${nim}' sudah terdaftar di sistem database.`);
        }
      } else {
        const duplicate = students.find(s => s.nim === nim && s.id !== editingId);
        if (duplicate) {
          throw new DuplicateNIMException(`NIM '${nim}' sudah dimiliki oleh mahasiswa lain.`);
        }
      }

      // 2. Instantiate OOP Student Object to trigger setters validation
      const parsedIPK = parseFloat(ipk);
      const parsedAngkatan = parseInt(angkatan);

      if (isNaN(parsedIPK)) {
        throw new ValidationException('Nilai IPK harus diisi berupa angka desimal.');
      }
      if (isNaN(parsedAngkatan)) {
        throw new ValidationException('Tahun angkatan harus diisi berupa angka bulat.');
      }

      const mhs = new Mahasiswa(nama, email, nim, parsedIPK, prodi, parsedAngkatan, phone);
      const newObj = mhs.toObject();

      if (editingId) {
        onUpdateStudent(editingId, newObj);
        addLog(`Pembaruan profil sukses! ${mhs.nama} [NIM: ${mhs.nim}] tersimpan ke File.`, 'SUCCESS');
        onTriggerEmail(email, 'UPDATE', { nama: mhs.nama });
        setEditingId(null);
      } else {
        onAddStudent(newObj);
        addLog(`Mahasiswa baru berhasil ditambahkan! ${mhs.nama} [NIM: ${mhs.nim}] dengan IPK ${mhs.ipk}.`, 'SUCCESS');
        // Dispatch Welcome Email
        onTriggerEmail(email, 'WELCOME', { nama: mhs.nama, nim: mhs.nim });
      }

      // Clear forms
      resetForm();
      setIsAddOpen(false);

    } catch (err: any) {
      const isCustomException = err instanceof ValidationException || err instanceof DuplicateNIMException;
      const exceptionClassName = isCustomException ? err.constructor.name : 'UnknownSystemError';
      
      const debugTraceback = `File "oop_engine.py", line 47, in setter
    raise ${exceptionClassName}("${err.message}")
${exceptionClassName}: ${err.message}`;

      setValidationError(err.message);
      addLog(
        `EXCEPTION CATCH: Gagal menyimpan data mahasiswa. Alasan: ${err.message}`, 
        'ERROR', 
        exceptionClassName, 
        debugTraceback
      );
    }
  };

  const startEdit = (student: StudentData) => {
    setEditingId(student.id);
    setNama(student.nama);
    setNim(student.nim);
    setEmail(student.email);
    setIpk(student.ipk.toString());
    setProdi(student.prodi);
    setAngkatan(student.angkatan.toString());
    setPhone(student.phone);
    setIsAddOpen(true);
    setValidationError(null);
    addLog(`Mulai edit data mahasiswa: NIM ${student.nim}`, 'INFO');
  };

  const handleDelete = (student: StudentData) => {
    onDeleteStudent(student.id);
    addLog(`Mahasiswa ${student.nama} (NIM: ${student.nim}) berhasil dihapus dari basis data.`, 'SUCCESS');
  };

  const resetForm = () => {
    setEditingId(null);
    setNama('');
    setNim('');
    setEmail('');
    setIpk('');
    setProdi('Teknik Informatika');
    setAngkatan('2023');
    setPhone('');
    setValidationError(null);
  };

  // Import JSON configuration
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          addLog("Mencoba membaca file unggahan JSON...", "INFO");
          const parsed = JSON.parse(event.target?.result as string);
          if (!Array.isArray(parsed)) {
            throw new ValidationException("Format file JSON tidak valid. Harus berupa array objek mahasiswa.");
          }

          let addedCount = 0;
          parsed.forEach((item: any) => {
            // Instantiate to validate
            const mhs = new Mahasiswa(
              item.nama || 'Tanpa Nama',
              item.email || 'student@domain.com',
              item.nim || Math.floor(Math.random() * 100000000).toString(),
              parseFloat(item.ipk) || 0.0,
              item.prodi || 'Teknik Informatika',
              parseInt(item.angkatan) || 2023,
              item.phone || '081234567890'
            );
            
            // Check duplicate
            if (!students.some(s => s.nim === mhs.nim)) {
              onAddStudent(mhs.toObject());
              addedCount++;
            }
          });

          addLog(`Proses File I/O Lengkap: Berhasil mengimpor ${addedCount} data mahasiswa baru dari berkas JSON!`, "SUCCESS");
        } catch (err: any) {
          addLog(`EXCEPTION CATCH File I/O: parsing file gagal. Alasan: ${err.message}`, "ERROR", "JSONParseException");
        }
      };
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    addLog("Sedang melakukan serialisasi data ke format CSV File I/O...", "INFO");
    const headers = ["NIM", "Nama", "Email", "IPK", "Prodi", "Angkatan", "No HP"];
    const rows = students.map(s => [
      s.nim,
      `"${s.nama}"`,
      s.email,
      s.ipk.toFixed(2),
      `"${s.prodi}"`,
      s.angkatan,
      s.phone
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data_mahasiswa.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog("Ekspor berkas 'data_mahasiswa.csv' sukses terunduh.", "SUCCESS");
  };

  // Export JSON
  const handleExportJSON = () => {
    addLog("Sedang menyusun berkas serialisasi data ke format JSON File I/O...", "INFO");
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(students, null, 2)
    )}`;
    const link = document.createElement("a");
    link.setAttribute("href", jsonString);
    link.setAttribute("download", "data_mahasiswa.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog("Ekspor berkas 'data_mahasiswa.json' sukses terunduh.", "SUCCESS");
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchSearch = 
      student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nim.includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.prodi.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchProgram = programFilter === 'ALL' || student.prodi === programFilter;

    return matchSearch && matchProgram;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6" id="student_system_container">
      {/* Upper toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6" id="student_toolbar">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight" id="student_list_title">
            Daftar Mahasiswa Terdaftar
          </h2>
          <p className="text-sm text-slate-500 mt-1" id="student_list_desc">
            Sistem Informasi Akademik CRUD Terkoneksi dengan Database File JSON/CSV berbasis OOP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2" id="student_actions">
          <button
            onClick={() => {
              resetForm();
              setIsAddOpen(!isAddOpen);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm rounded-lg shadow-sm transition-all cursor-pointer"
            id="btn_tambah_mahasiswa"
          >
            <Plus size={16} />
            {isAddOpen && editingId ? 'Tutup Edit' : isAddOpen ? 'Batal Tambah' : 'Tambah Mahasiswa (C)'}
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-sm rounded-lg transition-all cursor-pointer"
            id="btn_export_json"
          >
            <Download size={15} className="text-slate-500" />
            JSON
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-sm rounded-lg transition-all cursor-pointer"
            id="btn_export_csv"
          >
            <FileCode size={15} className="text-slate-500" />
            CSV
          </button>

          <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-sm rounded-lg transition-all cursor-pointer">
            <Upload size={15} className="text-slate-500" />
            <span>Impor JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Slide form add student */}
      {isAddOpen && (
        <div className="mb-6 p-5 bg-slate-50 border border-slate-150 rounded-xl" id="add_student_form_panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-sky-500 rounded-full inline-block"></span>
              {editingId ? 'Edit Data Mahasiswa (U)' : 'Pendaftaran Baru (C)'}
            </h3>
            <button 
              onClick={resetForm} 
              className="text-xs text-slate-400 hover:text-slate-600 underline font-medium cursor-pointer animate-pulse"
            >
              Reset Borang
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Contoh: Adrian Wijaya"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">NIM (8-12 karakter angka)</label>
              <input
                type="text"
                placeholder="Contoh: 23011032"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                disabled={!!editingId}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100 disabled:text-slate-400"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Email Instansi</label>
              <input
                type="text"
                placeholder="Contoh: adrian@student.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">IPK Aktual (0.00-4.00)</label>
              <input
                type="text"
                placeholder="Maks: 4.00"
                value={ipk}
                onChange={(e) => setIpk(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Program Studi</label>
              <select
                value={prodi}
                onChange={(e) => setProdi(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-sky-500"
              >
                {prodis.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Tahun Angkatan</label>
              <select
                value={angkatan}
                onChange={(e) => setAngkatan(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-sky-500"
              >
                {Array.from({ length: 8 }, (_, i) => (2020 + i).toString()).map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Nomor Telepon Seluler</label>
              <input
                type="text"
                placeholder="Contoh: 081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                required
              />
            </div>

            <div className="flex items-end pt-5">
              <button
                type="submit"
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 border border-slate-750 text-white font-medium text-sm rounded-lg shadow-xs transition-all cursor-pointer flex justify-center items-center gap-1.5"
              >
                {editingId ? 'Simpan Pembaruan (U)' : 'Daftarkan Mahasiswa (C)'}
              </button>
            </div>
          </form>

          {validationError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-150 text-red-700 rounded-lg text-xs flex gap-2 items-start" id="validation_error_alert">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">Error Terdeteksi: </span>
                {validationError}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters search */}
      <div className="flex flex-col md:flex-row gap-3 mb-4" id="table_search_container">
        <input
          type="text"
          placeholder="Cari NIM, Nama, Email, atau Prodi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          id="search_mahasiswa_input"
        />

        <select
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-hidden text-slate-600"
          id="filter_prodi"
        >
          <option value="ALL">Semua Program Studi</option>
          {prodis.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Main Student list Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left text-sm border-collapse" id="main_student_table">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
              <th className="p-4 rounded-tl-xl text-slate-500">Mahasiswa</th>
              <th className="p-4 text-slate-500">NIM / Angkatan</th>
              <th className="p-4 text-slate-500">Program Studi</th>
              <th className="p-4 text-slate-500">IPK</th>
              <th className="p-4 text-slate-500">No Telepon</th>
              <th className="p-4 rounded-tr-xl text-right text-slate-500">Modifikasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                  {searchTerm || programFilter !== 'ALL' 
                    ? 'Tidak ada mahasiswa yang cocok dengan pencarian Anda.' 
                    : 'Belum ada data mahasiswa terdaftar pada memori file.'}
                </td>
              </tr>
            ) : (
              filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm tracking-wide">
                        {std.nama.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{std.nama}</div>
                        <div className="text-xs text-slate-400 font-medium">{std.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-slate-700 font-medium text-xs">{std.nim}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Angkatan {std.angkatan}</div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{std.prodi}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full inline-block ${
                        std.ipk >= 3.5 ? 'bg-emerald-500' :
                        std.ipk >= 3.0 ? 'bg-sky-500' :
                        std.ipk >= 2.0 ? 'bg-amber-500' : 'bg-red-500'
                      }`}></span>
                      <span className="font-mono font-bold text-slate-700">{std.ipk.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-xs text-slate-500">{std.phone}</div>
                    <span className="inline-flex items-center px-1.5 py-0.5 mt-1 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Aktif
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => startEdit(std)}
                        className="p-1 px-2.5 py-1.5 hover:bg-slate-100 hover:text-slate-900 text-slate-500 rounded-lg transition-all text-xs font-semibold inline-flex items-center gap-1 border border-slate-100 cursor-pointer"
                        title="Ubah Profil Student (U)"
                      >
                        <Edit2 size={13} />
                        Ubah
                      </button>
                      <button
                        onClick={() => handleDelete(std)}
                        className="p-1 px-2.5 py-1.5 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-lg transition-all text-xs font-semibold inline-flex items-center gap-1 border border-slate-100 cursor-pointer"
                        title="Hapus Record (D)"
                      >
                        <Trash2 size={13} />
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination / simple total status bar */}
      <div className="flex items-center justify-between mt-4 text-xs text-slate-400 font-medium" id="student_counts_bar">
        <div>
          Menampilkan <span className="font-semibold text-slate-700">{filteredStudents.length}</span> dari <span className="font-semibold text-slate-700">{students.length}</span> records terdaftar.
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span> IPK &ge; 3.5 (Cumlaude)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-sky-500 rounded-full inline-block"></span> IPK 3.0 - 3.49
          </span>
        </div>
      </div>
    </div>
  );
}
