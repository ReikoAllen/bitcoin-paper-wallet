# Bitcoin Paper Wallet Generator

![Version](https://img.shields.io/badge/version-2.0.0-blue)

[GitHub Repository](https://github.com/ReikoAllen/bitcoin-paper-wallet)

## Overview
This project is a **Bitcoin Paper Wallet Generator** that allows users to securely generate and recover Bitcoin addresses and private keys. It provides QR codes for easy scanning, supports downloading the wallet as a PDF or PNG file, and allows you to check your wallet balance. The application is built using Node.js, Express.js, and Bitcoin-related libraries.

---

## What's New in v2.0.0

- Improved navigation (tab focusing, no duplicate tabs)
- Enhanced seed phrase sanitization and recovery UX
- Security and usability improvements
- Updated dependencies and documentation

## Features

- **Generate Bitcoin Wallets**
  - Generate a **Native SegWit (Bech32)** Bitcoin address (starts with `bc1`).
  - Securely creates a Bitcoin address and private key.
  - Encodes the private key and Bitcoin address as QR codes for easy scanning.

- **Recover Bitcoin Wallets**
  - Recover your wallet using a BIP39 seed phrase and optional passphrase.
  - Input can be sanitized: numbers, dots, and extra spaces in the seed phrase are automatically removed for user convenience.
  - Recovers the same address and private key as originally generated (if passphrase matches).

- **Download Options**
  - Download the wallet as a **PDF** (front and back sides included).
  - Download the wallet as **separate PNG files** for the front and back sides.

- **Balance Checker**
  - Check the balance of any generated or recovered Bitcoin address directly from the web interface.
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
  - After wallet generation or recovery, a prominent warning is shown reminding users to securely store their paper wallet, seed phrase, and passphrase.
  - Warns that anyone with access to these can spend the wallet's funds.

- **Improved User Flow**
  - The generate button and passphrase input are hidden after wallet creation to prevent accidental overwrites.
  - "Show Seed Phrase" and "Show Passphrase" buttons reveal sensitive information only when clicked.

- **Easy Navigation**
  - Navigation links at the bottom of each page allow you to easily switch between wallet generation and recovery. If you click a navigation link and the page is already open in another tab, it will focus the existing tab instead of opening a new one.

---

## Requirements

### Software
- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)

### Libraries
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
```bash
npm install
```

### 3. Start the Server
```bash
node server.js
```
The server will run at `https://localhost:3000`.

---

## Usage

### Generate a Wallet
1. Open your browser and navigate to `https://localhost:3000/index.html`.
2. Click the **Generate Wallet** button to create a new Bitcoin wallet.
3. The wallet will display:
   - **Bitcoin Address (Public)**: QR code and text.
   - **Private Key**: QR code and text.
   - **Seed Phrase** and **Passphrase** (if used).

### Recover a Wallet
1. Open your browser and navigate to `https://localhost:3000/recovery/recover.html`.
2. Enter your seed phrase (with or without numbers/dots/extra spaces) and optional passphrase.
3. Click **Recover Keys** to restore your wallet.

### Download Options
- **Download as PDF**:  
  Click the **Download as PDF** button to save the wallet as a PDF file.
- **Download as PNG**:  
  Click the **Download as PNG** button to save the front and back sides as separate PNG files.

### Check Balance
- Click the **Check Balance** button to fetch and display the current balance of the generated or recovered Bitcoin address.
- The balance is shown with 9 decimal places for accuracy.

### Navigation
- Use the **Generate Wallet** and **Recover Wallet** links at the bottom of each page to switch between wallet generation and recovery.  
  If the page is already open in another tab, it will focus the existing tab instead of opening a new one.

---

## 🔒 Security of the Bitcoin Paper Wallet Generator

### Key Security Features

- **Sensitive Data Handling:**  
  All sensitive data (seed phrase, private key, passphrase) is generated on the server and only sent to the client after wallet creation or recovery. The user is instructed to back up this information securely.

- **Seed Phrase & Passphrase Handling:**  
  The BIP39 seed phrase and optional passphrase are only displayed after wallet generation or recovery and are hidden by default. They are only revealed when the user explicitly clicks "Show Seed Phrase" or "Show Passphrase".

- **No Persistent Storage:**  
  By default, the application does not store any generated seed phrases, private keys, or passphrases on the server or in any database. Sensitive data is only available in the user's browser session.

- **One-Time Generation Flow:**  
  After generating a wallet, the generate button and passphrase input are hidden to prevent accidental overwrites and to encourage the user to back up their credentials immediately.

- **Security Warnings:**  
  Prominent warnings are displayed after wallet generation or recovery, reminding users that anyone with access to the seed phrase or passphrase can spend their Bitcoin, and that losing either means losing access to funds.

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
│   ├── index.html              # Frontend HTML file (wallet generator)
│   ├── recovery/
│   │   └── recover.html        # Wallet recovery page
│   ├── styles.css              # CSS for styling
│   ├── script.js               # Frontend JavaScript for wallet generation
│   ├── recovery/
│   │   └── recover.js          # Frontend JavaScript for recovery
│   ├── img/                    # Folder for wallet images (e.g., back.png, paper.png, Bitcoin.png)
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