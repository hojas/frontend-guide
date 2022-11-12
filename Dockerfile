FROM node:18.12.1-alpine AS builder

ENV NODE_ENV=production
WORKDIR /opt/app
COPY .npmrc package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm i


FROM node:18.12.1-alpine

RUN apk add --no-cache git

ENV NODE_ENV=production
WORKDIR /opt/app
COPY . .
COPY --from=builder /opt/app/node_modules ./node_modules
RUN npm i -g pnpm && pnpm run build

EXPOSE 3000
CMD pnpm run serve
