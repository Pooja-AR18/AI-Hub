require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const docRoutes = require('./routes/docRoutes');
const qaRoutes = require('./routes/qaRoutes');
const searchRoutes = require('./routes/searchRoutes');


const cors = require('cors');

// Connect MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/docs', docRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/search', searchRoutes); 
// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
