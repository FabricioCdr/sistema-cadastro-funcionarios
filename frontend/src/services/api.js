const API_URL = 'http://localhost:3001';

export async function getFuncionarios() {
  const res = await fetch(`${API_URL}/funcionarios`);
  if (!res.ok) {
    throw new Error('Erro ao buscar funcionários');
  }
  return res.json();
}
