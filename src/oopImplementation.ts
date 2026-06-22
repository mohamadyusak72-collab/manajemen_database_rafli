/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Custom Exception classes representing modern error handling
export class SystemException extends Error {
  constructor(public override message: string, public exceptionClass: string = 'SystemException') {
    super(message);
    this.name = exceptionClass;
  }
}

export class ValidationException extends SystemException {
  constructor(message: string) {
    super(message, 'ValidationException');
  }
}

export class DuplicateNIMException extends SystemException {
  constructor(message: string) {
    super(message, 'DuplicateNIMException');
  }
}

export class StudentNotFoundException extends SystemException {
  constructor(message: string) {
    super(message, 'StudentNotFoundException');
  }
}

// 1. Base Class representing human entity
export class Orang {
  protected _nama: string;
  protected _email: string;

  constructor(nama: string, email: string) {
    this._nama = nama;
    this._email = email;
  }

  // Encapsulation - Getters and Setters
  public get nama(): string {
    return this._nama;
  }

  public set nama(value: string) {
    if (!value || value.trim().length === 0) {
      throw new ValidationException('Nama tidak boleh kosong');
    }
    this._nama = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    // Regex validation inside setter (Encapsulation and Validation integration)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|student\.ac\.id)$/;
    if (!emailRegex.test(value)) {
      throw new ValidationException(`Format email '${value}' tidak valid. Gunakan format standar (Contoh: nama@domain.com atau nama@student.ac.id).`);
    }
    this._email = value;
  }

  // Polymorphism interface method
  public getSummary(): string {
    return `Orang: ${this._nama} (${this._email})`;
  }
}

// 2. Derived Class (Inheritance) representing a Student (Mahasiswa)
export class Mahasiswa extends Orang {
  private _nim: string;
  private _ipk: number;
  private _prodi: string;
  private _angkatan: number;
  private _phone: string;

  constructor(
    nama: string,
    email: string,
    nim: string,
    ipk: number,
    prodi: string,
    angkatan: number,
    phone: string
  ) {
    super(nama, email); // Call base constructor (Inheritance)
    
    // Encapsulation checking
    this._nim = '';
    this.nim = nim; // trigger setter
    
    this._ipk = 0;
    this.ipk = ipk; // trigger setter
    
    this._prodi = prodi;
    this._angkatan = angkatan;
    
    this._phone = '';
    this.phone = phone; // trigger setter
  }

  // Encapsulation for NIM (Regex Validation: must be numeric with exact format)
  public get nim(): string {
    return this._nim;
  }

  public set nim(value: string) {
    const nimRegex = /^\d{8,12}$/; // Typically NIM is between 8 to 12 digits
    if (!nimRegex.test(value)) {
      throw new ValidationException(`NIM '${value}' harus berupa angka sepanjang 8 hingga 12 karakter.`);
    }
    this._nim = value;
  }

  // Encapsulation for IPK (GPA check between 0.00 and 4.00)
  public get ipk(): number {
    return this._ipk;
  }

  public set ipk(value: number) {
    if (isNaN(value) || value < 0.0 || value > 4.0) {
      throw new ValidationException(`IPK '${value}' tidak valid. IPK harus berada pada rentang 0.00 s/d 4.00.`);
    }
    this._ipk = parseFloat(value.toFixed(2));
  }

  // Encapsulation for Phone
  public get phone(): string {
    return this._phone;
  }

  public set phone(value: string) {
    const phoneRegex = /^08\d{8,11}$/; // Indonesian phone format: 08xxxxxxxxxx
    if (value && !phoneRegex.test(value)) {
      throw new ValidationException(`Nomor telepon '${value}' tidak valid. Harus diawali '08' dengan total 10-13 digit.`);
    }
    this._phone = value || '';
  }

  public get prodi(): string {
    return this._prodi;
  }

  public set prodi(value: string) {
    if (!value) throw new ValidationException('Program Studi tidak boleh kosong');
    this._prodi = value;
  }

  public get angkatan(): number {
    return this._angkatan;
  }

  public set angkatan(value: number) {
    const currentYear = new Date().getFullYear();
    if (value < 2010 || value > currentYear + 1) {
      throw new ValidationException(`Tahun Angkatan ${value} tidak realistis.`);
    }
    this._angkatan = value;
  }

  // Polymorphism override (Overriding Orang's getSummary)
  public override getSummary(): string {
    return `Mahasiswa: ${this.nama} (NIM: ${this.nim}) - Prodi: ${this.prodi} (IPK: ${this.ipk.toFixed(2)})`;
  }

  // Helper conversion for state-sync
  public toObject() {
    return {
      id: this.nim, // using NIM as unique id
      nim: this.nim,
      nama: this.nama,
      email: this.email,
      ipk: this.ipk,
      prodi: this.prodi,
      angkatan: this.angkatan,
      phone: this.phone,
    };
  }
}

// 3. Companion Derived Class for Polymorphism demonstration (Dosen)
export class Dosen extends Orang {
  private _nidn: string;
  private _keahlian: string;

  constructor(nama: string, email: string, nidn: string, keahlian: string) {
    super(nama, email);
    this._nidn = nidn;
    this._keahlian = keahlian;
  }

  public get nidn(): string {
    return this._nidn;
  }

  public get keahlian(): string {
    return this._keahlian;
  }

  // Polymorphism override (We show the caller that calling getSummary returns dynamic content)
  public override getSummary(): string {
    return `Dosen: ${this.nama} (NIDN: ${this._nidn}) - Keahlian: ${this._keahlian}`;
  }
}

// 4. Pointer Simulation Classes (Node representing a single allocated pointer location)
export class NodeMahasiswa {
  public student: Mahasiswa;
  public nextPointer: string | null = null; // Stored as reference address mockup
  public prevPointer: string | null = null; // Stored as reference address mockup

  // High-fidelity simulation of physical addresses in memory
  public memoryAddress: string;

  constructor(student: Mahasiswa) {
    this.student = student;
    // Generate a simulated hex address (mock pointer)
    this.memoryAddress = '0x' + Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase();
  }
}

// Doubly Linked List encapsulating NodeMahasiswa pointers
export class LinkedMahasiswaList {
  public headAddress: string | null = null;
  public nodesMap: Map<string, NodeMahasiswa> = new Map(); // address -> Node

  // Converts a list of records into linked pointer nodes
  constructor(students: Mahasiswa[]) {
    let prevNode: NodeMahasiswa | null = null;

    students.forEach((student) => {
      const node = new NodeMahasiswa(student);
      this.nodesMap.set(node.memoryAddress, node);

      if (!prevNode) {
        this.headAddress = node.memoryAddress;
      } else {
        prevNode.nextPointer = node.memoryAddress;
        node.prevPointer = prevNode.memoryAddress;
      }
      prevNode = node;
    });
  }

  // Simulate updating pointers live
  public appendNode(student: Mahasiswa): string {
    const newNode = new NodeMahasiswa(student);
    this.nodesMap.set(newNode.memoryAddress, newNode);

    if (!this.headAddress) {
      this.headAddress = newNode.memoryAddress;
      return newNode.memoryAddress;
    }

    // Traverse pointers visually
    let currentAddress: string | null = this.headAddress;
    let tailAddress: string = currentAddress;

    while (currentAddress) {
      tailAddress = currentAddress;
      const currentNode = this.nodesMap.get(currentAddress);
      currentAddress = currentNode ? currentNode.nextPointer : null;
    }

    const tailNode = this.nodesMap.get(tailAddress);
    if (tailNode) {
      tailNode.nextPointer = newNode.memoryAddress;
      newNode.prevPointer = tailNode.memoryAddress;
    }

    return newNode.memoryAddress;
  }

  // Simulated node removal updating pointer links
  public removeNode(nim: string): boolean {
    let currentAddress: string | null = this.headAddress;

    while (currentAddress) {
      const currentNode = this.nodesMap.get(currentAddress);
      if (!currentNode) break;

      if (currentNode.student.nim === nim) {
        const prevAddr = currentNode.prevPointer;
        const nextAddr = currentNode.nextPointer;

        if (prevAddr) {
          const prevNode = this.nodesMap.get(prevAddr);
          if (prevNode) prevNode.nextPointer = nextAddr;
        } else {
          // It was head
          this.headAddress = nextAddr;
        }

        if (nextAddr) {
          const nextNode = this.nodesMap.get(nextAddr);
          if (nextNode) nextNode.prevPointer = prevAddr;
        }

        this.nodesMap.delete(currentAddress);
        return true;
      }

      currentAddress = currentNode.nextPointer;
    }
    return false;
  }
}
