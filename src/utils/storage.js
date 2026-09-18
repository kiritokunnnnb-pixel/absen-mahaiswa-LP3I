import { supabase } from '../lib/supabase';

const LOCAL_KEY = 'lp3i_attendance_records_fallback';

const getLocalRecords = () => {
  try {
    const item = localStorage.getItem(LOCAL_KEY);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
};

const saveLocalRecord = (record) => {
  try {
    const existing = getLocalRecords();
    const filtered = existing.filter((r) => r.id !== record.id);
    const updated = [record, ...filtered];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

// Helper: convert base64 dataUrl to Blob for upload
const dataUrlToBlob = (dataUrl) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
};

export const getAttendanceRecords = async () => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('waktu', { ascending: false });

    if (error) throw error;

    const dbRecords = (data || []).map((record) => ({
      ...record,
      fileProof: record.file_url
        ? {
            name: record.file_name,
            type: record.file_type,
            dataUrl: record.file_url,
          }
        : null,
    }));

    // Merge with local fallback records (if any created offline)
    const localRecords = getLocalRecords();
    const map = new Map();
    dbRecords.forEach((r) => map.set(r.id, r));
    localRecords.forEach((r) => {
      if (!map.has(r.id)) map.set(r.id, r);
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.waktu) - new Date(a.waktu)
    );
  } catch (error) {
    console.warn('Supabase fetch failed, returning local storage records:', error);
    return getLocalRecords();
  }
};

export const saveAttendanceRecord = async (newRecord) => {
  let file_url = null;
  let file_name = null;
  let file_type = null;

  try {
    // Upload file to Supabase Storage if a file proof is attached
    if (newRecord.fileProof && newRecord.fileProof.dataUrl) {
      try {
        const blob = dataUrlToBlob(newRecord.fileProof.dataUrl);
        const ext = newRecord.fileProof.name.split('.').pop();
        const storageName = `${newRecord.id}-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('bukti-kehadiran')
          .upload(storageName, blob, { contentType: newRecord.fileProof.type });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('bukti-kehadiran')
            .getPublicUrl(storageName);
          file_url = urlData.publicUrl;
          file_name = newRecord.fileProof.name;
          file_type = newRecord.fileProof.type;
        }
      } catch (fileErr) {
        console.warn('File upload warning:', fileErr);
      }
    }

    // Remove fileProof (base64) before sending to DB
    const { fileProof, ...recordData } = newRecord;

    const { error } = await supabase.from('attendance').insert({
      ...recordData,
      file_url,
      file_name,
      file_type,
    });

    if (error) throw error;

    // Save to local cache as backup
    saveLocalRecord(newRecord);

    return await getAttendanceRecords();
  } catch (error) {
    console.warn('Supabase insert failed, saving to local fallback storage:', error);
    // Save to local storage as fallback so data is NOT lost
    saveLocalRecord(newRecord);
    return await getAttendanceRecords();
  }
};

export const deleteAttendanceRecord = async (recordId) => {
  try {
    // Delete from Supabase
    const { data: record } = await supabase
      .from('attendance')
      .select('file_url')
      .eq('id', recordId)
      .single();

    if (record?.file_url) {
      const parts = record.file_url.split('/');
      const fileName = parts[parts.length - 1];
      await supabase.storage.from('bukti-kehadiran').remove([fileName]);
    }

    await supabase.from('attendance').delete().eq('id', recordId);
  } catch (error) {
    console.warn('Supabase delete failed:', error);
  }

  // Delete from local storage
  try {
    const existing = getLocalRecords();
    const updated = existing.filter((r) => r.id !== recordId);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  } catch {}

  return await getAttendanceRecords();
};
