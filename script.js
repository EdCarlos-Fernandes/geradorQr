function generateQRCode() {
    const data = document.getElementById('data').value;
    const backgroundColor = document.getElementById('background').value;
    const color = document.getElementById('color').value;
    const style = document.getElementById('style').value;
    const qrSizeValue = document.getElementById('qrSizeValue').innerText;
    const qrSize = parseInt(qrSizeValue);
    const errorCorrection = document.getElementById('errorCorrection').value;
    const qr = qrcode(0, errorCorrection);
    qr.addData(data);
    qr.make();

    const canvas = document.getElementById('qrCanvas');
    const ctx = canvas.getContext('2d');
    const moduleSize = qrSize / qr.getModuleCount();
    canvas.width = qrSize;
    canvas.height = qrSize;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, qrSize, qrSize);

    ctx.fillStyle = color;
    for (let row = 0; row < qr.getModuleCount(); row++) {
        for (let col = 0; col < qr.getModuleCount(); col++) {
            if (qr.isDark(row, col)) {
                switch (style) {
                    case 'square':
                        ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
                        break;
                    case 'circle':
                        ctx.beginPath();
                        ctx.arc(col * moduleSize + moduleSize / 2, row * moduleSize + moduleSize / 2,
                            moduleSize / 2, 0, 2 * Math.PI);
                        ctx.fill();
                        break;
                    default:
                        ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
                }
            }
        }
    }

    const logoInput = document.getElementById('logo');
    if (logoInput.files.length > 0) {
        const logo = new Image();
        logo.src = URL.createObjectURL(logoInput.files[0]);
        logo.onload = () => {
            const logoSize = moduleSize * 6;
            const logoX = (qrSize - logoSize) / 2;
            const logoY = (qrSize - logoSize) / 2;
            ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
        };
    }
}

function updateQRCode() {
    generateQRCode();
}

document.addEventListener("DOMContentLoaded", () => {
    const size = document.getElementById('qrSize');
    size.addEventListener('input', function () {
        const dat = document.getElementById('data').value;
        if (dat) {
            document.getElementById('qrSizeValue').innerText = this.value;
            updateQRCode();
        } else {
            alert(`Digite algo para gerar o QR code.`);
        }
    });

    const backgroundColorInput = document.getElementById('background');
    backgroundColorInput.addEventListener('input', function () {
        const canvas = document.getElementById('qrCanvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = this.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        updateQRCode();
    });

    const colorInput = document.getElementById('color');
    colorInput.addEventListener('input', function () {
        updateQRCode();
    });

    const logoInput = document.getElementById('logo');
    logoInput.addEventListener('change', function () {
        updateQRCode();
    });

    const dataInput = document.getElementById('data');
    dataInput.addEventListener("input", () => {
        generateQRCode();
    });

    const downloadButton = document.getElementById('baixar');
    downloadButton.addEventListener("click", () => {
        const dat = document.getElementById('data').value;
        if (dat) {
            const canvas = document.getElementById('qrCanvas');
            const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'qrcode.png';
            link.click();
        } else {
            alert(`Digite algo para gerar o QR code.`);
        }
    });
});
