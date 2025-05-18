// random.js - Utility functions for randomization

// Get a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Get a random float between min and max
const getRandomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Get a random element from an array
const getRandomElement = (array) => {
  return array[getRandomInt(0, array.length - 1)];
};

// Export functions
export { getRandomInt, getRandomFloat, getRandomElement };
