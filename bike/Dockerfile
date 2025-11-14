
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g nodemon && \
    npm install

COPY . .

EXPOSE 7071

CMD ["npm", "run", "start"]
