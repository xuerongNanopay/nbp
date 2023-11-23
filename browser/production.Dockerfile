FROM node:18.18-alpine

WORKDIR /App

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]