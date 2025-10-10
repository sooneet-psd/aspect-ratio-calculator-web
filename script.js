// Get DOM elements
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const ratioResult = document.getElementById('ratioResult');
const previewBox = document.getElementById('preview-box');

// Calculate GCD (Greatest Common Divisor) using Euclidean algorithm
function calculateGCD(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Calculate aspect ratio from dimensions
function calculateRatio() {
    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);

    if (width && height) {
        const gcd = calculateGCD(width, height);
        const simplifiedWidth = width / gcd;
        const simplifiedHeight = height / gcd;
        const ratio = `${simplifiedWidth}:${simplifiedHeight}`;
        
        // Format the output
        let result = `Simplified Ratio: ${ratio}`;
        
        // Add common name for well-known ratios
        if (ratio === '16:9') result += ' (Widescreen HD)';
        else if (ratio === '4:3') result += ' (Standard)';
        else if (ratio === '21:9') result += ' (UltraWide)';
        else if (ratio === '32:9') result += ' (Super UltraWide)';
        else if (ratio === '1:1') result += ' (Square)';
        else if (ratio === '4:5' || ratio === '3:4') result += ' (Portrait)';
        else if (ratio === '9:16') result += ' (Mobile)';
        
        ratioResult.textContent = result;
        updatePreview(width, height);
    } else {
        ratioResult.textContent = '-';
        resetPreview();
    }
}

// Update preview box
function updatePreview(width, height) {
    const previewContainer = document.querySelector('.preview-container');
    const containerWidth = previewContainer.offsetWidth;
    const containerHeight = previewContainer.offsetHeight;
    
    // Calculate scaling factor to fit preview box within container
    const scaleWidth = containerWidth / width;
    const scaleHeight = containerHeight / height;
    const scale = Math.min(scaleWidth, scaleHeight) * 0.8; // 80% of container size
    
    // Apply dimensions and center the preview box
    previewBox.style.width = `${width * scale}px`;
    previewBox.style.height = `${height * scale}px`;
}

// Reset preview box
function resetPreview() {
    previewBox.style.width = '0';
    previewBox.style.height = '0';
}

// Add input validation
function validateInput(input) {
    if (input.value < 1) {
        input.value = 1;
    }
}

// Add event listeners for real-time updates
widthInput.addEventListener('input', calculateRatio);
heightInput.addEventListener('input', calculateRatio);

// Add validation to all number inputs
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('change', () => validateInput(input));
});
