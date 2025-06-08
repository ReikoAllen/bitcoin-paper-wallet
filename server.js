const https = require('https');
const fs = require('fs');
const express = require('express');
const bitcoin = require('bitcoinjs-lib');
const bip32Factory = require('bip32').BIP32Factory;
const ecc = require('tiny-secp256k1');
const bip32 = bip32Factory(ecc);
const qr = require('qr-image');
const path = require('path');
const { getBalance } = require('./balance');
const bip39 = require('bip39');

const ECPair = require('ecpair').ECPairFactory;
const ECPairFactory = ECPair(ecc);

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/img', express.static(path.join(__dirname, 'img')));

app.get('/generate-paper-wallet', (req, res) => {
    console.log('=================🔐 Generating paper wallet...==================');
    console.log('➡️  Received request to /generate-paper-wallet');

    try {
        // Use 128 bits for 12 words, 256 bits for 24 words
        const words = req.query.words === '12' ? 128 : 256;
        const mnemonic = bip39.generateMnemonic(words);

        const passphrase = req.query.passphrase || '';
        const seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);

        const root = bip32.fromSeed(seed);
        const child = root.derivePath("m/84'/0'/0'/0/0"); // BIP84 (native segwit) first address

        const pubKeyBuffer = child.publicKey;
        const { address } = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(pubKeyBuffer) });
        const privateKey = child.toWIF();

        // Generate QR codes as Data URLs
        const qrPrivate = qr.imageSync(privateKey, { type: 'png' });
        const qrPublic = qr.imageSync(address, { type: 'png' });

        const privateQrBase64 = 'data:image/png;base64,' + qrPrivate.toString('base64');
        const publicQrBase64 = 'data:image/png;base64,' + qrPublic.toString('base64');

        res.json({
            mnemonic: mnemonic,           
            passphrase: passphrase,       
            privateQr: privateQrBase64,
            publicQr: publicQrBase64,
            bitcoinAddress: address,
            privateKey: privateKey,
            publicKey: pubKeyBuffer.toString('hex')
        });

        // Human-readable log of wallet details
        console.log(`✅ Paper wallet generated.`);
        console.log('===============================================================');
    } catch (err) {
        console.error('❌ Error generating paper wallet:', err);
        res.status(500).json({ error: 'Failed to generate paper wallet.' });
    }
});

app.get('/balance/:address', async (req, res) => {
    const address = req.params.address;
    try {
        const balance = await getBalance(address);
        res.json(balance);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch balance' });
    }
});

app.post('/recover-from-seed', express.json(), (req, res) => {
    try {
        const { mnemonic, passphrase } = req.body;

        // Validate input
        if (!mnemonic || typeof mnemonic !== 'string' || mnemonic.trim().split(' ').length < 12) {
            return res.status(400).json({ error: 'Invalid or missing mnemonic.' });
        }

        // Validate mnemonic
        if (!bip39.validateMnemonic(mnemonic.trim())) {
            return res.status(400).json({ error: 'Invalid mnemonic phrase.' });
        }

        const seed = bip39.mnemonicToSeedSync(mnemonic.trim(), passphrase || '');
        const root = bip32.fromSeed(seed);
        const child = root.derivePath("m/84'/0'/0'/0/0"); // BIP84 (native segwit) first address

        const pubKeyBuffer = child.publicKey;
        const { address } = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(pubKeyBuffer) });
        const privateKey = child.toWIF();

        // Generate QR codes as Data URLs
        const qrPrivate = qr.imageSync(privateKey, { type: 'png' });
        const qrPublic = qr.imageSync(address, { type: 'png' });

        const privateQrBase64 = 'data:image/png;base64,' + qrPrivate.toString('base64');
        const publicQrBase64 = 'data:image/png;base64,' + qrPublic.toString('base64');

        res.json({
            bitcoinAddress: address,
            privateKey: privateKey,
            publicKey: pubKeyBuffer.toString('hex'),
            privateQr: privateQrBase64,
            publicQr: publicQrBase64
        });

        console.log('===============================================================');
        console.log(`🔑 Keys recovered from seed phrase.`);
        console.log('===============================================================');
    } catch (err) {
        console.log('================================================================');
        console.error('❌ Error recovering keys from seed:', err.message || err);
        res.status(500).json({ error: 'Failed to recover keys from seed.' });
        console.log('Please ensure your seed phrase is correct and try again.');
        console.log('================================================================');
    }
});

// Replace with your actual certificate and key file paths
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`🚀 HTTPS server running at https://localhost:${PORT}`);
});
// console.log('bip32:', bip32);
