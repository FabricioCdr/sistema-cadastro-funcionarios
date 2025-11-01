import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import funcionariosRouter from "./routes/funcionarios";
import cepRouter from "./routes/cep";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/funcionarios", funcionariosRouter);
app.use("/cep", cepRouter);

app.use((req: Request, res: Response) => {
  return res.status(404).json({ msg: "Rota não encontrada." });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Erro no servidor:", err);
  if (err.code === "23505") {
    return res.status(409).json({ msg: "Registro já existe (CPF duplicado)." });
  }
  return res.status(500).json({ msg: "Erro interno do servidor." });
});

export default app;
