import React from "react";

interface Props {
  aberto: boolean;
  onClose: () => void;
  funcionario: any;
}

const formatarDataBR = (data?: string) => {
  if (!data) return "";
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR");
};

const ModalFuncionario: React.FC<Props> = ({ aberto, onClose, funcionario }) => {
  if (!aberto || !funcionario) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Dados do Funcionário</h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Nome:</strong> {funcionario.nome_completo}</p>
          <p><strong>CPF:</strong> {funcionario.cpf}</p>
          <p><strong>Email:</strong> {funcionario.email}</p>
          <p><strong>Telefone:</strong> {funcionario.telefone}</p>
          <p><strong>Data de Nascimento:</strong> {formatarDataBR(funcionario.data_nascimento)}</p>
          <p><strong>Data de Admissão:</strong> {formatarDataBR(funcionario.data_admissao)}</p>
          <p><strong>CEP:</strong> {funcionario.cep}</p>
          <p><strong>Logradouro:</strong> {funcionario.logradouro}</p>
          <p><strong>Número:</strong> {funcionario.numero}</p>
          <p><strong>Complemento:</strong> {funcionario.complemento}</p>
          <p><strong>Bairro:</strong> {funcionario.bairro}</p>
          <p><strong>Cidade:</strong> {funcionario.cidade}</p>
          <p><strong>Estado:</strong> {funcionario.estado}</p>
          <p><strong>Cargo:</strong> {funcionario.cargo}</p>
          <p><strong>Departamento:</strong> {funcionario.departamento}</p>
          <p><strong>Salário:</strong> {funcionario.salario}</p>
        </div>

        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalFuncionario;
