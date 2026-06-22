/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentData } from '../types';
import { LinkedMahasiswaList, Mahasiswa, NodeMahasiswa } from '../oopImplementation';
import { Link, Hash, HelpCircle, CornerDownRight, Play, Server } from 'lucide-react';

interface PointerVisualizerProps {
  students: StudentData[];
  addLog: (message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR', exceptionClass?: string, traceback?: string) => void;
}

export default function PointerVisualizer({ students, addLog }: PointerVisualizerProps) {
  const [linkedList, setLinkedList] = useState<LinkedMahasiswaList | null>(null);
  const [selectedNodeAddress, setSelectedNodeAddress] = useState<string | null>(null);

  // Sync internal DLL state when the main students state changes
  useEffect(() => {
    // Instantiate actual model classes of Mahasiswa
    const mhsObjects = students.map(s => new Mahasiswa(
      s.nama,
      s.email,
      s.nim,
      s.ipk,
      s.prodi,
      s.angkatan,
      s.phone
    ));

    const list = new LinkedMahasiswaList(mhsObjects);
    setLinkedList(list);

    // Default select first address
    if (list.headAddress) {
      setSelectedNodeAddress(list.headAddress);
    }
  }, [students]);

  // Read list elements into ordered sequence following pointer references
  const getOrderedNodes = () => {
    if (!linkedList || !linkedList.headAddress) return [];
    
    const ordered: { address: string; node: NodeMahasiswa }[] = [];
    let currentAddress: string | null = linkedList.headAddress;
    const visited = new Set<string>(); // avoid infinite loops if pointers are broken

    while (currentAddress && !visited.has(currentAddress)) {
      visited.add(currentAddress);
      const node = linkedList.nodesMap.get(currentAddress);
      if (node) {
        ordered.push({ address: currentAddress, node });
        currentAddress = node.nextPointer;
      } else {
        break;
      }
    }
    return ordered;
  };

  const orderedNodes = getOrderedNodes();
  const selectedNode = selectedNodeAddress && linkedList ? linkedList.nodesMap.get(selectedNodeAddress) : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6" id="pointer_visualizer_panel">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight" id="pointer_title">
          Simulator Alokasi Pointer &amp; Memori Heap
        </h2>
        <p className="text-sm text-slate-500 mt-1" id="pointer_desc">
          Meskipun JavaScript dan Python mengelola memori otomatis, di bawah kap konsep Pointer digunakan untuk mereferensikan objek pada Heap Memori. Di bawah ini adalah visualisasi Struktur Doubly Linked List.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="pointer_grid">
        {/* Visual blocks (Left/Middle columns) */}
        <div className="lg:col-span-2 space-y-6" id="pointer_blocks_container">
          {/* Linked nodes board */}
          <div className="p-6 bg-slate-50 border border-slate-150 rounded-2xl overflow-x-auto min-h-60 flex items-center gap-6 relative">
            {orderedNodes.length === 0 ? (
              <div className="text-center text-slate-450 w-full font-medium" id="dll_empty_state">
                Tidak ada entri memori. Silakan menambahkan mahasiswa di tab CRUD.
              </div>
            ) : (
              orderedNodes.map(({ address, node }, idx) => {
                const isHead = linkedList?.headAddress === address;
                const isTail = node.nextPointer === null;
                const isSelected = selectedNodeAddress === address;

                return (
                  <div key={address} className="flex items-center gap-4 shrink-0">
                    {/* Node block */}
                    <div
                      onClick={() => {
                        setSelectedNodeAddress(address);
                        addLog(`Pemeriksaan pointer pada physical heap address: ${address}`, 'INFO');
                      }}
                      className={`w-44 bg-white border rounded-xl shadow-xs transition-all duration-300 transform cursor-pointer relative ${
                        isSelected 
                          ? 'border-sky-600 ring-2 ring-sky-300/30 scale-102 mt-[-4px]' 
                          : 'border-slate-150 hover:border-slate-350 hover:scale-101'
                      }`}
                    >
                      {/* Address tag */}
                      <div className="bg-slate-900 text-slate-350 p-2 text-[10px] font-mono flex items-center justify-between rounded-t-xl border-b border-slate-800">
                        <span className="flex items-center gap-1">
                          <Hash size={10} className="text-sky-400" />
                          {address}
                        </span>
                        <span className="text-[8px] font-bold tracking-wider text-slate-505 uppercase">
                          {isHead ? 'HEAD' : isTail ? 'TAIL' : `NODE #${idx}`}
                        </span>
                      </div>

                      {/* Cell contents */}
                      <div className="p-3 space-y-1.5">
                        <div className="font-bold text-slate-800 text-xs truncate leading-normal">
                          {node.student.nama}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono leading-none">
                          NIM: {node.student.nim}
                        </div>

                        {/* Node self reference pointers representation */}
                        <div className="border-t border-slate-100 pt-2 flex flex-col gap-1 text-[9px] font-mono font-medium leading-none">
                          <div className="flex justify-between items-center text-rose-500">
                            <span>[prev_ptr] &rarr;</span>
                            <span className="font-bold">{node.prevPointer ? node.prevPointer : 'NULL'}</span>
                          </div>
                          <div className="flex justify-between items-center text-sky-500">
                            <span>[next_ptr] &rarr;</span>
                            <span className="font-bold">{node.nextPointer ? node.nextPointer : 'NULL'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Doubly directional arrow connector representation */}
                    {!isTail && (
                      <div className="flex flex-col items-center justify-center text-slate-400 leading-none shrink-0" id={`arrow_link_${idx}`}>
                        <div className="flex items-center gap-1 text-sky-500 font-mono text-[9px] font-bold">
                          <span>next</span>
                          <span className="text-xs">&rarr;</span>
                        </div>
                        <div className="h-0.5 w-10 bg-slate-200 my-1 relative">
                          <div className="absolute top-[-2px] right-0 w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                          <div className="absolute top-[-2px] left-0 w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                        </div>
                        <div className="flex items-center gap-1 text-rose-400 font-mono text-[9px] font-bold">
                          <span className="text-xs">&larr;</span>
                          <span>prev</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Pointer theory description */}
          <div className="p-4 bg-sky-50 border border-sky-150 rounded-xl text-xs text-sky-800 flex gap-3 leading-relaxed">
            <HelpCircle size={18} className="shrink-0 mt-0.5 text-sky-500" />
            <div>
              <span className="font-bold block text-sky-900 mb-0.5">Aturan Alokasi Poiner yang sedang divisualisasikan:</span>
              Ketika Anda menghapus elemen tengah (misal <kbd className="bg-sky-100 px-1 py-0.5 rounded text-[10px]">Node B</kbd> dari rantai <code className="font-mono text-[10px]">A &harr; B &harr; C</code>), algoritma memperbarui alamat pointer:
              <ul className="list-disc pl-4 mt-1 font-mono text-[10px] text-sky-750">
                <li>NodeA.next_ptr = NodeB.next_ptr (A pointing to C)</li>
                <li>NodeC.prev_ptr = NodeB.prev_ptr (C pointing to A)</li>
                <li>Hapus Node B dari tabel alamat heap untuk membiarkan Garbage Collector memulihkan memori.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Selected Pointer Node Details (Right panel) */}
        <div id="pointer_node_details">
          <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-4" id="heap_details_card">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Server size={16} className="text-emerald-400" />
              Detail Lokasi Memori Heap
            </h3>

            {selectedNode && selectedNodeAddress ? (
              <div className="space-y-4 font-mono text-xs">
                {/* Visual statistics */}
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Physical Addr:</span>
                    <span className="text-sky-400 font-bold">{selectedNodeAddress}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>NIM Mahasiswa:</span>
                    <span className="text-white font-semibold">{selectedNode.student.nim}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Induk Class:</span>
                    <span className="text-indigo-400">class Mahasiswa</span>
                  </div>
                </div>

                {/* Operations traceback */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                    OPERASI LINKAGE DILAKUKAN
                  </span>
                  
                  <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-850 text-[10px] text-slate-300">
                    <div className="flex items-start gap-1">
                      <CornerDownRight size={10} className="mt-1 text-slate-500 shrink-0" />
                      <span>ALLOCATING memory for student {selectedNode.student.nama}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <CornerDownRight size={10} className="mt-1 text-slate-500 shrink-0" />
                      <span>BINDING pointers:</span>
                    </div>
                    <div className="pl-3 text-emerald-400">
                      <div>prev_ptr = {selectedNode.prevPointer ? selectedNode.prevPointer : '0x00000000 (NULL)'}</div>
                      <div>next_ptr = {selectedNode.nextPointer ? selectedNode.nextPointer : '0x00000000 (NULL)'}</div>
                    </div>
                    <div className="flex items-start gap-1 text-orange-400">
                      <CornerDownRight size={10} className="mt-1 text-slate-500 shrink-0" />
                      <span>STATE: LOCKED IN HEAP</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-350 font-sans leading-normal">
                  Fungsi <code className="font-mono text-white text-[10px] bg-slate-800 px-1 py-0.5 rounded">id(obj)</code> asli pada Python mengembalikan alamat virtual unik di memori RAM di mana objek dideklarasikan.
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 font-sans text-xs">
                Klik salah satu blok alamat memori untuk melacak detail pointers.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
