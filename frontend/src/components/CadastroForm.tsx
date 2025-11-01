import React, { useState } from "react";

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

interface Props {
  onSaved: () => void;
  editar?: Funcionario | null;
  limparEdicao?: () => void;
}

const formatarCPF = (valor: string) => {
  const apenasNum = valor.replace(/\D/g, "").slice(0, 11);
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
  const apenasNum = valor.replace(/\D/g, "").slice(0, 11);
  const ddd = apenasNum.slice(0, 2);
  const parte1 = apenasNum.slice(2, 7);
  const parte2 = apenasNum.slice(7, 11);

  if (apenasNum.length === 0) return "";
  if (apenasNum.length <= 2) return `(${ddd}`;
  if (apenasNum.length <= 7) return `(${ddd})${parte1}`;
  return `(${ddd})${parte1}-${parte2}`;
};

const CadastroForm: React.FC<Props> = ({ onSaved, editar, limparEdicao }) => {
  const [formData, setFormData] = useState<Funcionario>(
    editar || {
      nome_completo: "",
      cpf: "",
      email: "",
      telefone: "",
      data_nascimento: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      data_admissao: "",
      cargo: "",
      departamento: "",
      salario: "",
    }
  );
  const [loadingCep, setLoadingCep] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "data_nascimento" || name === "data_admissao") {
      const partes = value.split("-");
      const ano = partes[0] || "";
      if (ano.length > 4) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, cpf: formatarCPF(e.target.value) }));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, telefone: formatarTelefone(e.target.value) }));
  };

const handleCepBlur = async () => {
  const cep = formData.cep.replace(/\D/g, "");
  if (cep.length !== 8) return;

  setLoadingCep(true);
  const res = await fetch(`http://localhost:3001/cep/${cep}`);
  const data = await res.json();
  setLoadingCep(false);

  if (data.erro) return;

  setFormData((prev) => ({
    ...prev,
    logradouro: data.logradouro || "",
    bairro: data.bairro || "",
    cidade: data.localidade || data.cidade || "",
    estado: data.uf || data.estado || "",
  }));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMensagem("");

    const url = editar
      ? `http://localhost:3001/funcionarios/${editar.id}`
      : "http://localhost:3001/funcionarios";

    const res = await fetch(url, {
      method: editar ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) {
      alert(data?.msg ?? "Erro ao salvar funcionário");
      setSaving(false);
      return;
    }

    setMensagem(editar ? "Funcionário atualizado ✅" : "Funcionário cadastrado ✅");

    setFormData({
      nome_completo: "",
      cpf: "",
      email: "",
      telefone: "",
      data_nascimento: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      data_admissao: "",
      cargo: "",
      departamento: "",
      salario: "",
    });

    if (limparEdicao) limparEdicao();
    await onSaved();
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        {editar ? "Editar Funcionário" : "Cadastrar Funcionário"}
      </h1>

      {mensagem && <div className="mb-4 bg-green-100 text-green-800 px-4 py-2 rounded-md">{mensagem}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo *</label>
            <input
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
              name="cpf"
              value={formData.cpf}
              onChange={handleCPFChange}
              maxLength={14}
              required
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
              name="telefone"
              value={formData.telefone}
              onChange={handleTelefoneChange}
              maxLength={14}
              required
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
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Complemento</label>
              <input
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bairro</label>
              <input
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade *</label>
              <input
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
          {saving ? "Salvando..." : editar ? "Salvar alterações" : "Cadastrar Funcionário"}
        </button>
      </form>
    </div>
  );
};

export default CadastroForm;
