// You need to have bitcoinjs-lib, bip39, and qr-image functionality available in the browser.
// For a simple solution, use an API endpoint on your server to do the recovery and return the keys and QR codes.

function sanitizeMnemonic(input) {
    // Remove numbers, dots, and extra spaces, keep only words
    return input
        .toLowerCase()
        .replace(/(\d+\.)/g, '')      // Remove patterns like "1."
        .replace(/\d+/g, '')          // Remove standalone numbers
        .replace(/[.,]/g, '')         // Remove dots and commas
        .replace(/\s+/g, ' ')         // Replace multiple spaces with single space
        .replace(/^\s+|\s+$/g, '');   // Trim leading/trailing spaces
}

async function recoverKeys() {
    // Clear previous results
    document.getElementById('recoveredPublicQr').src = '';
    document.getElementById('recoveredPrivateQr').src = '';
    document.getElementById('recoveredPublicAddress').textContent = '';
    document.getElementById('recoveredPrivateKey').textContent = '';
    document.getElementById('recoveredFrontCanvas').getContext('2d').clearRect(
        0, 0,
        document.getElementById('recoveredFrontCanvas').width,
        document.getElementById('recoveredFrontCanvas').height
    );
    document.getElementById('recoveredFrontCanvasWrapper').classList.add('hidden');
    document.getElementById('recoveredBackImageWrapper').classList.add('hidden');
    document.getElementById('recoveredDownloadPDFButton').classList.add('hidden');
    document.getElementById('recoveredDownloadPNGButton').classList.add('hidden');
    document.getElementById('recoveredPublicSection').classList.add('hidden');
    document.getElementById('recoveredPrivateSection').classList.add('hidden');

    let seedInput = document.getElementById('seedInput').value.trim();
    const passphrase = document.getElementById('recoverPassphraseInput').value || '';
    const warningDiv = document.getElementById('recoverWarning');
    warningDiv.textContent = '';

    // Sanitize the mnemonic
    seedInput = sanitizeMnemonic(seedInput);

    if (!seedInput) {
        warningDiv.textContent = 'Please enter your seed phrase.';
        return;
    }

    // Call backend to recover keys
    try {
        const response = await fetch('/recover-from-seed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mnemonic: seedInput, passphrase })
        });
        if (!response.ok) throw new Error('Failed to recover keys');
        const data = await response.json();

        // Show public info
        document.getElementById('recoveredPublicQr').src = data.publicQr;
        document.getElementById('recoveredPublicAddress').textContent = data.bitcoinAddress;
        document.getElementById('recoveredPublicSection').classList.remove('hidden');

        // Show private info
        document.getElementById('recoveredPrivateQr').src = data.privateQr;
        document.getElementById('recoveredPrivateKey').textContent = data.privateKey;
        document.getElementById('recoveredPrivateSection').classList.remove('hidden');

        // Show canvas and download buttons
        await generateAndShowRecoveredPNG();
        document.getElementById('recoveredDownloadPDFButton').classList.remove('hidden');
        document.getElementById('recoveredDownloadPNGButton').classList.remove('hidden');
        document.getElementById('recoveredBackImageWrapper').classList.remove('hidden');

        warningDiv.textContent = 'Warning: Never share your seed phrase or private key with anyone!';

        document.getElementById('recoveredCheckBalanceButton').classList.remove('hidden');
        document.getElementById('recoveredBalanceResult').textContent = '';

    } catch (err) {
        warningDiv.textContent = 'Failed to recover keys. Please check your seed phrase and passphrase.';
    }
}

async function generateAndShowRecoveredPNG() {
    const publicQr = document.getElementById('recoveredPublicQr').src;
    const privateQr = document.getElementById('recoveredPrivateQr').src;

    const frontImage = new Image();
    frontImage.src = '/img/paper.png';

    try {
        await new Promise((resolve, reject) => {
            frontImage.onload = () => resolve();
            frontImage.onerror = () => reject(new Error('Failed to load front side image.'));
        });

        const canvas = document.getElementById('recoveredFrontCanvas');
        canvas.width = frontImage.width;
        canvas.height = frontImage.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(frontImage, 0, 0, canvas.width, canvas.height);

        // Draw public QR
        if (publicQr) {
            const publicQrImage = new Image();
            publicQrImage.src = publicQr;
            await new Promise((resolve, reject) => {
                publicQrImage.onload = resolve;
                publicQrImage.onerror = reject;
            });
            ctx.drawImage(publicQrImage, 248, 30.7, 120, 120);
        }

        // Draw private QR
        if (privateQr) {
            const privateQrImage = new Image();
            privateQrImage.src = privateQr;
            await new Promise((resolve, reject) => {
                privateQrImage.onload = resolve;
                privateQrImage.onerror = reject;
            });
            ctx.drawImage(privateQrImage, 28.7, 591.2, 120, 120);
        }

        // Set back image size to match canvas
        const backImage = document.getElementById('recoveredBackImage');
        backImage.width = canvas.width;
        backImage.height = canvas.height;

        // Show both
        document.getElementById('recoveredFrontCanvasWrapper').classList.remove('hidden');
        document.getElementById('recoveredBackImageWrapper').classList.remove('hidden');
    } catch (error) {
        console.error('Error generating recovered canvas:', error);
        alert('Failed to generate wallet image. Please check the image paths and try again.');
    }
}

async function downloadRecoveredPDF() {
    const frontCanvas = document.getElementById('recoveredFrontCanvas');
    if (!frontCanvas) {
        alert('Canvas not found. Please recover the wallet first.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    // A4 size in mm
    const pageWidth = 210;
    const pageHeight = 297;

    // Wallet size in mm (3"x6")
    const walletWidth = 76.2;
    const walletHeight = 152.4;

    // Center position
    const x = (pageWidth - walletWidth) / 2;
    const y = (pageHeight - walletHeight) / 2;

    try {
        // Convert the front canvas to a PNG data URL
        const frontImageData = frontCanvas.toDataURL('image/png');

        // Add the front side image to the PDF, centered
        doc.addImage(frontImageData, 'PNG', x, y, walletWidth, walletHeight);

        // Draw crop marks (5mm long, 0.2mm thick)
        const markLen = 5;
        const markThickness = 0.2;

        doc.setLineWidth(markThickness);

        // Top left
        doc.line(x - markLen, y, x, y); // horizontal
        doc.line(x, y - markLen, x, y); // vertical

        // Top right
        doc.line(x + walletWidth, y - markLen, x + walletWidth, y); // vertical
        doc.line(x + walletWidth, y, x + walletWidth + markLen, y); // horizontal

        // Bottom left
        doc.line(x - markLen, y + walletHeight, x, y + walletHeight); // horizontal
        doc.line(x, y + walletHeight, x, y + walletHeight + markLen); // vertical

        // Bottom right
        doc.line(x + walletWidth, y + walletHeight, x + walletWidth + markLen, y + walletHeight); // horizontal
        doc.line(x + walletWidth, y + walletHeight, x + walletWidth, y + walletHeight + markLen); // vertical

        // Add a new page for the back side
        const backImage = document.getElementById('recoveredBackImage');

        await new Promise((resolve, reject) => {
            if (backImage.complete) return resolve();
            backImage.onload = resolve;
            backImage.onerror = reject;
        });

        doc.addPage();

        // Add the back image, same position and size
        doc.addImage(backImage, 'PNG', x, y, walletWidth, walletHeight);

        // Draw crop marks on back page
        doc.setLineWidth(markThickness);

        // Top left
        doc.line(x - markLen, y, x, y);
        doc.line(x, y - markLen, x, y);

        // Top right
        doc.line(x + walletWidth, y - markLen, x + walletWidth, y);
        doc.line(x + walletWidth, y, x + walletWidth + markLen, y);

        // Bottom left
        doc.line(x - markLen, y + walletHeight, x, y + walletHeight);
        doc.line(x, y + walletHeight, x, y + walletHeight + markLen);

        // Bottom right
        doc.line(x + walletWidth, y + walletHeight, x + walletWidth + markLen, y + walletHeight);
        doc.line(x + walletWidth, y + walletHeight, x + walletWidth, y + walletHeight + markLen);

        // Utility to detect mobile
        function isMobile() {
            return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
        }

        // Render PDF in a hidden iframe and print or download
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);

        if (isMobile()) {
            // On mobile, offer download instead of print
            const downloadLink = document.createElement('a');
            downloadLink.href = pdfUrl;
            downloadLink.download = 'Bitcoin_Paper_Wallet_Recovered.pdf';
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            alert('Printing is not supported on mobile. The PDF has been downloaded instead.');
        } else {
            // Desktop: print in hidden iframe
            let printFrame = document.getElementById('printPDFFrame');
            if (printFrame) {
                printFrame.parentNode.removeChild(printFrame);
            }
            printFrame = document.createElement('iframe');
            printFrame.style.display = 'none';
            printFrame.id = 'printPDFFrame';
            document.body.appendChild(printFrame);
            printFrame.src = pdfUrl;
            printFrame.onload = function () {
                printFrame.contentWindow.focus();
                printFrame.contentWindow.print();
            };
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    }
}

async function downloadRecoveredPNG() {
    const frontCanvas = document.getElementById('recoveredFrontCanvas');
    if (!frontCanvas) return;
    const frontImageData = frontCanvas.toDataURL('image/png');

    // Download front
    const link = document.createElement('a');
    link.href = frontImageData;
    link.download = 'bitcoin-paper-wallet-front-recovered.png';
    link.click();

    // Download back
    const backImage = document.getElementById('recoveredBackImage');
    if (backImage) {
        const link2 = document.createElement('a');
        link2.href = backImage.src;
        link2.download = 'bitcoin-paper-wallet-back-recovered.png';
        link2.click();
    }
}

async function checkRecoveredBalance() {
    const address = document.getElementById('recoveredPublicAddress').textContent.trim();
    if (!address) {
        alert('No address found.');
        return;
    }
    // Optionally hide the button after pressed
    const balanceResult = document.getElementById('recoveredBalanceResult');
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