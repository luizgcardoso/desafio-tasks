import express from 'express';
import cors from 'cors';


import { AppDataSource } from './database/data-source';
import { taskRouter } from './routes/TaskRoutes';
import { userRouter } from './routes/UserRoutes';
// import AuthRoutes from './routes/AuthRoutes';
// import authMiddleware from './middleware/AuthMiddleware';

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
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
// app.use(AuthRoutes);
// app.use(authMiddleware);
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
    })
  })
  .catch((err: Error) => {
    console.error('Erro ao conectar no banco:', err);
  });