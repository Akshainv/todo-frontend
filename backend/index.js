const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const todoRoutes = require('./routes/todoRoutes');
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
  res.send('Todo API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
