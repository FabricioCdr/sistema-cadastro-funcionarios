// src/services/api.ts
const API_URL = 'http://localhost:3001';

export interface Funcionario {
  id?: number;
  nome_completo: string;
  cpf: string;
  email: string;
  telefone?: string;
  data_nascimento?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  data_admissao: string;
  cargo: string;
  departamento: string;
  salario: number;
}

export async function getFuncionarios(): Promise<Funcionario[]> {
  const res = await fetch(`${API_URL}/funcionarios`);
  if (!res.ok) {
    throw new Error('Erro ao buscar funcionários');
  }
  return res.json();
}
