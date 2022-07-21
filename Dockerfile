FROM node:16.15.0-alpine

WORKDIR /server/api

COPY package*.json ./

RUN npm install -g typescript

RUN yarn install

COPY . .

RUN yarn build

