const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB Local
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('Database connection error:', err));

// Simple database setup
const Transaction = mongoose.model('Transaction', new mongoose.Schema({
    text: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: 'General' }
}, { timestamps: true }));

// Get all transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: transactions });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Add a transaction
app.post('/api/transactions', async (req, res) => {
    try {
        const { text, amount, category } = req.body;
        const transaction = await Transaction.create({ text, amount, category });
        res.status(201).json({ success: true, data: transaction });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ success: false, error: 'Not found' });
        await transaction.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));