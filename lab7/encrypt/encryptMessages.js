const crypto = require('crypto');
const fs = require('fs');

const SYM_ALGORITHM = 'aes-128-ctr';
const ASYM_PAD = crypto.constants.RSA_PKCS1_OAEP_PADDING;

if (!fs.existsSync('public.pem')) {
    console.error("public.pem not found.");
    process.exit(1);
}

const publicKey = fs.readFileSync('public.pem', 'utf8');

const key = crypto.randomBytes(16); 
const iv = crypto.randomBytes(16); 

let phrases = [
  'hello world!!!!!',
  'Pranish is the best',
  'Give me an A',
  'This is a test for Pranish if he really looks at code he will zelle me $10'
];

function encrypt(text, key, iv) {
  let cipher = crypto.createCipheriv(SYM_ALGORITHM, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('base64');
}

function encryptPub(txt, publicKey) {
  const encryptedBuffer = crypto.publicEncrypt({
    key: publicKey,
    padding: ASYM_PAD,
    oaepHash: 'sha256',
  }, Buffer.from(txt));
  return encryptedBuffer.toString('base64');
}

const encryptedData = phrases.map(phrase => encrypt(phrase, key, iv));
const encryptedKey = encryptPub(key, publicKey);
const encryptedIv = encryptPub(iv, publicKey);

const output = {
  key: encryptedKey,
  iv: encryptedIv,
  data: encryptedData
};

fs.writeFileSync('messages.json', JSON.stringify(output, null, 2));
