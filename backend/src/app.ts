import express from 'express';
import cors from 'cors';
import funcionariosRouter from './routes/funcionarios';
import cepRouter from './routes/cep';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/funcionarios', funcionariosRouter);
app.use('/cep', cepRouter);

export default app;
