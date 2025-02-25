import getPriorityRating from './Aiconnect.js';

const query = "There's a pile of trash on the sidewalk.";
const severity = 8;
const result = await getPriorityRating(query, severity);
console.log(result);