import React from "react";
import { useFuncionarios } from "../context/FuncionariosContext";

const FiltrosFuncionarios: React.FC = () => {
  const {
    filtroNome,
    filtroCpf,
    filtroDepartamento,
    setFiltroNome,
    setFiltroCpf,
    setFiltroDepartamento,
    setPaginaAtual,
    carregarFuncionarios,
  } = useFuncionarios();

  return (
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
  );
};

export default FiltrosFuncionarios;
