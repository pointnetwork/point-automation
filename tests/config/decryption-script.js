const crypto = require('crypto');
const fs = require('fs');

const ENCRYPTION_KEY = process.env.PASS_ENCRYPT_AUTOMATION;
const encryptedFileName = 'tests/resources/encryptedcredentials.enc';
const decryptedFileName = 'tests/resources/decryptedcredentials.json';

function decrypt(text) {
  const textParts = text.split(':');
  const iv = new Buffer.from(textParts.shift(), 'hex');
  const encryptedText = new Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    new Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

const content = fs.readFileSync(encryptedFileName, 'utf-8');
const decryptedContent = decrypt(content);

fs.writeFile(decryptedFileName, decryptedContent, error => {
  if (error) throw error;
  console.log('Decrypted file has been saved!');
});
