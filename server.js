const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Endpoint to calculate resolutions
app.get('/calculate', (req, res) => {
    const { width, height } = req.query;
    
    if (!width || !height) {
        return res.status(400).json({ error: 'Width and height are required' });
    }

    const python = spawn('python3', [
        path.join(__dirname, 'utils/resolution_calculator.py'),
        width,
        height
    ]);

    let result = '';
    let error = '';

    python.stdout.on('data', (data) => {
        result += data.toString();
    });

    python.stderr.on('data', (data) => {
        // Log debug information to console
        console.log('Debug:', data.toString());
        error += data.toString();
    });

    python.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Failed to calculate resolutions' });
        }
        try {
            const jsonResult = JSON.parse(result);
            // Add debug information to response
            if (error) {
                jsonResult.debug = error;
            }
            res.json(jsonResult);
        } catch (e) {
            res.status(500).json({ error: 'Failed to parse Python output' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});