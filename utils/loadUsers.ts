import fs from 'fs';
import path from 'path';

export function loadUsers(): Record<string, { username: string; password: string; shouldBeLoggedIn: boolean }> {
  const filePath = path.join(__dirname, '..', 'data', 'users.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}
