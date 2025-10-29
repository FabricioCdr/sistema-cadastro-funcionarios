import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'empresa_funcionarios',
  password: '123',
  port: 5432,
});

// Listar funcionários
app.get('/funcionarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM funcionarios');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
});

// Criar funcionário
app.post('/funcionarios', async (req, res) => {
  try {
    const { nome_completo, cpf, email, telefone, data_nascimento, cep, logradouro, numero, complemento, bairro, cidade, estado, data_admissao, cargo, departamento, salario } = req.body;

    const result = await pool.query(
      `INSERT INTO funcionarios 
      (nome_completo, cpf, email, telefone, data_nascimento, cep, logradouro, numero, complemento, bairro, cidade, estado, data_admissao, cargo, departamento, salario) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
      RETURNING *`,
      [nome_completo, cpf, email, telefone, data_nascimento, cep, logradouro, numero, complemento, bairro, cidade, estado, data_admissao, cargo, departamento, salario]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar funcionário' });
  }
});

// Buscar por ID
app.get('/funcionarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM funcionarios WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar funcionário' });
  }
});

// Atualizar
app.put('/funcionarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_completo, cpf, email, telefone, data_nascimento, cep, logradouro, numero, complemento, bairro, cidade, estado, data_admissao, cargo, departamento, salario } = req.body;

    const result = await pool.query(
      `UPDATE funcionarios SET 
      nome_completo=$1, cpf=$2, email=$3, telefone=$4, data_nascimento=$5, cep=$6, logradouro=$7, numero=$8, complemento=$9, bairro=$10, cidade=$11, estado=$12, data_admissao=$13, cargo=$14, departamento=$15, salario=$16
      WHERE id=$17 RETURNING *`,
      [nome_completo, cpf, email, telefone, data_nascimento, cep, logradouro, numero, complemento, bairro, cidade, estado, data_admissao, cargo, departamento, salario, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar funcionário' });
  }
});

// Deletar
app.delete('/funcionarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM funcionarios WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    
    res.json({ message: 'Funcionário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar funcionário' });
  }
});

// Buscar CEP
app.get('/cep/:cep', async (req, res) => {
  try {
    const { cep } = req.params;
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar CEP' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});