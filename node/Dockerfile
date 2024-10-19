FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

RUN chmod +x wait-for-it.sh

EXPOSE 3000

ENTRYPOINT ["./wait-for-it.sh", "db:3306", "--"]

CMD [ "node", "index.js" ]