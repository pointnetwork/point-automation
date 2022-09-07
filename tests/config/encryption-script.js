const crypto = require('crypto');
const fs = require('fs');
const userJson = require('../resources/decryptedcredentials.json');

const ENCRYPTION_KEY = process.env.PASS_ENCRYPT_AUTOMATION;
const IV_LENGTH = 16;
const encryptedFileName = 'tests/resources/encryptedcredentials.enc';

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    new Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

const encrypotedContent = encrypt(JSON.stringify(userJson));

fs.writeFile(encryptedFileName, encrypotedContent, error => {
  if (error) throw error;
  console.log('The file has been saved!');
});
