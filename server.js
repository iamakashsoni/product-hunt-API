const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth.js');
const productRoutes = require('./routes/products');
const commentRoutes = require('./routes/comments');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);

app.use('/api/products', commentRoutes);