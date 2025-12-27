import moment from 'moment';

/**
 * EXACT COPY of NASA TLX calculation logic from old/src/reducers/experiment.js
 * 
 * This function calculates the weighted NASA TLX score based on:
 * - scale: Raw ratings (0-100) for 6 dimensions
 * - workload: Weights (0-5) from pairwise comparisons
 * 
 * Formula: Weighted TLX = Sum(scale[i] * workload[i]) / 15
 */
export const calculateNASATLX = (scale, workload) => {
  // Calculate adjusted rating: raw rating × weight for each dimension
  const adjustedRating = {};
  Object.keys(scale).forEach((key) => {
    adjustedRating[key] = scale[key] * workload[key];
  });

  // Calculate weighted rating: sum of adjusted ratings divided by 15
  const sum = Object.values(adjustedRating).reduce((acc, val) => acc + val, 0);
  const weightedRating = parseFloat((sum / 15).toFixed(2));

  return {
    adjustedRating,
    weightedRating,
    completed: true,
    date: moment().format('MMMM Do YYYY, h:mm:ss a'),
  };
};

/**
 * Generate all pairwise combinations for comparison
 * Returns array of 15 pairs like: [[A, B], [A, C], [B, C], ...]
 */
export const generatePairwiseComparisons = (dimensions) => {
  const pairs = [];
  for (let i = 0; i < dimensions.length; i++) {
    for (let j = i + 1; j < dimensions.length; j++) {
      pairs.push([dimensions[i], dimensions[j]]);
    }
  }
  return pairs;
};

/**
 * Shuffle array (Fisher-Yates algorithm)
 * Used to randomize the order of pairwise comparisons
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
