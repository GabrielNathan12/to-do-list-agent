# to-do-list-agent
O projeto é um gerenciador de tarefas com um bot inteligente incluso, onde através desse bot o usuário pode pedir recomendações ao bot que irá retornar uma lista de soluções de como completar determinada tarefa. Ele foi desenvolvido com uma arquitetura de microserviços. Onde cada API é responsável por um tipo específico de recurso na aplicação, e a comunicação entre os serviços é orquestrada via Kubernetes.

## Estrutura do Projeto

- **Backend:** Django rest framework com Mysql
  - Localização: `backend/projects`
- **Backend:** Django rest framework com Postgresql
  - Localização: `backend/tasks`
- **Backend:** Nodejs typescript com MongoDB
  - Localização: `backend/users`
- **Frontend:** React
  - Localização: `frontend`

## Tecnologias Utilizadas

### Backends
  - <img src="https://github.com/user-attachments/assets/79e80127-c568-4625-996c-c2feb342cbd8" alt="Django Logo" width="55" height="35">
    <img src="https://github.com/user-attachments/assets/3d806c97-872f-4841-91fb-573a6ffe4c61" alt="Docker Logo" width="30" height="30">
  - <img src="https://github.com/user-attachments/assets/79e80127-c568-4625-996c-c2feb342cbd8" alt="Django Logo" width="55" height="35">
    <img src="https://github.com/user-attachments/assets/d104c9c0-48e5-49cf-bbc1-908ddc5c5b22" alt="Postrgres Logo" width="30" height="30">
  - <img src="https://github.com/user-attachments/assets/0f493076-2a5b-403b-96cc-17f5f7e7a0cd" alt="Node Logo" width="40" height="35">
    <img src="https://github.com/user-attachments/assets/3e750495-ca0d-4366-9b3c-33835e3e0915" alt="MongoDB Logo" width="45" height="30">

<img src="https://github.com/user-attachments/assets/ec4eba85-e574-4e05-9617-3b04a5a9d868" alt="Docker Logo" width="30" height="30">
<img src="https://github.com/user-attachments/assets/761b5ff4-0034-4098-90db-2d9fabedd066" alt="Kubernetes Logo" width="70" height="40">

### Frontend
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png" alt="React Logo" width="30" height="30">

## Requisitos

- Docker e Docker Compose
- Node.js e npm (ou yarn)
- Django
- Kubernetes com Helm
## Testando a API localmente de Tarefas (Django rest framework E Postgress)

1. **Navegue até a pasta do backend:**

    ```bash
    cd backend/tasks/
    ```

2. **Suba a API com o docker-compose:**
  
    ```bash
    docker compose up
    ```

3. **Configure o ambiente:**

    - Crie um arquivo `.env`:

      ```bash
      MYSQL_ENGINE='django.db.backends.mysql'
      MYSQL_DATABASE='CHANGE-ME'
      MYSQL_USER='CHANGE-ME'
      MYSQL_PASSWORD='CHANGE-ME'
      MYSQL_ROOT_PASSWORD='CHANGE-ME'
      MYSQL_HOST='CHANGE-ME'
      MYSQL_PORT='CHANGE-ME'
      
      
      SECRET_KEY='CHANGE-ME'
      DEBUG='CHANGE-ME'
      ALLOWED_HOSTS='CHANGE-ME'
      CORS_ALLOWED_ORIGINS="CHANGE-ME"
      ```

    - Verifique e ajuste as variáveis de ambiente no arquivo `.env` conforme necessário.

4. **Inicie o teste de requisições através do Insominia ou Postman:**
  O backend estará disponível em `http://localhost:8000`.

## Testando a API localmente de Tarefas (Django rest framework E Mysql)

1. **Navegue até a pasta do backend:**

    ```bash
    cd backend/tasks/
    ```

2. **Suba a API com o docker-compose:**
  
    ```bash
    docker compose up
    ```

3. **Configure o ambiente:**

    - Crie um arquivo `.env`:

      ```bash
      SECRET_KEY="CHANGE-ME"
      DEBUG="CHANGE-ME"
      DB_ENGINE="django.db.backends.postgresql"
      POSTGRES_DB="CHANGE-ME"
      POSTGRES_USER="CHANGE-ME"
      POSTGRES_PASSWORD="CHANGE-ME"
      POSTGRES_HOST="CHANGE-ME"
      POSTGRES_PORT="CHANGE-ME"
      OPEN_AI_MODEL='CHANGE-ME'
      OPEN_AI_KEY='CHANGE-ME'
      CORS_ALLOWED_ORIGINS="CHANGE-ME"
      ```

    - Verifique e ajuste as variáveis de ambiente no arquivo `.env` conforme necessário.

4. **Inicie o teste de requisições através do Insominia ou Postman:**
  O backend estará disponível em `http://localhost:8001`.

   
## Testando a API localmente de Usuários (Nodejs E MongoDB)

1. **Navegue até a pasta do backend:**

    ```bash
    cd backend/users/
    ```

2. **Suba a API com o docker-compose:**
  
    ```bash
    docker compose up
    ```

3. **Configure o ambiente:**

    - Crie um arquivo `.env`:

      ```bash
      ME_CONFIG_MONGODB_URL='CHANGE-ME'
      MONGO_DB_PORT='CHANGE-ME'
      JWT_SECRET='CHANGE-ME'
      CORS_ALLOWED_ORIGINS='CHANGE-ME'
      ```

    - Verifique e ajuste as variáveis de ambiente no arquivo `.env` conforme necessário.

4. **Inicie o teste de requisições através do Insominia ou Postman:**
  O backend estará disponível em `http://localhost:3000`.

## Configuração do Frontend (React)

1. **Navegue até a pasta do frontend:**

    ```bash
    cd frontend/
    ```

2. **Instale as dependências do React:**

    ```bash
    npm install
    ```

    ou, se estiver usando yarn:

    ```bash
    yarn install
    ```

3. **Inicie o servidor de desenvolvimento do React:**

    ```bash
    npm start
    ```

    ou, se estiver usando yarn:

    ```bash
    yarn start
    ```

   O frontend estará disponível em `http://localhost:3000`.
## Executando a aplicação completa pelo Kubernetes.
- Requisitos: Helm
1. **Navegue até a raiz do projeto:**
2. **Instale o Helm**
    ```bash
     helm install <nome-da-sua-release> k8s 
    ```
3. **Verique os Pods em execução**
    ```bash
     kubectl get all 
    ```
4. **Obtenha o IP do frontend no cluster**
    - Foi usado o minikube no desenvolvimento desse projeto, então o processo de ativação do Ingress pode ser um pouco diferente, em ambientes como Kind.
    - Ative o cert manager no cluster, com os seguintes comandos.
      ```bash
      kubectl apply --validate=false -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.5/cert-manager.crds.yaml
      ```
      ```bash
      helm repo add jetstack https://charts.jetstack.io
      ```
      ```bash
      helm repo update
      ```
      ```bash
      helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.12.5
      ```
      ```bash
      kubectl wait --namespace cert-manager --for=condition=available deployment/cert-manager --timeout=120s
      ```
    - Se estiver usando o minikube, ative o Ingress com esse seguinte comando.
     ```bash
      minikube addons enable ingress  
      ```
    - Para conseguir o IP do front end através do minikube use.
    ```bash
    minikube service <nome-da-sua-realease>-frontend-service --url   
    ```
    - Pegue o IP retornando e coloque ele ao navegador, a aplicação estará disponível lá.
## Considerações Finais
- Verifique os arquivos de configuração e as variáveis de ambiente para garantir que estejam configurados corretamente.
- A senha de seu usuário precisa ter no mínimo 8 caracteres.
- Para parar o cluster kubernetes, use:

  ```bash
  helm unistall <nome-da-sua-release>
  ```
- Para atualizar sua release, use:
  ```bash
  helm upgrade <nome-da-sua-release> k8s
  ```
- Para voltar a versão da sua release, use:
  ```bash
  helm rollback <nome-da-sua-release> <numero-da-revisao>
  ```
     
