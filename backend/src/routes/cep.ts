import { Router, Request, Response } from "express";

const router = Router();

router.get("/:cep", async (req: Request, res: Response) => {
  try {
    const cep = req.params.cep.replace(/\D/g, "");
    if (cep.length !== 8) {
      return res.status(400).json({ msg: "CEP inválido." });
    }

    const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await r.json();

    if (data.erro) {
      return res.status(404).json({ msg: "CEP não encontrado." });
    }

    return res.json(data);
  } catch (err) {
    console.error("Erro ao buscar CEP:", err);
    return res.status(500).json({ msg: "Erro ao buscar CEP." });
  }
});

export default router;
