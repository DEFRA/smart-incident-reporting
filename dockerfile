ARG PARENT_VERSION=3.2.4-node26.12.1
ARG PORT=8000
ARG PORT_DEBUG=9229

FROM defradigital/node-development:${PARENT_VERSION} AS development
ARG PARENT_VERSION
ARG PORT
ARG PORT_DEBUG
ARG GA_ID
LABEL uk.gov.defra.parent-image="defradigital/node-development:${PARENT_VERSION}"
ENV NODE_ENV=development
ENV PORT=${PORT}

WORKDIR /home/node
COPY --chown=node:node package*.json ./
RUN npm ci --ignore-scripts --allow-git=root
COPY --chown=node:node . .
RUN npm run build

EXPOSE ${PORT} ${PORT_DEBUG}
CMD [ "npm", "run", "dev" ]

FROM defradigital/node:${PARENT_VERSION} AS production
ARG PARENT_VERSION
ARG PORT
LABEL uk.gov.defra.parent-image="defradigital/node:${PARENT_VERSION}"
LABEL author="DEFRA"
ENV NODE_ENV=production
ENV PORT=${PORT}

WORKDIR /home/node
COPY --from=development --chown=node:node /home/node/package*.json ./
RUN npm ci --omit=dev --ignore-scripts --allow-git=root
COPY --from=development --chown=node:node /home/node/server ./server
COPY --from=development --chown=node:node /home/node/index.js /home/node/dirname.cjs ./

EXPOSE ${PORT}
USER node
CMD [ "npm", "start" ]