import React, { useState, useEffect } from 'react';

interface Funcionario {
  id: number;
  nome_completo: string;
  cpf: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  data_admissao: string;
  cargo: string;
  departamento: string;
  salario: string;
  created_at: string;
  updated_at: string;
}

function FuncionariosList() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);

  const carregarFuncionarios = async (): Promise<void> => {
    setCarregando(true);
    try {
      const response = await fetch('http://localhost:3001/funcionarios');
      if (!response.ok) {
        throw new Error('Erro na resposta do servidor');
      }
      const data: Funcionario[] = await response.json();
      setFuncionarios(data);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      alert('Erro ao carregar funcionários. Verifique se o servidor está rodando na porta 3001.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-indigo-600 text-white rounded-xl shadow-lg p-6 mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-wide">Funcionários 💼</h2>
            <p className="text-indigo-200">
              {carregando ? 'Carregando...' : `Total: ${funcionarios.length} funcionário(s)`}
            </p>
          </div>
          <button
            onClick={carregarFuncionarios}
            disabled={carregando}
            className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {carregando ? '⏳ Carregando...' : '🔄 Atualizar Lista'}
          </button>
        </div>

        {!carregando && funcionarios.length === 0 ? (
          <div className="text-center text-indigo-800 bg-white/70 py-10 rounded-lg shadow-md border-2 border-dashed border-indigo-400">
            Nenhum funcionário encontrado 😢
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {funcionarios.map((func, index) => (
              <div
                key={func.id}
                className={`rounded-xl shadow-md border border-white p-5 text-white transition transform hover:scale-[1.02] hover:shadow-lg ${
                  index % 2 === 0
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-500'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                }`}
              >
                <h3 className="text-xl font-bold mb-3">{func.nome_completo}</h3>

                <div className="space-y-1 text-sm leading-relaxed">
                  <p><strong>CPF:</strong> {func.cpf}</p>
                  <p><strong>Email:</strong> {func.email}</p>
                  <p><strong>Telefone:</strong> {func.telefone}</p>
                  <p><strong>Data de nascimento:</strong> {func.data_nascimento ? new Date(func.data_nascimento).toLocaleDateString() : '—'}</p>

                  <p><strong>CEP:</strong> {func.cep}</p>
                  <p><strong>Endereço:</strong> {func.logradouro}, {func.numero} {func.complemento && `- ${func.complemento}`}</p>
                  <p><strong>Bairro:</strong> {func.bairro}</p>
                  <p><strong>Cidade/UF:</strong> {func.cidade} - {func.estado}</p>

                  <p><strong>Cargo:</strong> {func.cargo}</p>
                  <p><strong>Departamento:</strong> {func.departamento}</p>
                  <p><strong>Salário:</strong> R$ {Number(func.salario).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                  <p><strong>Admissão:</strong> {func.data_admissao ? new Date(func.data_admissao).toLocaleDateString() : '—'}</p>

                  <p><strong>Criado em:</strong> {func.created_at ? new Date(func.created_at).toLocaleString("pt-BR") : '—'}</p>
                  <p><strong>Atualizado em:</strong> {func.updated_at ? new Date(func.updated_at).toLocaleString("pt-BR") : '—'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FuncionariosList;
