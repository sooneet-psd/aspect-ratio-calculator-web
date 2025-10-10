// Get DOM elements
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const ratioWidthInput = document.getElementById('ratioWidth');
const ratioHeightInput = document.getElementById('ratioHeight');
const targetWidthInput = document.getElementById('targetWidth');
const ratioResult = document.getElementById('ratioResult');
const dimensionResult = document.getElementById('dimensionResult');
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
        ratioResult.textContent = `${simplifiedWidth}:${simplifiedHeight}`;
        updatePreview(width, height);
    } else {
        ratioResult.textContent = '-';
        resetPreview();
    }
}

// Calculate dimensions from aspect ratio
function calculateDimensions() {
    const ratioWidth = parseInt(ratioWidthInput.value);
    const ratioHeight = parseInt(ratioHeightInput.value);
    const targetWidth = parseInt(targetWidthInput.value);

    if (ratioWidth && ratioHeight && targetWidth) {
        const calculatedHeight = Math.round((targetWidth * ratioHeight) / ratioWidth);
        dimensionResult.textContent = `${calculatedHeight}px`;
        updatePreview(targetWidth, calculatedHeight);
    } else {
        dimensionResult.textContent = '-';
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

// Add event listeners for real-time updates
widthInput.addEventListener('input', calculateRatio);
heightInput.addEventListener('input', calculateRatio);
ratioWidthInput.addEventListener('input', calculateDimensions);
ratioHeightInput.addEventListener('input', calculateDimensions);
targetWidthInput.addEventListener('input', calculateDimensions);

// Add input validation
function validateInput(input) {
    if (input.value < 1) {
        input.value = 1;
    }
}

// Add validation to all number inputs
const numberInputs = document.querySelectorAll('input[type="number"]');
numberInputs.forEach(input => {
    input.addEventListener('change', () => validateInput(input));
});