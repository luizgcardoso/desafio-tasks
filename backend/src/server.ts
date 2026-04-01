import express from 'express';
import cors from 'cors';

import { AppDataSource } from './database/data-source';
import { taskRouter } from './routes/TaskRoutes';
import { userRouter } from './routes/UserRoutes';
import { Task } from './entities/Task';
import AuthRoutes from './routes/AuthRoutes';
import authMiddleware from './middleware/authMiddleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(AuthRoutes);
app.use(authMiddleware);
app.use(taskRouter);
app.use(userRouter);

app.get('/', (req, res) => {
  console.log('Servidor rodando com Express!');
  return res.send('Servidor rodando com Express!');
});

AppDataSource.initialize()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log('Servidor iniciado!');
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar no banco:', err);
  });