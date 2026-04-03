import express from 'express';
import cors from 'cors';

import { AppDataSource } from './database/data-source';
import { taskRouter } from './routes/TaskRoutes';
import { userRouter } from './routes/UserRoutes';
import authMiddleware from './middleware/AuthMiddleware';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

app.use('/users', userRouter);

app.use(authMiddleware);
app.use('/tasks', taskRouter);

app.get('/', (req, res) => {
  res.send('API To-Do List rodando com autenticação JWT');
});

AppDataSource.initialize()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => console.error('Erro ao conectar no banco:', err));