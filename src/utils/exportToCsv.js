export const exportAttendanceToCSV = (records, filename = 'rekapan_kehadiran_mahasiswa.csv') => {
  if (!records || !records.length) {
    alert('Tidak ada data kehadiran yang bisa diekspor.');
    return;
  }

  const headers = ['ID Presensi', 'NIM', 'Nama Mahasiswa', 'Kelas', 'Mata Kuliah', 'Status Kehadiran', 'Tanggal & Waktu', 'Catatan', 'Memiliki Bukti'];

  const rows = records.map(record => [
    `"${record.id || ''}"`,
    `"${record.nim || ''}"`,
    `"${(record.nama || '').replace(/"/g, '""')}"`,
    `"${record.kelas || ''}"`,
    `"${(record.matakuliah || '').replace(/"/g, '""')}"`,
    `"${record.status || ''}"`,
    `"${record.waktu ? new Date(record.waktu).toLocaleString('id-ID') : ''}"`,
    `"${(record.catatan || '').replace(/"/g, '""')}"`,
    `"${record.fileProof ? record.fileProof.name : 'Tidak Ada'}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
