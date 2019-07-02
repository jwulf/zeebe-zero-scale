FROM node:12.4.0-alpine

WORKDIR /zeebe
COPY package.json .
COPY . .
RUN npm i

CMD ["node", "dst/index.js"]
