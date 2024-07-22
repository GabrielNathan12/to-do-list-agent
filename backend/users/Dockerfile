FROM node:slim

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração do npm
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta 3000
EXPOSE 3000

# Compila o código TypeScript para JavaScript
RUN npm run build

# Executa o código compilado
CMD ["node", "dist/index.js"]
