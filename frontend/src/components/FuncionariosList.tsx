import React, { useState, useEffect } from 'react';

interface Funcionario {
  id?: number;
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
}

const formatarCPF = (valor: string) => {
  const apenasNum = valor.replace(/\D/g, '').slice(0, 11);
  const p1 = apenasNum.slice(0, 3);
  const p2 = apenasNum.slice(3, 6);
  const p3 = apenasNum.slice(6, 9);
  const p4 = apenasNum.slice(9, 11);

  if (apenasNum.length <= 3) return p1;
  if (apenasNum.length <= 6) return `${p1}.${p2}`;
  if (apenasNum.length <= 9) return `${p1}.${p2}.${p3}`;
  return `${p1}.${p2}.${p3}-${p4}`;
};

const formatarTelefone = (valor: string) => {
  const apenasNum = valor.replace(/\D/g, '').slice(0, 11);
  const ddd = apenasNum.slice(0, 2);
  const parte1 = apenasNum.slice(2, 7);
  const parte2 = apenasNum.slice(7, 11);

  if (apenasNum.length === 0) return '';
  if (apenasNum.length <= 2) return `(${ddd}`;
  if (apenasNum.length <= 7) return `(${ddd})${parte1}`;
  return `(${ddd})${parte1}-${parte2}`;
};

const CadastroFuncionario: React.FC = () => {
  const [formData, setFormData] = useState<Funcionario>({
    nome_completo: '',
    cpf: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    data_admissao: '',
    cargo: '',
    departamento: '',
    salario: '',
  });

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loadingCep, setLoadingCep] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const limit = 5;

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroCpf, setFiltroCpf] = useState('');
  const [filtroDepartamento, setFiltroDepartamento] = useState('');

  const carregarFuncionarios = async () => {
    const params = new URLSearchParams({
      page: String(paginaAtual),
      limit: String(limit),
    });
    if (filtroNome) params.append('nome', filtroNome);
    if (filtroCpf) params.append('cpf', filtroCpf);
    if (filtroDepartamento) params.append('departamento', filtroDepartamento);

    const res = await fetch(`http://localhost:3001/funcionarios?${params.toString()}`);
    const data = await res.json();
    setFuncionarios(data.dados || []);
    setPaginaAtual(data.paginaAtual || 1);
    setTotalPaginas(data.totalPaginas || 1);
    setTotalRegistros(data.totalRegistros || 0);
  };

  useEffect(() => {
    carregarFuncionarios();
  }, [paginaAtual, filtroNome, filtroCpf, filtroDepartamento]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setFormData((prev) => ({
      ...prev,
      cpf: formatarCPF(valor),
    }));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setFormData((prev) => ({
      ...prev,
      telefone: formatarTelefone(valor),
    }));
  };

  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
      setLoadingCep(true);
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) return;
      setFormData((prev) => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      }));
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMensagem('');
    try {
      const res = await fetch('http://localhost:3001/funcionarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Erro ao cadastrar');

      setFormData({
        nome_completo: '',
        cpf: '',
        email: '',
        telefone: '',
        data_nascimento: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        data_admissao: '',
        cargo: '',
        departamento: '',
        salario: '',
      });
      setPaginaAtual(1);
      await carregarFuncionarios();
      setMensagem('Funcionário cadastrado com sucesso ✅');
    } catch (err) {
      alert('Erro ao cadastrar funcionário');
    } finally {
      setSaving(false);
    }
  };

  const excluirFuncionario = async (id?: number) => {
    if (!id) return;
    const confirmar = window.confirm('Deseja realmente excluir este funcionário?');
    if (!confirmar) return;
    const res = await fetch(`http://localhost:3001/funcionarios/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      await carregarFuncionarios();
    }
  };

  const irParaPagina = (p: number) => {
    if (p < 1 || p > totalPaginas) return;
    setPaginaAtual(p);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Cadastrar Funcionário</h1>

        {mensagem && (
          <div className="mb-4 rounded-md bg-green-100 text-green-800 px-4 py-2 text-sm">
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome Completo *</label>
              <input
                type="text"
                name="nome_completo"
                value={formData.nome_completo}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CPF *</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleCPFChange}
                required
                maxLength={14}
                className="mt-1 w-full border rounded-md px-3 py-2"
                placeholder="000.000.000-00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone *</label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleTelefoneChange}
                required
                maxLength={15}
                className="mt-1 w-full border rounded-md px-3 py-2"
                placeholder="(00)00000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Nascimento *</label>
              <input
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Admissão *</label>
              <input
                type="date"
                name="data_admissao"
                value={formData.data_admissao}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Endereço</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">CEP *</label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  onBlur={handleCepBlur}
                  required
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
                {loadingCep && <p className="text-xs text-gray-500 mt-1">Buscando CEP...</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Logradouro *</label>
                <input
                  type="text"
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número</label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Complemento</label>
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bairro</label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cidade *</label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado *</label>
                <input
                  type="text"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Dados Profissionais</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cargo</label>
                <input
                  type="text"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Departamento</label>
                <select
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                >
                  <option value="">Selecione</option>
                  <option value="TI">TI</option>
                  <option value="RH">RH</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Operações">Operações</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Salário</label>
                <input
                  type="number"
                  name="salario"
                  value={formData.salario}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
          >
            {saving ? 'Cadastrando...' : 'Cadastrar Funcionário'}
          </button>
        </form>

        <div className="mt-10 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-700">Buscar por nome</label>
            <input
              value={filtroNome}
              onChange={(e) => {
                setFiltroNome(e.target.value);
                setPaginaAtual(1);
              }}
              className="mt-1 border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">CPF</label>
            <input
              value={filtroCpf}
              onChange={(e) => {
                setFiltroCpf(e.target.value);
                setPaginaAtual(1);
              }}
              className="mt-1 border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Departamento</label>
            <input
              value={filtroDepartamento}
              onChange={(e) => {
                setFiltroDepartamento(e.target.value);
                setPaginaAtual(1);
              }}
              className="mt-1 border rounded-md px-3 py-2"
            />
          </div>
          <button
            onClick={() => {
              setPaginaAtual(1);
              carregarFuncionarios();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Atualizar lista
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Lista de Funcionários</h2>
        <p className="text-sm text-gray-500 mb-2">
          Total: {totalRegistros} funcionário(s) • Página {paginaAtual} de {totalPaginas}
        </p>
        <div className="space-y-4">
          {funcionarios.map((f) => (
            <div key={f.id} className="bg-gray-50 border rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{f.nome_completo}</p>
                <p className="text-sm text-gray-600">CPF: {f.cpf}</p>
                <p className="text-sm text-gray-600">Email: {f.email}</p>
                <p className="text-sm text-gray-600">
                  Cargo: {f.cargo} • {f.departamento}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => excluirFuncionario(f.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalPaginas > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => irParaPagina(paginaAtual - 1)}
              disabled={paginaAtual === 1}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Anterior
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => irParaPagina(p)}
                  className={`px-3 py-1 rounded-md ${
                    p === paginaAtual ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => irParaPagina(paginaAtual + 1)}
              disabled={paginaAtual === totalPaginas}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CadastroFuncionario;
