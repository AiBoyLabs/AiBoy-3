require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from Frontend directory
app.use(express.static(path.join(__dirname, '../Frontend')));

// Define port
const PORT = process.env.PORT || 3001;

// Basic route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Catch all route to serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 