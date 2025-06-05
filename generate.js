const fs = require('fs');
const bitcoin = require('bitcoinjs-lib');
const ECPairFactory = require('ecpair').ECPairFactory;
const ecc = require('tiny-secp256k1');

const ECPair = ECPairFactory(ecc);

// Create a random key pair
const keyPair = ECPair.makeRandom();
const { publicKey } = keyPair;
const privateKeyWIF = keyPair.toWIF();

// Legacy P2PKH Address
const { address: p2pkh } = bitcoin.payments.p2pkh({ pubkey: Buffer.from(publicKey) });

// Native SegWit (Bech32) Address
const { address: bech32 } = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(publicKey) });

// Wrapped SegWit (P2SH-P2WPKH) Address
const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(publicKey) });
const { address: p2sh } = bitcoin.payments.p2sh({ redeem: p2wpkh });

console.log('=== Bitcoin Address Generator ===');
console.log('Private key (WIF):', privateKeyWIF);
console.log('Public key (hex):', publicKey.toString('hex'));
console.log('Legacy (P2PKH) Address:', p2pkh);
console.log('Wrapped SegWit (P2SH-P2WPKH) Address:', p2sh);
console.log('Native SegWit (Bech32) Address:', bech32);

// Optionally save to file
fs.writeFileSync('private_key_wif.txt', privateKeyWIF);
