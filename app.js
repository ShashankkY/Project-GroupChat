const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5500',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(bodyParser.json());
app.use(express.static('public'));

// Serve signup HTML
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Use routes
app.use(authRoutes);

sequelize.sync();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
