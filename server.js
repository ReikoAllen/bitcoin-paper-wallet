const express = require('express');
const bitcoin = require('bitcoinjs-lib');
const qr = require('qr-image');
const path = require('path');
const fs = require('fs'); // Add this at the top with other requires

const ECPair = require('ecpair').ECPairFactory;
const ecc = require('tiny-secp256k1');
const ECPairFactory = ECPair(ecc);

const app = express();
const PORT = 3000;

app.use(express.static('public')); // Ensure 'public' is the folder containing 'img'
app.use('/img', express.static(path.join(__dirname, 'img')));

app.get('/generate-paper-wallet', (req, res) => {
    console.log('➡️  Received request to /generate-paper-wallet');

    try {
        const keyPair = ECPairFactory.makeRandom();
        const pubKeyBuffer = Buffer.from(keyPair.publicKey);
        const { address } = bitcoin.payments.p2wpkh({ pubkey: pubKeyBuffer });
        const privateKey = keyPair.toWIF();

        // Save the private key to private_key_wif.txt
        fs.writeFileSync('private_key_wif.txt', privateKey);

        console.log('✅ Generated keys:');
        console.log('Private Key:', privateKey);
        console.log('Address:', address);
        console.log('Public Key (hex):', pubKeyBuffer.toString('hex')); // Added line

        // Generate QR codes as Data URLs
        const qrPrivate = qr.imageSync(privateKey, { type: 'png' });
        const qrPublic = qr.imageSync(address, { type: 'png' });

        const privateQrBase64 = 'data:image/png;base64,' + qrPrivate.toString('base64');
        const publicQrBase64 = 'data:image/png;base64,' + qrPublic.toString('base64');

        res.json({
            privateQr: privateQrBase64,
            publicQr: publicQrBase64,
            bitcoinAddress: address,
            privateKey: privateKey,
            publicKey: pubKeyBuffer.toString('hex') // <-- Add this line
        });
    } catch (err) {
        console.error('❌ Error generating paper wallet:', err);
        res.status(500).json({ error: 'Failed to generate paper wallet.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
