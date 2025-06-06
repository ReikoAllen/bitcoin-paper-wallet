let lastMnemonic = '';
let lastPassphrase = '';

function generateWallet() {
    const passphraseInput = document.getElementById('passphraseInput');
    const passphraseDiv = passphraseInput.parentElement;
    const passphrase = passphraseInput.value || '';
    // Add a query parameter for 12 words
    fetch(`/generate-paper-wallet?passphrase=${encodeURIComponent(passphrase)}&words=12`)
        .then(response => response.json())
        .then(data => {
            if (data.bitcoinAddress && data.privateKey) {
                document.getElementById('publicQr').src = data.publicQr;
                document.getElementById('publicAddress').textContent = data.bitcoinAddress;
                document.getElementById('publicSection').classList.remove('hidden');

                document.getElementById('privateQr').src = data.privateQr;
                document.getElementById('privateKey').textContent = data.privateKey;
                document.getElementById('privateSection').classList.remove('hidden');

                // Automatically generate and show the PNG canvas
                generateAndShowPNG();

                // Show the download buttons
                document.getElementById('downloadPDFButton').classList.remove('hidden');
                document.getElementById('downloadPNGButton').classList.remove('hidden');

                document.getElementById('checkBalanceButton').classList.remove('hidden');
                document.getElementById('balanceResult').textContent = '';

                // Show the back image
                document.getElementById('backImageWrapper').classList.remove('hidden');

                lastMnemonic = data.mnemonic;
                lastPassphrase = data.passphrase;

                // Hide seed phrase/passphrase initially
                document.getElementById('mnemonic').style.display = 'none';
                document.getElementById('passphrase').style.display = 'none';
                document.getElementById('showMnemonicBtn').style.display = '';
                document.getElementById('showPassphraseBtn').style.display = '';
                document.getElementById('seedPhraseSection').style.display = '';

                // Numbered seed phrase
                const words = lastMnemonic.split(' ');
                document.getElementById('mnemonic').innerHTML = words.map((w, i) => `<span style="margin-right:8px;">${i+1}. ${w}</span>`).join(' ');

                // Only show passphrase if it was set
                if (lastPassphrase && lastPassphrase.trim() !== '') {
                    document.getElementById('passphrase').textContent = 'Passphrase: ' + lastPassphrase;
                } else {
                    document.getElementById('passphrase').textContent = '(No passphrase has been set.)';
                }

                // Remove and clear passphrase input
                passphraseInput.value = '';
                passphraseDiv.style.display = 'none';

                // Hide the generate button
                document.getElementById('generateWalletButton').style.display = 'none';

                // Show warning after wallet is generated
                let warning = "⚠️ <b>Important:</b> Anyone with access to your paper wallet, seed phrase, or passphrase can spend your Bitcoin. ";
                warning += "Store them securely and never share them with anyone.<br>";
                warning += "If you used a passphrase, you must remember it to recover your wallet. Losing your seed phrase or passphrase means losing access to your funds forever.⚠️";
                document.getElementById('walletWarning').innerHTML = warning;
            } else {
                alert('Error generating paper wallet. Please try again later.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error generating paper wallet. Please try again later.');
        });
}

function showMnemonic() {
    document.getElementById('mnemonic').style.display = '';
    document.getElementById('mnemonic').style.marginBottom = '16px';
    document.getElementById('showMnemonicBtn').style.display = 'none';
}

function showPassphrase() {
    document.getElementById('passphrase').style.display = '';
    document.getElementById('passphrase').style.marginTop = '16px';
    document.getElementById('showPassphraseBtn').style.display = 'none';
}

async function downloadPDF() {
    const frontCanvas = document.getElementById('frontCanvas');
    if (!frontCanvas) {
        alert('Canvas not found. Please generate the wallet first.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    try {
        // Convert the front canvas to a PNG data URL
        const frontImageData = frontCanvas.toDataURL('image/png');

        // Add the front side image to the PDF
        doc.addImage(frontImageData, 'PNG', 0, 0, 210, 297); // Full-page background (A4 size in mm)

        // Load the back side image
        const backImage = new Image();
        backImage.src = '/img/back.png'; // Path to the back side image

        await new Promise((resolve, reject) => {
            backImage.onload = resolve;
            backImage.onerror = reject;
        });

        // Add a new page for the back side
        doc.addPage();
        doc.addImage(backImage, 'PNG', 0, 0, 210, 297); // Full-page background (A4 size in mm)

        // Save the PDF
        doc.save('Bitcoin_Paper_Wallet.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    }
}

async function downloadPNG() {
    const frontCanvas = document.getElementById('frontCanvas');
    if (!frontCanvas) {
        alert('Front canvas not found. Please generate the wallet first.');
        return;
    }

    const frontImageData = frontCanvas.toDataURL('image/png');

    // Load the back side image
    const backImage = new Image();
    backImage.src = '/img/back.png'; // Path to the back side image

    try {
        await new Promise((resolve, reject) => {
            backImage.onload = resolve;
            backImage.onerror = reject;
        });

        // Create a canvas for the back side
        const backCanvas = document.createElement('canvas');
        backCanvas.width = frontCanvas.width;
        backCanvas.height = frontCanvas.height;

        const backCtx = backCanvas.getContext('2d');
        backCtx.drawImage(backImage, 0, 0, backCanvas.width, backCanvas.height);

        // Convert the back canvas to a PNG data URL
        const backImageData = backCanvas.toDataURL('image/png');

        // Create temporary link elements to download the images
        const frontLink = document.createElement('a');
        frontLink.href = frontImageData;
        frontLink.download = 'Bitcoin_Paper_Wallet_Front.png'; // File name for the front side
        frontLink.click(); // Trigger the download for the front side

        const backLink = document.createElement('a');
        backLink.href = backImageData;
        backLink.download = 'Bitcoin_Paper_Wallet_Back.png'; // File name for the back side
        backLink.click(); // Trigger the download for the back side
    } catch (error) {
        console.error('Error generating PNGs:', error);
        alert('Failed to generate PNGs. Please check the image path and try again.');
    }
}

async function generateAndShowPNG() {
    const publicQr = document.getElementById('publicQr').src;
    const privateQr = document.getElementById('privateQr').src;

    const frontImage = new Image();
    frontImage.src = '/img/paper.png'; // Path to the front side image

    try {
        // Wait for the front side image to load
        await new Promise((resolve, reject) => {
            frontImage.onload = () => {
                console.log('Front side image loaded successfully.');
                resolve();
            };
            frontImage.onerror = () => {
                console.error('Failed to load front side image. Check the path: /img/paper.png');
                reject();
            };
        });

        // Create a canvas for the front side
        const frontCanvas = document.getElementById('frontCanvas');
        frontCanvas.width = frontImage.width;
        frontCanvas.height = frontImage.height;

        const frontCtx = frontCanvas.getContext('2d');
        frontCtx.drawImage(frontImage, 0, 0, frontCanvas.width, frontCanvas.height);

        // Add the public QR code
        if (publicQr) {
            const publicQrImage = new Image();
            publicQrImage.src = publicQr;
            await new Promise((resolve, reject) => {
                publicQrImage.onload = resolve;
                publicQrImage.onerror = reject;
            });
            frontCtx.drawImage(publicQrImage, 248, 30.7, 120, 120); // Adjust as needed
        }

        // Add the private QR code
        if (privateQr) {
            const privateQrImage = new Image();
            privateQrImage.src = privateQr;
            await new Promise((resolve, reject) => {
                privateQrImage.onload = resolve;
                privateQrImage.onerror = reject;
            });
            frontCtx.drawImage(privateQrImage, 28.7, 591.2, 120, 120); // Adjust as needed
        }

        // Show the front canvas
        document.getElementById('frontCanvasWrapper').classList.remove('hidden');
    } catch (error) {
        console.error('Error generating canvases:', error);
        alert('Failed to generate canvases. Please check the image paths and try again.');
    }
}

async function checkBalance() {
    const address = document.getElementById('publicAddress').textContent.trim();
    if (!address) {
        alert('No address found.');
        return;
    }
    // Hide the check balance button after pressed
    document.getElementById('checkBalanceButton').style.display = 'none';

    const balanceResult = document.getElementById('balanceResult');
    balanceResult.textContent = 'Checking balance...';

    try {
        // Call your server endpoint
        const response = await fetch(`/balance/${address}`);
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        balanceResult.textContent = `Balance: ${data.total} BTC`;
    } catch (err) {
        balanceResult.textContent = 'Failed to fetch balance.';
        console.error(err);
    }
}