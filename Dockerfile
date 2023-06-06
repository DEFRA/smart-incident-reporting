FROM node:16

LABEL author="Department for Environment, Food & Rural Affairs"

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE $PORT

ENTRYPOINT /bin/sh ./bin/startContainer
