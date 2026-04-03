import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { AppDataSource } from './database/data-source';
import { taskRouter } from './routes/TaskRoutes';
import AuthRoutes from './routes/AuthRoutes';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use(AuthRoutes);

app.use('/tasks', taskRouter);

app.get('/', (req, res) => {
  res.send('Servidor rodando com Express + TypeORM!');
});

AppDataSource.initialize()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar no banco de dados:', err);
  });