#!/usr/bin/env node
const fs = require('fs');
try {
  JSON.parse(fs.readFileSync('cspell.json', 'utf8'));
  console.log('cspell.json parsed successfully.');
} catch (err) {
  console.error('Failed to parse cspell.json:', err.message);
  process.exit(1);
}
