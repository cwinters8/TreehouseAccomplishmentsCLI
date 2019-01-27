// Problem: We need a simple way to look at a user's badge count and JavaScript points
// Solution: Use Node.js to connect to Treehouse's API to get profile info to print out
const profile = require('./profile');

const args = process.argv;
const topic = args[2];
const users = args.slice(3);
users.forEach(user => profile.get(topic, user));