# Bitcoin Paper Wallet Generator

## Overview
This project is a **Bitcoin Paper Wallet Generator** that allows users to securely generate Bitcoin addresses and private keys. It provides QR codes for easy scanning and supports downloading the wallet as a PDF or PNG file. The application is built using Node.js, Express.js, and Bitcoin-related libraries.

---

## Features
- **Generate Bitcoin Wallets**:
  - Generate a **Native SegWit (Bech32)** Bitcoin address (starts with `bc1`).
  - Creates a Bitcoin address and private key using secure cryptographic methods.
  - Encodes the private key and Bitcoin address as QR codes for easy scanning.

- **Download Options**:
  - Download the wallet as a **PDF** (front and back sides included).
  - Download the wallet as **separate PNG files** for the front and back sides.

- **Secure Key Generation**:
  - Uses `ecpair` and `tiny-secp256k1` libraries for secure private key generation.

- **Customizable Design**:
  - Includes customizable templates for the wallet's front and back designs.

- **Balance Checker**:
  - Check the balance of any generated Bitcoin address directly from the web interface.
  - Uses a server-side endpoint (`/balance/:address`) that queries the Blockstream API via `balance.js`.
  - Displays the balance with **9 decimal places** for precision.

- **BIP39 Seed Phrase Generation**
  - Generates a 12-word (or 24-word) BIP39 seed phrase (mnemonic) for each wallet.
  - Optionally supports a user-supplied BIP39 passphrase for enhanced security.
  - Both the seed phrase and passphrase are displayed only after wallet generation, with the passphrase input and generate button hidden for safety.

- **Numbered Seed Phrase Display**
  - Seed phrase words are shown with numbering for easier backup and verification.

- **Passphrase Handling**
  - Users can enter an optional passphrase before generating a wallet.
  - The passphrase is required (along with the seed phrase) to restore the wallet in any BIP39-compatible wallet app.
  - If a passphrase is used, it is clearly indicated and displayed only after wallet generation.

- **Security Warnings**
  - After wallet generation, a prominent warning is shown reminding users to securely store their paper wallet, seed phrase, and passphrase.
  - Warns that anyone with access to these can spend the wallet's funds.

- **Improved User Flow**
  - The generate button and passphrase input are hidden after wallet creation to prevent accidental overwrites.
  - "Show Seed Phrase" and "Show Passphrase" buttons reveal sensitive information only when clicked.

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
- `axios` (HTTP client for server-side balance checking)

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

### Check Balance
- Click the **Check Balance** button to fetch and display the current balance of the generated Bitcoin address.
- The balance is shown with 9 decimal places for accuracy.

---

## 🔒 Security of the Bitcoin Paper Wallet Generator

### Key Security Features

- **Sensitive Data Handling:**  
  All sensitive data (seed phrase, private key, passphrase) is generated on the server and only sent to the client after wallet creation. The user is instructed to back up this information securely.

- **Seed Phrase & Passphrase Handling:**  
  The BIP39 seed phrase and optional passphrase are only displayed after wallet generation and are hidden by default. They are only revealed when the user explicitly clicks "Show Seed Phrase" or "Show Passphrase".

- **No Persistent Storage:**  
  By default, the application does not store any generated seed phrases, private keys, or passphrases on the server or in any database. Sensitive data is only available in the user's browser session.

- **One-Time Generation Flow:**  
  After generating a wallet, the generate button and passphrase input are hidden to prevent accidental overwrites and to encourage the user to back up their credentials immediately.

- **Security Warnings:**  
  Prominent warnings are displayed after wallet generation, reminding users that anyone with access to the seed phrase or passphrase can spend their Bitcoin, and that losing either means losing access to funds.

- **No Transmission to Third Parties:**  
  The application does not transmit seed phrases, private keys, or passphrases to any third-party service or analytics provider.

- **Balance Checking:**  
  The balance checker only queries public blockchain data and does not expose or transmit private keys or seed phrases.

### User Responsibilities

- **Backup:**  
  Users are responsible for securely backing up their seed phrase and passphrase. Loss of either results in permanent loss of funds.

- **Privacy:**  
  Users should generate wallets in a secure, private environment and avoid using public or shared computers.

- **No Recovery:**  
  The project maintainers cannot recover lost seed phrases or passphrases.

---

**In summary:**  
This project is designed to maximize user privacy and security by never storing or transmitting sensitive wallet data. The user is always in full control of their keys and must take care to back them up securely.

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
│   ├── script.js               # Frontend JavaScript
│   ├── img/                    # Folder for wallet images (e.g., back.png, paper.png)
│   └── ...                     # Other frontend assets
├── server.js                   # Backend server code (Express.js)
├── balance.js                  # Server-side balance checker
├── generate.js                 # Standalone wallet generator script (Node.js)
├── verify_bitcoin_key.js       # Script to verify private key/address pairs
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

---

**Always back up your seed phrase and passphrase securely. Losing either means losing access to your funds!**