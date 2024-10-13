const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { fullname, username, password } = req.body;   

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [rows] = await pool.query('INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)', [fullname, username, hashedPassword]);

    res.status(201).json({ message: 'You are successfully registered!!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username =?', [username]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Login Error!!' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Login Error!!' });
    }

    const token = jwt.sign({ user_id: user.user_id, username: user.username, },process.env.JWT_SECRET,{ expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME });

    res.json({ token });

  } catch (err) {
    
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };