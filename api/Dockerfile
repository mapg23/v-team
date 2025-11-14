FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g nodemon
RUN npm install

COPY . .

EXPOSE 9091

CMD ["npm", "run", "start"]
