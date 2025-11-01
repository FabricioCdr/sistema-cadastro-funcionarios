import React, { createContext, useContext, useEffect, useState } from "react";

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

interface FuncionariosContextData {
  funcionarios: Funcionario[];
  paginaAtual: number;
  totalPaginas: number;
  totalRegistros: number;
  filtroNome: string;
  filtroCpf: string;
  filtroDepartamento: string;
  setFiltroNome: (v: string) => void;
  setFiltroCpf: (v: string) => void;
  setFiltroDepartamento: (v: string) => void;
  setPaginaAtual: (p: number) => void;
  carregarFuncionarios: () => Promise<void>;
  excluirFuncionario: (id: number) => Promise<void>;
}

const FuncionariosContext = createContext<FuncionariosContextData | undefined>(undefined);

const limit = 5;

export const FuncionariosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCpf, setFiltroCpf] = useState("");
  const [filtroDepartamento, setFiltroDepartamento] = useState("");

  const carregarFuncionarios = async () => {
    const params = new URLSearchParams({
      page: String(paginaAtual),
      limit: String(limit),
    });
    if (filtroNome) params.append("nome", filtroNome);
    if (filtroCpf) params.append("cpf", filtroCpf);
    if (filtroDepartamento) params.append("departamento", filtroDepartamento);

    const res = await fetch(`http://localhost:3001/funcionarios?${params.toString()}`);
    const data = await res.json();

    setFuncionarios(data.dados || []);
    setPaginaAtual(data.paginaAtual || 1);
    setTotalPaginas(data.totalPaginas || 1);
    setTotalRegistros(data.totalRegistros || 0);
  };

  const excluirFuncionario = async (id: number) => {
    const ok = window.confirm("Deseja realmente excluir este funcionário?");
    if (!ok) return;
    const res = await fetch(`http://localhost:3001/funcionarios/${id}`, { method: "DELETE" });
    if (res.ok) {
      await carregarFuncionarios();
    }
  };

  useEffect(() => {
    carregarFuncionarios();
  }, [paginaAtual, filtroNome, filtroCpf, filtroDepartamento]);

  return (
    <FuncionariosContext.Provider
      value={{
        funcionarios,
        paginaAtual,
        totalPaginas,
        totalRegistros,
        filtroNome,
        filtroCpf,
        filtroDepartamento,
        setFiltroNome,
        setFiltroCpf,
        setFiltroDepartamento,
        setPaginaAtual,
        carregarFuncionarios,
        excluirFuncionario,
      }}
    >
      {children}
    </FuncionariosContext.Provider>
  );
};

export const useFuncionarios = () => {
  const ctx = useContext(FuncionariosContext);
  if (!ctx) throw new Error("useFuncionarios deve ser usado dentro de FuncionariosProvider");
  return ctx;
};
