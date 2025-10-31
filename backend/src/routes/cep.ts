import { Router } from 'express';

const router = Router();

router.get('/:cep', async (req, res) => {
  try {
    const { cep } = req.params;
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao buscar CEP', detail: error.message });
  }
});

export default router;
