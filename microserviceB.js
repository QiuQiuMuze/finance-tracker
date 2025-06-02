import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] [${req.method}] ${req.originalUrl}`);
  next();
});

let transactions = [];

app.post('/submit_transaction', (req, res) => {
  const { amount, type, category, date } = req.body;
  transactions.push({ amount, type, category, date });
  return res.status(200).json({ status: 'ok', total: transactions.length });
});

app.get('/transactions', (req, res) => {
  return res.status(200).json({ transactions });
});

app.listen(5001, () => {
  console.log('Microservice B (Transactions) listening on port 5001');
});
