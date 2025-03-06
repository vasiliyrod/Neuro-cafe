FROM node:16

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache