FROM node

WORKDIR /app

RUN apt-get install git -y
COPY package*.json .
RUN npm ci

COPY . .

EXPOSE 80

CMD [ "node", "main.js" ]
