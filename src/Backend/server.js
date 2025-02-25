import express from 'express';
import getPriorityRating from './Aiconnect.js';

const app = express();
const port = 3001;

app.use(express.json());

app.get('/', (req, res) => {
    console.log('Hello, World!');
    res.send('Hello, World!');
});

app.post('/api/getPriorityRating', async (req, res) => {
    const { query, severity } = req.body;

    if (!query || !severity) {
        return res.status(400).json({ error: 'Missing query or severity' });
    }

    try {
        console.log('Received request for priority rating:', query, severity);
        const rating = await getPriorityRating(query, severity);
        res.json({ rating });
    } catch (error) {
        console.error('Error getting priority rating:', error);
        res.status(500).json({ error: 'Failed to get priority rating' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
