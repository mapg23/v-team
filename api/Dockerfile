
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g nodemon && \
    npm install

COPY . .

EXPOSE 9091

CMD ["npm", "run", "start"]
