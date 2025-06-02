import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] [${req.method}] ${req.originalUrl}`);
  next();
});

const users = { testuser: 'password123' };

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== 'string' || username.length < 3 ||
      typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Username ≥3 chars; password ≥6 chars.' });
  }
  if (users[username]) {
    return res.status(400).json({ error: 'User already exists.' });
  }
  users[username] = password;
  return res.status(201).json({ status: 'registered' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] === password) {
    return res.status(200).json({ status: 'ok' });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.listen(5002, () => {
  console.log('Microservice C (Auth) listening on port 5002');
});
