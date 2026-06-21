const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
dotenv.config();

const app = express();
const PORT = 3000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/detect', async (req, res) => {
    const { headline } = req.body;

    if(!headline) {
        return res.status(400).json({ error: 'No headline provided' });
    }

    try {
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'user',
                    content: `You are a strict fact-checking assistant. Analyze the following news headline.
Rules:
- Ignore uppercase or lowercase differences
- If it is a question, convert it to a statement and analyze it
- Use your knowledge up to 2024 to verify facts
- If you cannot verify something as TRUE with strong evidence, mark it as FAKE
- Be strict and decisive — do not give diplomatic answers
- Always start with FAKE or REAL in capitals on first line
- Give reason in 2-3 simple lines
Headline: "${headline.toLowerCase()}"`
                }
            ]
        });

        const result = response.choices[0].message.content;
        res.json({ result });

    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// Signup Route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword],
            (err, result) => {
                if(err) {
                    if(err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ error: 'Email already exists' });
                    }
                    return res.status(500).json({ error: 'Something went wrong' });
                }
                res.json({ message: 'Account created successfully!' });
            }
        );
    } catch(err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, results) => {
            if(err) return res.status(500).json({ error: 'Something went wrong' });

            if(results.length === 0) {
                return res.status(400).json({ error: 'Email not found' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch) {
                return res.status(400).json({ error: 'Wrong password' });
            }

            const token = jwt.sign(
                { id: user.id, name: user.name },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.json({ message: 'Login successful!', token, name: user.name });
        }
    );
});
app.get('/profile', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if(!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        db.query(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [decoded.id],
            (err, results) => {
                if(err) return res.status(500).json({ error: 'Something went wrong' });
                res.json(results[0]);
            }
        );
    } catch(err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});