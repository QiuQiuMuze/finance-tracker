import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] [${req.method}] ${req.originalUrl}`);
  next();
});

let settings = {};

app.post('/update_setting', (req, res) => {
  const { setting, value } = req.body;
  settings[setting] = value;
  return res.status(200).json({ status: 'saved', settings });
});

app.listen(5003, () => {
  console.log('Microservice D (Settings) listening on port 5003');
});
