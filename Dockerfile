FROM node:20-slim AS base

FROM base AS server
RUN mkdir -p /profsummit/server
WORKDIR /profsummit/server
COPY ./server/package.json .
COPY ./server/package-lock.json .
RUN npm ci --force
COPY ./server .
EXPOSE 5011
# ARG DB_URL
# ENV DB_URL=${DB_URL}
# RUN npm run db:migrate
CMD ["npm", "run", "start"]

FROM base AS website
RUN mkdir -p /profsummit/website
WORKDIR /profsummit/website
RUN apt-get -y update; apt-get -y install curl
COPY ./scripts/clear_cloudflare_cache.sh .
COPY ./website/package.json .
COPY ./website/package-lock.json .
RUN npm ci --force
COPY ./website .
ARG HIDE_REGISTER
ENV NEXT_PUBLIC_HIDE_REGISTER=${HIDE_REGISTER}
ARG HIDE_LOGIN
ENV NEXT_PUBLIC_HIDE_LOGIN=${HIDE_LOGIN}
ARG WHATSAPP_LINK_MALE
ENV NEXT_PUBLIC_WHATSAPP_LINK_MALE=${WHATSAPP_LINK_MALE}
ARG WHATSAPP_LINK_FEMALE
ENV NEXT_PUBLIC_WHATSAPP_LINK_FEMALE=${WHATSAPP_LINK_FEMALE}
ARG CONTACT_REDIRECT_LINK
ENV NEXT_PUBLIC_CONTACT_REDIRECT_LINK=${CONTACT_REDIRECT_LINK}
ARG CLOUDFLARE_API_KEY
ENV CLOUDFLARE_API_KEY=${CLOUDFLARE_API_KEY}
RUN npm run build
CMD ["sh", "-c", "rm -rf /var/www/html/* && cp -R ./build/* /var/www/html/ && ./clear_cloudflare_cache.sh"]

FROM base AS webapp
RUN mkdir -p /profsummit/webapp
WORKDIR /profsummit/webapp
RUN apt-get -y update; apt-get -y install curl
COPY ./scripts/clear_cloudflare_cache.sh .
COPY ./webapp/package.json .
COPY ./webapp/package-lock.json .
RUN npm ci --force
COPY ./webapp .
ARG API_URL
ENV VITE_API_URL=${API_URL}
ARG FIREBASE_API_KEY
ENV VITE_FIREBASE_API_KEY=${FIREBASE_API_KEY}
ARG AUTH_DOMAIN
ENV VITE_AUTH_DOMAIN=${AUTH_DOMAIN}
ARG DATABASE_URL
ENV VITE_DATABASE_URL=${DATABASE_URL}
ARG PROJECT_ID
ENV VITE_PROJECT_ID=${PROJECT_ID}
ARG STORAGE_BUCKET
ENV VITE_STORAGE_BUCKET=${STORAGE_BUCKET}
ARG MESSAGING_SENDER_ID
ENV VITE_MESSAGING_SENDER_ID=${MESSAGING_SENDER_ID}
ARG APP_ID
ENV VITE_APP_ID=${APP_ID}
ARG GROUP_AVAILABLE_SEATS_DISPLAY_THRESHOLD
ENV VITE_GROUP_AVAILABLE_SEATS_DISPLAY_THRESHOLD=${GROUP_AVAILABLE_SEATS_DISPLAY_THRESHOLD}
ARG ENABLE_REGISTRATION
ENV VITE_ENABLE_REGISTRATION=${ENABLE_REGISTRATION}
ARG ENABLE_CERTIFICATE
ENV VITE_ENABLE_CERTIFICATE=${ENABLE_CERTIFICATE}
ARG CLOUDFLARE_API_KEY
ENV CLOUDFLARE_API_KEY=${CLOUDFLARE_API_KEY}
RUN npm run update-meta
RUN npm run build
CMD ["sh", "-c", "rm -rf /var/www/html/* && cp -R ./build/* /var/www/html/ && ./clear_cloudflare_cache.sh"]
