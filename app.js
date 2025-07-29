const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./db');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORs configuration
app.use(cors({
  origin: 'http://localhost:5500', // Live server port
  methods: ['POST', 'GET'],
  credentials: true,
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Routes to serve pages
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});


app.get('/', (req, res) => {
  res.redirect('/login');
});

app.use(authRoutes);

sequelize.sync();
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
