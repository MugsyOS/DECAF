import crypto from 'crypto';

function generateSecretKey(length = 64): string {
  return crypto.randomBytes(length).toString('hex');
}

const secretKey = generateSecretKey();
console.log('Generated Secret Key:');
console.log(secretKey);
console.log('\nAdd this to your .env file:');
console.log(`JWT_SECRET=${secretKey}`);
