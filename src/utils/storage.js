import { supabase } from '../lib/supabase';

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

// Fetch ALL attendance records centrally from Supabase Cloud Database
export const getAttendanceRecords = async () => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('waktu', { ascending: false });

    if (error) throw error;

    return (data || []).map((record) => ({
      ...record,
      fileProof: record.file_url
        ? {
            name: record.file_name || 'bukti-file',
            type: record.file_type || 'image/png',
            dataUrl: record.file_url,
          }
        : null,
    }));
  } catch (error) {
    console.error('Failed to fetch from Supabase Cloud DB:', error);
    throw error;
  }
};

// Save record directly to Supabase Cloud Database
export const saveAttendanceRecord = async (newRecord) => {
  let file_url = null;
  let file_name = null;
  let file_type = null;

  // Process & upload file proof to Supabase Storage or Cloud DB (max 2MB)
  if (newRecord.fileProof && newRecord.fileProof.dataUrl) {
    file_name = newRecord.fileProof.name;
    file_type = newRecord.fileProof.type;

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
      } else {
        // Fallback: Store dataUrl directly in file_url column if storage bucket has policy restrictions
        file_url = newRecord.fileProof.dataUrl;
      }
    } catch (fileErr) {
      console.warn('Supabase storage upload warning, storing file dataUrl directly:', fileErr);
      file_url = newRecord.fileProof.dataUrl;
    }
  }

  // Remove local fileProof object before payload insert
  const { fileProof, ...recordData } = newRecord;

  const { error } = await supabase.from('attendance').insert({
    ...recordData,
    file_url,
    file_name,
    file_type,
  });

  if (error) {
    console.error('Supabase DB Insert Error:', error);
    throw new Error(error.message || 'Gagal menyimpan ke database cloud Supabase');
  }

  return await getAttendanceRecords();
};

// Delete record directly from Supabase Cloud Database
export const deleteAttendanceRecord = async (recordId) => {
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

    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', recordId);

    if (error) throw error;
  } catch (error) {
    console.error('Supabase delete error:', error);
    throw error;
  }

  return await getAttendanceRecords();
};
