import { initialAttendanceRecords } from '../mockData/initialAttendance';

const STORAGE_KEY = 'absensi_mahasiswa_db_v1';

export const getAttendanceRecords = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Seed initial mock data if first time
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAttendanceRecords));
      return initialAttendanceRecords;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read attendance records:', error);
    return initialAttendanceRecords;
  }
};

export const saveAttendanceRecord = (newRecord) => {
  try {
    const existingRecords = getAttendanceRecords();
    const updatedRecords = [newRecord, ...existingRecords];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
    return updatedRecords;
  } catch (error) {
    console.error('Failed to save attendance record:', error);
    throw error;
  }
};

export const deleteAttendanceRecord = (recordId) => {
  try {
    const existingRecords = getAttendanceRecords();
    const updatedRecords = existingRecords.filter(item => item.id !== recordId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
    return updatedRecords;
  } catch (error) {
    console.error('Failed to delete attendance record:', error);
    throw error;
  }
};

export const resetAttendanceData = () => {
  try {
    // Clear stored demo data
    localStorage.removeItem(STORAGE_KEY);
    // Return empty array as cleared state
    return [];
  } catch (error) {
    console.error('Failed to reset attendance data:', error);
    return [];
  }
};
