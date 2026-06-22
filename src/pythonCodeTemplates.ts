/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PYTHON_SISTEM_MAHASISWA_CODE = `import json
import csv
import re
import math
import sys
from datetime import datetime

# ==============================================================================
# 1. STRUKTUR EXCEPTION MANDIRI (Exception/Error Handling)
# ==============================================================================
class ValidationException(Exception):
    """Exception untuk kesalahan validasi input data."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message

class DuplicateNIMException(Exception):
    """Exception jika NIM yang didaftarkan sudah ada dalam sistem."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message

class StudentNotFoundException(Exception):
    """Exception jika Mahasiswa yang dicari tidak ditemukan."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message


# ==============================================================================
# 2. IMPLEMENTASI KONSEP OOP (Encapsulation, Inheritance, Polymorphism)
# ==============================================================================
class Orang:
    """Base Class (Inheritance) representing a person."""
    def __init__(self, nama: str, email: str):
        self._nama = nama         # Encapsulation - Protected Field
        self._email = email       # Encapsulation - Protected Field

    # Getter & Setter untuk Nama (Encapsulation)
    @property
    def nama(self):
        return self._nama

    @nama.setter
    def nama(self, value):
        if not value or len(value.strip()) == 0:
            raise ValidationException("Nama tidak boleh kosong.")
        self._nama = value

    # Getter & Setter untuk Email dengan validasi Regex (Encapsulation)
    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, value):
        # Regex check: standard or student.ac.id
        regex = r"^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}|student\\.ac\\.id)$"
        if not re.match(regex, value):
            raise ValidationException(f"Format email '{value}' tidak valid.")
        self._email = value

    def info_singkat(self) -> str:
        """Polymorphism placeholder method."""
        return f"Orang: {self._nama} ({self._email})"


class Mahasiswa(Orang):
    """Derived Class (Inheritance dari Orang) untuk Mahasiswa."""
    def __init__(self, nama: str, email: str, nim: str, ipk: float, prodi: str, angkatan: int, phone: str):
        super().__init__(nama, email) # Memanggil constructor base class
        self._nim = ""
        self._ipk = 0.0
        self._phone = ""
        
        # Trigger setters
        self.nim = nim
        self.ipk = ipk
        self.phone = phone
        
        self.prodi = prodi
        self.angkatan = angkatan

    # Getter & Setter NIM (Encapsulation & Regex Validation)
    @property
    def nim(self):
        return self._nim

    @nim.setter
    def nim(self, value):
        if not re.match(r"^\\d{8,12}$", value):
            raise ValidationException(f"NIM '{value}' harus berupa angka sepanjang 8-12 digit.")
        self._nim = value

    # Getter & Setter IPK (Encapsulation & Range Validation)
    @property
    def ipk(self):
        return self._ipk

    @ipk.setter
    def ipk(self, value):
        try:
            val = float(value)
        except ValueError:
            raise ValidationException("IPK harus berupa angka desimal.")
        if val < 0.0 or val > 4.0:
            raise ValidationException("Rentang IPK harus berada pada 0.00 hingga 4.00.")
        self._ipk = round(val, 2)

    # Getter & Setter Phone
    @property
    def phone(self):
        return self._phone

    @phone.setter
    def phone(self, value):
        if value and not re.match(r"^08\\d{8,11}$", value):
            raise ValidationException(f"Nomor telepon '{value}' tidak valid (Gunakan format 08xxxxxxxxxx).")
        self._phone = value

    # Polymorphism Override
    def info_singkat(self) -> str:
        return f"Mahasiswa: {self.nama} [NIM: {self.nim}] - Prodi: {self.prodi} (IPK: {self.ipk})"


# ==============================================================================
# 3. IMPLEMENTASI POINTER & STRUKTUR DATA NODE (Pointer Concept)
# ==============================================================================
class NodeMahasiswa:
    """Representasi visual dari Node Memory untuk Pointer Simulation."""
    def __init__(self, mhs_obj: Mahasiswa):
        self.mahasiswa = mhs_obj
        self.next = None  # Pointer ke Node selanjutnya
        self.prev = None  # Pointer ke Node sebelumnya (Doubly Linked)
        self.address = hex(id(self)) # Mengakses pseudo-alamat memory fisik asli Python


class LinkedMahasiswaList:
    """Implementasi List menggunakan Pointer untuk visualisasi memory."""
    def __init__(self):
        self.head = None
        self.tail = None

    def insert_akhir(self, mhs: Mahasiswa):
        new_node = NodeMahasiswa(mhs)
        if not self.head:
            self.head = new_node
            self.tail = new_node
        else:
            self.tail.next = new_node
            new_node.prev = self.tail
            self.tail = new_node
        return new_node.address

    def hapus_by_nim(self, nim: str) -> bool:
        current = self.head
        while current:
            if current.mahasiswa.nim == nim:
                if current.prev:
                    current.prev.next = current.next
                else:
                    self.head = current.next

                if current.next:
                    current.next.prev = current.prev
                else:
                    self.tail = current.prev
                return True
            current = current.next
        return False

    def to_list(self):
        result = []
        current = self.head
        while current:
            result.append(current.mahasiswa)
            current = current.next
        return result


# ==============================================================================
# 4. ALGORITMA SEARCHING (Linear/Sequential & Binary Search)
# ==============================================================================
def sequential_search(daftar_mhs, key: str, field: str = "nim"):
    """
    Sequential/Linear Search.
    Time Complexity: O(N) - worst/average, O(1) - best case.
    """
    for i, mhs in enumerate(daftar_mhs):
        val = getattr(mhs, field)
        if str(val).lower() == key.lower():
            return mhs, i
    return None, -1


def binary_search(daftar_mhs_sorted, target_nim: str):
    """
    Binary Search (Syarat: array sudah harus diurutkan berdasarkan NIM).
    Time Complexity: O(log N) - worst/average, O(1) - best case.
    """
    low = 0
    high = len(daftar_mhs_sorted) - 1

    while low <= high:
        mid = (low + high) // 2
        mid_nim = daftar_mhs_sorted[mid].nim
        
        if mid_nim == target_nim:
            return daftar_mhs_sorted[mid], mid
        elif mid_nim < target_nim:
            low = mid + 1
        else:
            high = mid - 1
            
    return None, -1


# ==============================================================================
# 5. ALGORITMA SORTING (Bubble, Selection, Insertion, Merge Sort)
# ==============================================================================
def bubble_sort(arr, field: str = "nim", reverse: bool = False):
    """
    Bubble Sort.
    Time Complexity: O(N^2).
    """
    n = len(arr)
    working_arr = list(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            val1 = getattr(working_arr[j], field)
            val2 = getattr(working_arr[j+1], field)
            
            # Comparison check
            condition = (val1 > val2) if not reverse else (val1 < val2)
            if condition:
                working_arr[j], working_arr[j+1] = working_arr[j+1], working_arr[j]
    return working_arr


def selection_sort(arr, field: str = "ipk", reverse: bool = True):
    """
    Selection Sort.
    Time Complexity: O(N^2).
    """
    n = len(arr)
    working_arr = list(arr)
    for i in range(n):
        idx_target = i
        for j in range(i+1, n):
            val1 = getattr(working_arr[j], field)
            val2 = getattr(working_arr[idx_target], field)
            
            condition = (val1 > val2) if reverse else (val1 < val2)
            if condition:
                idx_target = j
                
        working_arr[i], working_arr[idx_target] = working_arr[idx_target], working_arr[i]
    return working_arr


def insertion_sort(arr, field: str = "id", reverse: bool = False):
    """
    Insertion Sort.
    Time Complexity: O(N^2).
    """
    working_arr = list(arr)
    for i in range(1, len(working_arr)):
        key_node = working_arr[i]
        key_val = getattr(key_node, field)
        j = i - 1
        
        while j >= 0:
            compare_val = getattr(working_arr[j], field)
            condition = (compare_val > key_val) if not reverse else (compare_val < key_val)
            if condition:
                working_arr[j + 1] = working_arr[j]
                j -= 1
            else:
                break
        working_arr[j + 1] = key_node
    return working_arr


def merge_sort(arr, field: str = "angkatan", reverse: bool = False):
    """
    Merge Sort.
    Time Complexity: O(N log N).
    """
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid], field, reverse)
    right = merge_sort(arr[mid:], field, reverse)

    return _merge(left, right, field, reverse)

def _merge(left, right, field, reverse):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        val1 = getattr(left[i], field)
        val2 = getattr(right[j], field)
        
        condition = (val1 <= val2) if not reverse else (val1 >= val2)
        if condition:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result


# ==============================================================================
# 6. PENYIMPANAN DATA & FILE I/O (JSON/CSV)
# ==============================================================================
def simpan_ke_json(daftar_mhs, filepath="mahasiswa.json"):
    """Menyimpan seluruh data mahasiswa terdaftar ke file JSON."""
    data = []
    for mhs in daftar_mhs:
        data.append({
            "nim": mhs.nim,
            "nama": mhs.nama,
            "email": mhs.email,
            "ipk": mhs.ipk,
            "prodi": mhs.prodi,
            "angkatan": mhs.angkatan,
            "phone": mhs.phone
        })
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)


def muat_dari_json(filepath="mahasiswa.json"):
    """Membaca data mahasiswa dari file JSON."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            return [Mahasiswa(**item) for item in data]
    except FileNotFoundError:
        return []
    except Exception as e:
        print(f"Error memuat file: {e}")
        return []


def simpan_ke_csv(daftar_mhs, filepath="mahasiswa.csv"):
    """Ekspor data ke file CSV."""
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["NIM", "Nama", "Email", "IPK", "Prodi", "Angkatan", "No HP"])
        for mhs in daftar_mhs:
            writer.writerow([mhs.nim, mhs.nama, mhs.email, mhs.ipk, mhs.prodi, mhs.angkatan, mhs.phone])


# ==============================================================================
# 7. FITUR REAL-TIME EMAIL SIMULATOR (OTP & NOTIFIKASI)
# ==============================================================================
def kirim_email_simulasi(email_tujuan: str, jenis_notifikasi: str, detail_data: dict):
    """
    Simulasi pengiriman email interaktif secara real-time.
    Dalam aslinya bisa diintegrasikan dengan modul 'smtplib'.
    """
    print("-" * 50)
    print(f">> MENGIRIM EMAIL [REAL-TIME DISPATCHER] ...")
    print(f"Kepada      : {email_tujuan}")
    print(f"Timestamp   : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    if jenis_notifikasi == "OTP":
        otp_code = detail_data.get("otp", "123456")
        print(f"Subjek      : Kode Verifikasi Keamanan OTP")
        print(f"Konten      : Yth. Pengguna, Kode OTP Anda adalah: {otp_code}")
    elif jenis_notifikasi == "WELCOME":
        nama = detail_data.get("nama", "Mahasiswa")
        nim = detail_data.get("nim", "")
        print(f"Subjek      : Selamat Datang di Sistem Akademik")
        print(f"Konten      : Halo {nama},\\nAkun Anda dengan NIM {nim} berhasil didaftarkan!")
    elif jenis_notifikasi == "UPDATE":
        print(f"Subjek      : Pemberitahuan Pembaruan Data Profil")
        print(f"Konten      : Profil mahasiswa Anda diubah pada sistem.")
        
    print(f"Status      : DELIVERED (Sukses Terkirim)")
    print("-" * 50)


# ==============================================================================
# 8. SISTEM LOGIN DENGAN VALIDASI RETRY
# ==============================================================================
def system_login():
    """Mengendalikan otentikasi login dengan maksimal 3 kali percobaan."""
    username_terdaftar = "admin"
    password_terdaftar = "mahasiswa123"
    percobaan = 3

    print("=" * 60)
    print("      LOGIN SYSTEM - SISTEM INFORMASI AKADEMIK MAHASISWA")
    print("=" * 60)

    while percobaan > 0:
        username = input("Username: ")
        password = input("Password: ")

        if username == username_terdaftar and password == password_terdaftar:
            print("\\n[SUCCESS] Login sukses! Selamat datang Admin.\\n")
            return True
        else:
            percobaan -= 1
            print(f"[REJECTED] Username atau Password salah.")
            if percobaan > 0:
                print(f"Sisa percobaan login: {percobaan}x. Silakan coba lagi.\\n")
            else:
                print("[LOCKOUT] Percobaan habis! Anda terkunci dari sistem.")
                sys.exit()
    return False


# ==============================================================================
# 9. MENU UTAMA (SISTEM MANAJEMEN DATA MAHASISWA)
# ==============================================================================
def main():
    # Login mandiri sebelum menggunakan CRUD
    if not system_login():
        return

    # Inisialisasi struktur Linked List & Muat simpanan file
    db_linked = LinkedMahasiswaList()
    
    # Tambah data dummy awal jika kosong
    dummy_data = [
        Mahasiswa("Adrian Wijaya", "adrian@student.ac.id", "23011032", 3.82, "Teknik Informatika", 2023, "081234567890"),
        Mahasiswa("Siti Rahma", "siti@student.ac.id", "23011044", 3.71, "Sistem Informasi", 2023, "081345678911"),
        Mahasiswa("Budi Santoso", "budi.s@student.ac.id", "22011123", 2.95, "Teknik Elektro", 2022, "081987654321")
    ]
    for d in dummy_data:
        db_linked.insert_akhir(d)

    while True:
        print("+" * 60)
        print("          MENU UTAMA MANAJEMEN DATA MAHASISWA")
        print("+" * 60)
        print("1. Tambah Data Mahasiswa (C)")
        print("2. Tampilkan Semua Data Mahasiswa (R)")
        print("3. Edit Data Mahasiswa (U)")
        print("4. Hapus Data Mahasiswa (D)")
        print("5. Cari Mahasiswa (Searching - Linear / Binary)")
        print("6. Urutkan Mahasiswa (Sorting)")
        print("7. Ekspor/Simpan Data (File I/O)")
        print("8. Kirim Simulasi Email OTP")
        print("9. Keluar")
        print("-" * 60)
        
        pilihan = input("Pilih Menu (1-9): ").strip()
        
        try:
            if pilihan == "1":
                print("\\n-- INPUT DATA MAHASISWA BARU --")
                nama = input("Masukkan Nama: ")
                email = input("Masukkan Email: ")
                nim = input("Masukkan NIM: ")
                ipk_str = input("Masukkan IPK (0.00 - 4.00): ")
                prodi = input("Masukkan Program Studi: ")
                angkatan_str = input("Masukkan Tahun Angkatan: ")
                phone = input("Masukkan No Telepon (08xxxxxxxx): ")
                
                # Exception error handling input types
                try:
                    ipk = float(ipk_str)
                    angkatan = int(angkatan_str)
                except ValueError:
                    raise ValidationException("IPK harus berupa angka desimal dan Angkatan harus integer.")

                # Check Duplicate NIM menggunakan sequential search
                daftar_sekarang = db_linked.to_list()
                existing, _ = sequential_search(daftar_sekarang, nim, "nim")
                if existing:
                    raise DuplicateNIMException(f"NIM {nim} sudah terdaftar di sistem!")

                # Validasi format via constructor setter
                mhs_baru = Mahasiswa(nama, email, nim, ipk, prodi, angkatan, phone)
                
                # Masukkan menggunakan pointer list
                addr = db_linked.insert_akhir(mhs_baru)
                print(f"\\n[OK] Mahasiswa berhasil ditambahkan ke memori di alamat {addr}!")
                
                # Simulasi Email Notifikasi Pendaftaran Akun Baru secara Real-time
                kirim_email_simulasi(mhs_baru.email, "WELCOME", {"nama": mhs_baru.nama, "nim": mhs_baru.nim})

            elif pilihan == "2":
                daftar = db_linked.to_list()
                print(f"\\n-- DATA MAHASISWA ({len(daftar)} Terdaftar) --")
                if not daftar:
                    print("Belum ada data mahasiswa.")
                else:
                    for idx, mhs in enumerate(daftar):
                        print(f"{idx+1}. {mhs.info_singkat()}")
                print()

            elif pilihan == "3":
                print("\\n-- EDIT DATA MAHASISWA --")
                nim = input("Masukkan NIM mahasiswa yang akan diedit: ")
                daftar = db_linked.to_list()
                mhs, _ = sequential_search(daftar, nim, "nim")
                
                if not mhs:
                    raise StudentNotFoundException(f"Mahasiswa dengan NIM {nim} tidak ditemukan.")
                
                print(f"Data Saat Ini: {mhs.info_singkat()}")
                mhs.nama = input(f"Masukkan Nama Baru (Kosongkan jika tetap '{mhs.nama}'): ") or mhs.nama
                mhs.email = input(f"Masukkan Email Baru (Kosongkan jika tetap '{mhs.email}'): ") or mhs.email
                ipk_any = input(f"Masukkan IPK Baru (Kosongkan jika tetap '{mhs.ipk}'): ")
                if ipk_any: mhs.ipk = float(ipk_any)
                mhs.prodi = input(f"Masukkan Prodi Baru (Kosongkan jika tetap '{mhs.prodi}'): ") or mhs.prodi
                
                angkatan_any = input(f"Masukkan Angkatan Baru (Kosongkan jika tetap '{mhs.angkatan}'): ")
                if angkatan_any: mhs.angkatan = int(angkatan_any)
                
                mhs.phone = input(f"Masukkan No Telpon Baru (Kosongkan jika tetap '{mhs.phone}'): ") or mhs.phone
                
                print("\\n[OK] Data Mahasiswa berhasil diperbarui!")
                kirim_email_simulasi(mhs.email, "UPDATE", {})

            elif pilihan == "4":
                print("\\n-- HAPUS DATA MAHASISWA --")
                nim = input("Masukkan NIM yang ingin dihapus: ")
                sukses = db_linked.hapus_by_nim(nim)
                if sukses:
                    print(f"[OK] Mahasiswa NIM {nim} didelete dari pointer memory list.")
                else:
                    raise StudentNotFoundException(f"Hapus gagal, NIM {nim} tidak terdaftar.")

            elif pilihan == "5":
                print("\\n-- CARI MAHASISWA --")
                print("1. Linear / Sequential Search (Bisa cari berdasarkan Nama/Email/NIM, O(N))")
                print("2. Binary Search (Cepat, khusus pencarian NIM terurut, O(log N))")
                sub_pilih = input("Metode Pencarian (1-2): ")
                
                daftar = db_linked.to_list()
                
                if sub_pilih == "1":
                    field = input("Cari berdasarkan (nama/nim/email): ").strip().lower()
                    kunci = input("Masukkan nilai pencarian: ")
                    hasil, pos = sequential_search(daftar, kunci, field)
                    if hasil:
                        print(f"\\n[FOUND] Mahasiswa ditemukan di indeks-{pos} (O(N) search):")
                        print(hasil.info_singkat())
                    else:
                        print("\\n[NOT FOUND] Mahasiswa tidak ditemukan.")
                
                elif sub_pilih == "2":
                    kunci = input("Masukkan NIM yang dicari: ")
                    # Binary search mewajibkan NIM terurut! Urutkan dulu menggunakan Merge Sort
                    daftar_sorted = merge_sort(daftar, "nim")
                    hasil, pos = binary_search(daftar_sorted, kunci)
                    if hasil:
                        print(f"\\n[FOUND] Mahasiswa ditemukan di indeks-{pos} setelah diurutkan NIM (O(log N) search):")
                        print(hasil.info_singkat())
                    else:
                        print("\\n[NOT FOUND] NIM mahasiswa tidak ditemukan.")

            elif pilihan == "6":
                print("\\n-- URUTKAN DATA MAHASISWA (SORTING) --")
                print("1. Bubble Sort (NIM - Ascending, O(N^2))")
                print("2. Selection Sort (IPK - Descending/Tertinggi, O(N^2))")
                print("3. Insertion Sort (Nama - Ascending, O(N^2))")
                print("4. Merge Sort (Angkatan - Ascending, O(N log N))")
                
                sub_sort = input("Pilih Algoritma Sorting (1-4): ")
                daftar = db_linked.to_list()
                
                if not daftar:
                    print("Array kosong, tidak ada data untuk disort.")
                    continue
                
                mulai_t = datetime.now()
                if sub_sort == "1":
                    hasil = bubble_sort(daftar, "nim", False)
                    print("\\nHasil Bubble Sort berdasarkan NIM Ascending:")
                elif sub_sort == "2":
                    hasil = selection_sort(daftar, "ipk", True)
                    print("\\nHasil Selection Sort berdasarkan IPK Tertinggi:")
                elif sub_sort == "3":
                    hasil = insertion_sort(daftar, "nama", False)
                    print("\\nHasil Insertion Sort berdasarkan Nama:")
                elif sub_sort == "4":
                    hasil = merge_sort(daftar, "angkatan", False)
                    print("\\nHasil Merge Sort berdasarkan Angkatan:")
                else:
                    print("Pilihan invalid.")
                    continue
                    
                durasi = (datetime.now() - mulai_t).total_seconds() * 1000
                for idx, m in enumerate(hasil):
                    print(f"[{idx}] - {m.info_singkat()}")
                print(f"Estimasi Running Time: ~{durasi:.4f} ms")

            elif pilihan == "7":
                print("\\n-- EKSPOR DATA KE FILE (FILE I/O) --")
                print("1. Simpan/Ekspor ke JSON (mahasiswa.json)")
                print("2. Simpan/Ekspor ke CSV (mahasiswa.csv)")
                sub_io = input("Pilihan (1-2): ")
                
                daftar = db_linked.to_list()
                if sub_io == "1":
                    simpan_ke_json(daftar)
                    print("[OK] Data tersimpan di mahasiswa.json!")
                elif sub_io == "2":
                    simpan_ke_csv(daftar)
                    print("[OK] Data diekspor ke mahasiswa.csv!")

            elif pilihan == "8":
                print("\\n-- SIMULASI KIRIM EMAIL OTP --")
                email = input("Masukkan Email Mahasiswa Penerima: ")
                # OTP random generator mockup
                import random
                otp = f"{random.randint(100000, 999999)}"
                kirim_email_simulasi(email, "OTP", {"otp": otp})

            elif pilihan == "9":
                print("\\nTerima kasih telah menggunakan sistem informasi mahasiswa.")
                break
                
        # Error handling global try-except block
        except ValidationException as ve:
            print(f"\\n[ERROR VALIDASI] Kesalahan Input: {ve.message}")
        except DuplicateNIMException as de:
            print(f"\\n[ERROR DUPLIKASI] NIM Bermasalah: {de.message}")
        except StudentNotFoundException as se:
            print(f"\\n[ERROR NOT FOUND] Data Hilang: {se.message}")
        except Exception as e:
            print(f"\\n[LOG SYSTEM ERROR] Kesalahan Tidak Terduga: {e}")
        
        print()

if __name__ == "__main__":
    main()
`;
