FROM node:22-slim AS base

FROM base AS server
RUN mkdir -p /sahityotsav_management/server
WORKDIR /sahityotsav_management/server
COPY ./server/package.json .
COPY ./server/package-lock.json .
RUN npm ci --force
COPY ./server .
EXPOSE 5000
CMD ["npm", "run", "start"]

FROM base AS client
RUN mkdir -p /sahityotsav_management/client
WORKDIR /sahityotsav_management/client
COPY ./client/package.json .
COPY ./client/package-lock.json .
RUN npm ci --force
COPY ./client .
ARG API_URL
ENV API_URL=${API_URL}
RUN npm run build
CMD ["sh", "-c", "rm -rf /var/www/html/* && cp -R ./build/* /var/www/html/"]
