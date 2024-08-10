FROM node:slim

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração do npm
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta 3001
EXPOSE 3001


# Executa o código compilado
CMD ["npm", "start"]
