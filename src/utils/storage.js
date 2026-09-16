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

export const getAttendanceRecords = async () => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('waktu', { ascending: false });

    if (error) throw error;

    // Reconstruct fileProof object so existing components still work
    return (data || []).map((record) => ({
      ...record,
      fileProof: record.file_url
        ? {
            name: record.file_name,
            type: record.file_type,
            dataUrl: record.file_url,
          }
        : null,
    }));
  } catch (error) {
    console.error('Failed to get attendance records:', error);
    return [];
  }
};

export const saveAttendanceRecord = async (newRecord) => {
  try {
    let file_url = null;
    let file_name = null;
    let file_type = null;

    // Upload file to Supabase Storage if a file proof is attached
    if (newRecord.fileProof && newRecord.fileProof.dataUrl) {
      const blob = dataUrlToBlob(newRecord.fileProof.dataUrl);
      const ext = newRecord.fileProof.name.split('.').pop();
      const storageName = `${newRecord.id}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('bukti-kehadiran')
        .upload(storageName, blob, { contentType: newRecord.fileProof.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('bukti-kehadiran')
        .getPublicUrl(storageName);

      file_url = urlData.publicUrl;
      file_name = newRecord.fileProof.name;
      file_type = newRecord.fileProof.type;
    }

    // Remove fileProof (base64) from what we send to DB
    const { fileProof, ...recordData } = newRecord;

    const { error } = await supabase.from('attendance').insert({
      ...recordData,
      file_url,
      file_name,
      file_type,
    });

    if (error) throw error;

    return await getAttendanceRecords();
  } catch (error) {
    console.error('Failed to save attendance record:', error);
    throw error;
  }
};

export const deleteAttendanceRecord = async (recordId) => {
  try {
    // Fetch record to get file reference before deleting
    const { data: record } = await supabase
      .from('attendance')
      .select('file_url')
      .eq('id', recordId)
      .single();

    // Delete file from storage if it exists
    if (record?.file_url) {
      const parts = record.file_url.split('/');
      const fileName = parts[parts.length - 1];
      await supabase.storage.from('bukti-kehadiran').remove([fileName]);
    }

    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', recordId);

    if (error) throw error;

    return await getAttendanceRecords();
  } catch (error) {
    console.error('Failed to delete attendance record:', error);
    throw error;
  }
};
