FROM node:22
COPY package*.json ./
WORKDIR /app
COPY . .
EXPOSE 3000

RUN npm install

CMD ["node", "index.js"]
LABEL Name=fetchbackendtakehome Version=0.0.1
