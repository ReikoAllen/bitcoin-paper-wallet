const fs = require('fs');
const bitcoin = require('bitcoinjs-lib');
const ECPairFactory = require('ecpair').ECPairFactory;
const ecc = require('tiny-secp256k1');
const bs58check = require('bs58check');
const bech32 = require('bech32');

const ECPair = ECPairFactory(ecc);

// --- Manual Calculation Functions ---

function wifToPrivateKey(wif) {
  const decoded = bs58check.decode(wif);
  if (decoded[0] !== 0x80) throw new Error('Not a mainnet WIF private key');
  if (decoded.length === 34 && decoded[33] === 0x01) {
    return { privKey: decoded.slice(1, 33), compressed: true };
  } else if (decoded.length === 33) {
    return { privKey: decoded.slice(1, 33), compressed: false };
  } else {
    throw new Error('Invalid WIF format');
  }
}

function pubkeyFromPrivate(privKey, compressed = true) {
  const pair = ECPair.fromPrivateKey(privKey, { compressed });
  return pair.publicKey;
}

function hash160(buffer) {
  return bitcoin.crypto.ripemd160(bitcoin.crypto.sha256(buffer));
}

function base58Address(prefix, payload) {
  // Only pass prefix+payload, bs58check.encode adds checksum
  return bs58check.encode(Buffer.concat([prefix, payload]));
}

function bech32Address(hrp, witver, witprog) {
  const b32 = bech32.bech32 || bech32;
  const words = b32.toWords(witprog);
  words.unshift(witver);
  return b32.encode(hrp, words);
}

// --- Main ---

const wif = fs.readFileSync('private_key_wif.txt', 'utf8').trim();

let privKey, compressed, manual;

console.log('==== Manual Calculation ====');
try {
  ({ privKey, compressed } = wifToPrivateKey(wif));
  const pubkey = pubkeyFromPrivate(privKey, compressed);
  const pubkeyHash = hash160(pubkey);

  // Manual legacy address (P2PKH)
  const legacy = base58Address(Buffer.from([0x00]), pubkeyHash);

  // Manual native segwit (bech32)
  const segwit = bech32Address('bc', 0, pubkeyHash);

  console.log('Private Key (hex):', Buffer.from(privKey).toString('hex'));
  console.log('Public Key (hex):', Buffer.from(pubkey).toString('hex'));
  console.log('Legacy (P2PKH) Address:', legacy);
  console.log('Native SegWit (Bech32) Address:', segwit);

  manual = {
    privKey: Buffer.from(privKey).toString('hex'),
    pubkey: Buffer.from(pubkey).toString('hex'),
    legacy,
    segwit
  };
} catch (e) {
  console.error('[Error] Failed manual calculation:', e.message);
  process.exit(1);
}

console.log('\n==== bitcoinjs-lib (for comparison) ====');
try {
  const keyPair = ECPair.fromPrivateKey(Buffer.from(privKey), { compressed });

  const bl_priv = keyPair.privateKey.toString('hex');
  const bl_pub = keyPair.publicKey.toString('hex');
  const bl_legacy = bitcoin.payments.p2pkh({ pubkey: Buffer.from(keyPair.publicKey) }).address;
  const bl_segwit = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(keyPair.publicKey) }).address;

  console.log('Private Key (hex):', bl_priv);
  console.log('Public Key (hex):', Buffer.from(keyPair.publicKey).toString('hex'));
  console.log('Legacy (P2PKH) Address:', bl_legacy);
  console.log('Native SegWit (Bech32) Address:', bl_segwit);

  // Comparison
  function check(label, a, b) {
    const status = a === b ? '✅' : '❌ Mismatch';
    console.log(`→ ${label} Match: ${status}`);
  }

  console.log('\n==== Comparison ====');
  check('Private Key', manual.privKey, bl_priv);
  check('Public Key', manual.pubkey, Buffer.from(keyPair.publicKey).toString('hex'));
  check('Legacy Address', manual.legacy, bl_legacy);
  check('SegWit Address', manual.segwit, bl_segwit);

} catch (e) {
  console.error('[Error] bitcoinjs-lib comparison failed:', e.message);
}
