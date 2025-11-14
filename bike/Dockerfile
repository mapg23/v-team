# syntax=docker/dockerfile:1.4

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN <<-EOF
    npm install -g nodemon
    npm install
EOF

COPY . .

EXPOSE 7071

CMD ["npm", "run", "start"]
