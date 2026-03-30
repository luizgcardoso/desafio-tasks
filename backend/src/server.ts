import express from 'express';
import { AppDataSource } from './database/data-source';
import { taskRouter } from './routes/taskRoutes';
import { userRouter } from './routes/userRoutes';


AppDataSource.initialize()
  .then(() => {
    const app = express();
    app.use(express.json());
    app.use(taskRouter, userRouter);

    app.get('/', (req, res) => {
      return res.send('Servidor rodando com Express!');
      console.log('Servidor rodando com Express!');
    });
    return app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.error('Erro', err);
  });

