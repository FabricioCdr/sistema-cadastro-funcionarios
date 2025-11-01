# Backend - Sistema de Cadastro de Funcionários

API REST construída em **Node.js + Express + TypeScript**, utilizando **PostgreSQL** como banco de dados.

---

## 🚀 Como rodar

### 1. Configurar o banco

Crie um banco de dados no PostgreSQL (exemplo):

CREATE DATABASE funcionarios_db;

CREATE TABLE funcionarios (
  id SERIAL PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  data_nascimento DATE,
  cep VARCHAR(8),
  logradouro VARCHAR(255),
  numero VARCHAR(20),
  complemento VARCHAR(255),
  bairro VARCHAR(255),
  cidade VARCHAR(255),
  estado VARCHAR(2),
  data_admissao DATE,
  cargo VARCHAR(100),
  departamento VARCHAR(100),
  salario NUMERIC(12,2)
);

2. Configurar o .env
Crie um arquivo .env dentro da pasta backend com suas credenciais:

DB_USER=postgres
DB_PASSWORD=123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=funcionarios_db
PORT=3001

3. Instalar dependências

npm install

4. Rodar o servidor

npm run dev

5. Endpoints principais
Método	                   Rota             	Descrição
GET                	 /funcionarios	            Lista todos os funcionários
GET	              	 /funcionarios/:id     	 	Retorna um funcionário específico
POST	           	 /funcionarios            	Cadastra um novo funcionário
PUT	                 /funcionarios/:id	    	 Atualiza um funcionário existente
DELETE	           	 /funcionarios/:id      	 Remove um funcionário
GET	                 /cep/:cep	                Busca endereço pelo CEP (usando ViaCEP)





