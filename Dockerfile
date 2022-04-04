FROM node:14-alpine

WORKDIR /
COPY package.json /
EXPOSE 3000

ENV NODE_ENV=production
RUN npm install && npm run tests
COPY . /
CMD ["node", "server.js"]