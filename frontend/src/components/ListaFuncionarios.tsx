import React from "react";
import { useFuncionarios } from "../context/FuncionariosContext";

interface Props {
  onEditar: (id: number) => void;
  onVisualizar: (id: number) => void;
}

const ListaFuncionarios: React.FC<Props> = ({ onEditar, onVisualizar }) => {
  const { funcionarios, paginaAtual, totalPaginas, totalRegistros, setPaginaAtual, excluirFuncionario } =
    useFuncionarios();

  const irParaPagina = (p: number) => {
    if (p < 1 || p > totalPaginas) return;
    setPaginaAtual(p);
  };

  return (
    <>
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
                onClick={() => onVisualizar(f.id!)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Visualizar
              </button>
              <button
                onClick={() => onEditar(f.id!)}
                className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500"
              >
                Editar
              </button>
              <button
                onClick={() => excluirFuncionario(f.id!)}
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
                  p === paginaAtual ? "bg-blue-600 text-white" : "bg-gray-200"
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
    </>
  );
};

export default ListaFuncionarios;
