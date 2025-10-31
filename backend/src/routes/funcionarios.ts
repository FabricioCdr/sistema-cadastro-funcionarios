import { Router } from 'express';
import { pool } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '5', 10);
    const offset = (page - 1) * limit;

    const nome = (req.query.nome as string) || '';
    const cpf = (req.query.cpf as string) || '';
    const departamento = (req.query.departamento as string) || '';

    const whereParts: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (nome) {
      whereParts.push(`LOWER(nome_completo) LIKE LOWER($${idx++})`);
      values.push(`%${nome}%`);
    }
    if (cpf) {
      whereParts.push(`cpf ILIKE $${idx++}`);
      values.push(`%${cpf}%`);
    }
    if (departamento) {
      whereParts.push(`departamento ILIKE $${idx++}`);
      values.push(`%${departamento}%`);
    }

    const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

    const totalResult = await pool.query(
      `SELECT COUNT(*) AS total FROM funcionarios ${whereClause}`,
      values
    );
    const totalRegistros = parseInt(totalResult.rows[0].total, 10);
    const totalPaginas = Math.ceil(totalRegistros / limit);

    const dataResult = await pool.query(
      `
        SELECT
          id,
          nome_completo,
          cpf,
          email,
          telefone,
          data_nascimento,
          cep,
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          data_admissao,
          cargo,
          departamento,
          salario
        FROM funcionarios
        ${whereClause}
        ORDER BY id DESC
        LIMIT $${idx++} OFFSET $${idx++}
      `,
      [...values, limit, offset]
    );

    res.json({
      paginaAtual: page,
      totalPaginas,
      totalRegistros,
      limit,
      dados: dataResult.rows,
    });
  } catch (error: any) {
    console.error('❌ ERRO AO BUSCAR FUNCIONÁRIOS:', error);
    res.status(500).json({ error: 'Erro ao buscar funcionários', detail: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      nome_completo,
      cpf,
      email,
      telefone,
      data_nascimento,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      data_admissao,
      cargo,
      departamento,
      salario,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO funcionarios 
      (nome_completo, cpf, email, telefone, data_nascimento, cep, logradouro, numero, complemento, bairro, cidade, estado, data_admissao, cargo, departamento, salario) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
      RETURNING *`,
      [
        nome_completo,
        cpf,
        email,
        telefone,
        data_nascimento,
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        data_admissao,
        cargo,
        departamento,
        salario,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('❌ ERRO AO CRIAR FUNCIONÁRIO:', error);
    res.status(500).json({
      error: 'Erro ao criar funcionário',
      detail: error.message,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM funcionarios WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao buscar funcionário', detail: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome_completo,
      cpf,
      email,
      telefone,
      data_nascimento,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      data_admissao,
      cargo,
      departamento,
      salario,
    } = req.body;

    const result = await pool.query(
      `UPDATE funcionarios SET 
      nome_completo=$1, cpf=$2, email=$3, telefone=$4, data_nascimento=$5, cep=$6, logradouro=$7, numero=$8, complemento=$9, bairro=$10, cidade=$11, estado=$12, data_admissao=$13, cargo=$14, departamento=$15, salario=$16
      WHERE id=$17 RETURNING *`,
      [
        nome_completo,
        cpf,
        email,
        telefone,
        data_nascimento,
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        data_admissao,
        cargo,
        departamento,
        salario,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao atualizar funcionário', detail: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM funcionarios WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.json({ message: 'Funcionário deletado com sucesso' });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao deletar funcionário', detail: error.message });
  }
});

export default router;
