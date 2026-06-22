/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentData, SortingStep, SearchingStep } from '../types';
import { 
  Play, Pause, ChevronRight, RotateCcw, AlertCircle, HelpCircle, Code, Info, Sparkles 
} from 'lucide-react';

interface AlgorithmSandboxProps {
  students: StudentData[];
  addLog: (message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR', exceptionClass?: string, traceback?: string) => void;
}

export default function AlgorithmSandbox({ students, addLog }: AlgorithmSandboxProps) {
  // Tab within sandbox: Search vs Sort
  const [activeTab, setActiveTab] = useState<'SORT' | 'SEARCH'>('SORT');

  // General States
  const [isPlaying, setIsPlaying] = useState(false);
  const [delayMs, setDelayMs] = useState(600);

  // --- SORT STATES ---
  const [sortAlgorithm, setSortAlgorithm] = useState<'BUBBLE' | 'SELECTION' | 'INSERTION' | 'MERGE'>('BUBBLE');
  const [sortField, setSortField] = useState<'nim' | 'ipk' | 'angkatan'>('nim');
  const [sortSteps, setSortSteps] = useState<SortingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // --- SEARCH STATES ---
  const [searchAlgorithm, setSearchAlgorithm] = useState<'LINEAR' | 'BINARY'>('LINEAR');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<'nim' | 'nama'>('nim');
  const [searchSteps, setSearchSteps] = useState<SearchingStep[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [searchResultFound, setSearchResultFound] = useState<boolean | null>(null);

  // Initialize sorting state when choices change
  useEffect(() => {
    generateSortSteps();
  }, [students, sortAlgorithm, sortField]);

  // Handle active playing of steps
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying) {
      interval = setInterval(() => {
        if (activeTab === 'SORT') {
          if (currentStepIndex < sortSteps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
          } else {
            setIsPlaying(false);
            addLog(`Algoritma Pengurutan ${sortAlgorithm} selesai dijalankan secara penuh!`, 'SUCCESS');
          }
        } else {
          if (currentSearchIndex < searchSteps.length - 1) {
            setCurrentSearchIndex(prev => prev + 1);
          } else {
            setIsPlaying(false);
            const finalStep = searchSteps[searchSteps.length - 1];
            if (finalStep && finalStep.found) {
              setSearchResultFound(true);
              addLog(`Pencarian ${searchAlgorithm} selesai: Data mahasiswa ditemukan!`, 'SUCCESS');
            } else {
              setSearchResultFound(false);
              addLog(`Pencarian ${searchAlgorithm} selesai: Data mahasiswa TIDAK ditemukan.`, 'WARNING');
            }
          }
        }
      }, delayMs);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeTab, currentStepIndex, currentSearchIndex, sortSteps, searchSteps, delayMs]);

  // Log active step changes
  useEffect(() => {
    if (activeTab === 'SORT' && sortSteps[currentStepIndex]) {
      // Avoid excessive log spam, only log major checkpoints
      const step = sortSteps[currentStepIndex];
      if (currentStepIndex === 0) {
        addLog(`Memulai animasi visual ${sortAlgorithm} berdasarkan field '${sortField}'...`, 'INFO');
      }
    }
  }, [currentStepIndex, activeTab]);

  // ==============================================================================
  // GENERATE STEPS FOR SORTING ALGORITHMS
  // ==============================================================================
  const generateSortSteps = () => {
    if (students.length === 0) return;
    setIsPlaying(false);
    setCurrentStepIndex(0);

    const dataCopy = [...students];
    const steps: SortingStep[] = [];

    // Capture initial state
    steps.push({
      array: dataCopy.map(s => Number(s[sortField]) || 0),
      comparingIndices: [],
      swappedIndices: [],
      description: "Keadaan awal laci memori sebelum pengurutan dimulai."
    });

    const getVal = (student: StudentData): number => {
      if (sortField === 'ipk') return student.ipk;
      if (sortField === 'angkatan') return student.angkatan;
      // nim: parse to integer safely
      return parseInt(student.nim) || 0;
    };

    // Helper functions representing real sorting but capturing intervals
    const runBubbleSort = () => {
      const arr = [...students];
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          const val1 = getVal(arr[j]);
          const val2 = getVal(arr[j + 1]);

          steps.push({
            array: arr.map(getVal),
            comparingIndices: [j, j + 1],
            swappedIndices: [],
            description: `Bandingkan indeks ${j} (${val1}) & indeks ${j+1} (${val2}).`
          });

          // bubble sort ascending
          if (val1 > val2) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;

            steps.push({
              array: arr.map(getVal),
              comparingIndices: [j, j + 1],
              swappedIndices: [j, j + 1],
              description: `Tukar posisi! ${val1} > ${val2}. Indeks ${j} digeser ke indeks ${j+1}.`
            });
          }
        }
      }
    };

    const runSelectionSort = () => {
      const arr = [...students];
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        steps.push({
          array: arr.map(getVal),
          comparingIndices: [i],
          swappedIndices: [],
          description: `Asumsikan elemen terkecil sementara berada di indeks ${i} (${getVal(arr[i])}).`
        });

        for (let j = i + 1; j < n; j++) {
          const valJ = getVal(arr[j]);
          const valMin = getVal(arr[minIdx]);

          steps.push({
            array: arr.map(getVal),
            comparingIndices: [j, minIdx],
            swappedIndices: [],
            description: `Bandingkan indeks ke-${j} (${valJ}) dengan elemen terkecil sementara (${valMin}).`
          });

          if (valJ < valMin) {
            minIdx = j;
            steps.push({
              array: arr.map(getVal),
              comparingIndices: [minIdx],
              swappedIndices: [],
              description: `Ditemukan nilai terkecil baru (${valJ}) pada indeks ke-${j}.`
            });
          }
        }

        if (minIdx !== i) {
          const temp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = temp;

          steps.push({
            array: arr.map(getVal),
            comparingIndices: [i, minIdx],
            swappedIndices: [i, minIdx],
            description: `Tukar posisi: Letakkan elemen terkecil ${getVal(arr[i])} ke indeks ${i}.`
          });
        }
      }
    };

    const runInsertionSort = () => {
      const arr = [...students];
      const n = arr.length;
      for (let i = 1; i < n; i++) {
        const keyNode = arr[i];
        const keyVal = getVal(keyNode);
        let j = i - 1;

        steps.push({
          array: arr.map(getVal),
          comparingIndices: [i],
          swappedIndices: [],
          description: `Ambil kunci pembanding (Key): ${keyVal} pada indeks ${i}.`
        });

        while (j >= 0 && getVal(arr[j]) > keyVal) {
          steps.push({
            array: arr.map(getVal),
            comparingIndices: [j, j + 1],
            swappedIndices: [j, j + 1],
            description: `Karena ${getVal(arr[j])} > ${keyVal}, geser elemen ${getVal(arr[j])} ke indeks ${j + 1}.`
          });
          arr[j + 1] = arr[j];
          j = j - 1;
        }
        arr[j + 1] = keyNode;
        steps.push({
          array: arr.map(getVal),
          comparingIndices: [j + 1],
          swappedIndices: [j + 1],
          description: `Sisipkan kembali key ${keyVal} ke posisi yang sesuai di indeks ${j + 1}.`
        });
      }
    };

    // Simplified animated Merge steps generator
    const runMergeSortShim = () => {
      const arr = [...students];
      const n = arr.length;
      // We simulate recursive merge segments with visual feedback steps
      steps.push({
        array: arr.map(getVal),
        comparingIndices: [],
        swappedIndices: [],
        description: "Melakukan pembagian array (Divide) ke rentang-rentang sub-array terkecil..."
      });

      // Sort full array
      arr.sort((a, b) => getVal(a) - getVal(b));

      steps.push({
        array: arr.map(getVal),
        comparingIndices: Array.from({length: n}, (_, i) => i),
        swappedIndices: Array.from({length: n}, (_, i) => i),
        description: "Gabungkan sub-array (Merge) secara rekursif O(N log N) ke susunan terurut akhir."
      });
    };

    if (sortAlgorithm === 'BUBBLE') runBubbleSort();
    else if (sortAlgorithm === 'SELECTION') runSelectionSort();
    else if (sortAlgorithm === 'INSERTION') runInsertionSort();
    else if (sortAlgorithm === 'MERGE') runMergeSortShim();

    setSortSteps(steps);
  };

  // ==============================================================================
  // GENERATE STEPS FOR SEARCHING ALGORITHMS
  // ==============================================================================
  const triggerSearchInit = () => {
    if (!searchQuery.trim()) {
      addLog("Gagal mencari: Kata kunci pencarian kosong.", "WARNING");
      return;
    }

    addLog(`Menginisialisasi pencarian ${searchAlgorithm} untuk query: "${searchQuery}"`, "INFO");
    setIsPlaying(false);
    setSearchResultFound(null);

    const steps: SearchingStep[] = [];
    let queryLower = searchQuery.toLowerCase();

    // Prepare arrays
    let searchArray = [...students];
    
    // For Binary search, the array must be sorted! We sort by NIM.
    if (searchAlgorithm === 'BINARY') {
      searchArray.sort((a, b) => parseInt(a.nim) - parseInt(b.nim));
      addLog("Binary Search mewajibkan data terurut. Mengurutkan array berdasarkan NIM terlebih dahulu...", "INFO");
    }

    if (searchAlgorithm === 'LINEAR') {
      let found = false;
      for (let i = 0; i < searchArray.length; i++) {
        const student = searchArray[i];
        const val = searchField === 'nim' ? student.nim : student.nama.toLowerCase();
        const match = searchField === 'nim' ? val.includes(queryLower) : val.includes(queryLower);

        if (match) {
          found = true;
          steps.push({
            index: i,
            array: searchArray,
            range: [0, searchArray.length - 1],
            found: true,
            message: `Cocok! Elemen ke-${i} (${student.nama}) memenuhi syarat pencarian.`
          });
          break; // Stop sequential on first match
        } else {
          steps.push({
            index: i,
            array: searchArray,
            range: [0, searchArray.length - 1],
            found: false,
            message: `Evaluasi Indeks ${i}: '${val}' tidak cocok dengan '${queryLower}'. Lanjut sequential.`
          });
        }
      }
      if (!found) {
        steps.push({
          index: searchArray.length,
          array: searchArray,
          range: [0, searchArray.length - 1],
          found: false,
          message: "Sequential traversal selesai. Tidak ada mahasiswa yang cocok."
        });
      }
    } else {
      // BINARY SEARCH (Binary Search on exact numeric NIM matches)
      let low = 0;
      let high = searchArray.length - 1;
      let found = false;
      const targetInt = parseInt(queryLower);

      if (isNaN(targetInt)) {
        steps.push({
          index: -1,
          array: searchArray,
          range: [0, searchArray.length - 1],
          found: false,
          message: "Error: NIM query harus berupa angka bulat untuk dieksekusi via Binary Search."
        });
      } else {
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const midStudent = searchArray[mid];
          const midVal = parseInt(midStudent.nim) || 0;

          if (midVal === targetInt) {
            found = true;
            steps.push({
              index: mid,
              array: searchArray,
              range: [low, high],
              found: true,
              message: `Ditemukan! Midpoint indeks ${mid} (${midStudent.nim} - ${midStudent.nama}) cocok dengan target.`
            });
            break;
          } else if (midVal < targetInt) {
            steps.push({
              index: mid,
              array: searchArray,
              range: [low, high],
              found: false,
              message: `${midVal} < ${targetInt}. Sektor kiri tereliminasi. Rentang baru low=${mid + 1}.`
            });
            low = mid + 1;
          } else {
            steps.push({
              index: mid,
              array: searchArray,
              range: [low, high],
              found: false,
              message: `${midVal} > ${targetInt}. Sektor kanan tereliminasi. Rentang baru high=${mid - 1}.`
            });
            high = mid - 1;
          }
        }

        if (!found) {
          steps.push({
            index: -1,
            array: searchArray,
            range: [low, high],
            found: false,
            message: `Selesai: Interval kosong [${low} > ${high}]. NIM '${queryLower}' tidak ada.`
          });
        }
      }
    }

    setSearchSteps(steps);
    setCurrentSearchIndex(0);
  };

  // Complexity stats mapper
  const countStats = {
    BUBBLE: { best: 'O(N)', avg: 'O(N²)', worst: 'O(N²)', space: 'O(1)', desc: 'Menukar elemen berdekatan berulang kali jika salah urutan.' },
    SELECTION: { best: 'O(N²)', avg: 'O(N²)', worst: 'O(N²)', space: 'O(1)', desc: 'Memindai sisa list untuk memilih elemen minimum.' },
    INSERTION: { best: 'O(N)', avg: 'O(N²)', worst: 'O(N²)', space: 'O(1)', desc: 'Menyisipkan satu per satu elemen ke bagian yang sudah terurut.' },
    MERGE: { best: 'O(N log N)', avg: 'O(N log N)', worst: 'O(N log N)', space: 'O(N)', desc: 'Membagi daftar rekursif, lalu menyatukan kembali secara berurutan.' },
    LINEAR: { best: 'O(1)', avg: 'O(N)', worst: 'O(N)', space: 'O(1)', desc: 'Memeriksa satu per satu indeks dari awal hingga akhir.' },
    BINARY: { best: 'O(1)', avg: 'O(log N)', worst: 'O(log N)', space: 'O(1)', desc: 'Membagi dua ruang pencarian pada array terurut.' }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6" id="algorithm_lab_panel">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-100 gap-4 mb-6" id="algo_tab_headers">
        <button
          onClick={() => { setActiveTab('SORT'); setIsPlaying(false); }}
          className={`pb-3 font-semibold text-sm transition-all relative cursor-pointer ${
            activeTab === 'SORT' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-650'
          }`}
          id="tab_sort"
        >
          Visualisasi Sorting (Pengurutan)
          {activeTab === 'SORT' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />}
        </button>

        <button
          onClick={() => { setActiveTab('SEARCH'); setIsPlaying(false); }}
          className={`pb-3 font-semibold text-sm transition-all relative cursor-pointer ${
            activeTab === 'SEARCH' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-650'
          }`}
          id="tab_search"
        >
          Visualisasi Searching (Pencarian Nirkabel)
          {activeTab === 'SEARCH' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />}
        </button>
      </div>

      {/* Control row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-150 rounded-xl mb-6" id="sandbox_controllers">
        <div className="flex flex-wrap items-center gap-3">
          {activeTab === 'SORT' ? (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-405 tracking-wider uppercase">Algoritma</span>
                <select
                  value={sortAlgorithm}
                  onChange={(e) => setSortAlgorithm(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="BUBBLE">Bubble Sort</option>
                  <option value="SELECTION">Selection Sort</option>
                  <option value="INSERTION">Insertion Sort</option>
                  <option value="MERGE">Merge Sort (Efektif)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-405 tracking-wider uppercase">Field Pembanding</span>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="nim">NIM (Nomor Induk)</option>
                  <option value="ipk">IPK (Nilai Prestasi)</option>
                  <option value="angkatan">Tahun Angkatan</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-405 tracking-wider uppercase">Metode</span>
                <select
                  value={searchAlgorithm}
                  onChange={(e) => {
                    setSearchAlgorithm(e.target.value as any);
                    setSearchField(e.target.value === 'BINARY' ? 'nim' : 'nama');
                  }}
                  className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="LINEAR">Linear / Sequential Search</option>
                  <option value="BINARY">Binary Search (O(log N))</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-405 tracking-wider uppercase">Filter Atribut</span>
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value as any)}
                  disabled={searchAlgorithm === 'BINARY'}
                  className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-40"
                >
                  <option value="nim">NIM (Angka)</option>
                  <option value="nama">Nama Lengkap</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-405 tracking-wider uppercase">Cari Nilai</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchField === 'nim' ? 'Contoh: 23011044' : 'Nama mahasiswa...'}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:border-sky-500 w-36"
                  />
                  <button
                    onClick={triggerSearchInit}
                    className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Kalkulasi Langkah
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-405 tracking-wider uppercase">Interval Tunda</span>
            <select
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="1200">Lambat (1.2s)</option>
              <option value="600">Normal (0.6s)</option>
              <option value="200">Cepat (0.2s)</option>
            </select>
          </div>
        </div>

        {/* Media Button Groups */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={activeTab === 'SEARCH' && searchSteps.length === 0}
            className={`flex items-center gap-1.5 px-3 py-2 ${
              isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sky-600 hover:bg-sky-700'
            } text-white font-semibold text-xs rounded-lg transition-all cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed`}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Jeda' : 'Putar Autonoma'}</span>
          </button>

          <button
            onClick={() => {
              if (activeTab === 'SORT') {
                if (currentStepIndex < sortSteps.length - 1) {
                  setCurrentStepIndex(currentStepIndex + 1);
                }
              } else {
                if (currentSearchIndex < searchSteps.length - 1) {
                  setCurrentSearchIndex(currentSearchIndex + 1);
                }
              }
            }}
            disabled={
              (activeTab === 'SORT' && currentStepIndex >= sortSteps.length - 1) ||
              (activeTab === 'SEARCH' && (searchSteps.length === 0 || currentSearchIndex >= searchSteps.length - 1))
            }
            className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
            title="Langkah Berikutnya"
          >
            <ChevronRight size={14} />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              if (activeTab === 'SORT') {
                setCurrentStepIndex(0);
              } else {
                setCurrentSearchIndex(0);
                setSearchResultFound(null);
              }
              addLog("Mereset frame animasi sandbox algoritma.", "INFO");
            }}
            className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 rounded-lg transition-all cursor-pointer"
            title="Mulai Ulang"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Visual Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="visual_sandbox_canvas">
        {/* Step screen (Left visual elements) */}
        <div className="lg:col-span-2 space-y-4" id="sandbox_visualization">
          {/* Active stats display */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 font-mono text-xs flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-2 right-2 shrink-0 flex items-center gap-1 bg-sky-950/75 border border-sky-900 text-sky-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
              {activeTab === 'SORT' ? sortAlgorithm : searchAlgorithm} ENGINE ACTIVE
            </div>
            
            <div className="text-[11px] text-slate-500 font-bold tracking-normal border-b border-slate-850 pb-1.5">
              INFORMASI ALGORITMA AKTIF / FRAME CONTROL
            </div>
            
            {activeTab === 'SORT' ? (
              <>
                <div>Total Steps : <span className="text-white font-bold">{sortSteps.length}</span> (Active Frame: <span className="text-sky-400 font-bold">#{currentStepIndex}</span>)</div>
                <div className="text-[12px] text-sky-300 font-sans font-medium mt-1">
                  &raquo; {sortSteps[currentStepIndex]?.description || 'Mempersiapkan array...'}
                </div>
              </>
            ) : (
              <>
                <div>Total Evaluations : <span className="text-white font-bold">{searchSteps.length || '0'}</span> (Active Probe: <span className="text-sky-400 font-bold">#{currentSearchIndex === -1 ? 'None' : currentSearchIndex}</span>)</div>
                <div className="text-[12px] text-sky-300 font-sans font-medium mt-1">
                  &raquo; {searchSteps[currentSearchIndex]?.message || 'Masukkan query dan kalkulasikan langkah untuk mulai.'}
                </div>
              </>
            )}
          </div>

          {/* Cards container */}
          <div className="min-h-56 p-6 border border-slate-150 rounded-2xl bg-slate-50/50 flex flex-wrap items-center justify-center gap-4 relative">
            {activeTab === 'SORT' && sortSteps[currentStepIndex] ? (
              sortSteps[currentStepIndex].array.map((val, idx) => {
                const step = sortSteps[currentStepIndex];
                const isComparing = step.comparingIndices.includes(idx);
                const isSwapped = step.swappedIndices.includes(idx);

                // Find student corresponding to value for real rendering
                const student = students.find(s => {
                  if (sortField === 'ipk') return s.ipk === val;
                  if (sortField === 'angkatan') return s.angkatan === val;
                  return parseInt(s.nim) === val;
                });

                return (
                  <div
                    key={idx}
                    className={`shrink-0 w-32 p-3 bg-white border rounded-xl flex flex-col justify-between h-36 shadow-xs relative transition-all duration-300 ${
                      isSwapped ? 'border-amber-500 ring-2 ring-amber-400/30 scale-105' :
                      isComparing ? 'border-sky-500 ring-2 ring-sky-350/30 scale-102 bg-sky-50' :
                      'border-slate-150'
                    }`}
                  >
                    <span className="absolute top-1 left-2 text-[9px] text-slate-400 font-mono">
                      INDEX [{idx}]
                    </span>

                    <div className="pt-2 text-center">
                      <div className="text-2xl font-black text-slate-800 font-mono tracking-tight">
                        {sortField === 'ipk' ? val.toFixed(2) : val}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold truncate mt-1">
                        {student?.nama || 'Mhs Dummy'}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5 font-mono">
                        {sortField === 'nim' ? 'NIM' : sortField === 'ipk' ? 'IPK' : 'ANGKATAN'}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-1.5 flex items-center justify-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isSwapped ? 'bg-amber-500' : isComparing ? 'bg-sky-400' : 'bg-slate-300'
                      }`} />
                      <span className="text-[8px] font-bold text-slate-400 uppercase">
                        {isSwapped ? 'SWAPPED' : isComparing ? 'COMPARING' : 'STABLE'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : activeTab === 'SEARCH' && searchSteps.length > 0 && currentSearchIndex !== -1 ? (
              searchSteps[currentSearchIndex].array.map((student, idx) => {
                const step = searchSteps[currentSearchIndex];
                const isActive = step.index === idx;
                const isInSearchRange = idx >= step.range[0] && idx <= step.range[1];
                const isFound = isActive && step.found;

                return (
                  <div
                    key={idx}
                    className={`shrink-0 w-32 p-3 bg-white border rounded-xl flex flex-col justify-between h-36 shadow-xs relative transition-all duration-300 ${
                      isFound ? 'border-emerald-500 ring-3 ring-emerald-400/40 scale-108 bg-emerald-50/50' :
                      isActive ? 'border-sky-500 ring-2 ring-sky-305/30 scale-102 bg-sky-50' :
                      !isInSearchRange ? 'opacity-35 grayscale border-slate-205' : 'border-slate-150'
                    }`}
                  >
                    <span className="absolute top-1 left-2 text-[9px] text-slate-401 font-mono">
                      INDEX [{idx}]
                    </span>

                    <div className="pt-2 text-center">
                      <div className="text-sm font-bold text-slate-800 truncate leading-tight">
                        {student.nama}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-1 font-semibold">
                        {student.nim}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        IPK: {student.ipk.toFixed(2)}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-1.5 flex items-center justify-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isFound ? 'bg-emerald-500 animate-ping' :
                        isActive ? 'bg-sky-500' :
                        !isInSearchRange ? 'bg-slate-300' : 'bg-sky-300'
                      }`} />
                      <span className="text-[8px] font-bold text-slate-400 uppercase">
                        {isFound ? 'FOUND!' : isActive ? 'PROBING' : !isInSearchRange ? 'OUT OF RANGE' : 'IN RANGE'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-slate-400 flex flex-col items-center max-w-sm py-8" id="empty_sandbox_prompter">
                <HelpCircle size={40} className="text-slate-300 animate-bounce mb-2" />
                <p className="font-semibold text-sm">Menunggu kalkulasi search sandbox...</p>
                <p className="text-xs text-slate-400 mt-1">
                  Ketik kata kunci NIM lalu tekan &quot;Kalkulasi Langkah&quot; di bar atas untuk memvisualisasikan data.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Complexity Details Sidebar (Right block) */}
        <div className="space-y-4" id="complexity_sidebar">
          <div className="p-5 bg-slate-900 text-white rounded-2xl shadow-xs" id="complexity_card">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-amber-400" />
              Kompleksitas Algoritma
            </h3>

            {/* Matrix comparison values */}
            {(() => {
              const selectedAlgo = activeTab === 'SORT' ? sortAlgorithm : searchAlgorithm;
              const stats = countStats[selectedAlgo];

              return (
                <div className="space-y-4 font-mono text-xs" id="active_complexities">
                  <div className="p-3 bg-slate-850 rounded-xl space-y-2 border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Best-Case Time:</span>
                      <span className="font-bold text-emerald-400">{stats.best}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Average-Case Time:</span>
                      <span className="font-bold text-amber-400">{stats.avg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Worst-Case Time:</span>
                      <span className="font-bold text-red-400">{stats.worst}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2 mt-2">
                      <span className="text-slate-400">Auxiliary Space:</span>
                      <span className="font-bold text-yellow-300">{stats.space}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-350 font-sans leading-relaxed">
                    <span className="font-bold text-white block mb-1">Cara Kerja:</span>
                    {stats.desc}
                  </div>

                  {/* Scientific estimation banner */}
                  <div className="bg-sky-950/40 p-3 rounded-lg border border-sky-900/60 font-sans text-xs text-sky-305 flex gap-2">
                    <Info size={14} className="shrink-0 mt-0.5 text-sky-455" />
                    <div>
                      <span className="font-bold block text-sky-300 text-[10px] tracking-wider uppercase mb-1">
                        ANALISIS TEORITIS (Big-O Notation)
                      </span>
                      Berdasarkan ukuran database anda (N={students.length} mahasiswa), pencarian ini membutuhkan estimasi maksimal{' '}
                      <span className="font-mono font-bold text-white">
                        {selectedAlgo === 'BINARY' ? Math.ceil(Math.log2(students.length || 1)) : students.length}
                      </span>{' '}
                      operasi perbandingan sebelum hasil final dikembalikan.
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Quick interactive facts */}
          <div className="p-4 border border-slate-150 rounded-2xl text-xs space-y-2.5" id="algo_helpful_tips">
            <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
              <HelpCircle size={14} className="text-slate-500" />
              Petunjuk Belajar:
            </h4>
            <p className="text-slate-500 leading-normal">
              Urutan NIM yang valid memudahkan pencarian berkas besar. Menggunakan 
              <strong> Binary Search</strong> dapat memangkas jutaan pencarian menjadi belasan langkah saja 
              <em> (logaritma basis 2)</em>. Namun, data wajib disortir terlebih dahulu!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
