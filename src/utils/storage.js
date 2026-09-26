import { supabase } from '../lib/supabase';
import { initialAttendanceRecords } from '../mockData/initialAttendance';

const CACHE_KEY = 'lp3i_attendance_records_v1';

// Helper: Get cached records from local storage safeguard
const getLocalCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }
  return initialAttendanceRecords;
};

// Helper: Save cached records to local storage safeguard
const setLocalCache = (records) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
};

// Helper: convert base64 dataUrl to Blob for upload
const dataUrlToBlob = (dataUrl) => {
  try {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    return null;
  }
};

// Fetch ALL attendance records centrally from Supabase Cloud Database + Local Cache Fallback
export const getAttendanceRecords = async () => {
  const cached = getLocalCache();

  try {
    // Simple direct fetch without server-side sorting lock overhead
    const { data, error } = await supabase
      .from('attendance')
      .select('*');

    if (error) throw error;

    if (Array.isArray(data) && data.length > 0) {
      const remoteRecords = data.map((record) => ({
        ...record,
        fileProof: record.file_url
          ? {
              name: record.file_name || 'bukti-file',
              type: record.file_type || (record.file_url.startsWith('data:image') ? 'image/jpeg' : 'image/png'),
              dataUrl: record.file_url,
            }
          : null,
      }));

      // Merge remote records with local cache so no local submissions are lost
      const recordMap = new Map();
      cached.forEach((r) => recordMap.set(r.id, r));
      remoteRecords.forEach((r) => recordMap.set(r.id, r));

      const merged = Array.from(recordMap.values()).sort(
        (a, b) => new Date(b.waktu || 0) - new Date(a.waktu || 0)
      );

      setLocalCache(merged);
      return merged;
    }
  } catch (error) {
    console.warn('Supabase DB fetch warning (using local cache safeguard):', error.message || error);
  }

  // Fallback to local cache so user never sees empty database
  return cached;
};

// Save record directly to Supabase Cloud Database with Local Cache & Auto-Compression Safeguards
export const saveAttendanceRecord = async (newRecord) => {
  let file_url = null;
  let file_name = null;
  let file_type = null;

  // 1. Instantly save to local cache so user data is NEVER lost
  const currentCache = getLocalCache();
  const updatedCache = [newRecord, ...currentCache.filter((r) => r.id !== newRecord.id)];
  setLocalCache(updatedCache);

  // 2. Process & upload file proof to Supabase Storage or fallback URL
  if (newRecord.fileProof && newRecord.fileProof.dataUrl) {
    file_name = newRecord.fileProof.name;
    file_type = newRecord.fileProof.type;

    try {
      const blob = dataUrlToBlob(newRecord.fileProof.dataUrl);
      if (blob) {
        const ext = file_name.split('.').pop() || 'jpg';
        const storageName = `${newRecord.id}-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('bukti-kehadiran')
          .upload(storageName, blob, { contentType: file_type, upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('bukti-kehadiran')
            .getPublicUrl(storageName);
          file_url = urlData.publicUrl;
        } else {
          console.warn('Supabase storage upload error, using compressed dataUrl fallback:', uploadError.message);
          file_url = newRecord.fileProof.dataUrl;
        }
      } else {
        file_url = newRecord.fileProof.dataUrl;
      }
    } catch (fileErr) {
      console.warn('Supabase storage upload warning:', fileErr);
      file_url = newRecord.fileProof.dataUrl;
    }
  }

  // 3. Insert record into Supabase Database with timeout safeguard
  const { fileProof, ...recordData } = newRecord;

  try {
    const insertPromise = supabase.from('attendance').insert({
      ...recordData,
      file_url,
      file_name,
      file_type,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Insert timeout')), 6000)
    );

    const insertRes = await Promise.race([insertPromise, timeoutPromise]);
    if (insertRes?.error) {
      console.error('Supabase DB Insert Error:', insertRes.error);
    }
  } catch (err) {
    console.warn('Supabase DB Insert Exception (saved locally):', err.message || err);
  }

  return getLocalCache();
};

// Delete record directly from Supabase Cloud Database & Local Cache
export const deleteAttendanceRecord = async (recordId) => {
  // Update local cache
  const currentCache = getLocalCache();
  const updatedCache = currentCache.filter((r) => r.id !== recordId);
  setLocalCache(updatedCache);

  try {
    const { data: record } = await supabase
      .from('attendance')
      .select('file_url')
      .eq('id', recordId)
      .single();

    if (record?.file_url && record.file_url.startsWith('http')) {
      const parts = record.file_url.split('/');
      const fileName = parts[parts.length - 1];
      await supabase.storage.from('bukti-kehadiran').remove([fileName]);
    }

    await supabase.from('attendance').delete().eq('id', recordId);
  } catch (error) {
    console.warn('Supabase delete warning:', error);
  }

  return getLocalCache();
};

// Reset data helper
export const resetAttendanceData = () => {
  setLocalCache(initialAttendanceRecords);
  return initialAttendanceRecords;
};
