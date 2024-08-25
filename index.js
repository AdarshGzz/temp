
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;


const corsOptions = {
    origin: 'http://localhost:3000', 
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Enable pre-flight requests for all routes
app.options('*', cors(corsOptions));

app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => isNaN(item));
        const highestLowercase = alphabets
            .filter(char => char.toLowerCase() === char)
            .sort((a, b) => b.localeCompare(a))[0] || [];

        const response = {
            is_success: true,
            user_id: "john_doe_17091999", // Replace with your actual user ID
            email: "john@xyz.com", // Replace with your actual email
            roll_number: "ABCD123", // Replace with your actual roll number
            numbers,
            alphabets,
            highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : []
        };

        res.json(response);
    } catch (error) {
        res.status(400).json({ is_success: false, error: error.message });
    }
});

app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});