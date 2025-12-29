// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update } from 'firebase/database';

// Firebase configuration from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyA8HNMdBxyuJcw0BusUmXan5SYTf8hHXac",
  authDomain: "nasa-tlx-thesis.firebaseapp.com",
  databaseURL: "https://nasa-tlx-thesis-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nasa-tlx-thesis",
  storageBucket: "nasa-tlx-thesis.firebasestorage.app",
  messagingSenderId: "414549447170",
  appId: "1:414549447170:web:dbe2145124ba8046900d1b",
  measurementId: "G-HT7D60TRSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// Database reference path
const PARTICIPANTS_PATH = 'participants';
const GERMANE_LOAD_PATH = 'germaneLoad';

/**
 * Create a new participant entry in Firebase
 * @param {string} participantId - Unique participant ID
 * @param {object} participantInfo - Participant information (email, age, major, etc.)
 * @returns {Promise<object>} - { success: boolean, participantRef, exists: boolean }
 */
export const createParticipant = async (participantId, participantInfo) => {
  try {
    const participantRef = ref(database, `${PARTICIPANTS_PATH}/${participantId}`);
    const snapshot = await get(participantRef);
    const exists = snapshot.exists();

    if (!exists) {
      await set(participantRef, {
        info: participantInfo,
        completed: false,
        createdAt: new Date().toISOString(),
      });
    }

    return {
      success: true,
      participantRef,
      exists,
    };
  } catch (error) {
    console.error('Error creating participant:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get participant data from Firebase
 * @param {string} participantId - Participant ID
 * @returns {Promise<object>} - { success: boolean, data, exists: boolean }
 */
export const getParticipant = async (participantId) => {
  try {
    const participantRef = ref(database, `${PARTICIPANTS_PATH}/${participantId}`);
    const snapshot = await get(participantRef);
    const exists = snapshot.exists();

    return {
      success: true,
      data: exists ? snapshot.val() : null,
      exists,
    };
  } catch (error) {
    console.error('Error getting participant:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update participant data in Firebase
 * @param {string} participantId - Participant ID
 * @param {object} data - Data to update
 * @returns {Promise<object>} - { success: boolean }
 */
export const updateParticipant = async (participantId, data) => {
  try {
    const participantRef = ref(database, `${PARTICIPANTS_PATH}/${participantId}`);
    await update(participantRef, data);

    return { success: true };
  } catch (error) {
    console.error('Error updating participant:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get all participants from Firebase
 * @returns {Promise<object>} - { success: boolean, data: array }
 */
export const getAllParticipants = async () => {
  try {
    const participantsRef = ref(database, PARTICIPANTS_PATH);
    const snapshot = await get(participantsRef);
    
    if (!snapshot.exists()) {
      return {
        success: true,
        data: [],
      };
    }

    const participantsData = snapshot.val();
    const participantsArray = Object.entries(participantsData).map(([id, data]) => ({
      id,
      ...data,
    }));

    return {
      success: true,
      data: participantsArray,
    };
  } catch (error) {
    console.error('Error getting all participants:', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

/**
 * Save grading scores for a Germane Load response
 * @param {string} participantId - Participant ID
 * @param {object} scores - Scores object with questionId as key and score as value
 * @param {number} totalScore - Total score
 * @returns {Promise<object>} - { success: boolean }
 */
export const saveGermaneLoadScores = async (participantId, scores, totalScore) => {
  try {
    const scoreRef = ref(database, `${GERMANE_LOAD_PATH}/${participantId}`);
    await update(scoreRef, {
      scores,
      totalScore,
      gradedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving Germane Load scores:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Export participants data to CSV format
 * @param {array} participants - Array of participant objects
 * @returns {string} - CSV formatted string
 */
export const exportToCSV = (participants) => {
  const headers = [
    'Participant ID',
    'Mode',
    'Email',
    'Age',
    'Major/Field',
    'Gaming Experience',
    'Gaming Duration',
    'Gaming Platform',
    'Weighted TLX Score',
    'Time Taken (seconds)',
    'Germane Load Score',
    'Date Completed',
    'Mental Demand (Raw)',
    'Physical Demand (Raw)',
    'Temporal Demand (Raw)',
    'Performance (Raw)',
    'Effort (Raw)',
    'Frustration (Raw)',
    'Mental Demand (Weight)',
    'Physical Demand (Weight)',
    'Temporal Demand (Weight)',
    'Performance (Weight)',
    'Effort (Weight)',
    'Frustration (Weight)',
  ];

  const rows = participants
    .filter(p => p.completed)
    .map(p => [
      p.id,
      p.info?.mode || '',
      p.info?.email || '',
      p.info?.age || '',
      p.info?.major || '',
      p.info?.gamingExperience || '',
      p.info?.gamingDuration || '',
      p.info?.gamingPlatform || '',
      p.weightedRating || '',
      p.timeTakenSeconds || '',
      p.germaneLoadScore !== undefined ? p.germaneLoadScore : '',
      p.date || '',
      p.scale?.['Mental Demand'] || '',
      p.scale?.['Physical Demand'] || '',
      p.scale?.['Temporal Demand'] || '',
      p.scale?.['Performance'] || '',
      p.scale?.['Effort'] || '',
      p.scale?.['Frustration Level'] || '',
      p.workload?.['Mental Demand'] || '',
      p.workload?.['Physical Demand'] || '',
      p.workload?.['Temporal Demand'] || '',
      p.workload?.['Performance'] || '',
      p.workload?.['Effort'] || '',
      p.workload?.['Frustration Level'] || '',
    ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
};

/**
 * Save Germane Load questionnaire responses
 * @param {string} participantId - Participant ID
 * @param {object} responses - Questionnaire responses
 * @returns {Promise<object>} - { success: boolean }
 */
export const saveGermaneLoadResponse = async (participantId, responses) => {
  try {
    const responseRef = ref(database, `${GERMANE_LOAD_PATH}/${participantId}`);
    await set(responseRef, {
      ...responses,
      submittedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving Germane Load response:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get Germane Load response for a participant
 * @param {string} participantId - Participant ID
 * @returns {Promise<object>} - { success: boolean, data, exists: boolean }
 */
export const getGermaneLoadResponse = async (participantId) => {
  try {
    const responseRef = ref(database, `${GERMANE_LOAD_PATH}/${participantId}`);
    const snapshot = await get(responseRef);
    const exists = snapshot.exists();

    return {
      success: true,
      data: exists ? snapshot.val() : null,
      exists,
    };
  } catch (error) {
    console.error('Error getting Germane Load response:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get all Germane Load responses
 * @returns {Promise<object>} - { success: boolean, data: array }
 */
export const getAllGermaneLoadResponses = async () => {
  try {
    const responsesRef = ref(database, GERMANE_LOAD_PATH);
    const snapshot = await get(responsesRef);
    
    if (!snapshot.exists()) {
      return {
        success: true,
        data: [],
      };
    }

    const responsesData = snapshot.val();
    const responsesArray = Object.entries(responsesData).map(([id, data]) => ({
      participantId: id,
      ...data,
    }));

    return {
      success: true,
      data: responsesArray,
    };
  } catch (error) {
    console.error('Error getting all Germane Load responses:', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};
