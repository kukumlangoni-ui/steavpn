// Generate PBKDF2 password hash for admin account insertion
// Usage: node scripts/hash-admin-password.js <password>
// Outputs: SALT:HASH (ready for INSERT INTO admins)

const crypto = require('crypto');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-admin-password.js <password>');
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex');

console.log(`Salt:      ${salt}`);
console.log(`Hash:      ${hash}`);
console.log(`Full hash: ${salt}:${hash}`);
console.log('');
console.log('SQL insert command:');
console.log(`npx wrangler d1 execute steavpn-db --remote --command="INSERT INTO admins (email, password_hash) VALUES ('isayamasika100@gmail.com', '${salt}:${hash}')"`);
