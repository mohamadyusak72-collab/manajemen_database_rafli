/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EmailLog, StudentData } from '../types';
import { Send, Smartphone, Compass, Inbox, ShieldAlert, Cpu, Terminal, ArrowRight, CheckCircle } from 'lucide-react';

interface EmailSimulatorProps {
  students: StudentData[];
  emailLogs: EmailLog[];
  onTriggerOTP: (email: string) => void;
  addLog: (message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR', exceptionClass?: string, traceback?: string) => void;
}

export default function EmailSimulator({
  students,
  emailLogs,
  onTriggerOTP,
  addLog
}: EmailSimulatorProps) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailType, setEmailType] = useState<'OTP' | 'ACCOUNT_ALERTS' | 'PASSWORD_RESET'>('OTP');
  const [activeSocketLogs, setActiveSocketLogs] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [focusedEmailId, setFocusedEmailId] = useState<string | null>(null);

  // Set default recipient to first student email if available
  useEffect(() => {
    if (students.length > 0 && !recipientEmail) {
      setRecipientEmail(students[0].email);
    }
  }, [students]);

  // Hook focused email to always show most recent in inbox
  useEffect(() => {
    if (emailLogs.length > 0 && !focusedEmailId) {
      setFocusedEmailId(emailLogs[0].id);
    }
  }, [emailLogs]);

  // Simulate Socket SMTP Handshake Animation
  const triggerEmailDispatch = async () => {
    if (!recipientEmail) {
      addLog("Gagal mengirim simulasi email: Penerima tidak boleh kosong", "WARNING");
      return;
    }

    setIsSending(true);
    setFocusedEmailId(null);
    setActiveSocketLogs([]);

    const mailData = {
      OTP: { subject: "Kode OTP Verifikasi Keamanan", desc: "Mereset Password" },
      ACCOUNT_ALERTS: { subject: "Pemberitahuan Pendaftaran Akun", desc: "Registrasi Student" },
      PASSWORD_RESET: { subject: "Instruksi Pemulihan Akun", desc: "Forgot Password" }
    }[emailType];

    addLog(`Memulai transfer email SMTP real-time ke: ${recipientEmail}`, 'INFO');

    const handshakes = [
      `[SMTP] Connecting to mail.student-system.ac.id:587...`,
      `[SMTP] S: 220 academicmail.org ESTABLISHED`,
      `[SMTP] C: EHLO client.student-system.ac.id`,
      `[SMTP] S: 250-academicmail.org greets client.student-system.co.id`,
      `[SMTP] S: 250 STARTTLS SUPPORTED`,
      `[SMTP] C: STARTTLS`,
      `[SMTP] S: 220 Ready to start TLS encryption`,
      `[SMTP] C: MAIL FROM: <noreply@student-system.ac.id>`,
      `[SMTP] S: 250 Sender noreply@student-system.ac.id OK`,
      `[SMTP] C: RCPT TO: <${recipientEmail}>`,
      `[SMTP] S: 250 Recipient <${recipientEmail}> OK`,
      `[SMTP] C: DATA`,
      `[SMTP] S: 354 Start mail input; end with <CRLF>.<CRLF>`,
      `[SMTP] C: Subject: ${mailData.subject}`,
      `[SMTP] C: To: ${recipientEmail}`,
      `[SMTP] C: [Payload serialized MIME format - HTML]`,
      `[SMTP] C: .`,
      `[SMTP] S: 250 OK: Message queued as local transaction #875CADB93`,
      `[SMTP] Connection Closed Safely`
    ];

    // Play socket handshake steps
    for (let i = 0; i < handshakes.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setActiveSocketLogs(prev => [...prev, handshakes[i]]);
    }

    // Actually trigger state addition via call
    onTriggerOTP(recipientEmail);
    setIsSending(false);
    addLog(`Simulasi email '${mailData.subject}' berhasil disalurkan dan diterima oleh klien.`, 'SUCCESS');
  };

  const focusedEmail = emailLogs.find(el => el.id === focusedEmailId);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6" id="email_simulator_panel">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight" id="email_title">
          Simulator Pengiriman Email Real-time (SMTP)
        </h2>
        <p className="text-sm text-slate-500 mt-1" id="email_desc">
          Lakukan pengujian kirim email otomatis kepada mahasiswa seperti login OTP, welcome email, dan verifikasi akun secara interaktif di smart phone mockup.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="email_workspace">
        {/* Left Controller (4 cols) */}
        <div className="xl:col-span-4 space-y-4" id="email_trigger_section">
          <div className="p-5 border border-slate-150 rounded-2xl bg-slate-50/50 space-y-4">
            <h3 className="font-bold text-xs text-slate-400 tracking-wider uppercase">
              Borang Pemicu Email Real-time
            </h3>

            {/* Recipient select */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-550">Pilih Mahasiswa Penerima</label>
              <select
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
              >
                {students.map(s => (
                  <option key={s.id} value={s.email}>{s.nama} ({s.email})</option>
                ))}
              </select>
            </div>

            {/* Notification type */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-550">Jenis Template Notifikasi</label>
              <div className="space-y-2">
                {[
                  { id: 'OTP', title: 'Kode Keamanan OTP (Forgot Password)', icon: ShieldAlert },
                  { id: 'ACCOUNT_ALERTS', title: 'Welcome Email (Pendaftaran Akun)', icon: Inbox },
                  { id: 'PASSWORD_RESET', title: 'Pemulihan Sandi Kredensial', icon: Compass }
                ].map((tpl) => (
                  <label
                    key={tpl.id}
                    onClick={() => setEmailType(tpl.id as any)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      emailType === tpl.id 
                        ? 'border-sky-500 bg-sky-50 text-sky-800' 
                        : 'border-slate-150 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <tpl.icon size={14} className={emailType === tpl.id ? 'text-sky-500' : 'text-slate-400'} />
                    <span>{tpl.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit trigger button */}
            <button
              onClick={triggerEmailDispatch}
              disabled={isSending || students.length === 0}
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-slate-205 disabled:text-slate-400 transition-all shadow-xs"
            >
              <Send size={13} />
              <span>{isSending ? 'Mengirim payload...' : 'Kirim Real-time Email'}</span>
            </button>
          </div>

          {/* Connection diagnostics console */}
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-slate-350 font-mono text-[10px] space-y-2 h-44 overflow-y-auto" id="smtp_socket_logs_viewport">
            <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Terminal size={11} className="text-emerald-400" />
              SMTP SOCKET CONSOLE LOGS
            </span>
            <div className="space-y-1 text-slate-300">
              {activeSocketLogs.length === 0 ? (
                <div className="text-slate-500 italic mt-4 text-center">Menunggu antrian transaksi pengiriman...</div>
              ) : (
                activeSocketLogs.map((log, i) => (
                  <div key={i} className={
                    log.startsWith('[SMTP] C:') ? 'text-sky-400 font-semibold' :
                    log.startsWith('[SMTP] S: 250') ? 'text-emerald-400' : 'text-slate-400'
                  }>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Dashboard Mock smart phone (8 cols) */}
        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-150 rounded-2xl p-4 bg-slate-50/50" id="smart_phone_workspace">
          {/* Inbox summary */}
          <div className="bg-white border border-slate-150 rounded-xl p-3 h-96 overflow-y-auto space-y-2" id="simulated_inbox">
            <div className="font-bold text-xs text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1">
              <Inbox size={12} className="text-sky-500" />
              Inbox Masuk Klien (@mail)
            </div>

            {emailLogs.length === 0 ? (
              <div className="text-center py-20 text-slate-400 font-medium text-xs">Simulasi kosong. Belum ada email terkirim.</div>
            ) : (
              emailLogs.map((log) => {
                const isActive = focusedEmailId === log.id;
                return (
                  <div
                    key={log.id}
                    onClick={() => setFocusedEmailId(log.id)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      isActive 
                        ? 'border-sky-500 bg-sky-50/55 shadow-xs' 
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-xs truncate max-w-36">{log.recipient}</span>
                      <span className="text-[9px] text-slate-400 font-mono">{log.timestamp.split('T')[1]?.substring(0, 5) || '10:30'}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700 mt-1 truncate">{log.subject}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{log.content}</div>
                  </div>
                );
              })
            )}
          </div>

          {/* Email Reader layout inside phone device frame */}
          <div className="bg-white border border-slate-150 rounded-xl p-3 h-96 overflow-y-auto flex flex-col justify-between" id="simulated_email_viewport">
            {focusedEmail ? (
              <div className="space-y-4 text-left" id="active_email_render">
                {/* Header info */}
                <div className="border-b border-slate-100 pb-3" id="email_header">
                  <div className="text-xs text-slate-400">Kode Transaksi: <span className="font-mono">{focusedEmail.id}</span></div>
                  <h3 className="font-black text-slate-800 text-sm mt-1">{focusedEmail.subject}</h3>
                  <div className="mt-2 text-[11px] text-slate-600 flex flex-col gap-0.5 font-medium">
                    <div><b>Pengirim:</b> noreply@student-system.ac.id <span className="text-[9px] bg-sky-50 text-sky-600 px-1 rounded border border-sky-100 font-bold ml-1">Terverifikasi</span></div>
                    <div><b>Kepada:</b> {focusedEmail.recipient}</div>
                  </div>
                </div>

                {/* Email Body Template */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-4 text-xs shadow-xs" id="email_content_body">
                  <div className="text-center font-bold text-slate-800 border-b border-slate-200 pb-2">
                    🎓 PORTAL INTEGRASI AKADEMIK MAHASISWA
                  </div>

                  <p className="text-slate-600 leading-relaxed font-sans text-[11px]">
                    {focusedEmail.type === 'OTP' ? (
                      <>
                        Yth. Pengguna, Kami mendeteksi permintaan verifikasi akun. Gunakan kode pengaman berikut:
                      </>
                    ) : focusedEmail.type === 'ACCOUNT_ALERTS' ? (
                      <>
                        Selamat Datang! Akun Anda untuk Portal Informasi Akademik Mahasiswa berhasil dibuat oleh Admin Database.
                      </>
                    ) : (
                      <>
                        Kami menerima instruksi pemulihan kredensial akun Anda. Silakan ikuti instruksi pengaktifan kembali:
                      </>
                    )}
                  </p>

                  {/* Highlights like Code or Code snippet */}
                  {focusedEmail.type === 'OTP' && (
                    <div className="text-center bg-white border border-slate-200 p-3 rounded-lg">
                      <div className="text-2xl font-black font-mono tracking-widest text-sky-600 animate-pulse">
                        {focusedEmail.verificationCode || '123456'}
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 tracking-wider block mt-1">MASUKKAN KODE INI DALAM 5 MENIT</span>
                    </div>
                  )}

                  {focusedEmail.type === 'ACCOUNT_ALERTS' && (
                    <div className="bg-white border border-slate-200 p-3 rounded-lg text-[10px] space-y-1 font-mono text-slate-700">
                      <div>ID Login: [NIM Mahasiswa]</div>
                      <div>Tipe Peran: Mahasiswa (Universitas)</div>
                      <div>Status Akun: AKTIF / UNLOCKED</div>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-400 leading-normal border-t border-slate-200 pt-3">
                    Email ini dibuat otomatis secara asimetris. Harap jangan membalas pesan ini langsung. © 2026 Admin Portal Akademik.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-slate-400 font-medium text-xs">
                Simulasi Klien HP Aktif. Kirim email untuk menguji penerimaan pesan.
              </div>
            )}

            <div className="border-t border-slate-100 pt-2 text-[9px] text-slate-400 font-mono text-center">
              MOCKUP DEVICE CLIENT - EST. 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
