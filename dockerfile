FROM node:22.16-alpine3.22

LABEL author="DEFRA"
ARG GA_ID
ENV NODE_ENV=production
ENV PORT=8000

WORKDIR /usr/src
COPY . smart-incident-reporting
WORKDIR /usr/src/smart-incident-reporting
RUN npm ci

EXPOSE $PORT

CMD [ "npm", "start" ]