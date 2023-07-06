FROM node:18

LABEL author="Department for Environment, Food & Rural Affairs"
#ENV NODE_ENV=production
ENV PORT=8000

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE $PORT

CMD [ "npm", "start" ]