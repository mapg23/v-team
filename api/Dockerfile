FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -g nodemon

COPY . .

EXPOSE 9091

CMD ["npm", "start"]
