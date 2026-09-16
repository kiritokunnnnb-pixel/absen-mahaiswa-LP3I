// Mock initial attendance data for realistic demonstration
export const initialAttendanceRecords = [
  {
    id: "ABS-20260904-001",
    nim: "2201010045",
    nama: "Budi Pratama",
    kelas: "TI-3A",
    matakuliah: "Pemrograman Web Lanjut",
    status: "Hadir",
    waktu: "2026-09-04T08:15:00.000Z",
    catatan: "Hadir tepat waktu di kelas LKP-1",
    fileProof: null,
  },
  {
    id: "ABS-20260904-002",
    nim: "2201010088",
    nama: "Siti Rahmawati",
    kelas: "TI-3A",
    matakuliah: "Pemrograman Web Lanjut",
    status: "Sakit",
    waktu: "2026-09-04T08:20:00.000Z",
    catatan: "Demam dan flu berat, istirahat dokter",
    fileProof: {
      name: "Surat_Keterangan_Dokter.pdf",
      type: "application/pdf",
      size: 245120,
      dataUrl: "data:application/pdf;base64,JVBERi0xLjQKJSDi48jN..." // Mock PDF tag
    }
  },
  {
    id: "ABS-20260904-003",
    nim: "2201010102",
    nama: "Ahmad Rizky",
    kelas: "TI-3A",
    matakuliah: "Pemrograman Web Lanjut",
    status: "Izin",
    waktu: "2026-09-04T08:35:00.000Z",
    catatan: "Mengikuti kompetisi Hackathon tingkat nasional",
    fileProof: {
      name: "Surat_Izin_Dispen_Hackathon.png",
      type: "image/png",
      size: 512000,
      // Sample SVG/PNG placeholder data url
      dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%231e293b'/><text x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' fill='%2338bdf8' font-size='18' font-family='sans-serif'>SURAT DISPENSASI KAMPUS</text><text x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='14' font-family='sans-serif'>An. Ahmad Rizky - Nim 2201010102</text></svg>"
    }
  },
  {
    id: "ABS-20260904-004",
    nim: "2201010031",
    nama: "Dewi Lestari",
    kelas: "TI-3B",
    matakuliah: "Basa Data Lanjut",
    status: "Hadir",
    waktu: "2026-09-04T09:05:00.000Z",
    catatan: "Hadir",
    fileProof: null,
  },
  {
    id: "ABS-20260904-005",
    nim: "2201010119",
    nama: "Faris Kurniawan",
    kelas: "TI-3B",
    matakuliah: "Basa Data Lanjut",
    status: "Sakit",
    waktu: "2026-09-04T09:12:00.000Z",
    catatan: "Rawat jalan klinik pratama",
    fileProof: {
      name: "Kuitansi_Klinik.jpg",
      type: "image/jpeg",
      size: 320000,
      dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f172a'/><text x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' fill='%23f43f5e' font-size='18' font-family='sans-serif'>SURAT KETERANGAN SAKIT</text><text x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' fill='%23cbd5e1' font-size='14' font-family='sans-serif'>Pasien: Faris Kurniawan</text></svg>"
    }
  }
];
