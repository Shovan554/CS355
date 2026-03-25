const crypto = require('crypto');
const fs = require('fs');

const SYM_ALGORITHM = 'aes-128-ctr';
const ASYM_PAD = crypto.constants.RSA_PKCS1_OAEP_PADDING;

if (!fs.existsSync('messages.json') || !fs.existsSync('private.pem')) {
    console.error("messages.json or private.pem not found.");
    process.exit(1);
}

const privateKey = fs.readFileSync('private.pem', 'utf8');
const dataFile = JSON.parse(fs.readFileSync('messages.json', 'utf8'));

function decryptPriv(encryptedB64, privateKey) {
  const decryptedBuffer = crypto.privateDecrypt({
    key: privateKey,
    padding: ASYM_PAD,
    oaepHash: 'sha256',
  }, Buffer.from(encryptedB64, 'base64'));
  return decryptedBuffer;
}

function decrypt(text, key, iv) {
  let encryptedText = Buffer.from(text, 'base64');
  let decipher = crypto.createDecipheriv(SYM_ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

const key = decryptPriv(dataFile.key, privateKey);
const iv = decryptPriv(dataFile.iv, privateKey);

dataFile.data.forEach(encryptedMsg => {
    console.log(decrypt(encryptedMsg, key, iv));
});
