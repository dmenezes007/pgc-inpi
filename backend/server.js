const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const dbPath = path.join(__dirname, 'db.json');
// A simple, insecure password for demonstration purposes.
// In a real application, this should be handled securely (e.g., environment variables, secrets management).
const ADMIN_PASSWORD = 'password123';

// Function to read data from db.json
const readData = () => {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading or parsing db.json:", error);
        // If the file doesn't exist or is empty, return a default structure
        return { conhecimentos: [] };
    }
};

// Function to write data to db.json
const writeData = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing to db.json:", error);
    }
};

// --- API Endpoints ---

// GET all conhecimentos
app.get('/api/conhecimentos', (req, res) => {
    const data = readData();
    res.json(data.conhecimentos || []);
});

// POST a new conhecimento
app.post('/api/conhecimentos', (req, res) => {
    const data = readData();
    if (!data.conhecimentos) {
        data.conhecimentos = [];
    }
    const newConhecimento = {
        id: new Date().getTime().toString(), // Simple unique ID
        ...req.body
    };
    data.conhecimentos.push(newConhecimento);
    writeData(data);
    res.status(201).json(newConhecimento);
});

// PUT (update) a conhecimento
app.put('/api/conhecimentos/:id', (req, res) => {
    const { id } = req.params;
    const updatedConhecimento = req.body;
    const data = readData();
    
    if (!data.conhecimentos) {
        return res.status(404).json({ message: 'Conhecimento not found' });
    }

    const index = data.conhecimentos.findIndex(c => c.id === id);

    if (index !== -1) {
        // Preserve the original id
        data.conhecimentos[index] = { ...updatedConhecimento, id: id };
        writeData(data);
        res.json(data.conhecimentos[index]);
    } else {
        res.status(404).json({ message: 'Conhecimento not found' });
    }
});

// DELETE a conhecimento
app.delete('/api/conhecimentos/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();

    if (!data.conhecimentos) {
        return res.status(404).json({ message: 'Conhecimento not found' });
    }

    const index = data.conhecimentos.findIndex(c => c.id === id);

    if (index !== -1) {
        const deletedConhecimento = data.conhecimentos.splice(index, 1);
        writeData(data);
        res.json(deletedConhecimento[0]);
    } else {
        res.status(404).json({ message: 'Conhecimento not found' });
    }
});

// POST to verify password
app.post('/api/verify-password', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Incorrect password' });
    }
});


app.listen(port, () => {
    console.log(`Backend server for PGC is running on http://localhost:${port}`);
});