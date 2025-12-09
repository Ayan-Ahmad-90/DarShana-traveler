const fs = require('fs');
const lines = fs.readFileSync('src/pages/Lucknow.tsx', 'utf8').split(/\n/);
const stack = [];
lines.forEach((line, i) => {
  const trimmed = line.trim();
  const opens = (trimmed.match(/<div\b[^>]*>/g) || []).filter(tag => !tag.endsWith('/>'));
  const closes = trimmed.match(/<\/div>/g) || [];
  opens.forEach(() => stack.push({ line: i + 1, text: trimmed }));
  closes.forEach(() => stack.pop());
});
console.log(stack);
