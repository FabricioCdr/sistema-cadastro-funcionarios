import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

function toISODate(value?: string | null) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parts = value.split("/");
  if (parts.length === 3) {
    const [dia, mes, ano] = parts;
    return `${ano}-${mes}-${dia}`;
  }
  return null;
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 5);
    const offset = (page - 1) * limit;

    const nome = (req.query.nome as string) || "";
    const cpf = (req.query.cpf as string) || "";
    const departamento = (req.query.departamento as string) || "";

    const where: string[] = [];
    const params: any[] = [];
    let i = 1;

    if (nome) {
      where.push(`LOWER(nome_completo) LIKE LOWER($${i++})`);
      params.push(`%${nome}%`);
    }
    if (cpf) {
      where.push(`cpf ILIKE $${i++}`);
      params.push(`%${cpf}%`);
    }
    if (departamento) {
      where.push(`departamento ILIKE $${i++}`);
      params.push(`%${departamento}%`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const total = await pool.query(
      `SELECT COUNT(*) as total FROM funcionarios ${whereSql}`,
      params
    );

    const rows = await pool.query(
      `
        SELECT *
        FROM funcionarios
        ${whereSql}
        ORDER BY id DESC
        LIMIT $${i++} OFFSET $${i++}
      `,
      [...params, limit, offset]
    );

    return res.json({
      paginaAtual: page,
      totalPaginas: Math.ceil(Number(total.rows[0].total) / limit),
      totalRegistros: Number(total.rows[0].total),
      dados: rows.rows,
    });
  } catch (err) {
    console.error("Erro ao listar funcionários:", err);
    return res.status(500).json({ msg: "Erro ao listar funcionários." });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const f = req.body;
    const data_nascimento = toISODate(f.data_nascimento);
    const data_admissao = toISODate(f.data_admissao);

    const result = await pool.query(
      `
      INSERT INTO funcionarios
      (nome_completo, cpf, email, telefone, data_nascimento, cep, logradouro, numero, complemento, bairro, cidade, estado, data_admissao, cargo, departamento, salario)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING *
    `,
      [
        f.nome_completo,
        f.cpf,
        f.email,
        f.telefone,
        data_nascimento,
        f.cep,
        f.logradouro,
        f.numero,
        f.complemento,
        f.bairro,
        f.cidade,
        f.estado,
        data_admissao,
        f.cargo,
        f.departamento,
        f.salario === "" ? null : f.salario,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error("Erro ao criar funcionário:", err);
    if (err.code === "23505") {
      return res.status(409).json({ msg: "CPF já cadastrado.", code: err.code });
    }
    return res.status(500).json({ msg: "Erro ao criar funcionário.", code: err.code });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const r = await pool.query("SELECT * FROM funcionarios WHERE id = $1", [
      req.params.id,
    ]);
    if (!r.rows.length) return res.status(404).json({ msg: "não encontrado" });
    res.json(r.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar funcionário:", err);
    return res.status(500).json({ msg: "Erro ao buscar funcionário." });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const f = req.body;
    const data_nascimento = toISODate(f.data_nascimento);
    const data_admissao = toISODate(f.data_admissao);

    const r = await pool.query(
      `
      UPDATE funcionarios
      SET nome_completo=$1, cpf=$2, email=$3, telefone=$4, data_nascimento=$5, cep=$6, logradouro=$7, numero=$8, complemento=$9, bairro=$10, cidade=$11, estado=$12, data_admissao=$13, cargo=$14, departamento=$15, salario=$16
      WHERE id=$17
      RETURNING *
    `,
      [
        f.nome_completo,
        f.cpf,
        f.email,
        f.telefone,
        data_nascimento,
        f.cep,
        f.logradouro,
        f.numero,
        f.complemento,
        f.bairro,
        f.cidade,
        f.estado,
        data_admissao,
        f.cargo,
        f.departamento,
        f.salario,
        req.params.id,
      ]
    );

    if (!r.rows.length) return res.status(404).json({ msg: "não encontrado" });
    res.json(r.rows[0]);
  } catch (err: any) {
    console.error("Erro ao atualizar funcionário:", err);
    if (err.code === "23505") {
      return res.status(409).json({ msg: "CPF já cadastrado." });
    }
    return res.status(500).json({ msg: "Erro ao atualizar funcionário." });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const r = await pool.query("DELETE FROM funcionarios WHERE id=$1 RETURNING *", [
      req.params.id,
    ]);
    if (!r.rows.length) return res.status(404).json({ msg: "não encontrado" });
    res.json({ ok: true });
  } catch (err) {
    console.error("Erro ao deletar funcionário:", err);
    return res.status(500).json({ msg: "Erro ao deletar funcionário." });
  }
});

export default router;
