# Bitcoin Paper Wallet Generator

## Overview
This project is a **Bitcoin Paper Wallet Generator** that allows users to securely generate Bitcoin addresses and private keys. It provides QR codes for easy scanning and supports downloading the wallet as a PDF or PNG file. The application is built using Node.js, Express.js, and Bitcoin-related libraries.

---

## Features
- **Generate Bitcoin Wallets**:
  - Generate a **Native SegWit (Bech32)** Bitcoin address (starts with `bc1`).
  - Also supports generating and verifying **Legacy (P2PKH)** and **Wrapped SegWit (P2SH-P2WPKH)** addresses for advanced users.
  - Creates a Bitcoin address and private key using secure cryptographic methods.
  - Encodes the private key and Bitcoin address as QR codes for easy scanning.
  - **Automatically saves the generated private key** to `private_key_wif.txt` for backup and verification.

- **Download Options**:
  - Download the wallet as a **PDF** (front and back sides included).
  - Download the wallet as **separate PNG files** for the front and back sides.

- **Secure Key Generation**:
  - Uses `ecpair` and `tiny-secp256k1` libraries for secure private key generation.

- **Customizable Design**:
  - Includes customizable templates for the wallet's front and back designs.

- **Verification Tools**:
  - Includes scripts to verify that the generated private key matches the public address using both manual calculation and `bitcoinjs-lib`.

---

## Requirements
To run this project, you need the following:

### Software:
- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)

### Libraries:
- `express` (Web server framework)
- `bitcoinjs-lib` (Bitcoin library for address and key generation)
- `qr-image` (QR code generation)
- `ecpair` (Elliptic curve key pair generation)
- `tiny-secp256k1` (Elliptic curve cryptography library)
- `bs58check` (Base58Check encoding/decoding)
- `bech32` (Bech32 encoding/decoding)

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/ReikoAllen/bitcoin-paper-wallet.git
cd bitcoin-paper-wallet
```

### 2. Install Dependencies
Run the following command to install the required Node.js libraries:
```bash
npm install
```

### 3. Start the Server
Start the Express.js server:
```bash
node server.js
```
The server will run at `http://localhost:3000`.

---

## Usage

### Generate a Wallet
1. Open your browser and navigate to `http://localhost:3000`.
2. Click the **Generate Paper Wallet** button to create a new Bitcoin wallet.
3. The wallet will display:
   - **Bitcoin Address (Public)**: QR code and text.
   - **Private Key**: QR code and text.

### Download Options
- **Download as PDF**:
  - Click the **Download as PDF** button to save the wallet as a PDF file.
- **Download as PNG**:
  - Click the **Download as PNG** button to save the front and back sides as separate PNG files.

---

## Security Notes
- **Do not share your private key**: The private key grants full access to your Bitcoin wallet.
- **Run in a secure environment**: Ensure the server is hosted in a secure location to prevent unauthorized access.
- **Use HTTPS**: If deploying online, use HTTPS to encrypt communication.

---

## Folder Structure
```
bitcoin-paper-wallet/
├── public/
│   ├── index.html              # Frontend HTML file
│   ├── styles.css              # CSS for styling
│   ├── img/                    # Folder for wallet images (e.g., back.png, paper.png)
│   └── ...                     # Other frontend assets
├── server.js                   # Backend server code (Express.js)
├── generate.js                 # Standalone wallet generator script (Node.js)
├── verify_bitcoin_key.js       # Script to verify private key/address pairs
├── private_key_wif.txt         # Last generated private key (WIF format)
├── package.json                # Node.js dependencies and scripts
├── package-lock.json           # NPM lockfile
└── README.md                   # Project documentation
```

---

## License
This project is licensed under the MIT License. Feel free to use and modify it.

---

## Contact
For questions or support, contact [reikoallen6@gmail.com].
