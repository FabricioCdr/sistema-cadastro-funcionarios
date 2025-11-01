import React, { useState } from "react";
import { FuncionariosProvider, useFuncionarios } from "./context/FuncionariosContext";
import CadastroForm from "./components/CadastroForm";
import FiltrosFuncionarios from "./components/FiltrosFuncionarios";
import ListaFuncionarios from "./components/ListaFuncionarios";
import ModalFuncionario from "./components/ModalFuncionario";

const Tela: React.FC = () => {
  const { funcionarios, carregarFuncionarios } = useFuncionarios();
  const [editarId, setEditarId] = useState<number | null>(null);
  const [visualizarId, setVisualizarId] = useState<number | null>(null);

  const funcionarioEditando = editarId ? funcionarios.find((f) => f.id === editarId) || null : null;
  const funcionarioVisualizando = visualizarId ? funcionarios.find((f) => f.id === visualizarId) || null : null;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
        <CadastroForm
          onSaved={carregarFuncionarios}
          editar={funcionarioEditando || undefined}
          limparEdicao={() => setEditarId(null)}
        />
        <FiltrosFuncionarios />
        <ListaFuncionarios
          onEditar={(id) => setEditarId(id)}
          onVisualizar={(id) => setVisualizarId(id)}
        />
      </div>

      <ModalFuncionario
        aberto={!!visualizarId}
        onClose={() => setVisualizarId(null)}
        funcionario={funcionarioVisualizando}
      />
    </div>
  );
};

function App() {
  return (
    <FuncionariosProvider>
      <Tela />
    </FuncionariosProvider>
  );
}

export default App;
