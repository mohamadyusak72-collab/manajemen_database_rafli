/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentData {
  id: string;
  nim: string;
  nama: string;
  email: string;
  ipk: number;
  prodi: string;
  angkatan: number;
  phone: string;
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  type: 'OTP' | 'ACCOUNT_ALERTS' | 'PASSWORD_RESET' | 'WELCOME' | 'UPDATE';
  status: 'DELIVERED' | 'PENDING' | 'FAILED';
  verificationCode?: string;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  exceptionClass?: string;
  traceback?: string;
}

export interface SortingStep {
  array: number[];
  comparingIndices: number[];
  swappedIndices: number[];
  pivot?: number;
  description: string;
}

export interface SearchingStep {
  index: number;
  array: any[];
  range: [number, number]; // [low, high] for binary search
  found: boolean;
  message: string;
}
