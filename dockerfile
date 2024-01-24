FROM node:18-alpine

LABEL author="DEFRA"
ENV NODE_ENV=production
ENV PORT=8000

WORKDIR /usr/src
COPY . smart-incident-reporting
WORKDIR /usr/src/smart-incident-reporting
RUN npm install

EXPOSE $PORT

CMD [ "npm", "start" ]