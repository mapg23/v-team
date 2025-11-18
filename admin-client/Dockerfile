FROM node:22

WORKDIR /app

COPY . ./

RUN npm install

# Show for others that service is running on port 1337
# Acts only as information
EXPOSE 5173

CMD ["npm", "run", "dev"]